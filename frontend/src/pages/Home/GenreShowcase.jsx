import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiClock, FiStar, FiSearch, FiSmile, FiFeather } from 'react-icons/fi';
import styles from './GenreShowcase.module.css';

const genres = [
  { id: 'fiction', label: 'Գեղարվեստական', icon: <FiBookOpen /> },
  { id: 'history', label: 'Պատմական', icon: <FiClock /> },
  { id: 'fantasy', label: 'Ֆենթեզի', icon: <FiStar /> },
  { id: 'detective', label: 'Դետեկտիվ', icon: <FiSearch /> },
  { id: 'children', label: 'Մանկական', icon: <FiSmile /> },
  { id: 'poetry', label: 'Պոեզիա', icon: <FiFeather /> },
];

const GenreShowcase = () => {
  return (
    <section className={styles.genreSection}>
      <h2>Ընտրիր ըստ ժանրի</h2>
      <div className={styles.genreGrid}>
        {genres.map((g) => (
          <Link to={`/shop?genre=${g.id}`} className={styles.genreCard} key={g.id}>
            <div className={styles.genreIcon}>{g.icon}</div>
            <span>{g.label}</span>
          </Link>
        ))}
      </div>
      <Link to="/shop" className={styles.viewAllLink}>
        Տեսնել բոլոր գրքերը →
      </Link>
    </section>
  );
};

export default GenreShowcase;
