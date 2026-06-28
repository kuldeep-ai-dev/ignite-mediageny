import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import Gallery from './pages/Gallery';
import Registration from './pages/Registration';
import PaymentStatus from './pages/PaymentStatus';
import Workshops from './pages/Workshops';
import Events from './pages/Events';
import About from './pages/About';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventsManager from './pages/admin/EventsManager';
import RegistrationsManager from './pages/admin/RegistrationsManager';
import InstitutesManager from './pages/admin/InstitutesManager';
import './App.css';

const PublicLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Routes with Navbar/Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/register/:id" element={<Registration />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/gallery/:id" element={<Gallery />} />
          </Route>

          {/* Admin Routes (No Navbar/Footer) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<EventsManager />} />
            <Route path="registrations" element={<RegistrationsManager />} />
            <Route path="institutes" element={<InstitutesManager />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
