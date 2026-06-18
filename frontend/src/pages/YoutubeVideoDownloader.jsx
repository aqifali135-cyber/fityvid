import PlatformDownloaderPage from '../components/PlatformDownloaderPage';
import { YOUTUBE_DOWNLOADER_PAGE } from '../constants/platformDownloaderContent';

export default function YoutubeVideoDownloader() {
  return <PlatformDownloaderPage {...YOUTUBE_DOWNLOADER_PAGE} />;
}
