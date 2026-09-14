import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import api from '../../api/axiosInstance';
import styles from './authorsStyles.js';
import Seo from '../Seo/Seo';

const SITE_URL = 'https://www.gratunhub.am';

const AuthorDetail = () => {
          const { author } = useParams();
          const [data, setData] = useState(null);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState(null);

          useEffect(() => {
                    setLoading(true);
                    setError(null);
                    api.get(`/quotes/authors/${encodeURIComponent(author)}`)
                              .then(res => {
                                        setData(res.data);
                                        setLoading(false);
                              })
                              .catch(() => {
                                        setError('Հեղինակը չգտնվեց');
                                        setLoading(false);
                              });
          }, [author]);

          if (loading) return <div className={styles.loading}>Բեռնվում է...</div>;
          if (error || !data) return <div className={styles.loading}>{error || 'Հեղինակը չգտնվեց'}</div>;

          return (
                    <div className={styles.page}>
                              <Seo
                                        title={data.author}
                                        description={data.authorBio || `${data.author}-ի մեջբերումները Գրատուն կայքում։`}
                                        image={data.authorImage}
                                        url={`${SITE_URL}/authors/${encodeURIComponent(data.author)}`}
                              />

                              <Link to="/authors" className={styles.backLink}>← Հետ դեպի Հեղինակներ</Link>

                              <div className={styles.detailHeader}>
                                        {data.authorImage ? (
                                                  <img className={styles.detailPhoto} src={data.authorImage} alt={data.author} />
                                        ) : (
                                                  <div className={styles.detailPhotoFallback}><FiUser /></div>
                                        )}
                                        <h1 className={styles.detailName}>{data.author}</h1>
                                        {data.authorBio && <p className={styles.detailBio}>{data.authorBio}</p>}
                                        <span className={styles.detailQuotesCount}>
                                                  {data.quotes.length} {data.quotes.length === 1 ? 'մեջբերում' : 'մեջբերում'}
                                        </span>
                              </div>

                              <div className={styles.quotesGrid}>
                                        {data.quotes.map(quote => (
                                                  <article key={quote._id} className={styles.quoteCard}>
                                                            <span className={styles.quoteMark}>&#8221;</span>
                                                            <p className={styles.quoteText}>{quote.text}</p>
                                                  </article>
                                        ))}
                              </div>
                    </div>
          );
};

export default AuthorDetail;