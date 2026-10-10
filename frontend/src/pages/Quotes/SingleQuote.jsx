import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import api from '../../api/axiosInstance';
import styles from './quotesStyles.js';
import Seo from '../Seo/Seo';

const SITE_URL = 'https://www.gratunhub.am';

const SingleQuote = () => {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/quotes/${id}`)
      .then(res => { setQuote(res.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  if (loading) return <div className={styles.loading}>Բեռնվում է...</div>;
  if (error || !quote) return <div className={styles.loading}>Մեջբերումը չգտնվեց</div>;

  return (
    <div className={styles.quotesPage}>
      <Seo
        title={`${quote.author} — մեջբերում`}
        description={quote.text.slice(0, 160)}
        image={quote.authorImage}
        url={`${SITE_URL}/quote/${quote._id}`}
      />
      <Link to={`/quotes/${encodeURIComponent(quote.author)}`} className={styles.backLink}>← Հետ դեպի {quote.author}</Link>
      <div className={styles.fullQuoteWrap}>
        {quote.authorImage ? (
          <img className={styles.detailPhoto} src={quote.authorImage} alt={quote.author} />
        ) : (
          <div className={styles.detailPhotoFallback}><FiUser /></div>
        )}
        <span className={styles.quoteMark}>&#8221;</span>
        <p className={styles.fullQuoteText}>{quote.text}</p>
        <Link to={`/quotes/${encodeURIComponent(quote.author)}`} className={styles.fullQuoteAuthor}>— {quote.author}</Link>
      </div>
    </div>
  );
};

export default SingleQuote;