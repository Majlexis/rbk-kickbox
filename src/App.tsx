import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Bookings from './pages/Bookings';
import Cancel from './pages/Cancel';
import Equipment from './pages/Equipment';
import Cennik from './pages/Cennik';
import DveProcenta from './pages/DveProcenta';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/galeria" element={<Gallery />} />
            <Route path="/vybavenie" element={<Equipment />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/zrusenie" element={<Cancel />} />
            <Route path="/rezervacie" element={<Bookings />} />
            <Route path="/cennik" element={<Cennik />} />
            <Route path="/2-percenta" element={<DveProcenta />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}