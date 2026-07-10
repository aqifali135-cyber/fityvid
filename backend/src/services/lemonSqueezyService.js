import crypto from 'crypto';
import { getCreditPackage, getPackageVariantId } from './paymentStore.js';

const LEMON_API_BASE = 'https://api.lemonsqueezy.com/v1';

export function isLemonConfigured() {
  return Boolean(
    process.env.LEMONSQUEEZY_API_KEY?.trim() &&
      process.env.LEMONSQUEEZY_STORE_ID?.trim() &&
      process.env.FRONTEND_URL?.trim(),
  );
}

export function getFrontendUrl() {
  return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
}

export async function createLemonCheckout({
  packageKey,
  userId,
  email,
  name,
}) {
  const pack = getCreditPackage(packageKey);
  if (!pack) {
    const error = new Error('Invalid credit package.');
    error.code = 'INVALID_PACKAGE';
    throw error;
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY?.trim();
  const storeId = process.env.LEMONSQUEEZY_STORE_ID?.trim();
  const variantId = getPackageVariantId(packageKey);

  if (!apiKey || !storeId || !variantId) {
    const error = new Error('Payment system is not configured.');
    error.code = 'PAYMENT_NOT_CONFIGURED';
    throw error;
  }

  const frontendUrl = getFrontendUrl();
  const successUrl = `${frontendUrl}/payment-success`;

  const payload = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          email: email || undefined,
          name: name || undefined,
          custom: {
            user_id: String(userId),
            email: String(email || ''),
            packageKey: pack.key,
            credits: String(pack.credits),
            package_name: pack.name,
          },
        },
        product_options: {
          redirect_url: successUrl,
          receipt_button_text: 'Return to FityVid',
          receipt_link_url: successUrl,
        },
        checkout_options: {
          embed: false,
          media: false,
          logo: true,
        },
      },
      relationships: {
        store: {
          data: {
            type: 'stores',
            id: String(storeId),
          },
        },
        variant: {
          data: {
            type: 'variants',
            id: String(variantId),
          },
        },
      },
    },
  };

  const response = await fetch(`${LEMON_API_BASE}/checkouts`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.detail ||
      data?.message ||
      'Unable to create Lemon Squeezy checkout.';
    const error = new Error(message);
    error.code = 'LEMON_CHECKOUT_FAILED';
    error.status = response.status;
    error.data = data;
    throw error;
  }

  const checkoutId = data?.data?.id;
  const checkoutUrl = data?.data?.attributes?.url;

  if (!checkoutUrl) {
    const error = new Error('Lemon Squeezy did not return a checkout URL.');
    error.code = 'LEMON_CHECKOUT_FAILED';
    throw error;
  }

  return {
    checkoutId: checkoutId ? String(checkoutId) : null,
    checkoutUrl,
    package: pack,
  };
}

export function verifyLemonWebhookSignature(rawBody, signatureHeader) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return false;
  }
  if (!signatureHeader || !rawBody) {
    return false;
  }

  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  try {
    const digestBuffer = Buffer.from(digest, 'utf8');
    const signatureBuffer = Buffer.from(String(signatureHeader), 'utf8');
    if (digestBuffer.length !== signatureBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(digestBuffer, signatureBuffer);
  } catch {
    return false;
  }
}
