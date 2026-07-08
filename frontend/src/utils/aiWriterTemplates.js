export const AI_WRITER_GROUPS = [
  {
    id: 'generate-text',
    label: 'Generate text',
    icon: '✍️',
    tools: [
      { id: 'article', label: 'Article', title: 'AI Article Generator' },
      { id: 'email', label: 'Email', title: 'AI Email Generator' },
      { id: 'essay', label: 'Essay', title: 'AI Essay Generator' },
      { id: 'ideas', label: 'Ideas', title: 'AI Ideas Generator' },
      { id: 'names', label: 'Names', title: 'AI Names Generator' },
      { id: 'outline', label: 'Outline', title: 'AI Outline Generator' },
      { id: 'paragraph', label: 'Paragraph', title: 'AI Paragraph Generator' },
      { id: 'prompt', label: 'Prompt', title: 'AI Prompt Generator' },
      { id: 'script', label: 'Script', title: 'AI Script Generator' },
      { id: 'story', label: 'Story', title: 'AI Story Generator' },
      { id: 'titles', label: 'Titles', title: 'AI Titles Generator' },
      { id: 'translations', label: 'Translations', title: 'AI Translations' },
    ],
  },
  {
    id: 'edit-text',
    label: 'Edit text',
    icon: '📝',
    tools: [
      { id: 'expand', label: 'Expand', title: 'AI Expand Text' },
      { id: 'grammar', label: 'Grammar checker', title: 'AI Grammar Checker' },
      { id: 'paraphraser', label: 'Paraphraser', title: 'AI Paraphraser' },
      { id: 'shorten', label: 'Shorten', title: 'AI Shorten Text' },
      { id: 'summarizer', label: 'Summarizer', title: 'AI Summarizer' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    icon: '💡',
    tools: [
      { id: 'content-article', label: 'Article', title: 'AI Article Generator' },
      { id: 'blog-titles', label: 'Blog titles', title: 'AI Blog Titles Generator' },
      { id: 'captions', label: 'Captions', title: 'AI Captions Generator' },
      { id: 'hashtags', label: 'Hashtags', title: 'AI Hashtags Generator' },
      { id: 'content-ideas', label: 'Ideas', title: 'AI Content Ideas Generator' },
      { id: 'meta-description', label: 'Meta description', title: 'AI Meta Description Generator' },
      { id: 'content-outline', label: 'Outline', title: 'AI Outline Generator' },
      { id: 'content-paragraph', label: 'Paragraph', title: 'AI Paragraph Generator' },
      { id: 'content-script', label: 'Script', title: 'AI Script Generator' },
      { id: 'social-bio', label: 'Social media bio', title: 'AI Social Media Bio Generator' },
      { id: 'story-ideas', label: 'Story ideas', title: 'AI Story Ideas Generator' },
      { id: 'content-titles', label: 'Titles', title: 'AI Titles Generator' },
      { id: 'video-titles', label: 'Video titles', title: 'AI Video Titles Generator' },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    icon: '💼',
    tools: [
      { id: 'business-names', label: 'Business names', title: 'AI Business Names Generator' },
      { id: 'email-writer', label: 'Email writer', title: 'AI Email Writer' },
      { id: 'business-ideas', label: 'Ideas', title: 'AI Business Ideas Generator' },
      { id: 'side-hustle', label: 'Side hustle ideas', title: 'AI Side Hustle Ideas' },
      { id: 'business-slogan', label: 'Slogan', title: 'AI Slogan Generator' },
      { id: 'startup', label: 'Startup', title: 'AI Startup Ideas Generator' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: '📣',
    tools: [
      { id: 'ad-copy', label: 'Ad copy', title: 'AI Ad Copy Generator' },
      { id: 'marketing-article', label: 'Article', title: 'AI Marketing Article Generator' },
      { id: 'marketing-blog-titles', label: 'Blog titles', title: 'AI Blog Titles Generator' },
      { id: 'marketing-email', label: 'Email', title: 'AI Marketing Email Generator' },
      { id: 'landing-titles', label: 'Landing page titles', title: 'AI Landing Page Titles' },
      { id: 'marketing-meta', label: 'Meta description', title: 'AI Meta Description Generator' },
      { id: 'marketing-paragraph', label: 'Paragraph', title: 'AI Marketing Paragraph Generator' },
      { id: 'product-description', label: 'Product description', title: 'AI Product Description Generator' },
      { id: 'marketing-slogan', label: 'Slogan', title: 'AI Slogan Generator' },
    ],
  },
];

export const AI_TONES = ['Professional', 'Friendly', 'Casual', 'Creative', 'Persuasive'];
export const AI_LENGTHS = ['Short', 'Medium', 'Long'];

function titleCase(value) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function tonePhrase(tone) {
  switch (tone) {
    case 'Friendly':
      return 'with a warm and approachable voice';
    case 'Casual':
      return 'in a relaxed everyday style';
    case 'Creative':
      return 'with creative flair and vivid wording';
    case 'Persuasive':
      return 'with a clear, persuasive focus on action';
    default:
      return 'in a clear professional tone';
  }
}

function lengthMultiplier(length) {
  if (length === 'Short') return 1;
  if (length === 'Long') return 3;
  return 2;
}

function listIdeas(topic, count, maker) {
  return Array.from({ length: count }, (_, i) => maker(topic, i + 1)).join('\n');
}

function slugifyParts(topic) {
  const cleaned = titleCase(topic);
  return cleaned || 'Your Idea';
}

export function getAiWriterTool(toolId) {
  for (const group of AI_WRITER_GROUPS) {
    const found = group.tools.find((tool) => tool.id === toolId);
    if (found) return { ...found, groupId: group.id, groupLabel: group.label };
  }
  return null;
}

export function generateAiWriterOutput({ toolId, topic, tone = 'Professional', length = 'Medium' }) {
  const input = (topic ?? '').trim();
  if (!input) return '';

  const t = slugifyParts(input);
  const toneLine = tonePhrase(tone);
  const size = lengthMultiplier(length);
  const tool = getAiWriterTool(toolId)?.id || toolId;

  switch (tool) {
    case 'article':
    case 'content-article':
    case 'marketing-article':
      return [
        `${t}: A Practical Guide`,
        '',
        `${t} is becoming more important for creators and brands who want better results online. This short guide shares useful points ${toneLine}.`,
        '',
        `Start by clarifying your goal with ${t.toLowerCase()}. When your audience understands the value quickly, they are more likely to engage, save, and share your content.`,
        '',
        size > 1
          ? `Next, break ${t.toLowerCase()} into simple steps. Use clear examples, keep each section focused, and finish with one action people can take today.`
          : '',
        size > 2
          ? `\nFinally, measure what works. Track comments, clicks, and saves related to ${t.toLowerCase()}, then improve your next post based on real feedback.`
          : '',
      ]
        .filter(Boolean)
        .join('\n');

    case 'email':
    case 'email-writer':
    case 'marketing-email':
      return [
        `Subject: Quick ideas for ${t}`,
        '',
        `Hi there,`,
        '',
        `I wanted to share a few thoughts about ${t.toLowerCase()} ${toneLine}.`,
        '',
        `Here is a simple approach:`,
        `1. Define what success looks like with ${t.toLowerCase()}.`,
        `2. Share one clear tip your audience can use today.`,
        size > 1 ? `3. Invite readers to reply with their biggest challenge.` : null,
        size > 2 ? `4. Offer a short checklist they can save for later.` : null,
        '',
        `If you would like more help with ${t.toLowerCase()}, just reply to this email.`,
        '',
        `Best regards,`,
        `Your Name`,
      ]
        .filter((line) => line !== null)
        .join('\n');

    case 'essay':
      return [
        `Title: Understanding ${t}`,
        '',
        `Introduction`,
        `${t} is a useful topic to explore because it affects how people learn, create, and communicate. This essay examines the main points ${toneLine}.`,
        '',
        `Body`,
        `- Point 1: ${t} helps people organize their goals more clearly.`,
        `- Point 2: Strong examples make ${t.toLowerCase()} easier to apply in real life.`,
        size > 1 ? `- Point 3: Consistent practice improves results with ${t.toLowerCase()}.` : null,
        size > 2 ? `- Point 4: Feedback loops help refine your approach over time.` : null,
        '',
        `Conclusion`,
        `In summary, focusing on ${t.toLowerCase()} can lead to better outcomes when the process is clear, practical, and repeated.`,
      ]
        .filter((line) => line !== null)
        .join('\n');

    case 'ideas':
    case 'content-ideas':
    case 'business-ideas':
      return listIdeas(t, size === 1 ? 8 : size === 2 ? 10 : 12, (topic, i) => `${i}. Fresh idea about ${topic} #${i}`);

    case 'names':
    case 'business-names':
      return listIdeas(t, 10, (topic, i) => {
        const roots = [
          `${topic} Hub`,
          `${topic} Lab`,
          `${topic} Nest`,
          `Smart${topic.replace(/\s+/g, '')}`,
          `${topic} Grove`,
          `Nova ${topic}`,
          `${topic} Works`,
          `Prime ${topic}`,
          `${topic} Path`,
          `${topic} Forge`,
        ];
        return `${i}. ${roots[i - 1]}`;
      });

    case 'outline':
    case 'content-outline':
      return [
        `Outline: ${t}`,
        `1. Introduction to ${t}`,
        `2. Why ${t} matters`,
        `3. Key steps to get started`,
        size > 1 ? `4. Common mistakes to avoid` : null,
        size > 1 ? `5. Practical examples` : null,
        size > 2 ? `6. Tools and resources` : null,
        size > 2 ? `7. Measuring progress` : null,
        `8. Conclusion and next actions`,
      ]
        .filter((line) => line !== null)
        .join('\n');

    case 'paragraph':
    case 'content-paragraph':
    case 'marketing-paragraph':
      return size === 1
        ? `${t} can help you communicate more clearly and attract the right audience. Focus on one main message, keep the wording simple, and end with a useful next step ${toneLine}.`
        : `${t} can help you communicate more clearly and attract the right audience. Focus on one main message, support it with a short example, and keep the wording simple. When people understand the value quickly, they are more likely to take action ${toneLine}. End with one practical tip they can use today.`;

    case 'prompt':
      return `Write a ${tone.toLowerCase()} ${length.toLowerCase()} response about "${t}". Include a short introduction, 3 practical tips, and a clear call to action. Avoid fluff and keep the language easy to follow.`;

    case 'script':
    case 'content-script':
      return [
        `Video Script: ${t}`,
        '',
        `Hook: Stop scrolling if you want better results with ${t.toLowerCase()}.`,
        `Problem: Most people overcomplicate ${t.toLowerCase()} and quit too early.`,
        `Solution: Here is a simple way to improve ${t.toLowerCase()} ${toneLine}.`,
        `Step 1: Start with one clear goal.`,
        `Step 2: Apply one tip today.`,
        size > 1 ? `Step 3: Review what worked and adjust.` : null,
        `CTA: Follow for more tips on ${t.toLowerCase()}.`,
      ]
        .filter((line) => line !== null)
        .join('\n');

    case 'story':
      return [
        `Story Idea: The Day ${t} Changed Everything`,
        '',
        `A creator struggled to get noticed until they tried a new approach to ${t.toLowerCase()}. After one simple change ${toneLine}, their content finally connected with the right audience.`,
        size > 1
          ? `\nMidpoint: challenges appear—doubt, slow growth, and conflicting advice. They stay focused on one method related to ${t.toLowerCase()}.`
          : '',
        size > 2
          ? `\nEnding: results arrive quietly, then all at once. The lesson is that consistency around ${t.toLowerCase()} beats chasing trends.`
          : '',
      ]
        .filter(Boolean)
        .join('\n');

    case 'titles':
    case 'content-titles':
    case 'blog-titles':
    case 'marketing-blog-titles':
      return listIdeas(t, 10, (topic, i) => `${i}. ${topic}: Tip #${i} You Can Use Today`);

    case 'translations':
      return 'Translation support will be available soon.\n\nFor now, keep your original text ready and try another AI Writer tool such as Paraphraser, Expand, or Summarizer.';

    case 'expand':
      return `${input}\n\nExpanded version (${tone.toLowerCase()}, ${length.toLowerCase()}):\n${input} is worth exploring in more detail because clear communication helps your audience understand the value faster. Add context, share one practical example, and explain the benefit in simple language ${toneLine}. Then invite your reader to take one small action related to this idea.`;

    case 'grammar':
      return `Grammar check notes for your text:\n\nOriginal:\n${input}\n\nSuggested polished version:\n${input
        .replace(/\bi\b/g, 'I')
        .replace(/\s+/g, ' ')
        .replace(/\s+([,.!?])/g, '$1')
        .trim()}${/[.!?]$/.test(input.trim()) ? '' : '.'}\n\nQuick tips: capitalize sentence starts, remove extra spaces, and keep sentences concise.`;

    case 'paraphraser':
      return `Paraphrased (${tone.toLowerCase()}):\nHere is another way to say it — ${input
        .replace(/\bvery\b/gi, 'truly')
        .replace(/\bgood\b/gi, 'strong')
        .replace(/\bbad\b/gi, 'weak')
        .trim()}. This version keeps your meaning while adjusting the wording ${toneLine}.`;

    case 'shorten':
      return `Shortened version:\n${input
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, size === 1 ? 1 : 2)
        .join('. ')
        .trim()}${input.trim() ? '.' : ''}`;

    case 'summarizer':
      return `Summary:\n${t} focuses on the main idea of your input. In short: keep the core message, remove extras, and communicate the value clearly ${toneLine}.`;

    case 'captions':
      return [
        `1. ${t} made simple — save this for later ✨`,
        `2. Trying ${t.toLowerCase()} today. Who else is in?`,
        `3. Small tips for better ${t.toLowerCase()}. Follow for more.`,
        `4. Your reminder: progress with ${t.toLowerCase()} beats perfection.`,
        size > 1 ? `5. Real talk about ${t.toLowerCase()} — comment your biggest challenge.` : null,
        size > 2 ? `6. New to ${t.toLowerCase()}? Start with one tiny step today.` : null,
      ]
        .filter((line) => line !== null)
        .join('\n');

    case 'hashtags': {
      const base = t.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '');
      return `#${base || 'fityvid'} #${base || 'content'}Tips #CreateDaily #SocialGrowth #CreatorTips #ContentIdeas #ViralReady #MarketingTips #GrowOnline #PostIdeas`;
    }

    case 'meta-description':
    case 'marketing-meta':
      return `Discover practical tips for ${t.toLowerCase()}. Learn clear steps, useful examples, and simple actions you can use today to get better results.`.slice(
        0,
        length === 'Short' ? 120 : length === 'Long' ? 160 : 145,
      );

    case 'social-bio':
      return [
        `1. Helping creators grow with ${t.toLowerCase()} 🚀`,
        `2. ${t} tips • daily ideas • real growth`,
        `3. Learn ${t.toLowerCase()} the simple way.`,
        `4. Creator of practical ${t.toLowerCase()} content.`,
        `5. Building better content through ${t.toLowerCase()}.`,
      ].join('\n');

    case 'story-ideas':
      return listIdeas(t, 8, (topic, i) => `${i}. A short story where someone discovers ${topic} in an unexpected place.`);

    case 'video-titles':
      return listIdeas(t, 10, (topic, i) => `${i}. ${topic} in ${60 + i * 5} Seconds (Must Watch)`);

    case 'side-hustle':
      return listIdeas(t, 8, (topic, i) => `${i}. Build a side hustle around ${topic} by offering a simple digital product or service.`);

    case 'business-slogan':
    case 'marketing-slogan':
    case 'slogan':
      return [
        `1. ${t} — made simple.`,
        `2. Better results with ${t}.`,
        `3. Your smart way to ${t.toLowerCase()}.`,
        `4. Create. Grow. Repeat with ${t}.`,
        `5. ${t}: clarity that converts.`,
      ].join('\n');

    case 'startup':
      return [
        `Startup concept: ${t} Assistant`,
        `Problem: People waste time figuring out ${t.toLowerCase()}.`,
        `Solution: A simple tool that guides users through ${t.toLowerCase()} step by step.`,
        `Audience: Beginners and small creators.`,
        `First MVP: One core feature + clear onboarding.`,
        size > 1 ? `Growth idea: Share weekly tips and templates related to ${t.toLowerCase()}.` : null,
      ]
        .filter((line) => line !== null)
        .join('\n');

    case 'ad-copy':
      return [
        `Headline: Get better results with ${t}`,
        `Description: Discover a simple way to improve ${t.toLowerCase()} ${toneLine}. Fast tips, clear value, and an easy next step.`,
        `CTA: Try it now`,
      ].join('\n');

    case 'product-description':
      return `${t} is designed to help you move faster with less stress. It gives you clear guidance, practical value, and an easy way to get started ${toneLine}. Perfect for creators and teams who want better results without complicated steps.`;

    case 'landing-titles':
      return listIdeas(t, 8, (topic, i) => `${i}. Unlock Better ${topic} Results Today`);

    default:
      return `Here are useful thoughts about ${t} ${toneLine}.\n\nFocus on clarity, give one practical example, and finish with a clear next step.`;
  }
}
