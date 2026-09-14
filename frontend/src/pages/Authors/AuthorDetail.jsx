import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import styles from '../Quotes/quotesStyles.js';
import Seo from '../Seo/Seo';

const SITE_URL = 'https://www.gratunhub.am';

const emptyForm = { text: '', author: '', authorBio: '', authorNationality: '', authorEra: '', image: null };

const AuthorDetail = () => {
          const { author } = useParams();
          const [data, setData] = useState(null);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState(null);
          const { isAdmin } = useContext(AuthContext);

          const [isFormVisible, setIsFormVisible] = useState(false);
          const [editingId, setEditingId] = useState(null);
          const [formData, setFormData] = useState(emptyForm);

          const loadAuthor = () => {
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
          };

          useEffect(() => {
                    loadAuthor();
                    // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [author]);

          const openAddForm = () => {
                    setEditingId(null);
                    setFormData({
                              text: '',
                              author: data?.author || '',
                              authorBio: data?.authorBio || '',
                              authorNationality: data?.authorNationality || '',
                              authorEra: data?.authorEra || '',
                              image: null
                    });
                    setIsFormVisible(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
          };

          const openEditForm = (quote) => {
                    setEditingId(quote._id);
                    setFormData({
                              text: quote.text,
                              author: quote.author,
                              authorBio: quote.authorBio || '',
                              authorNationality: quote.authorNationality || '',
                              authorEra: quote.authorEra || '',
                              image: null
                    });
                    setIsFormVisible(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
          };

          const closeForm = () => {
                    setIsFormVisible(false);
                    setEditingId(null);
                    setFormData(emptyForm);
          };

          const handleFormSubmit = async (e) => {
                    e.preventDefault();
                    const payload = new FormData();
                    payload.append('text', formData.text);
                    payload.append('author', formData.author);
                    payload.append('authorBio', formData.authorBio || '');
                    payload.append('authorNationality', formData.authorNationality || '');
                    payload.append('authorEra', formData.authorEra || '');
                    if (formData.image) payload.append('image', formData.image);

                    try {
                              if (editingId) {
                                        await api.put(`/quotes/${editingId}`, payload);
                                        alert('Մեջբերումը հաջողությամբ խմբագրվեց!');
                              } else {
                                        await api.post('/quotes', payload);
                                        alert('Մեջբերումը հաջողությամբ ավելացվեց!');
                              }
                              closeForm();
                              loadAuthor();
                    } catch (err) {
                              console.error(err);
                              alert(editingId ? 'Սխալ՝ խմբագրումը չհաջողվեց' : 'Սխալ՝ միայն ադմինները կարող են ավելացնել');
                    }
          };

          const handleDelete = async (id) => {
                    if (!window.confirm('Ջնջե՞լ այս մեջբերումը:')) return;
                    try {
                              await api.delete(`/quotes/${id}`);
                              loadAuthor();
                    } catch (err) { alert('Մուտքը մերժված է'); }
          };

          if (loading) return <div className={styles.loading}>Բեռնվում է...</div>;
          if (error || !data) return <div className={styles.loading}>{error || 'Հեղինակը չգտնվեց'}</div>;

          return (
                    <div className={styles.quotesPage}>
                              <Seo
                                        title={data.author}
                                        description={data.authorBio || `${data.author}-ի մեջբերումները Գրատուն կայքում։`}
                                        image={data.authorImage}
                                        url={`${SITE_URL}/quotes/${encodeURIComponent(data.author)}`}
                              />

                              <Link to="/quotes" className={styles.backLink}>← Հետ դեպի Մեջբերումներ</Link>

                              <div className={styles.detailHeader}>
                                        {data.authorImage ? (
                                                  <img className={styles.detailPhoto} src={data.authorImage} alt={data.author} />
                                        ) : (
                                                  <div className={styles.detailPhotoFallback}><FiUser /></div>
                                        )}
                                        <h1 className={styles.detailName}>{data.author}</h1>
                                        {(data.authorNationality || data.authorEra) && (
                                                  <div className={styles.detailMetaRow}>
                                                            {data.authorNationality && <span className={styles.detailMetaBadge}>{data.authorNationality}</span>}
                                                            {data.authorEra && <span className={styles.detailMetaBadge}>{data.authorEra}</span>}
                                                  </div>
                                        )}
                                        {data.authorBio && <p className={styles.detailBio}>{data.authorBio}</p>}
                                        <span className={styles.detailQuotesCount}>
                                                  {data.quotes.length} մեջբերում
                                        </span>
                              </div>

                              {isAdmin && (
                                        <div className={styles.adminSection}>
                                                  <button className={styles.publishBtn} onClick={() => isFormVisible ? closeForm() : openAddForm()}>
                                                            {isFormVisible ? 'Փակել ֆորման' : `+ Նոր մեջբերում ${data.author}-ից`}
                                                  </button>
                                                  {isFormVisible && (
                                                            <div className={styles.adminFormContainer}>
                                                                      <h3 className={styles.adminFormContainerH3}>{editingId ? 'Խմբագրել մեջբերումը' : 'Ավելացնել նոր մեջբերում'}</h3>
                                                                      <form onSubmit={handleFormSubmit} className={styles.form}>
                                                                                <textarea
                                                                                          placeholder="Մեջբերման տեքստը"
                                                                                          value={formData.text}
                                                                                          onChange={e => setFormData({ ...formData, text: e.target.value })}
                                                                                          required
                                                                                          className={styles.formTextarea}
                                                                                />
                                                                                <input
                                                                                          type="text"
                                                                                          placeholder="Հեղինակի անուն ազգանունը"
                                                                                          value={formData.author}
                                                                                          onChange={e => setFormData({ ...formData, author: e.target.value })}
                                                                                          required
                                                                                          className={styles.formInput}
                                                                                />
                                                                                <div className={styles.formRow}>
                                                                                          <input
                                                                                                    type="text"
                                                                                                    placeholder="Ազգություն (օր.՝ Չեխ)"
                                                                                                    value={formData.authorNationality}
                                                                                                    onChange={e => setFormData({ ...formData, authorNationality: e.target.value })}
                                                                                                    className={styles.formInput}
                                                                                          />
                                                                                          <input
                                                                                                    type="text"
                                                                                                    placeholder="Ժամանակաշրջան (օր.՝ 1883–1924)"
                                                                                                    value={formData.authorEra}
                                                                                                    onChange={e => setFormData({ ...formData, authorEra: e.target.value })}
                                                                                                    className={styles.formInput}
                                                                                          />
                                                                                </div>
                                                                                <textarea
                                                                                          placeholder="Հեղինակի կենսագրություն (ընտրովի)"
                                                                                          value={formData.authorBio}
                                                                                          onChange={e => setFormData({ ...formData, authorBio: e.target.value })}
                                                                                          className={styles.formTextarea}
                                                                                />
                                                                                <label htmlFor="author-detail-file" className={styles.fileLabel}>
                                                                                          {formData.image ? formData.image.name : (editingId ? "Փոխել հեղինակի նկարը (ընտրովի)" : "Ընտրել հեղինակի նկարը (ընտրովի)")}
                                                                                </label>
                                                                                <input
                                                                                          id="author-detail-file"
                                                                                          type="file"
                                                                                          accept="image/*"
                                                                                          className={styles.fileInput}
                                                                                          onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
                                                                                />
                                                                                <button type="submit" className={styles.publishBtn}>
                                                                                          {editingId ? 'Պահպանել փոփոխությունները' : 'Հրապարակել'}
                                                                                </button>
                                                                                <button type="button" onClick={closeForm} className={styles.cancelBtn}>Չեղարկել</button>
                                                                      </form>
                                                            </div>
                                                  )}
                                        </div>
                              )}

                              <div className={styles.detailQuotesGrid}>
                                        {data.quotes.map(quote => (
                                                  <article key={quote._id} className={styles.quoteCard}>
                                                            {isAdmin && (
                                                                      <div className={styles.adminQuoteActions}>
                                                                                <button className={styles.editDeleteQuoteBtn} onClick={() => openEditForm(quote)}>✏️</button>
                                                                                <button className={styles.editDeleteQuoteBtn} onClick={() => handleDelete(quote._id)}>🗑️</button>
                                                                      </div>
                                                            )}
                                                            <span className={styles.quoteMark}>&#8221;</span>
                                                            <p className={styles.quoteText}>{quote.text}</p>
                                                  </article>
                                        ))}
                              </div>
                    </div>
          );
};

export default AuthorDetail;