import React from 'react';
import styles from './Shop.module.css';

const GenreFilter = ({ genres, selectedGenre, onSelectGenre }) => {
          return (
                    <aside className={styles.genreSidebar}>
                              <h3 className={styles.genreSidebarTitle}>Ժանրեր</h3>
                              <ul className={styles.genreList}>
                                        {genres.map(genre => (
                                                  <li key={genre.id}>
                                                            <button
                                                                      className={`${styles.genreBtn} ${selectedGenre === genre.id ? styles.activeGenreBtn : ''}`}
                                                                      onClick={() => onSelectGenre(genre.id)}
                                                            >
                                                                      {genre.label}
                                                            </button>
                                                  </li>
                                        ))}
                              </ul>
                    </aside>
          );
};

export default GenreFilter;
