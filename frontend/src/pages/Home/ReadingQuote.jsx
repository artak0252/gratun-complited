import React from 'react';
import styles from './ReadingQuote.module.css';
import hemingwayPhoto from '../../assets/ErnestHemingway.jpg';

const ReadingQuote = () => {
          return (
                    <section className={styles.quoteContainer} aria-label="Մեջբերում ընթերցանության մասին">
                              <div className={styles.quoteInner}>
                                        <div className={styles.imageSide}>
                                                  <img
                                                            src={hemingwayPhoto}
                                                            alt="Էռնեստ Հեմինգուեյ իր գրամեքենայի մոտ, 1939 (public domain լուսանկար)"
                                                            className={styles.authorPhoto}
                                                  />
                                        </div>
                                        <div className={styles.textSide}>
                                                  <span className={styles.quoteMark}>"</span>
                                                  <p className={styles.quoteText}>
                                                            Վստահիր գրքերին, նրանք ամենամտերիմներն են. նրանք լռում են, երբ պետք է, և խոսում են, երբ պետք է՝ անհրաժեշտության դեպքում բացելով ձեր առջև աշխարհը։
                                                  </p>
                                                  <span className={styles.author}>— Էռնեստ Հեմինգուեյ</span>
                                        </div>
                              </div>
                    </section>
          );
};

export default ReadingQuote;