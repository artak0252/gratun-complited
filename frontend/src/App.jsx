import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Էջեր
import Home from './pages/Home/Home';
import Blog from './pages/Blog/Blog';
import Shop from './pages/Shop/Shop';
import BookDetail from './pages/Shop/BookDetail';
import Cart from './pages/Cart/Cart';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';
import SinglePost from './pages/Blog/SinglePost';
import Login from './pages/Login/Login';
import Register from './pages/Login/Register'; // Ավելացված Register էջը

// Կոմպոնենտներ
import Header from './pages/Header/Header';
import AnnouncementBar from './pages/AnnouncementBar/AnnouncementBar';
import Footer from './pages/Footer/Footer';

function App() {
  return (
    <Router>
      <Toaster />
      <Header />
      <AnnouncementBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<SinglePost />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<BookDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Նոր ռոուտը */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;