import React from 'react';
import styles from './Home.module.css';
import book from '../../assets/tree.png';

const SlideOne = () => (
          <div className={styles.heroContainer}>
                    <div className={styles.heroContent}>

                              <span className={styles.badge}>Գիրքը քո լավագույն ընկերն է</span>
                              <h1 className={styles.heroTitle}>
                                        Մեր գրքերի հավաքածուն կօգնի Ձեզ փոխել Ձեր
                                        աշխարհայացքը։
                                        <span className={styles.highlight}>Սկսե՛ք ձեր ճանապարհորդությունը հենց հիմա</span>
                              </h1>
                              <p className={styles.heroDesc}>
                                        Ուսումնասիրեք՝ գրքեր բաժնում
                              </p>
                              <button className={styles.ctaButton} onClick={() => window.location.href = '/shop'}>
                                        Դիտել հավաքածուն <span className={styles.arrow}>→</span>
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
export default SlideOne;