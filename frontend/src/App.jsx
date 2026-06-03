import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Platforms from './pages/Platforms';
import HashtagGenerator from './pages/HashtagGenerator';
import DownloadGuide from './pages/DownloadGuide';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/hashtag-generator" element={<HashtagGenerator />} />
        <Route path="/download-guide" element={<DownloadGuide />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>
    </Layout>
  );
}
