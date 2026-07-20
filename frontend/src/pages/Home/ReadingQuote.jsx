import React from 'react';
import styles from './ReadingQuote.module.css';


const ThinkerIllustration = () => (
          <svg viewBox="0 0 240 240" className={styles.illustration} role="img" aria-label="Դասական մտածողի պատկեր">
                    <circle cx="120" cy="120" r="118" className={styles.bgCircle} />

                    {/* Postament */}
                    <rect x="70" y="196" width="100" height="18" rx="4" className={styles.stone} />
                    <rect x="82" y="182" width="76" height="16" rx="3" className={styles.stone} />

                    {/* Shoulders / toga */}
                    <path
                              d="M62 186 C62 150 82 132 120 132 C158 132 178 150 178 186 Z"
                              className={styles.stone}
                    />
                    <path d="M92 150 L92 186" className={styles.foldLine} />
                    <path d="M120 140 L120 186" className={styles.foldLine} />
                    <path d="M148 150 L148 186" className={styles.foldLine} />

                    {/* Head */}
                    <ellipse cx="120" cy="96" rx="38" ry="44" className={styles.stone} />
                    {/* Ear hint / jaw shading */}
                    <path d="M96 100 Q90 108 96 118" className={styles.foldLine} />

                    {/* Laurel wreath */}
                    <g className={styles.laurel}>
                              <path d="M84 78 Q70 84 68 98 Q78 92 88 92" />
                              <path d="M80 92 Q66 96 62 110 Q73 105 84 104" />
                              <path d="M78 106 Q64 108 58 122 Q70 119 82 116" />
                              <path d="M156 78 Q170 84 172 98 Q162 92 152 92" />
                              <path d="M160 92 Q174 96 178 110 Q167 105 156 104" />
                              <path d="M162 106 Q176 108 182 122 Q170 119 158 116" />
                    </g>
          </svg>
);

const ReadingQuote = () => {
          return (
                    <section className={styles.quoteContainer} aria-label="Մեջբերում ընթերցանության մասին">
                              <div className={styles.imageSide}>
                                        <ThinkerIllustration />
                              </div>
                              <div className={styles.textSide}>
                                        <span className={styles.quoteMark}>"</span>
                                        <p className={styles.quoteText}>
                                                  Առանց գրքերի սենյակը նման է հոգի չունեցող մարմնի։
                                        </p>
                                        <span className={styles.author}>— Մարկուս Տուլիուս Ցիցերոն</span>
                              </div>
                    </section>
          );
};

export default ReadingQuote;