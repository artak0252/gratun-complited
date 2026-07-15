import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../../context/FavoritesContext';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { bookGenres } from '../Shop/genreConstants';
import { FiHeart } from 'react-icons/fi';
import styles from './Favorites.module.css';

const Favorites = () => {
          const { favorites, removeFavorite } = useContext(FavoritesContext);
          const { addToCart } = useContext(CartContext);

          const handleAddToCart = (book) => {
                    addToCart(book);
                    toast.success(`${book.title} գիրքը ավելացվեց զամբյուղի մեջ!`, { icon: '🛒', duration: 2000 });
          };

          const handleRemove = (book) => {
                    removeFavorite(book._id);
                    toast.success(`${book.title} հեռացվեց հավանածներից`, { icon: '💔', duration: 2000 });
          };

          if (favorites.length === 0) {
                    return (
                              <div className={`${styles.favContainer} ${styles.emptyState}`}>
                                        <h2>Հավանած գրքեր դեռ չկան</h2>
                                        <p>Խանութում գրքի նկարի սրտիկին սեղմիր, որ այն հայտնվի այստեղ։</p>
                                        <Link to="/shop" className={styles.shopLinkBtn}>Անցնել խանութ</Link>
                              </div>
                    );
          }

          return (
                    <div className={styles.favContainer}>
                              <h2 className={styles.favTitle}>Հավանած Գրքերը</h2>

                              <div className={styles.booksGrid}>
                                        {favorites.map(book => (
                                                  <div key={book._id} className={styles.bookCard}>
                                                            <div className={styles.imageWrapper}>
                                                                      <img
                                                                                src={book.image.startsWith('http') ? book.image : `https://ik.imagekit.io/hmtd5pr9d/${book.image}`}
                                                                                alt={book.title}
                                                                                loading="lazy"
                                                                                onError={(e) => {
                                                                                          e.target.style.display = 'none';
                                                                                }}
                                                                      />
                                                                      <button
                                                                                className={styles.favBtn}
                                                                                onClick={() => handleRemove(book)}
                                                                                aria-label="Հեռացնել հավանածներից"
                                                                      >
                                                                                <FiHeart />
                                                                      </button>
                                                            </div>
                                                            <h3>{book.title}</h3>
                                                            <p>{book.author}</p>
                                                            <span className={styles.genreTag}>{bookGenres.find(g => g.id === book.genre)?.label || book.genre}</span>
                                                            <span>{book.price} ֏</span>
                                                            <div className={styles.bookCardActions}>
                                                                      <Link to={`/shop/${book._id}`} className={styles.viewBtn}>Դիտել</Link>
                                                                      <button className={styles.buyBtn} onClick={() => handleAddToCart(book)}>Ավելացնել զամբյուղ</button>
                                                            </div>
                                                  </div>
                                        ))}
                              </div>
                    </div>
          );
};

export default Favorites;