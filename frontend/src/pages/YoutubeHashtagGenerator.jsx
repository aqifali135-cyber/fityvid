import HashtagLandingPage from '../components/HashtagLandingPage';
import { PAGE_SEO } from '../constants/seo';
import { YOUTUBE_HASHTAG_LANDING } from '../constants/hashtagLandingContent';

export default function YoutubeHashtagGenerator() {
  return (
    <HashtagLandingPage
      seo={PAGE_SEO.youtubeHashtagGenerator}
      hero={YOUTUBE_HASHTAG_LANDING.hero}
      content={YOUTUBE_HASHTAG_LANDING.content}
    />
  );
}
