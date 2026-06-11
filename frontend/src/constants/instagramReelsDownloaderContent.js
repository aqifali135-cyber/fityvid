import { crossLinksExcept } from './hashtagLandingContent.js';

export const INSTAGRAM_REELS_DOWNLOADER = {
  hero: {
    title: 'Instagram Reels Downloader',
    subtitle:
      'Download Instagram Reels and public videos with FityVid. Paste a link, choose quality when available, and save only content you have permission to use.',
  },
  disclaimer:
    'FityVid is an Instagram video downloader for publicly accessible links only. We do not support private accounts, login-only posts, restricted stories, or copyrighted material you do not own or have rights to use. Download only your own content or content with explicit permission from the rights holder.',
  content: {
    intro: [
      'FityVid helps you download Instagram Reels and other public Instagram videos when you paste a supported link. Use it as an Instagram Reels downloader on desktop, tablet, or mobile browsers—paste the URL, review available quality options and file size when shown, then save the file to your device.',
      'This page explains how Instagram video download works on FityVid, which links are supported, and how to use the tool responsibly. An Instagram video downloader should never be used to save private, restricted, or copyrighted content without permission.',
      'FityVid is not affiliated with Instagram or Meta. We do not bypass DRM, login walls, or platform restrictions. If a Reel or post is not publicly accessible, it cannot be downloaded here.',
    ],
    howItWorks: {
      title: 'How to download Instagram Reels with FityVid',
      paragraphs: [
        'Copy the Instagram Reels or video link from the share menu in the Instagram app or from your browser address bar. Open FityVid, paste the URL into the downloader on this page or the home page, and submit. When the source is public and supported, FityVid fetches available formats so you can choose quality before saving.',
        'The same flow applies when you want a general Instagram video download for a public post. Reels links and standard post URLs are the most common supported formats on FityVid.',
      ],
      steps: [
        'Open the public Reel or video on Instagram and copy its link.',
        'Paste the URL into the FityVid downloader above.',
        'Wait for quality and file size details when available.',
        'Download only if you own the content or have permission to save it.',
      ],
    },
    platformTips: {
      title: 'Supported Instagram links and limits',
      paragraphs: [
        'FityVid focuses on publicly accessible Instagram content. Availability depends on what Instagram exposes for a given link—not every post type or quality tier is guaranteed.',
      ],
      list: [
        'Public Reels URLs from instagram.com are commonly supported.',
        'Public video posts and many Reels share links work when not restricted.',
        'Private accounts, close friends stories, and login-only media are not supported.',
        'Carousel posts may only expose video from the shared link’s primary item.',
        'Always verify you have rights before reposting or editing downloaded files.',
      ],
    },
    bestPractices: {
      title: 'Responsible Instagram video download',
      items: [
        'Download only your own Reels or content you created for clients with written permission.',
        'Respect music licensing and branding in Reels you did not produce.',
        'Check Instagram’s terms and local copyright laws before reusing files offline.',
        'Use downloads for personal backup, offline review, or licensed workflows—not reposting without credit.',
        'When in doubt, ask the creator or rights holder before saving.',
      ],
    },
    commonMistakes: {
      title: 'Common mistakes',
      items: [
        'Trying to download Instagram Reels from private or restricted accounts.',
        'Assuming an Instagram video downloader can bypass login or paywalls.',
        'Republishing someone else’s Reel without permission or attribution.',
        'Expecting every quality tier to appear for every link.',
        'Using downloaded videos in ads or commercial projects without proper rights.',
      ],
    },
    faq: [
      {
        q: 'Is FityVid an Instagram Reels downloader?',
        a: 'Yes. FityVid supports many public Instagram Reels links when you paste the URL into our downloader. Private or restricted content is not supported.',
      },
      {
        q: 'Can I use this as an Instagram video downloader for regular posts?',
        a: 'FityVid handles many public Instagram video posts in addition to Reels. Paste the post link; if the video is public and supported, quality options may appear.',
      },
      {
        q: 'How do I download Instagram Reels on mobile?',
        a: 'Copy the Reel link from Instagram’s share menu, open FityVid in your mobile browser, paste the URL, and follow the on-screen steps when formats are available.',
      },
      {
        q: 'Does FityVid download private Instagram videos?',
        a: 'No. We only work with publicly accessible content. Private accounts, restricted posts, and copyrighted material without permission are not supported.',
      },
      {
        q: 'Is FityVid affiliated with Instagram?',
        a: 'No. FityVid is independent and not endorsed by Instagram or Meta.',
      },
    ],
    relatedLinks: crossLinksExcept('/instagram-reels-downloader'),
  },
};
