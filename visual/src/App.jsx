import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homescreen from './components/Homescreen';
import RoadmapView from './components/RoadmapView';
import TopicView from './components/TopicView';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homescreen />} />
        <Route path="/roadmap" element={<RoadmapView />} />
        <Route path="/topic/:filename" element={<TopicView />} />
      </Routes>
    </BrowserRouter>
  );
}
