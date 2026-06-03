import iconYoutube from '../assets/social/youtube.png';
import iconFacebook from '../assets/social/facebook.png';
import iconInstagram from '../assets/social/instagram.png';
import iconTiktok from '../assets/social/tiktok.png';
import './HeroFloatingSocials.css';

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', src: iconYoutube },
  { id: 'instagram', label: 'Instagram', src: iconInstagram },
  { id: 'tiktok', label: 'TikTok', src: iconTiktok },
  { id: 'facebook', label: 'Facebook', src: iconFacebook },
];

export default function HeroFloatingSocials() {
  return (
    <div className="hero-floating-layer" aria-hidden="true">
      <span className="hero-float-bubble bubble-1" />
      <span className="hero-float-bubble bubble-2" />
      <span className="hero-float-bubble bubble-3" />
      <span className="hero-float-bubble bubble-4" />

      {PLATFORMS.map(({ id, label, src }) => (
        <div
          key={id}
          className={`floating-social-icon float-${id}`}
          title={label}
        >
          <img src={src} alt="" className="floating-social-img" draggable={false} />
        </div>
      ))}
    </div>
  );
}
