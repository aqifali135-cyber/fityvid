import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Platforms from './pages/Platforms';
import HashtagGenerator from './pages/HashtagGenerator';
import DownloadGuide from './pages/DownloadGuide';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import Dmca from './pages/Dmca';

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
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/dmca" element={<Dmca />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
      </Routes>
    </Layout>
  );
}
