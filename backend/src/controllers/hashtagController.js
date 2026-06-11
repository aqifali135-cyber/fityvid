import { validateHashtagRequest } from '../utils/validation.js';
import { generateHashtags } from '../services/hashtagService.js';

export function generateHashtagHandler(req, res) {
  const validation = validateHashtagRequest(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      errors: validation.errors,
    });
  }

  const { topic, platform, type, count, contentType, goal } = validation.data;
  const { hashtags, groups, captionIdea } = generateHashtags({
    topic,
    platform,
    type,
    count,
    contentType,
    goal,
  });

  return res.json({
    success: true,
    topic,
    platform,
    type,
    count,
    contentType,
    goal,
    hashtags,
    groups,
    captionIdea,
  });
}
