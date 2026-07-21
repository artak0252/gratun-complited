import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import styles from './ReadingQuote.module.css';
import hemingwayPhoto from '../../assets/ErnestHemingway.jpg';
import { FiUser } from 'react-icons/fi';

// Եթե backend-ից մեջբերումներ չհաջողվի բերել (կամ դատարկ է), ցույց ենք
// տալիս այս ֆոլբեք մեջբերումը՝ որպեսզի բլոկը երբեք դատարկ չմնա
const fallbackQuote = {
          text: 'Վստահիր գրքերին, նրանք ամենամտերիմներն են. նրանք լռում են, երբ պետք է, և խոսում են, երբ պետք է՝ անհրաժեշտության դեպքում բացելով ձեր առջև աշխարհը։',
          author: 'Էռնեստ Հեմինգուեյ',
          authorImage: hemingwayPhoto,
};

const ReadingQuote = () => {
          const [quote, setQuote] = useState(null);

          useEffect(() => {
                    let isMounted = true;

                    const fetchRandomQuote = async () => {
                              try {
                                        const res = await api.get('/quotes');
                                        const quotes = res.data;
                                        if (isMounted) {
                                                  if (Array.isArray(quotes) && quotes.length > 0) {
                                                            // Ամեն անգամ, երբ բեռնվում է էջը, պատահականորեն ընտրում ենք
                                                            // մեկ մեջբերում ամբողջ ցանկից, որ բլոկը միշտ փոխվի
                                                            const randomIndex = Math.floor(Math.random() * quotes.length);
                                                            setQuote(quotes[randomIndex]);
                                                  } else {
                                                            setQuote(fallbackQuote);
                                                  }
                                        }
                              } catch (err) {
                                        if (isMounted) setQuote(fallbackQuote);
                              }
                    };

                    fetchRandomQuote();
                    return () => { isMounted = false; };
          }, []);

          if (!quote) return null;

          return (
                    <section className={styles.quoteContainer} aria-label="Մեջբերում ընթերցանության մասին">
                              <div className={styles.quoteInner}>
                                        <div className={styles.imageSide}>
                                                  {quote.authorImage ? (
                                                            <img
                                                                      src={quote.authorImage}
                                                                      alt={quote.author}
                                                                      className={styles.authorPhoto}
                                                            />
                                                  ) : (
                                                            <div className={styles.authorPhotoFallback}>
                                                                      <FiUser />
                                                            </div>
                                                  )}
                                        </div>
                                        <div className={styles.textSide}>
                                                  <span className={styles.quoteMark}>"</span>
                                                  <p className={styles.quoteText}>
                                                            {quote.text}
                                                  </p>
                                                  <span className={styles.author}>— {quote.author}</span>
                                        </div>
                              </div>
                    </section>
          );
};

export default ReadingQuote;