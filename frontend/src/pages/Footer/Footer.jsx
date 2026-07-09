import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h3>Գրատուն - Հաբ</h3>
          <p>Բացահայտիր գրքերի կախարդական աշխարհը մեզ հետ:</p>
        </div>

        <div className={styles.footerSection}>
          <h4>Հղումներ</h4>
          <ul className={styles.footerLinks}>
            <li><Link to="/about">Մեր մասին</Link></li>
            <li><Link to="/contact">Կապ</Link></li>
            <li><Link to="/blog">Բլոգ</Link></li>
            <li><Link to="/terms">Պայմաններ</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4>Հետևեք մեզ</h4>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Գրատուն. Բոլոր իրավունքները պաշտպանված են:</p>
      </div>
    </footer>
  );
};

export default Footer;