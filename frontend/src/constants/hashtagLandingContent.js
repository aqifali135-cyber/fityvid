/** @typedef {{ to: string, label: string }} RelatedLink */

export const HASHTAG_RELATED_ALL = [
  { to: '/hashtag-generator', label: 'Free hashtag generator (all platforms)' },
  { to: '/tiktok-hashtag-generator', label: 'TikTok hashtag generator guide' },
  { to: '/instagram-hashtag-generator', label: 'Instagram hashtag generator guide' },
  { to: '/youtube-hashtag-generator', label: 'YouTube hashtag generator guide' },
  { to: '/facebook-hashtag-generator', label: 'Facebook hashtag generator guide' },
  { to: '/faq', label: 'FityVid FAQ' },
];

/** Cross-links for Search Console priority pages */
export const SEO_CROSS_LINKS = [
  { to: '/hashtag-generator', label: 'Free hashtag generator' },
  { to: '/facebook-hashtag-generator', label: 'Facebook hashtag generator' },
  { to: '/youtube-hashtag-generator', label: 'YouTube hashtag generator' },
  { to: '/instagram-hashtag-generator', label: 'Instagram hashtag generator' },
  { to: '/instagram-reels-downloader', label: 'Instagram Reels downloader' },
];

function relatedExcept(currentPath) {
  return HASHTAG_RELATED_ALL.filter((link) => link.to !== currentPath);
}

export function crossLinksExcept(currentPath) {
  return SEO_CROSS_LINKS.filter((link) => link.to !== currentPath);
}

export const TIKTOK_HASHTAG_LANDING = {
  hero: {
    title: 'TikTok Hashtag Generator Guide',
    subtitle:
      'Plan TikTok captions with relevant hashtags. Use FityVid to generate tag ideas, then refine them for your niche.',
    ctaLabel: 'Generate TikTok hashtags',
  },
  content: {
    intro: [
      'TikTok creators often use hashtags to label topics, join conversations, and help the For You feed understand what a video is about. A focused set of tags can make your post easier to browse when someone taps a hashtag—but no tag list alone will guarantee views or followers.',
      'This page explains how to choose TikTok hashtags thoughtfully and how FityVid’s free hashtag generator fits into your workflow. When you are ready to build a list, open our main tool, enter your topic, select TikTok as the platform, and copy the suggestions into your caption or comment.',
      'FityVid is not affiliated with TikTok or ByteDance. We provide planning suggestions only; you are responsible for following TikTok’s community guidelines and terms.',
    ],
    howItWorks: {
      title: 'How the TikTok hashtag generator works',
      paragraphs: [
        'FityVid’s hashtag generator turns a short topic description into a set of suggested tags. You describe your video (for example, “morning yoga for beginners” or “budget meal prep”), pick TikTok as the platform, and choose a style such as niche, trending, or mixed.',
        'The tool returns a list you can copy in one click. Treat the output as a starting point: remove tags that do not match your video, add one or two branded tags if you use them, and avoid repeating the same word in every tag.',
      ],
      steps: [
        'Open the free hashtag generator on FityVid.',
        'Enter a clear topic that matches your video.',
        'Select TikTok as the platform and your preferred tag style.',
        'Review suggestions, delete irrelevant tags, and paste into your TikTok post.',
      ],
    },
    platformTips: {
      title: 'TikTok hashtag tips',
      paragraphs: [
        'On TikTok, hashtags work alongside your hook, sound, and watch time. Tags are most useful when they describe the subject, format, or community your video belongs to. Extremely broad tags may have a lot of competition; very obscure tags may have little browse traffic.',
      ],
      list: [
        'Use a small set of tags (often three to eight) that clearly match the video topic.',
        'Mix one broader topic tag with more specific niche tags when it feels natural.',
        'Check whether a tag is active by tapping it in the app before you rely on it.',
        'Keep branded or campaign tags consistent if you run a series or challenge.',
        'Write for humans first: captions should read naturally even with hashtags at the end.',
      ],
    },
    bestPractices: {
      title: 'Best practices',
      items: [
        'Align every hashtag with what appears in the first few seconds of your video.',
        'Test different tag sets on similar content and note which posts get steady discovery—not just one spike.',
        'Pair hashtags with strong titles, on-screen text, and relevant sounds where appropriate.',
        'Avoid banned, misleading, or unrelated tags that could confuse viewers or violate rules.',
        'Refresh tags when you change format, audience, or language.',
      ],
    },
    commonMistakes: {
      title: 'Common mistakes',
      items: [
        'Copying viral tag blocks that have nothing to do with your video.',
        'Using the maximum number of tags with no clear theme.',
        'Expecting hashtags alone to fix weak retention or unclear storytelling.',
        'Repeating the same tag list on every post regardless of topic.',
        'Including trademarked or sensitive terms without understanding platform policies.',
      ],
    },
    faq: [
      {
        q: 'How many hashtags should I use on TikTok?',
        a: 'Many creators use a handful of relevant tags rather than filling the caption. Quality and relevance matter more than count. Start with tags that clearly describe your video and adjust based on what fits your style.',
      },
      {
        q: 'Do TikTok hashtags guarantee views?',
        a: 'No. Hashtags may help categorize content and support discovery, but views depend on content quality, audience fit, and how people engage. FityVid does not promise viral results.',
      },
      {
        q: 'Can I use FityVid’s generator for TikTok ads or branded content?',
        a: 'You can use suggestions as ideas, but always review tags for accuracy and compliance with your brand and TikTok’s ad policies before publishing.',
      },
      {
        q: 'Should I put hashtags in the caption or comments?',
        a: 'Most creators place hashtags in the caption so the topic is clear immediately. Use whichever approach matches your workflow, as long as tags stay accurate.',
      },
      {
        q: 'Is FityVid affiliated with TikTok?',
        a: 'No. FityVid is an independent tool. TikTok is a trademark of its respective owner.',
      },
    ],
    relatedLinks: relatedExcept('/tiktok-hashtag-generator'),
  },
};

export const INSTAGRAM_HASHTAG_LANDING = {
  hero: {
    title: 'Instagram Hashtag Generator Guide',
    subtitle:
      'Find relevant Instagram hashtags for Reels, posts, and Stories. Generate ideas with FityVid, then tailor them to your account.',
    ctaLabel: 'Generate Instagram hashtags',
  },
  content: {
    intro: [
      'Instagram hashtags group posts into topic feeds and can help interested users find your Reels, carousels, and photos when they search or tap a tag. They are one signal among many—caption keywords, engagement, and who follows you all play a role.',
      'This guide covers practical Instagram hashtag habits and how to use FityVid’s hashtag generator for Instagram content. The generator suggests tags from your topic; you should still verify that each tag matches your post and community standards.',
      'Hashtags do not guarantee reach, likes, or follower growth. Use them to describe your content honestly, not as a shortcut around creating work your audience values.',
    ],
    howItWorks: {
      title: 'How the Instagram hashtag generator works',
      paragraphs: [
        'On FityVid, open the hashtag generator, describe your post in a few words, choose Instagram as the platform, and select a style (for example niche or mixed). The tool returns a copy-ready list you can paste into your caption or first comment.',
        'Instagram allows up to thirty hashtags per feed post, but many accounts use fewer. Start with FityVid’s list, then trim to the tags that best describe this specific piece of content.',
      ],
      steps: [
        'Describe your Reel, post, or carousel topic in the generator.',
        'Select Instagram and generate hashtags.',
        'Remove tags that are too broad, off-topic, or banned.',
        'Publish with a caption that reads naturally for your audience.',
      ],
    },
    platformTips: {
      title: 'Instagram hashtag tips',
      paragraphs: [
        'Instagram discovery blends hashtags with interests, follows, and Reels behavior. Tags work best when they mirror the subject, location, or community shown in your media.',
      ],
      list: [
        'Combine a few broader topic tags with specific niche tags when relevant.',
        'Hide hashtags in the caption or place them after a line break if you prefer a cleaner look.',
        'Use different tag sets for Reels versus static posts when the topics differ.',
        'Research tag volume by searching in Instagram—not every popular tag fits small accounts.',
        'Track which posts earn saves and shares, not only likes, when judging tag sets.',
      ],
    },
    bestPractices: {
      title: 'Best practices',
      items: [
        'Match hashtags to what is visible in your image or video.',
        'Rotate tag groups so you are not spamming identical blocks on unrelated posts.',
        'Keep a saved list of proven niche tags for your core themes.',
        'Pair hashtags with alt text and descriptive captions for accessibility.',
        'Follow Instagram’s guidelines on sensitive, political, or restricted topics.',
      ],
    },
    commonMistakes: {
      title: 'Common mistakes',
      items: [
        'Using thirty generic tags on every upload.',
        'Adding banned or broken hashtags that can limit distribution.',
        'Choosing tags only because competitors use them, without topic fit.',
        'Expecting hashtags to replace weak creative or inconsistent posting.',
        'Mixing unrelated viral tags with a narrow niche post.',
      ],
    },
    faq: [
      {
        q: 'How many hashtags should I use on Instagram?',
        a: 'You can use up to thirty on a feed post, but many creators use ten to twenty relevant tags or fewer. Focus on accuracy over volume.',
      },
      {
        q: 'Do hashtags on Reels work the same as on posts?',
        a: 'Reels still use hashtags for context, but discovery also depends on watch time, shares, and audio. Use tags that describe the Reel’s topic.',
      },
      {
        q: 'Will FityVid’s Instagram hashtags get me on Explore?',
        a: 'No tool can guarantee Explore placement. Hashtags may help organization and discovery; outcomes vary by content and audience.',
      },
      {
        q: 'Should I use popular or niche hashtags?',
        a: 'Often a blend works: broad tags for context and niche tags for a focused community. Test and keep what performs for your account over time.',
      },
      {
        q: 'Is FityVid affiliated with Instagram or Meta?',
        a: 'No. FityVid is independent and not endorsed by Meta or Instagram.',
      },
    ],
    examples: {
      title: 'Example Instagram hashtags',
      paragraphs: [
        'These sample tags illustrate how niche and topic tags might look for common Reels and post themes. Always choose tags that match your actual content.',
      ],
      groups: [
        {
          label: 'Fitness Reel',
          tags: ['#HomeWorkout', '#FitnessReels', '#BeginnerFitness', '#HealthyHabits'],
        },
        {
          label: 'Food carousel',
          tags: ['#EasyRecipes', '#MealPrep', '#CookingAtHome', '#WeeknightDinner'],
        },
        {
          label: 'Local business post',
          tags: ['#ShopLocal', '#SmallBusiness', '#BehindTheScenes', '#YourCityName'],
        },
      ],
      note: 'Replace generic location tags with your real city or neighborhood when relevant.',
    },
    relatedLinks: crossLinksExcept('/instagram-hashtag-generator'),
  },
};

export const YOUTUBE_HASHTAG_LANDING = {
  hero: {
    title: 'YouTube Hashtag Generator',
    subtitle:
      'Free YouTube hashtags generator for long-form videos and Shorts. Plan YouTube video hashtags on FityVid, then add the best fits to your description.',
    ctaLabel: 'Generate YouTube hashtags',
  },
  content: {
    intro: [
      'A YouTube hashtag generator helps you brainstorm tags before you publish. On YouTube, hashtags can appear above the video title and link to a hashtag results page. They group public videos by topic and may give viewers another way to browse related uploads—but they are not a substitute for clear titles, strong thumbnails, or watch time.',
      'FityVid works as a free YouTube hashtags generator: enter your subject, select YouTube, and review suggested YouTube video hashtags for your niche. Use this page to learn how to make hashtags on YouTube responsibly, including for Shorts, without stuffing unrelated terms into your metadata.',
      'No tool can promise rankings, subscribers, or viral Shorts placement. YouTube weighs many signals beyond tags. FityVid is not affiliated with YouTube or Google.',
    ],
    howItWorks: {
      title: 'How to make hashtags on YouTube with FityVid',
      paragraphs: [
        'Open FityVid’s hashtag generator, type a short topic (for example “beginner guitar lesson” or “budget travel Europe”), choose YouTube as the platform, and pick a style such as niche or mixed. The YouTube hashtag generator returns a list you can copy into your video description.',
        'YouTube may display up to three hashtags above the title when they follow current platform rules. Pick the tags that honestly describe this upload rather than pasting the entire list.',
      ],
      steps: [
        'Describe your video or Short in plain language.',
        'Select YouTube in the generator and generate hashtags.',
        'Choose two or three leading tags that match your title and thumbnail.',
        'Add remaining relevant tags in the description, then publish.',
      ],
    },
    platformTips: {
      title: 'YouTube video hashtags and Shorts hashtags',
      paragraphs: [
        'Long-form videos and YouTube Shorts share hashtag mechanics, but Shorts often depend more on the opening hook and retention. Keep YouTube Shorts hashtags tightly aligned with what viewers see in the first seconds.',
      ],
      list: [
        'Use YouTube video hashtags that match the spoken topic and on-screen text.',
        'For tutorials, include subject tags (#PythonTutorial) plus format tags (#HowTo) when accurate.',
        'For Shorts, favor short, clear tags over long unrelated chains.',
        'Check the hashtag page on YouTube before attaching it to see what content already appears.',
        'Follow YouTube spam and misleading metadata policies—irrelevant tags can hurt trust.',
      ],
    },
    examples: {
      title: 'Example YouTube hashtags',
      paragraphs: [
        'Sample YouTube hashtags for illustration only. Edit every list so it reflects your specific upload.',
      ],
      groups: [
        {
          label: 'How-to video',
          tags: ['#HowToEditVideo', '#VideoEditingTips', '#BeginnerTutorial'],
        },
        {
          label: 'YouTube Shorts',
          tags: ['#Shorts', '#QuickTip', '#PhonePhotography', '#CreativeShorts'],
        },
        {
          label: 'Gaming upload',
          tags: ['#Gaming', '#LetsPlay', '#IndieGames', '#Gameplay'],
        },
      ],
      note: 'YouTube may surface up to three hashtags above the title; choose your strongest topic tags first.',
    },
    bestPractices: {
      title: 'Best practices',
      items: [
        'Lead with tags that mirror your title keyword and thumbnail promise.',
        'Keep one branded tag consistent across a series or playlist when you use branding.',
        'Write descriptions for people first; add hashtags where they read naturally.',
        'Compare traffic sources in YouTube Analytics instead of judging tags alone.',
        'Update your YouTube hashtags generator workflow when you pivot niches.',
      ],
    },
    commonMistakes: {
      title: 'Common mistakes',
      items: [
        'Treating a YouTube hashtags generator output as final without editing.',
        'Stuffing descriptions with trending tags unrelated to the video.',
        'Using more than three prominent tags when only the top matches deserve emphasis.',
        'Expecting YouTube Shorts hashtags alone to fix weak hooks or low retention.',
        'Copying a competitor’s tag block for a different subject or audience.',
      ],
    },
    faq: [
      {
        q: 'What is a YouTube hashtag generator?',
        a: 'It is a tool that suggests hashtag ideas from a topic you provide. FityVid’s generator lets you pick YouTube as the platform and copy results into your description.',
      },
      {
        q: 'How many YouTube video hashtags should I use?',
        a: 'Many creators emphasize a few highly relevant tags. YouTube may show up to three above the title when eligible. Quality and accuracy matter more than quantity.',
      },
      {
        q: 'Do YouTube Shorts hashtags work differently?',
        a: 'Shorts use the same hashtag format, but reach depends heavily on engagement and viewer behavior. Use Shorts hashtags that describe the clip, not generic viral blocks.',
      },
      {
        q: 'Can this YouTube hashtags generator guarantee views?',
        a: 'No. FityVid provides planning suggestions only. Views and rankings depend on your content, audience, and YouTube’s systems.',
      },
      {
        q: 'Where do I put hashtags on YouTube?',
        a: 'Most creators add them in the video description. See YouTube’s help center for when tags may also appear above the title.',
      },
    ],
    relatedLinks: crossLinksExcept('/youtube-hashtag-generator'),
  },
};

export const FACEBOOK_HASHTAG_LANDING = {
  hero: {
    title: 'Facebook Hashtag Generator',
    subtitle:
      'Free Facebook hashtag generator for Page posts, Facebook Reels, and video uploads. Get Facebook video hashtag ideas, then publish tags that fit your message.',
    ctaLabel: 'Generate Facebook hashtags',
  },
  content: {
    intro: [
      'A Facebook hashtag generator helps you plan tags before you publish a Page post, Reel, or video. Facebook hashtags connect posts to topic feeds and in-app search, which can help people already on Facebook find public conversations around a subject. They work best when your post text, media, and tags all describe the same thing.',
      'FityVid’s free Facebook hashtag generator turns a short topic into Facebook post hashtags and Facebook video hashtags you can edit. Whether you need Facebook reel hashtags for a clip or Facebook video hashtag ideas for a longer upload, start with relevant suggestions—then remove anything that does not match your content.',
      'Hashtags do not guarantee reach, followers, or viral results on Facebook. Distribution also depends on your audience, content quality, shares, and whether you use paid tools. FityVid is not affiliated with Facebook or Meta.',
    ],
    howItWorks: {
      title: 'How the Facebook hashtag generator works',
      paragraphs: [
        'Open FityVid’s hashtag generator, describe your post or video (for example “small bakery grand opening” or “home workout for seniors”), select Facebook, and generate a list. The tool suggests Facebook post hashtags and video-oriented tags based on your topic and style preference.',
        'Copy the results into your Facebook composer at the end of the post or in the Reel caption. Public Pages and creators benefit most when tags are readable and on-topic. Private profiles and restricted posts follow different visibility rules—tags do not override privacy settings.',
      ],
      steps: [
        'Enter your Facebook post or video topic in the generator.',
        'Select Facebook and choose a tag style (niche, mixed, etc.).',
        'Review Facebook video hashtag ideas and trim irrelevant tags.',
        'Publish and check comments and insights over time—not overnight spikes alone.',
      ],
    },
    platformTips: {
      title: 'Facebook post hashtags, video hashtags, and Reel hashtags',
      paragraphs: [
        'Facebook post hashtags suit text updates, link shares, and photo albums. Facebook video hashtags and Facebook reel hashtags should mirror what viewers hear and see in the first moments. A short, clear set usually reads better than a long block copied from Instagram.',
      ],
      list: [
        'Use one to three core Facebook post hashtags for many Page updates.',
        'For Facebook video hashtags, match the spoken subject and on-screen action.',
        'For Facebook reel hashtags, keep tags aligned with the hook and vertical format.',
        'Search each hashtag on Facebook before publishing to see existing content.',
        'Separate campaign tags (#SummerSale2026) from evergreen topic tags (#GardeningTips).',
      ],
    },
    examples: {
      title: 'Example Facebook hashtags',
      paragraphs: [
        'Sample Facebook video hashtag ideas and post tags for common Page themes. Customize every list for your niche and location.',
      ],
      groups: [
        {
          label: 'Facebook post hashtags (local business)',
          tags: ['#ShopLocal', '#SmallBusiness', '#GrandOpening', '#YourTown'],
        },
        {
          label: 'Facebook video hashtags (how-to clip)',
          tags: ['#DIYHomeRepair', '#HowTo', '#HomeMaintenance', '#QuickTip'],
        },
        {
          label: 'Facebook reel hashtags (fitness)',
          tags: ['#FitnessReels', '#HomeWorkout', '#HealthyLiving', '#BeginnerWorkout'],
        },
      ],
      note: 'Swap placeholder location tags with your real city or neighborhood when relevant.',
    },
    bestPractices: {
      title: 'Best practices',
      items: [
        'Write the post for humans first, then add Facebook hashtags at the end.',
        'Keep branded campaign tags consistent across a series of Reels or videos.',
        'Pair Facebook video hashtags with a clear title line in the post text.',
        'Use Meta Business Suite insights to learn what content earns engagement over time.',
        'Respect group and Page rules—some communities limit promotional tags.',
      ],
    },
    commonMistakes: {
      title: 'Common mistakes',
      items: [
        'Pasting thirty Instagram tags onto a Facebook post.',
        'Using Facebook video hashtag ideas that do not match the footage.',
        'Expecting Facebook reel hashtags alone to replace weak hooks or audio.',
        'Adding trending tags unrelated to your Page niche or audience.',
        'Assuming tags guarantee reach without quality content or community interaction.',
      ],
    },
    faq: [
      {
        q: 'What is a Facebook hashtag generator?',
        a: 'It is a planning tool that suggests hashtags from a topic you enter. FityVid lets you select Facebook and copy edited results into posts, videos, or Reels.',
      },
      {
        q: 'How many Facebook post hashtags should I use?',
        a: 'Many Pages use a few focused tags. Clarity matters more than volume. Add more only when each tag adds real context.',
      },
      {
        q: 'Do Facebook video hashtags help discovery?',
        a: 'They may help organize and browse video topics on Facebook, but they do not guarantee views or shares. Content and audience fit still matter most.',
      },
      {
        q: 'Can I use the same Facebook reel hashtags on every Reel?',
        a: 'Reuse branded tags if you run a series, but change topic tags when each Reel covers a different subject.',
      },
      {
        q: 'Is FityVid affiliated with Facebook or Meta?',
        a: 'No. FityVid is an independent tool and is not endorsed by Meta.',
      },
    ],
    relatedLinks: crossLinksExcept('/facebook-hashtag-generator'),
  },
};

export const HASHTAG_GENERATOR_SEO = {
  intro: [
    'Looking for a free hashtag generator for YouTube, TikTok, Instagram, and Facebook? FityVid helps you brainstorm relevant hashtags from a short topic description. Use the tool above to generate a list, then edit it so every tag honestly describes your post, reel, Short, or video.',
    'Hashtags help platforms organize content and can make it easier for interested viewers to find posts on a topic. They do not guarantee views, followers, or viral reach. Treat suggestions as a starting point alongside strong creative work and consistent posting.',
    'Whether you need hashtags for a product launch, tutorial, vlog, or local business update, the same process applies: describe your subject clearly, pick the right platform, review the results, and remove anything off-topic or misleading.',
  ],
  howItWorks: {
    title: 'How it works',
    paragraphs: [
      'FityVid’s hashtag generator uses your topic, platform, style preference, and desired count to produce a copy-ready list. Select YouTube, TikTok, Instagram, or Facebook so suggestions fit how you plan to publish.',
    ],
    steps: [
      'Enter a specific topic (not just a single vague word).',
      'Choose the platform you are posting to.',
      'Pick a style such as niche, trending, or mixed.',
      'Generate, copy, and edit the list before you publish.',
    ],
  },
  platformTips: {
    title: 'Platform-specific hashtag guides',
    paragraphs: [
      'Each network treats hashtags slightly differently. Read the guide for your platform, then return here to generate tags.',
    ],
    list: [
      'TikTok: short, topic-clear tag sets that match your video hook.',
      'Instagram: accurate niche tags for Reels, carousels, and feed posts.',
      'YouTube: a few tags aligned with your title, thumbnail, and description.',
      'Facebook: concise tags suited to Page posts and public video.',
    ],
  },
  bestPractices: {
    title: 'Hashtag best practices',
    items: [
      'Match every tag to what viewers actually see in your content.',
      'Prefer relevance over copying large viral tag blocks.',
      'Keep branded or campaign tags consistent across a series.',
      'Test different sets over time and note what earns saves, shares, or watch time.',
      'Follow each platform’s rules on misleading or restricted tags.',
    ],
  },
  commonMistakes: {
    title: 'Common hashtag mistakes',
    items: [
      'Expecting hashtags alone to fix low engagement or unclear hooks.',
      'Using the same generic list on every upload regardless of topic.',
      'Adding banned, unrelated, or trademark-sensitive tags without review.',
      'Keyword-stuffing captions so they read like spam instead of sentences.',
      'Assuming tool output is final without human editing.',
    ],
  },
  faq: [
    {
      q: 'Is FityVid’s hashtag generator free?',
      a: 'Yes. You can generate hashtag suggestions without payment. Optional site ads may appear per our advertising setup.',
    },
    {
      q: 'Which platforms does the generator support?',
      a: 'YouTube, TikTok, Instagram, and Facebook. Select the platform before generating so you can plan tags in context.',
    },
    {
      q: 'Do generated hashtags guarantee more views?',
      a: 'No. Hashtags may help discovery and organization, but results depend on your content, audience, and each platform’s systems.',
    },
    {
      q: 'How is this different from the video downloader?',
      a: 'The downloader handles public video links you paste on the home page. The hashtag generator is a separate creative planning tool on this page.',
    },
    {
      q: 'Can I use one tag list on every social network?',
      a: 'Sometimes core topic tags carry over, but each platform has different norms. Generate per platform or read our platform guides and adjust.',
    },
  ],
  relatedLinks: crossLinksExcept('/hashtag-generator'),
};
