import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import api from '../../api/axiosInstance';
import styles from './authorsStyles.js';
import Seo from '../Seo/Seo';

const Authors = () => {
          const [authors, setAuthors] = useState([]);
          const [loading, setLoading] = useState(true);

          useEffect(() => {
                    api.get('/quotes/authors/list')
                              .then(res => {
                                        setAuthors(res.data);
                                        setLoading(false);
                              })
                              .catch(() => setLoading(false));
          }, []);

          if (loading) return <div className={styles.loading}>Բեռնվում է...</div>;

          return (
                    <div className={styles.page}>
                              <Seo
                                        title="Հեղինակներ"
                                        description="Ծանոթացեք Գրատուն-ի մեջբերումների հեղինակներին, նրանց լուսանկարներին ու կենսագրություններին։"
                                        url="https://www.gratunhub.am/authors"
                              />

                              <div className={styles.pageHeader}>
                                        <h1 className={styles.pageHeaderH1}>Հեղինակներ</h1>
                                        <p className={styles.pageHeaderP}>Սեղմեք հեղինակի վրա՝ նրա մասին ավելին իմանալու և բոլոր մեջբերումները տեսնելու համար</p>
                              </div>

                              {authors.length === 0 ? (
                                        <p className={styles.noResults}>Հեղինակներ դեռ չկան</p>
                              ) : (
                                        <div className={styles.authorsGrid}>
                                                  {authors.map(a => (
                                                            <Link key={a.author} to={`/authors/${encodeURIComponent(a.author)}`} className={styles.authorCard}>
                                                                      <div className={styles.authorImageWrap}>
                                                                                {a.authorImage ? (
                                                                                          <img className={styles.authorPhoto} src={a.authorImage} alt={a.author} loading="lazy" />
                                                                                ) : (
                                                                                          <div className={styles.authorPhotoFallback}><FiUser /></div>
                                                                                )}
                                                                                <span className={styles.authorTag}>
                                                                                          {a.quotesCount} {a.quotesCount === 1 ? 'մեջբերում' : 'մեջբերում'}
                                                                                </span>
                                                                      </div>
                                                                      <div className={styles.authorNameWrap}>
                                                                                <h2 className={styles.authorName}>{a.author}</h2>
                                                                      </div>
                                                            </Link>
                                                  ))}
                                        </div>
                              )}
                    </div>
          );
};

export default Authors;