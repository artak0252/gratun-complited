import React from 'react';
import styles from './Home.module.css';
import book from '../../assets/tree2.png';



const SlideThree = () => (
          <div className={styles.heroContainer}>
                    <div className={styles.heroContent}>
                              <span className={styles.badge}>Գիրքը քո մտքի լավագույն ընկերն է</span>
                              <h1 className={styles.heroTitle}>
                                        Այս կայքէջը կօգնի քեզ ոչ միայն գտնել Քեզ անհրաժեշտ գրքերը, <br />
                                        <span className={styles.highlight}>նաև վաճառել քո գրքերը</span>
                              </h1>
                              <button className={styles.ctaButton} onClick={() => window.location.href = '/shop'}>
                                        Ցանկին ծանոթացիր այստեղ →
                              </button>
                    </div>
                    <div className={styles.heroImageStack}>
                              <img src={book} alt="Գիրք" className={styles.mainBookImg} />
                    </div>
          </div>
);
export default SlideThree;