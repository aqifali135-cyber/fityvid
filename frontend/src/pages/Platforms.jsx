import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PlatformCardIcon from '../components/PlatformCardIcon';
import { PLATFORM_ICONS, PLATFORM_ALT } from '../constants/platforms';
import { PAGE_SEO } from '../constants/seo';
import './Platforms.css';

const NOTICE_TEXT =
  'FityVid only supports publicly accessible content. Please download only your own content or content you have permission to use. Private videos are not supported.';

const DOWNLOADER_ITEMS = [
  'Public videos only',
  'You must have permission',
  'Not affiliated with this platform',
];

const TOOLS = [
  {
    id: 'youtube',
    title: 'YouTube Video Downloader',
    desc: 'Download public YouTube videos when you have permission to use the content.',
    items: DOWNLOADER_ITEMS,
    to: '/youtube-video-downloader',
    iconType: 'image',
    icon: PLATFORM_ICONS.youtube,
    alt: PLATFORM_ALT.youtube,
  },
  {
    id: 'tiktok',
    title: 'TikTok Video Downloader',
    desc: 'Process publicly accessible TikTok video links only.',
    items: DOWNLOADER_ITEMS,
    to: '/tiktok-video-downloader',
    iconType: 'image',
    icon: PLATFORM_ICONS.tiktok,
    alt: PLATFORM_ALT.tiktok,
  },
  {
    id: 'instagram',
    title: 'Instagram Video Downloader',
    desc: 'For public Instagram posts and reels you are allowed to download.',
    items: DOWNLOADER_ITEMS,
    to: '/instagram-video-downloader',
    iconType: 'image',
    icon: PLATFORM_ICONS.instagram,
    alt: PLATFORM_ALT.instagram,
  },
  {
    id: 'facebook',
    title: 'Facebook Video Downloader',
    desc: 'Supports public Facebook video links with proper user permission.',
    items: DOWNLOADER_ITEMS,
    to: '/facebook-video-downloader',
    iconType: 'image',
    icon: PLATFORM_ICONS.facebook,
    alt: PLATFORM_ALT.facebook,
  },
  {
    id: 'hashtag',
    title: 'Hashtag Generator',
    desc: 'Generate powerful, relevant hashtags for your content.',
    items: ['100% Free to use', 'No sign up required', 'Boost your reach & engagement'],
    to: '/hashtag-generator',
    iconType: 'hashtag',
  },
  {
    id: 'stylish',
    title: 'Stylish Text Generator',
    desc: 'Create stylish and unique text for your bio, captions and posts.',
    items: ['100% Free to use', 'No sign up required', 'Copy & use anywhere'],
    to: '/stylish-text-generator',
    iconType: 'stylish',
  },
];

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" width={14} height={14} aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.2 11.4 3.4 8.6l-.9.9 3.7 3.7 7.4-7.4-.9-.9-6.5 6.5z"
      />
    </svg>
  );
}

function HashtagToolIcon() {
  return (
    <span className="pp-card__tool-icon pp-card__tool-icon--hashtag" aria-hidden="true">
      #
    </span>
  );
}

function StylishToolIcon() {
  return (
    <span className="pp-card__tool-icon pp-card__tool-icon--stylish" aria-hidden="true">
      Aa
    </span>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" width={18} height={18} aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 2a1 1 0 0 1 1 1v7.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L9 10.59V3a1 1 0 0 1 1-1z"
      />
      <path
        fill="currentColor"
        d="M4 16a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1z"
      />
    </svg>
  );
}

export default function Platforms() {
  const seo = PAGE_SEO.platforms;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />

      <section className="pp-section section" aria-labelledby="pp-section-title">
        <div className="pp-section__bg" aria-hidden="true">
          <span className="pp-section__orb pp-section__orb--left" />
          <span className="pp-section__orb pp-section__orb--right" />
          <span className="pp-section__orb pp-section__orb--mint" />
          <span className="pp-section__dots" />
        </div>

        <div className="container pp-section__inner">
          <h1 id="pp-section-title" className="pp-section__title">
            Supported <span className="pp-section__title-gradient">Platforms &amp; Tools</span>
          </h1>
          <p className="pp-section__subtitle">
            FityVid focuses on these platforms and tools only.
          </p>

          <div className="pp-section__notice" role="note">
            <span className="pp-section__notice-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width={18} height={18}>
                <path
                  fill="currentColor"
                  d="M12 2 4 5v6c0 5.25 3.4 10.15 8 11 4.6-.85 8-5.75 8-11V5l-8-3zm-1 14-3-3 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6z"
                />
              </svg>
            </span>
            <p>{NOTICE_TEXT}</p>
          </div>

          <div className="pp-section__grid">
            {TOOLS.map((tool) => (
              <Link
                key={tool.id}
                to={tool.to}
                className={`pp-card pp-card--${tool.id}`}
              >
                <div className="pp-card__icon-wrap">
                  {tool.iconType === 'image' ? (
                    <PlatformCardIcon
                      src={tool.icon}
                      label={tool.title}
                      alt={tool.alt}
                      iconBox
                    />
                  ) : tool.iconType === 'hashtag' ? (
                    <HashtagToolIcon />
                  ) : (
                    <StylishToolIcon />
                  )}
                </div>
                <h2 className="pp-card__title">{tool.title}</h2>
                <p className="pp-card__desc">{tool.desc}</p>
                <hr className="pp-card__divider" />
                <ul className="pp-card__list">
                  {tool.items.map((item) => (
                    <li key={item}>
                      <CheckIcon className="pp-card__check" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>

          <div className="pp-section__cta-wrap">
            <Link to="/download-guide" className="pp-section__cta">
              <DownloadIcon />
              Video Download Guide
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
