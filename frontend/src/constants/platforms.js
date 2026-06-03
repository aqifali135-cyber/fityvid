import iconYoutube from '../assets/social/youtube.png';
import iconTiktok from '../assets/social/tiktok.png';
import iconInstagram from '../assets/social/instagram.png';
import iconFacebook from '../assets/social/facebook.png';

export const PLATFORM_ICONS = {
  youtube: iconYoutube,
  tiktok: iconTiktok,
  instagram: iconInstagram,
  facebook: iconFacebook,
};

export const HOME_PLATFORMS = [
  { id: 'youtube', name: 'YouTube', icon: iconYoutube },
  { id: 'tiktok', name: 'TikTok', icon: iconTiktok },
  { id: 'instagram', name: 'Instagram', icon: iconInstagram },
  { id: 'facebook', name: 'Facebook', icon: iconFacebook },
];

export const PLATFORMS_PAGE = [
  {
    id: 'youtube',
    name: 'YouTube Video Downloader',
    shortName: 'YouTube',
    icon: iconYoutube,
    desc: 'Download public YouTube videos when you have permission to use the content.',
  },
  {
    id: 'tiktok',
    name: 'TikTok Video Downloader',
    shortName: 'TikTok',
    icon: iconTiktok,
    desc: 'Process publicly accessible TikTok video links only.',
  },
  {
    id: 'instagram',
    name: 'Instagram Video Downloader',
    shortName: 'Instagram',
    icon: iconInstagram,
    desc: 'For public Instagram posts and reels you are allowed to download.',
  },
  {
    id: 'facebook',
    name: 'Facebook Video Downloader',
    shortName: 'Facebook',
    icon: iconFacebook,
    desc: 'Supports public Facebook video links with proper user permission.',
  },
];

export const PLATFORM_DISCLAIMERS = [
  'Public videos only',
  'You must have permission to download and use the content',
  'FityVid is not affiliated with this platform',
];
