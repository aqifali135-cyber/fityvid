import PlatformDownloaderPage from '../components/PlatformDownloaderPage';
import { FACEBOOK_DOWNLOADER_PAGE } from '../constants/platformDownloaderContent';

export default function FacebookVideoDownloader() {
  return <PlatformDownloaderPage {...FACEBOOK_DOWNLOADER_PAGE} />;
}
