import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import styles from './RecommendedBooks.module.css';
import { EXCLUDED_FROM_RECOMMENDED } from '../Shop/genreConstants';


const RECOMMENDED_COUNT = 5;

const RecommendedBooks = () => {
          const [books, setBooks] = useState([]);
          const [loading, setLoading] = useState(true);
          const { addToCart } = useContext(CartContext);

          useEffect(() => {
                    axios.get('/api/books')
                              .then(res => {
                                        // Հին հրատարակությունների ժանրի գրքերը երբեք չպետք է
                                        // հայտնվեն այս բաժնում, նույնիսկ եթե ամենավերջին ավելացվածներից են
                                        const eligibleBooks = res.data.filter(
                                                  book => !EXCLUDED_FROM_RECOMMENDED.includes(book.genre)
                                        );
                                        const sorted = [...eligibleBooks].sort((a, b) => (a._id < b._id ? 1 : -1));
                                        setBooks(sorted.slice(0, RECOMMENDED_COUNT));
                                        setLoading(false);
                              })
                              .catch(err => {
                                        console.error(err);
                                        setLoading(false);
                              });
          }, []);

          const handleAddToCart = (book) => {
                    addToCart(book);
                    toast.success(`${book.title} գիրքը ավելացվեց զամբյուղի մեջ!`, { icon: '🛒', duration: 2000 });
          };

          // Եթե դեռ բեռնվում է կամ գրքեր չկան, բաժինը ընդհանրապես չի ցուցադրվում
          if (loading || books.length === 0) return null;

          return (
                    <section className={styles.recommendedSection}>
                              <div className={styles.contentWrapper}>
                                        <div className={styles.sectionHeader}>
                                                  <h2 className={styles.sectionTitle}>Առաջարկվող գրքեր</h2>
                                                  <p className={styles.sectionSubtitle}>Մեր վերջին գրքերն այս ցանկում</p>
                                                  <p className={styles.sectionDescription}>
                                                            Հատուկ ընտրված գրքեր՝ դասական և ժամանակակից հեղինակներից,
                                                            որոնք արժանի են Ձեր գրադարանում իրենց տեղն ունենալուն։ Նոր գրքերն ավելացվում են
                                                            պարբերաբար, այցելեք հաճախ😊
                                                  </p>
                                        </div>

                                        <div className={styles.booksRow}>
                                                  {books.map(book => (
                                                            <div key={book._id} className={styles.bookCard}>
                                                                      <div className={styles.imageWrapper}>
                                                                                <img
                                                                                          src={book.image.startsWith('http') ? book.image : `https://ik.imagekit.io/hmtd5pr9d/${book.image}`}
                                                                                          alt={book.title}
                                                                                          onError={(e) => { e.target.style.display = 'none'; }}
                                                                                />
                                                                      </div>
                                                                      <h3 className={styles.bookTitle}>{book.title}</h3>
                                                                      <p className={styles.bookAuthor}>{book.author}</p>
                                                                      <span className={styles.bookPrice}>{book.price} ֏</span>
                                                                      <button className={styles.buyBtn} onClick={() => handleAddToCart(book)}>
                                                                                Ավելացնել զամբյուղ
                                                                      </button>
                                                            </div>
                                                  ))}
                                        </div>
                              </div>
                    </section>
          );
};

export default RecommendedBooks;