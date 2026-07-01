import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import styles from './Header.module.css';
import { CiLogout } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerTop}>
        <div className={styles.headerLogo}>
          <Link to="/">Գրատուն</Link>
        </div>

        {/* Աջ կողմի խումբը՝ մենյուի կոճակի և զամբյուղի համար */}
        <div className={styles.headerRight}>
          <nav className={`${styles.headerMenu} ${isOpen ? styles.active : ''}`}>
            <Link to="/" className={styles.navLink} onClick={() => setIsOpen(false)}>Գլխավոր</Link>
            <Link to="/shop" className={styles.navLink} onClick={() => setIsOpen(false)}>Գրքեր</Link>
            <Link to="/blog" className={styles.navLink} onClick={() => setIsOpen(false)}>Բլոգ</Link>
            <Link to="/contact" className={styles.navLink} onClick={() => setIsOpen(false)}>Հետադարձ կապ</Link>
            <Link to="/about" className={styles.navLink} onClick={() => setIsOpen(false)}>Մեր մասին</Link>
            {/* Սա հին լոգիկան է */}
            {/* {isLoggedIn ? (
              <button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '21px' }}>
                Դուրս գալ
              </button>
            ) : (
              <Link to="/login" className={styles.navLink} onClick={() => setIsOpen(false)}>Մուտք</Link>
            )} */}
          </nav>

          <button className={styles.menuToggle} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX /> : <FiMenu />}
          </button>

          <Link to="/cart" aria-label="Զամբյուղ" className={styles.cartIcon}>
            <FiShoppingBag />

          </Link>

          {isLoggedIn ? (
            <button onClick={handleLogout} className={styles.cartIcon} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '21px' }}>
              <VscAccount />  <IoIosLogOut />
            </button>
          ) : (
              <Link to="/login" className={styles.cartIcon} onClick={() => setIsOpen(false)}><VscAccount />   <CiLogout /></Link>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;