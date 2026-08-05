import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { FiBookOpen } from 'react-icons/fi';
import styles from './ThematicTeaser.module.css';

// Գլխավոր էջում ամբողջ տեքստը ցույց չենք տալիս, միայն մի հատված, որ բլոկը
// չծանրանա. մնացածի համար "Կարդալ ավելին" հղումը տանում է /thematic էջին
const MAX_CHARS = 150;

const truncate = (text = '', max = MAX_CHARS) => {
          if (text.length <= max) return text;
          const cut = text.slice(0, max);
          const lastSpace = cut.lastIndexOf(' ');
          return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
};

const ThematicTeaser = () => {
          const [item, setItem] = useState(null);
          const [loading, setLoading] = useState(true);

          useEffect(() => {
                    let isMounted = true;

                    api.get('/thematic-books')
                              .then(res => {
                                        if (!isMounted) return;
                                        const items = res.data;
                                        if (Array.isArray(items) && items.length > 0) {
                                                  // Պատահական մեկը, որ ReadingQuote-ի պես ամեն բեռնման ժամանակ փոխվի
                                                  const randomIndex = Math.floor(Math.random() * items.length);
                                                  setItem(items[randomIndex]);
                                        }
                                        setLoading(false);
                              })
                              .catch(() => { if (isMounted) setLoading(false); });

                    return () => { isMounted = false; };
          }, []);

          // Դատարկ է, թե դեռ բեռնվում է. բլոկն ընդհանրապես չենք ցուցադրում,
          // որ էջում դատարկ տեղ չմնա (RecommendedBooks-ի նույն տրամաբանությունը)
          if (loading || !item) return null;

          return (
                    <section className={styles.teaserContainer} aria-label="Ինչ գիրք կարդալ ըստ տրամադրության">
                              <div className={styles.teaserInner}>
                                        <div className={styles.imageSide}>
                                                  {item.image ? (
                                                            <img
                                                                      className={styles.bookCover}
                                                                      src={item.image}
                                                                      alt={item.bookTitle}
                                                                      loading="lazy"
                                                            />
                                                  ) : (
                                                            <div className={styles.bookCoverFallback}>
                                                                      <FiBookOpen />
                                                            </div>
                                                  )}
                                        </div>
                                        <div className={styles.textSide}>
                                                  <span className={styles.themeTag}>{item.theme}</span>
                                                  <p className={styles.teaserText}>{truncate(item.text)}</p>
                                                  <div className={styles.bookInfo}>
                                                            <span className={styles.bookTitle}>{item.bookTitle}</span>
                                                            {item.bookAuthor && (
                                                                      <span className={styles.bookAuthor}>— {item.bookAuthor}</span>
                                                            )}
                                                  </div>
                                                  <Link to="/thematic" className={styles.readMoreBtn}>Կարդալ ավելին</Link>
                                        </div>
                              </div>
                    </section>
          );
};

export default ThematicTeaser;