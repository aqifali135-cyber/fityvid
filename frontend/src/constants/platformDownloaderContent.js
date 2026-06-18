function relatedDownloaderLinks(currentPlatform) {
  const pages = [
    { id: 'youtube', slug: 'youtube-video-downloader', label: 'YouTube video downloader' },
    { id: 'tiktok', slug: 'tiktok-video-downloader', label: 'TikTok video downloader' },
    { id: 'instagram', slug: 'instagram-video-downloader', label: 'Instagram video downloader' },
    { id: 'facebook', slug: 'facebook-video-downloader', label: 'Facebook video downloader' },
  ];

  return pages
    .filter((page) => page.id !== currentPlatform)
    .map(({ slug, label }) => ({ to: `/${slug}`, label }));
}

const RESPONSIBLE_NOTICE =
  'Download only your own content or content you have permission to use. FityVid supports publicly accessible videos only. Private, restricted, or copyrighted material must not be downloaded without rights from the owner.';

export const YOUTUBE_DOWNLOADER_PAGE = {
  platformId: 'youtube',
  platformName: 'YouTube',
  slug: 'youtube-video-downloader',
  heading: 'YouTube Video Downloader',
  introduction:
    'Paste a public YouTube video or Shorts link below to view available quality options and file size details on FityVid. This page is built for creators who need a simple YouTube video downloader without changing how the core tool works.',
  metaTitle: 'YouTube Video Downloader — Download Public YouTube Videos Online | FityVid',
  metaDescription:
    'Free YouTube video downloader for public links. Paste a YouTube URL, choose quality when available, and download only content you have permission to use.',
  howToSteps: [
    'Copy the YouTube video or Shorts URL from your browser or the YouTube app share menu.',
    'Paste the link into the FityVid downloader on this page.',
    'Confirm YouTube is selected, then click Get Download Info.',
    'Review available formats and file size when shown.',
    'Download only if you own the video or have permission to save it.',
  ],
  supportedUrlExamples: [
    'https://www.youtube.com/watch?v=VIDEO_ID',
    'https://youtu.be/VIDEO_ID',
    'https://www.youtube.com/shorts/VIDEO_ID',
    'https://m.youtube.com/watch?v=VIDEO_ID',
  ],
  commonProblems: [
    'Invalid link — use a full public watch, youtu.be, or Shorts URL from YouTube.',
    'Private or members-only videos cannot be processed because they are not publicly accessible.',
    'Some videos may have no downloadable format if the source restricts access.',
    'Age-restricted or region-blocked content may fail even when the link opens in a browser.',
    'Slow loading usually means the API is fetching metadata—wait a moment and try again.',
  ],
  faqs: [
    {
      q: 'Does FityVid download private YouTube videos?',
      a: 'No. FityVid only works with publicly accessible YouTube links. Private, unlisted-with-restriction, or login-only videos are not supported.',
    },
    {
      q: 'Can I download YouTube Shorts?',
      a: 'Many public Shorts URLs are supported when you paste the standard YouTube Shorts link format.',
    },
    {
      q: 'Will I see HD quality options?',
      a: 'When the source exposes multiple formats, FityVid lists available quality levels and file size details when possible.',
    },
    {
      q: 'Is this YouTube downloader free?',
      a: 'Yes. FityVid is free to use for supported public links. You are responsible for lawful use of any file you save.',
    },
    {
      q: 'Is FityVid affiliated with YouTube or Google?',
      a: 'No. FityVid is an independent tool and is not affiliated with YouTube, Google, or Alphabet.',
    },
  ],
  relatedLinks: relatedDownloaderLinks('youtube'),
  responsibleNotice: RESPONSIBLE_NOTICE,
};

export const TIKTOK_DOWNLOADER_PAGE = {
  platformId: 'tiktok',
  platformName: 'TikTok',
  slug: 'tiktok-video-downloader',
  heading: 'TikTok Video Downloader',
  introduction:
    'Use FityVid to process public TikTok video links in your browser. Paste a supported URL, review format details when available, and save only TikTok content you are allowed to download.',
  metaTitle: 'TikTok Video Downloader — Download Public TikTok Videos Online | FityVid',
  metaDescription:
    'Download public TikTok videos with FityVid. Paste a TikTok link, check quality options, and save only content you have permission to use.',
  howToSteps: [
    'Open the public TikTok video and copy its share link or browser URL.',
    'Paste the TikTok URL into the downloader below.',
    'Make sure TikTok is selected, then submit the form.',
    'Wait for FityVid to load available download options.',
    'Save the file only when you have rights to use the content.',
  ],
  supportedUrlExamples: [
    'https://www.tiktok.com/@username/video/1234567890123456789',
    'https://vm.tiktok.com/SHORTCODE/',
    'https://vt.tiktok.com/SHORTCODE/',
    'https://m.tiktok.com/v/1234567890123456789',
  ],
  commonProblems: [
    'Deleted or private TikTok posts cannot be fetched.',
    'Some shortened links expire—copy a fresh link from the TikTok app if needed.',
    'Videos removed for policy reasons will not return download options.',
    'If the platform is not detected, confirm the URL is a TikTok video link.',
    'Connection errors may come from network issues or temporary API limits—retry with a public video.',
  ],
  faqs: [
    {
      q: 'Can FityVid download TikTok videos without a watermark?',
      a: 'Available formats depend on what the source exposes. FityVid shows supported options when they exist; results vary by link.',
    },
    {
      q: 'Does this work on mobile browsers?',
      a: 'Yes. Paste a TikTok link on phone, tablet, or desktop—the same downloader form is responsive.',
    },
    {
      q: 'Are private TikTok accounts supported?',
      a: 'No. Only publicly accessible TikTok videos can be processed.',
    },
    {
      q: 'Why was my TikTok link rejected?',
      a: 'The URL may be invalid, expired, private, or pointing to unsupported content. Try copying the link again from TikTok.',
    },
    {
      q: 'Is FityVid affiliated with TikTok or ByteDance?',
      a: 'No. FityVid is independent and not affiliated with TikTok or ByteDance.',
    },
  ],
  relatedLinks: relatedDownloaderLinks('tiktok'),
  responsibleNotice: RESPONSIBLE_NOTICE,
};

export const INSTAGRAM_DOWNLOADER_PAGE = {
  platformId: 'instagram',
  platformName: 'Instagram',
  slug: 'instagram-video-downloader',
  heading: 'Instagram Video Downloader',
  introduction:
    'Download public Instagram videos and Reels with FityVid when you paste a supported link. This dedicated Instagram video downloader uses the same secure API flow as the homepage tool.',
  metaTitle: 'Instagram Video Downloader — Download Public Instagram Videos & Reels | FityVid',
  metaDescription:
    'Instagram video downloader for public posts and Reels. Paste a link, view quality options, and download only content you have permission to use.',
  howToSteps: [
    'Copy the Instagram post or Reels link from the share menu or browser address bar.',
    'Paste the URL into the FityVid form on this page.',
    'Select Instagram if it is not already preselected.',
    'Click Get Download Info and wait for format details.',
    'Download responsibly—public content only, with proper permission.',
  ],
  supportedUrlExamples: [
    'https://www.instagram.com/reel/SHORTCODE/',
    'https://www.instagram.com/p/SHORTCODE/',
    'https://www.instagram.com/tv/SHORTCODE/',
    'https://instagr.am/p/SHORTCODE/',
  ],
  commonProblems: [
    'Private accounts and login-only posts are not supported.',
    'Stories and restricted Reels may fail if Instagram does not expose a public stream.',
    'Carousel posts may only include video from the shared item in the link.',
    'Very new posts can take a moment to become available through third-party processing.',
    'Invalid URLs often come from copying profile links instead of a specific post URL.',
  ],
  faqs: [
    {
      q: 'Can I download Instagram Reels here?',
      a: 'Yes. Many public Reels links are supported. Use a direct Reels or post URL, not a profile page.',
    },
    {
      q: 'Does FityVid support Instagram Stories?',
      a: 'Stories are often restricted or temporary. FityVid focuses on public posts and Reels URLs.',
    },
    {
      q: 'Why is no format available?',
      a: 'The post may be private, removed, or not expose a downloadable stream to public tools.',
    },
    {
      q: 'Can I use this Instagram downloader on iPhone or Android?',
      a: 'Yes. Open FityVid in your mobile browser, paste the link, and follow the same steps.',
    },
    {
      q: 'Is FityVid affiliated with Instagram or Meta?',
      a: 'No. FityVid is not affiliated with Instagram, Meta, or Facebook.',
    },
  ],
  relatedLinks: relatedDownloaderLinks('instagram'),
  responsibleNotice: RESPONSIBLE_NOTICE,
};

export const FACEBOOK_DOWNLOADER_PAGE = {
  platformId: 'facebook',
  platformName: 'Facebook',
  slug: 'facebook-video-downloader',
  heading: 'Facebook Video Downloader',
  introduction:
    'Paste a public Facebook video link to check download options on FityVid. This Facebook video downloader page keeps the same API and validation logic while focusing on Facebook URLs.',
  metaTitle: 'Facebook Video Downloader — Download Public Facebook Videos Online | FityVid',
  metaDescription:
    'Free Facebook video downloader for public links. Paste a Facebook video URL and download only content you have permission to use.',
  howToSteps: [
    'Copy the public Facebook video link from the post or watch page.',
    'Paste the URL into the downloader below.',
    'Ensure Facebook is selected as the platform.',
    'Submit the form and review available formats when shown.',
    'Save the file only if you have rights to the content.',
  ],
  supportedUrlExamples: [
    'https://www.facebook.com/watch/?v=VIDEO_ID',
    'https://www.facebook.com/username/videos/VIDEO_ID/',
    'https://fb.watch/SHORTCODE/',
    'https://m.facebook.com/watch/?v=VIDEO_ID',
  ],
  commonProblems: [
    'Friends-only or group-only videos cannot be downloaded without public access.',
    'Live streams and unreleased reels may not expose downloadable files.',
    'Copied links from notifications sometimes need to be opened in a browser first.',
    'Removed or copyrighted videos will not return formats.',
    'If detection fails, confirm the URL points to a video watch page, not a profile.',
  ],
  faqs: [
    {
      q: 'Can FityVid download Facebook Reels?',
      a: 'Some public Reels and video posts work when Facebook exposes them through a standard video URL.',
    },
    {
      q: 'Are private Facebook videos supported?',
      a: 'No. FityVid only processes publicly accessible Facebook video links.',
    },
    {
      q: 'Why do I see a connection or fetch error?',
      a: 'The video may be restricted, removed, or temporarily unavailable. Try another public link.',
    },
    {
      q: 'Is this Facebook downloader free to use?',
      a: 'Yes. FityVid is free for supported public URLs. Users must comply with copyright and platform terms.',
    },
    {
      q: 'Is FityVid affiliated with Facebook or Meta?',
      a: 'No. FityVid is an independent service and is not affiliated with Meta or Facebook.',
    },
  ],
  relatedLinks: relatedDownloaderLinks('facebook'),
  responsibleNotice: RESPONSIBLE_NOTICE,
};
