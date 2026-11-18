import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import TallerGospodinoff from './TallerGospodinoff.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TallerGospodinoff />
  </StrictMode>
);
