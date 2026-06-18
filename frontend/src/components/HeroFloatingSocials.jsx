import iconYoutube from '../assets/social/youtube.png';
import iconFacebook from '../assets/social/facebook.png';
import iconInstagram from '../assets/social/instagram.png';
import iconTiktok from '../assets/social/tiktok.png';
import { PLATFORM_ALT } from '../constants/platforms';
import './HeroFloatingSocials.css';

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', src: iconYoutube, alt: PLATFORM_ALT.youtube },
  { id: 'instagram', label: 'Instagram', src: iconInstagram, alt: PLATFORM_ALT.instagram },
  { id: 'tiktok', label: 'TikTok', src: iconTiktok, alt: PLATFORM_ALT.tiktok },
  { id: 'facebook', label: 'Facebook', src: iconFacebook, alt: PLATFORM_ALT.facebook },
];

export default function HeroFloatingSocials() {
  return (
    <div className="hero-floating-layer" aria-hidden="true">
      {PLATFORMS.map(({ id, label, src, alt }) => (
        <div
          key={id}
          className={`floating-social-icon float-${id}`}
          title={label}
        >
          <span className="floating-social-glass">
            <img
              src={src}
              alt={alt}
              className="floating-social-img"
              draggable={false}
              loading="lazy"
            />
          </span>
        </div>
      ))}
    </div>
  );
}
