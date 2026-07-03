import React from 'react';
import styles from './Home.module.css';
import book from '../../assets/tree1.png';

const SlideTwo = () => (
        <div className={styles.heroContainer}>
                          <div className={styles.heroContent}>
                              <span className={styles.badge}>Քո նյութը՝ այստեղ</span>
                                    <h1 className={styles.heroTitle}>
                                             Շատ ուրախ կլինենք՝ տեսնել քո նյութը մեր կայքէջում։ <br />
                                        <span className={styles.highlight}>Ձևաչափին ծանոթացիր Բլոգ բաժնում</span>
                                    </h1>
                                    <p className={styles.heroDesc}>
                                             Կիսվիր Քո գիտելիքներով
                                    </p>
                                    <button className={styles.ctaButton} onClick={() => window.location.href = '/blog'}>
                                              Դիտել ձևաչափը <span className={styles.arrow}>→</span>
                                    </button>
                          </div>
      
                          <div className={styles.heroImageStack}>
                                    <img
                                              src={book}
                                              alt="Գրքերի հավաքածու"
                                              className={styles.mainBookImg}
                                    />
                          </div> 
                </div>
);
export default SlideTwo;