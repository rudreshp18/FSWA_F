import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Ssv from './components/Ssv.jsx'
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from './components/Dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/dashboard" element={<Ssv element={Dashboard} />} />
    </Routes>
  </BrowserRouter>
)
