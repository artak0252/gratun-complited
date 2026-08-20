import React, { useReducer, useEffect, useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import { FiSearch, FiX, FiBookOpen } from 'react-icons/fi';
import styles from './thematicBooksStyles.js';
import Seo from '../Seo/Seo';

const initialFormData = { theme: '', text: '', bookTitle: '', bookAuthor: '', link: '', image: null };

const initialState = {
          items: [],
          loading: true,
          searchTerm: '',
          editingId: null,
          formData: initialFormData
};

const reducer = (state, action) => {
          switch (action.type) {
                    case 'FETCH_SUCCESS': return { ...state, items: action.payload, loading: false };
                    case 'SET_LOADING': return { ...state, loading: action.payload };
                    case 'ADD_ITEM': return { ...state, items: [action.payload, ...state.items], formData: initialFormData, editingId: null };
                    case 'UPDATE_ITEM': return { ...state, items: state.items.map(i => i._id === action.payload._id ? action.payload : i), formData: initialFormData, editingId: null };
                    case 'DELETE_ITEM': return { ...state, items: state.items.filter(i => i._id !== action.payload) };
                    case 'SET_FORM_FIELD': return { ...state, formData: { ...state.formData, [action.field]: action.value } };
                    case 'START_EDIT': return {
                              ...state,
                              editingId: action.payload._id,
                              formData: {
                                        theme: action.payload.theme,
                                        text: action.payload.text,
                                        bookTitle: action.payload.bookTitle,
                                        bookAuthor: action.payload.bookAuthor || '',
                                        link: action.payload.link || '',
                                        image: null
                              }
                    };
                    case 'CANCEL_EDIT': return { ...state, editingId: null, formData: initialFormData };
                    case 'SET_SEARCH': return { ...state, searchTerm: action.payload };
                    default: return state;
          }
};

// Quotes.jsx-ի նույն "AND" տրամաբանությամբ որոնումը՝ թեմայի, տեքստի և գրքի
// անվան/հեղինակի մեջ միաժամանակ, որպեսզի "հույս Հեմինգուեյ"-ի նման հարցումներն էլ աշխատեն
const normalize = (str = '') => str.toLowerCase().trim();
const getSearchTerms = (query) => normalize(query).split(/\s+/).filter(Boolean);
const itemMatchesSearch = (item, terms) => {
          if (terms.length === 0) return true;
          const haystack = `${normalize(item.theme)} ${normalize(item.text)} ${normalize(item.bookTitle)} ${normalize(item.bookAuthor)}`;
          return terms.every(term => haystack.includes(term));
};
const highlightText = (text, terms) => {
          if (terms.length === 0) return text;
          const pattern = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
          const regex = new RegExp(`(${pattern})`, 'gi');
          const parts = String(text).split(regex);
          return parts.map((part, i) =>
                    terms.includes(normalize(part))
                              ? <mark key={i} className={styles.highlight}>{part}</mark>
                              : part
          );
};

const ThematicBooks = () => {
          const [state, dispatch] = useReducer(reducer, initialState);
          const [isFormVisible, setIsFormVisible] = useState(false);
          const { items, loading, formData, searchTerm, editingId } = state;
          const { isAdmin } = useContext(AuthContext);

          useEffect(() => {
                    const fetchItems = async () => {
                              try {
                                        const res = await api.get('/thematic-books');
                                        dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
                              } catch (err) { dispatch({ type: 'SET_LOADING', payload: false }); }
                    };
                    fetchItems();
          }, []);

          const handleDelete = async (id) => {
                    if (!window.confirm('Ջնջե՞լ այս երաշխավորությունը:')) return;
                    try {
                              await api.delete(`/thematic-books/${id}`);
                              dispatch({ type: 'DELETE_ITEM', payload: id });
                    } catch (err) { alert('Մուտքը մերժված է'); }
          };

          const handleFormSubmit = async (e) => {
                    e.preventDefault();
                    const data = new FormData();
                    data.append('theme', formData.theme);
                    data.append('text', formData.text);
                    data.append('bookTitle', formData.bookTitle);
                    data.append('bookAuthor', formData.bookAuthor);
                    data.append('link', formData.link);
                    if (formData.image) data.append('image', formData.image);

                    try {
                              if (editingId) {
                                        const res = await api.put(`/thematic-books/${editingId}`, data);
                                        dispatch({ type: 'UPDATE_ITEM', payload: res.data });
                                        setIsFormVisible(false);
                                        alert('Հաջողությամբ խմբագրվեց!');
                              } else {
                                        const res = await api.post('/thematic-books', data);
                                        dispatch({ type: 'ADD_ITEM', payload: res.data });
                                        setIsFormVisible(false);
                                        alert('Հաջողությամբ ավելացվեց!');
                              }
                    } catch (err) {
                              console.error(err);
                              alert(editingId ? 'Սխալ՝ խմբագրումը չհաջողվեց' : 'Սխալ՝ միայն ադմինները կարող են ավելացնել');
                    }
          };

          const handleEdit = (item) => {
                    dispatch({ type: 'START_EDIT', payload: item });
                    setIsFormVisible(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
          };

          const handleCancelEdit = () => {
                    dispatch({ type: 'CANCEL_EDIT' });
                    setIsFormVisible(false);
          };

          const searchTerms = useMemo(() => getSearchTerms(searchTerm), [searchTerm]);
          const filteredItems = useMemo(
                    () => items.filter(i => itemMatchesSearch(i, searchTerms)),
                    [items, searchTerms]
          );

          if (loading) return <div className={styles.loading}>Բեռնվում է...</div>;

          return (
                    <div className={styles.pageWrapper}>
                              <Seo
                                        title="Թեմատիկ երաշխավորություններ"
                                        description="Ինչ գիրք կարդալ ըստ տրամադրության. Գրատունի թեմատիկ գրքային երաշխավորությունները։"
                                        url="https://www.gratunhub.am/thematic"
                              />

                              <div className={styles.pageHeader}>
                                        <h1 className={styles.pageHeaderH1}>Ինչ գիրք կարդալ հիմա</h1>
                                        <p className={styles.pageHeaderP}>Ընտրված գրքեր՝ ըստ Ձեր տրամադրության և կարիքի</p>
                              </div>

                              {isAdmin && (
                                        <div className={styles.adminSection}>
                                                  <button className={styles.publishBtn} onClick={() => isFormVisible ? handleCancelEdit() : setIsFormVisible(true)}>
                                                            {isFormVisible ? 'Փակել ֆորման' : '+ Նոր երաշխավորություն ավելացնել'}
                                                  </button>
                                                  {isFormVisible && (
                                                            <div className={styles.adminFormContainer}>
                                                                      <h3 className={styles.adminFormContainerH3}>{editingId ? 'Խմբագրել երաշխավորությունը' : 'Ավելացնել նոր երաշխավորություն'}</h3>
                                                                      <form onSubmit={handleFormSubmit} className={styles.form}>
                                                                                <input
                                                                                          type="text"
                                                                                          placeholder="Թեման (օր.՝ Երբ կորցրել եք հույսը)"
                                                                                          value={formData.theme}
                                                                                          onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'theme', value: e.target.value })}
                                                                                          required
                                                                                          className={styles.formInput}
                                                                                />
                                                                                <textarea
                                                                                          placeholder="Տեքստը (օր.՝ Կարդացեք այս գիրքը, այն կօգնի...)"
                                                                                          value={formData.text}
                                                                                          onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'text', value: e.target.value })}
                                                                                          required
                                                                                          className={styles.formTextarea}
                                                                                />
                                                                                <input
                                                                                          type="text"
                                                                                          placeholder="Գրքի անվանումը"
                                                                                          value={formData.bookTitle}
                                                                                          onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'bookTitle', value: e.target.value })}
                                                                                          required
                                                                                          className={styles.formInput}
                                                                                />
                                                                                <input
                                                                                          type="text"
                                                                                          placeholder="Հեղինակը (ընտրովի)"
                                                                                          value={formData.bookAuthor}
                                                                                          onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'bookAuthor', value: e.target.value })}
                                                                                          className={styles.formInput}
                                                                                />
                                                                                <input
                                                                                          type="text"
                                                                                          placeholder="Հղում խանութի գրքին (ընտրովի, օր.՝ /shop/ID)"
                                                                                          value={formData.link}
                                                                                          onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'link', value: e.target.value })}
                                                                                          className={styles.formInput}
                                                                                />
                                                                                <label htmlFor="thematic-file" className={styles.fileLabel}>
                                                                                          {formData.image ? formData.image.name : (editingId ? "Փոխել գրքի նկարը (ընտրովի)" : "Ընտրել գրքի նկարը (ընտրովի)")}
                                                                                </label>
                                                                                <input
                                                                                          id="thematic-file"
                                                                                          type="file"
                                                                                          accept="image/*"
                                                                                          className={styles.fileInput}
                                                                                          onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'image', value: e.target.files[0] })}
                                                                                />
                                                                                <button type="submit" className={styles.publishBtn}>
                                                                                          {editingId ? 'Պահպանել փոփոխությունները' : 'Հրապարակել'}
                                                                                </button>
                                                                                {editingId && <button type="button" onClick={handleCancelEdit} className={styles.cancelBtn}>Չեղարկել</button>}
                                                                      </form>
                                                            </div>
                                                  )}
                                        </div>
                              )}

                              <div className={styles.searchContainer}>
                                        <FiSearch className={styles.searchIcon} />
                                        <input
                                                  className={styles.searchInput}
                                                  type="text"
                                                  placeholder="Որոնել ըստ թեմայի, գրքի կամ հեղինակի..."
                                                  value={searchTerm}
                                                  onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                                        />
                                        {searchTerm && (
                                                  <button className={styles.clearSearchBtn} onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })} aria-label="Մաքրել որոնումը">
                                                            <FiX />
                                                  </button>
                                        )}
                                        {searchTerm && (
                                                  <span className={styles.resultsCount}>{filteredItems.length} արդյունք</span>
                                        )}
                              </div>

                              {filteredItems.length === 0 ? (
                                        <p className={styles.noResults}>Երաշխավորություններ չեն գտնվել</p>
                              ) : (
                                        <div className={styles.itemsGrid}>
                                                  {filteredItems.map(item => (
                                                            <article key={item._id} className={styles.itemCard}>
                                                                      {isAdmin && (
                                                                                <div className={styles.adminActions}>
                                                                                          <button className={styles.editDeleteBtn} onClick={() => handleEdit(item)}>✏️</button>
                                                                                          <button className={styles.editDeleteBtn} onClick={() => handleDelete(item._id)}>🗑️</button>
                                                                                </div>
                                                                      )}
                                                                      <div className={styles.imageSide}>
                                                                                {item.image ? (
                                                                                          <img
                                                                                                    className={styles.bookCover}
                                                                                                    src={item.image}
                                                                                                    alt={item.bookTitle}
                                                                                                    loading="lazy"
                                                                                          />
                                                                                ) : (
                                                                                          <div className={styles.bookCoverFallback}>
                                                                                                    <FiBookOpen />
                                                                                          </div>
                                                                                )}
                                                                      </div>
                                                                      <div className={styles.textSide}>
                                                                                <span className={styles.themeTag}>{highlightText(item.theme, searchTerms)}</span>
                                                                                <p className={styles.itemText}>{highlightText(item.text, searchTerms)}</p>
                                                                                <div className={styles.bookInfo}>
                                                                                          <span className={styles.bookTitle}>{highlightText(item.bookTitle, searchTerms)}</span>
                                                                                          {item.bookAuthor && (
                                                                                                    <span className={styles.bookAuthor}>— {highlightText(item.bookAuthor, searchTerms)}</span>
                                                                                          )}
                                                                                </div>
                                                                                {item.link && (
                                                                                          item.link.startsWith('/') ? (
                                                                                                    <Link to={item.link} className={styles.linkBtn}>Դիտել գիրքը</Link>
                                                                                          ) : (
                                                                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>Դիտել գիրքը</a>
                                                                                          )
                                                                                )}
                                                                      </div>
                                                            </article>
                                                  ))}
                                        </div>
                              )}
                    </div>
          );
};

export default ThematicBooks;