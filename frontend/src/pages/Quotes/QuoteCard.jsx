import React, { useRef, useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import styles from './quotesStyles.js';

// Մեջբերման քարտ՝ հեղինակի նկարը ձախ կողմում, տեքստը՝ աջ։
// Եթե տեքստը գերազանցում է 4 տողը, կտրվում է և հայտնվում է «Կարդալ ավելին»՝ դեպի մեջբերման ամբողջական էջը։
const QuoteCard = ({ quote, authorImage, authorName, children }) => {
  const textRef = useRef(null);
  const [isLong, setIsLong] = useState(false);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => setIsLong(el.scrollHeight > el.clientHeight + 1);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [quote.text]);

  const img = quote.authorImage || authorImage;

  return (
    <article className={styles.quoteCard}>
      {children}
      <div className={styles.quoteImageWrap}>
        {img ? (
          <img className={styles.quoteImage} src={img} alt={authorName || quote.author} loading="lazy" />
        ) : (
          <div className={styles.quoteImageFallback}><FiUser /></div>
        )}
      </div>
      <div className={styles.quoteBody}>
        <span className={styles.quoteMark}>&#8221;</span>
        <p ref={textRef} className={`${styles.quoteText} ${styles.quoteTextClamped}`}>{quote.text}</p>
        {isLong && (
          <Link to={`/quote/${quote._id}`} className={styles.readMoreLink}>Կարդալ ավելին</Link>
        )}
      </div>
    </article>
  );
};

export default QuoteCard;