import { Link } from 'react-router-dom';
import PlatformCardIcon from './PlatformCardIcon';
import {
  PLATFORMS_PAGE,
  PLATFORM_DISCLAIMERS,
  PLATFORM_ALT,
} from '../constants/platforms';
import './SupportedPlatformsSection.css';

const NOTICE_TEXT =
  'FityVid only supports publicly accessible content. Please download only your own content or content you have permission to use. Private videos are not supported.';

const AFFILIATION_TEXT =
  'FityVid is not affiliated with YouTube, TikTok, Instagram, Facebook, Google, ByteDance, or Meta.';

function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width={16}
      height={16}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M6.2 11.4 3.4 8.6l-.9.9 3.7 3.7 7.4-7.4-.9-.9-6.5 6.5z"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" width={20} height={20} aria-hidden="true">
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

export default function SupportedPlatformsSection() {
  return (
    <section className="sp-section section" aria-labelledby="sp-section-title">
      <div className="sp-section__bg" aria-hidden="true">
        <span className="sp-section__orb sp-section__orb--left" />
        <span className="sp-section__orb sp-section__orb--right" />
        <span className="sp-section__wave sp-section__wave--one" />
        <span className="sp-section__wave sp-section__wave--two" />
      </div>

      <div className="container sp-section__inner">
        <span className="sp-section__badge">
          <svg className="sp-section__badge-icon" viewBox="0 0 16 16" width={14} height={14} aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 1.5l1.1 2.4 2.6.4-1.9 1.8.4 2.6L8 7.6 5.8 8.7l.4-2.6L4.3 4.3l2.6-.4L8 1.5z"
            />
          </svg>
          Supported Platforms
        </span>

        <h2 id="sp-section-title" className="sp-section__title">
          Supported Platforms
        </h2>
        <p className="sp-section__subtitle">
          FityVid focuses on these four platforms only.
        </p>

        <div className="sp-section__notice" role="note">
          <span className="sp-section__notice-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width={22} height={22}>
              <path
                fill="currentColor"
                d="M12 2 4 5v6c0 5.25 3.4 10.15 8 11 4.6-.85 8-5.75 8-11V5l-8-3zm-1 14-3-3 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6z"
              />
            </svg>
          </span>
          <p>{NOTICE_TEXT}</p>
        </div>

        <div className="sp-section__grid">
          {PLATFORMS_PAGE.map((platform) => (
            <article
              key={platform.id}
              className={`sp-card sp-card--${platform.id}`}
            >
              <div className="sp-card__icon-wrap">
                <PlatformCardIcon
                  src={platform.icon}
                  label={platform.shortName}
                  alt={PLATFORM_ALT[platform.id]}
                  iconBox
                />
              </div>
              <h3 className="sp-card__title">{platform.name}</h3>
              <p className="sp-card__desc">{platform.desc}</p>
              <hr className="sp-card__divider" />
              <ul className="sp-card__list">
                {PLATFORM_DISCLAIMERS.map((item) => (
                  <li key={item}>
                    <CheckIcon className="sp-card__check" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="sp-section__affiliation">{AFFILIATION_TEXT}</p>

        <div className="sp-section__cta-wrap">
          <Link to="/download-guide" className="sp-section__cta">
            <DownloadIcon />
            Video Download Guide
          </Link>
        </div>
      </div>
    </section>
  );
}
