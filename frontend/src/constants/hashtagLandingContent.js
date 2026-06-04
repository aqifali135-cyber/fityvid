/** @typedef {{ to: string, label: string }} RelatedLink */

export const HASHTAG_RELATED_ALL = [
  { to: '/hashtag-generator', label: 'Free hashtag generator (all platforms)' },
  { to: '/tiktok-hashtag-generator', label: 'TikTok hashtag generator guide' },
  { to: '/instagram-hashtag-generator', label: 'Instagram hashtag generator guide' },
  { to: '/youtube-hashtag-generator', label: 'YouTube hashtag generator guide' },
  { to: '/facebook-hashtag-generator', label: 'Facebook hashtag generator guide' },
  { to: '/faq', label: 'FityVid FAQ' },
];

function relatedExcept(currentPath) {
  return HASHTAG_RELATED_ALL.filter((link) => link.to !== currentPath);
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
    relatedLinks: relatedExcept('/instagram-hashtag-generator'),
  },
};

export const YOUTUBE_HASHTAG_LANDING = {
  hero: {
    title: 'YouTube Hashtag Generator Guide',
    subtitle:
      'Choose YouTube hashtags for videos and Shorts. Generate ideas on FityVid, then pick tags that match your title and topic.',
    ctaLabel: 'Generate YouTube hashtags',
  },
  content: {
    intro: [
      'On YouTube, hashtags can appear above the title and link to a hashtag search page. They help group public videos around a theme and can give viewers another path to related content. They are not a replacement for titles, thumbnails, or watch time.',
      'Use this page to plan YouTube hashtags for long-form videos and Shorts, and to learn how FityVid’s free generator suggests tags from your topic. Always confirm tags are relevant to the video you publish.',
      'FityVid does not guarantee rankings, subscribers, or Shorts feed placement. YouTube’s systems weigh many factors beyond hashtags.',
    ],
    howItWorks: {
      title: 'How the YouTube hashtag generator works',
      paragraphs: [
        'Enter your video subject in FityVid’s hashtag generator, select YouTube, and choose a style. The tool outputs suggested hashtags you can paste into your description or title area according to YouTube’s current display rules.',
        'YouTube may show up to three hashtags prominently above the title when they meet platform requirements. Prioritize the most accurate tags rather than using every suggestion.',
      ],
      steps: [
        'Summarize your video topic in the generator.',
        'Select YouTube and generate a tag list.',
        'Pick the top tags that match your title and content.',
        'Add them to your description (and title when appropriate) and publish.',
      ],
    },
    platformTips: {
      title: 'YouTube hashtag tips',
      paragraphs: [
        'YouTube hashtags work best when they reinforce the same topic as your title and thumbnail. Misleading tags can frustrate viewers and hurt trust.',
      ],
      list: [
        'Place your strongest topic hashtag where YouTube can surface it per current guidelines.',
        'Use tags for series names, events, or clear subjects viewers already search.',
        'For Shorts, keep tags aligned with the hook shown in the first seconds.',
        'Avoid overloading descriptions with dozens of unrelated hash symbols.',
        'Review YouTube Creator Academy and policy pages when rules change.',
      ],
    },
    bestPractices: {
      title: 'Best practices',
      items: [
        'Research what a hashtag page shows before you attach it to a video.',
        'Keep branding consistent with one campaign tag across a playlist or series.',
        'Combine hashtags with keyword-rich titles and descriptions written for people.',
        'Update tags on future uploads when your channel niche evolves.',
        'Monitor retention and traffic sources, not hashtag count alone.',
      ],
    },
    commonMistakes: {
      title: 'Common mistakes',
      items: [
        'Stuffing descriptions with unrelated trending tags.',
        'Using more than three prominent tags when only the most relevant should lead.',
        'Expecting hashtags to fix click-through issues from weak thumbnails.',
        'Copying competitor tag lists for a different subject matter.',
        'Violating YouTube spam or misleading metadata policies.',
      ],
    },
    faq: [
      {
        q: 'How many hashtags should I use on YouTube?',
        a: 'YouTube may highlight up to three hashtags above the title when eligible. Many creators use a focused set in the description. Relevance matters more than quantity.',
      },
      {
        q: 'Do YouTube hashtags help Shorts?',
        a: 'Shorts can include hashtags for context, but distribution relies heavily on engagement and viewer behavior. Tags alone do not control Shorts reach.',
      },
      {
        q: 'Can FityVid guarantee my video will rank?',
        a: 'No. FityVid suggests tags for planning. Rankings and suggested traffic depend on YouTube’s algorithms and your content performance.',
      },
      {
        q: 'Where should I put hashtags on YouTube?',
        a: 'Most creators add hashtags in the video description. Follow YouTube’s help documentation for where tags may appear above the title.',
      },
      {
        q: 'Is FityVid affiliated with YouTube or Google?',
        a: 'No. FityVid is not affiliated with YouTube or Google.',
      },
    ],
    relatedLinks: relatedExcept('/youtube-hashtag-generator'),
  },
};

export const FACEBOOK_HASHTAG_LANDING = {
  hero: {
    title: 'Facebook Hashtag Generator Guide',
    subtitle:
      'Plan Facebook hashtags for Page posts, reels, and videos. Use FityVid for ideas, then publish tags that fit your message.',
    ctaLabel: 'Generate Facebook hashtags',
  },
  content: {
    intro: [
      'Facebook hashtags link posts to topic feeds and search results on the platform. They can help people who already use Facebook discover public conversations around a subject, especially for Pages and public creators.',
      'This page walks through sensible Facebook hashtag use and how FityVid’s generator produces tag suggestions from your topic. Review each tag before posting—Facebook prioritizes meaningful engagement and clear context.',
      'Hashtags alone will not guarantee reach on Facebook. Paid distribution, followers, shares, and content quality all influence who sees your post.',
    ],
    howItWorks: {
      title: 'How the Facebook hashtag generator works',
      paragraphs: [
        'Describe your post in FityVid’s hashtag generator, choose Facebook as the platform, and generate a list. Copy the tags into your post text where they read naturally, often at the end of the message.',
        'Facebook audiences vary by Page, group, and profile settings. Public Pages benefit most from consistent topic tags; always respect privacy settings and community standards.',
      ],
      steps: [
        'Enter your post topic on the hashtag generator.',
        'Select Facebook and your preferred tag style.',
        'Edit the list to match your post language and audience.',
        'Publish and monitor comments and shares for feedback.',
      ],
    },
    platformTips: {
      title: 'Facebook hashtag tips',
      paragraphs: [
        'On Facebook, a short list of clear tags often works better than a long block copied from other networks. Tone and clarity matter for communities that skew conversational.',
      ],
      list: [
        'Use one to three focused tags for many Page posts; add more only when each tag adds context.',
        'Match hashtags to events, locations, or campaigns you discuss in the post.',
        'For video and Reels, align tags with the spoken topic and on-screen subject.',
        'Search the hashtag on Facebook to see what kind of content already appears.',
        'Avoid tags that confuse personal profiles with Page branding.',
      ],
    },
    bestPractices: {
      title: 'Best practices',
      items: [
        'Write the post for your audience first, then add hashtags.',
        'Keep branded tags stable across a campaign for easier browsing.',
        'Use native Facebook insights to see what content earns reach over time.',
        'Respect group rules—some communities restrict or ban hashtag spam.',
        'Pair hashtags with clear links, images, or video descriptions when relevant.',
      ],
    },
    commonMistakes: {
      title: 'Common mistakes',
      items: [
        'Pasting Instagram-style thirty-tag blocks onto Facebook posts.',
        'Using trending tags unrelated to your Page niche.',
        'Expecting hashtags to replace paid reach for new Pages.',
        'Ignoring privacy settings while chasing public hashtag feeds.',
        'Repeating the same promotional tag without varied content.',
      ],
    },
    faq: [
      {
        q: 'How many hashtags should I use on Facebook?',
        a: 'Many Pages use a few relevant tags. There is no universal perfect number—clarity and fit with the post matter most.',
      },
      {
        q: 'Do Facebook hashtags work in groups?',
        a: 'Groups may allow hashtags, but admins often set their own rules. Check group guidelines before posting tag-heavy content.',
      },
      {
        q: 'Will FityVid hashtags boost my Page reach?',
        a: 'FityVid provides suggestions only. Reach depends on content, audience, and Facebook’s distribution systems—not tags alone.',
      },
      {
        q: 'Can I use the same tags on Facebook and Instagram?',
        a: 'You can reuse tags when the topic is identical, but each platform’s audience behaves differently. Tailor lists when formats differ.',
      },
      {
        q: 'Is FityVid affiliated with Facebook or Meta?',
        a: 'No. FityVid is independent and not affiliated with Meta.',
      },
    ],
    relatedLinks: relatedExcept('/facebook-hashtag-generator'),
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
  relatedLinks: HASHTAG_RELATED_ALL.filter((link) => link.to !== '/hashtag-generator'),
};
