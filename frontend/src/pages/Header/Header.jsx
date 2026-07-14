import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { FiHeart } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import styles from './Header.module.css';
import { CiLogout } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { AuthContext } from '../../context/AuthContext.jsx';
import { FavoritesContext } from '../../context/FavoritesContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import logo from '../../assets/gratun-logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { favorites } = useContext(FavoritesContext);
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerTop}>
        <div className={styles.headerLogo}>
          <Link to="/">
            <img src={logo} alt="Գրատուն" className={styles.logoImg} />
          </Link>
        </div>

        <div className={styles.headerRight}>
          <nav className={`${styles.headerMenu} ${isOpen ? styles.active : ''}`}>
            <Link to="/" className={styles.navLink} onClick={() => setIsOpen(false)}>Գլխավոր</Link>
            <Link to="/shop" className={styles.navLink} onClick={() => setIsOpen(false)}>Գրքեր</Link>
            <Link to="/blog" className={styles.navLink} onClick={() => setIsOpen(false)}>Բլոգ</Link>
            <Link to="/contact" className={styles.navLink} onClick={() => setIsOpen(false)}>Հետադարձ կապ</Link>
            <Link to="/about" className={styles.navLink} onClick={() => setIsOpen(false)}>Մեր մասին</Link>
          </nav>

          <button className={styles.menuToggle} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX /> : <FiMenu />}
          </button>

          <Link to="/favorites" aria-label="Հավանածներ" className={styles.heartIcon}>
            <FiHeart />
            {favorites.length > 0 && <span className={styles.heartBadge}>{favorites.length}</span>}
          </Link>

          <Link to="/cart" aria-label="Զամբյուղ" className={styles.cartIcon}>
            <FiShoppingBag />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>

          {isLoggedIn ? (
            <button onClick={handleLogout} className={styles.accountAction} aria-label="Դուրս գալ">
              <VscAccount />
              <IoIosLogOut />
            </button>
          ) : (
            <Link to="/login" className={styles.accountAction} onClick={() => setIsOpen(false)} aria-label="Մուտք">
              <VscAccount />
              <CiLogout />
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;