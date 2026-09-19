import React, { useReducer, useEffect, useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiX, FiArrowLeft } from 'react-icons/fi';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import { armenianCategories, armenianFormCategories, getCategoryLabel } from './constants';
import styles from './armenianStyles.js';
import Seo from '../Seo/Seo';

const initialFormData = { title: '', category: 'general', author: '', excerpt: '', content: '', image: null };

const initialState = {
          items: [],
          loading: true,
          searchTerm: '',
          // null = նախադիտման («preview») էկրան, հակառակ դեպքում՝ կոնկրետ category id
          activeCategory: null,
          editingId: null,
          formData: initialFormData
};

const armenianReducer = (state, action) => {
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
                                        title: action.payload.title,
                                        category: action.payload.category,
                                        author: action.payload.author || '',
                                        excerpt: action.payload.excerpt,
                                        content: action.payload.content,
                                        image: null
                              }
                    };
                    case 'CANCEL_EDIT': return { ...state, editingId: null, formData: initialFormData };
                    case 'SET_SEARCH': return { ...state, searchTerm: action.payload };
                    case 'SET_CATEGORY': return { ...state, activeCategory: action.payload };
                    default: return state;
          }
};

// Quotes.jsx-ի նույն "AND" տրամաբանությամբ որոնումը՝ վերնագրի, հեղինակի և
// հատվածի (excerpt) մեջ միաժամանակ
const normalize = (str = '') => str.toLowerCase().trim();
const getSearchTerms = (query) => normalize(query).split(/\s+/).filter(Boolean);
const itemMatchesSearch = (item, terms) => {
          if (terms.length === 0) return true;
          const haystack = `${normalize(item.title)} ${normalize(item.author)} ${normalize(item.excerpt)}`;
          return terms.every(term => haystack.includes(term));
};

const getImageUrl = (image) =>
          image.startsWith('http') ? image : `https://ik.imagekit.io/hmtd5pr9d/${image}`;

const Armenian = () => {
          const [state, dispatch] = useReducer(armenianReducer, initialState);
          const [isFormVisible, setIsFormVisible] = useState(false);
          const { items, loading, formData, searchTerm, activeCategory, editingId } = state;
          const { isAdmin } = useContext(AuthContext);

          useEffect(() => {
                    const fetchItems = async () => {
                              try {
                                        const res = await api.get('/armenian');
                                        dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
                              } catch (err) { dispatch({ type: 'SET_LOADING', payload: false }); }
                    };
                    fetchItems();
          }, []);

          const handleDelete = async (id) => {
                    if (!window.confirm('Ջնջե՞լ այս նյութը:')) return;
                    try {
                              await api.delete(`/armenian/${id}`);
                              dispatch({ type: 'DELETE_ITEM', payload: id });
                    } catch (err) { alert('Մուտքը մերժված է'); }
          };

          const handleFormSubmit = async (e) => {
                    e.preventDefault();
                    const data = new FormData();
                    Object.keys(formData).forEach(key => {
                              // Խմբագրելիս, եթե admin-ը նոր նկար չի ընտրել, image դաշտը չենք ուղարկում,
                              // որպեսզի backend-ը հին նկարը թողնի անփոփոխ
                              if (key === 'image' && !formData.image) return;
                              data.append(key, formData[key]);
                    });

                    try {
                              if (editingId) {
                                        const res = await api.put(`/armenian/${editingId}`, data);
                                        dispatch({ type: 'UPDATE_ITEM', payload: res.data });
                                        setIsFormVisible(false);
                                        alert('Նյութը հաջողությամբ խմբագրվեց!');
                              } else {
                                        const res = await api.post('/armenian', data);
                                        dispatch({ type: 'ADD_ITEM', payload: res.data });
                                        setIsFormVisible(false);
                                        alert('Նյութը հաջողությամբ ավելացվեց!');
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

          const filteredItems = useMemo(() => items.filter(item => {
                    const matchesCategory = item.category === activeCategory;
                    return matchesCategory && itemMatchesSearch(item, searchTerms);
          }), [items, activeCategory, searchTerms]);

          // Ամեն ենթաբաժնից ամենավերջին նյութը (items-ը արդեն backend-ից գալիս է
          // createdAt-ով նվազման կարգով), նախադիտման էկրանի համար։ Եթե ենթաբաժնում
          // նյութ չկա, պարզապես բացակայում է ցանկից. flex-wrap + justify-center-ը
          // ինքնաշխատ սիմետրիկ է դասավորում մնացածին, լինի դա 2, 3 թե բոլոր 7-ը
          const previewItems = useMemo(() => (
                    armenianFormCategories
                              .map(c => items.find(item => item.category === c.id))
                              .filter(Boolean)
          ), [items]);

          if (loading) return <div className={styles.loading}>Բեռնվում է...</div>;

          return (
                    <div className={styles.pageWrapper}>
                              <Seo
                                        title="Հայ և հայկական"
                                        description="Հայ գրականություն, պատմություն, երաժշտություն, արվեստ, հոգևոր մշակույթ և հայ հայտնիներ Գրատուն կայքում։"
                                        url="https://www.gratunhub.am/armenian"
                              />

                              <div className={styles.pageHeader}>
                                        <h1 className={styles.pageHeaderH1}>Հայ և հայկական</h1>
                                        <p className={styles.pageHeaderP}>Գրականություն, պատմություն, երաժշտություն, արվեստ, հոգևոր մշակույթ և հայ հայտնիներ</p>
                              </div>

                              {isAdmin && (
                                        <div className={styles.adminSection}>
                                                  <button className={styles.publishBtn} onClick={() => isFormVisible ? handleCancelEdit() : setIsFormVisible(true)}>
                                                            {isFormVisible ? 'Փակել ֆորման' : '+ Նոր նյութ ավելացնել'}
                                                  </button>
                                                  {isFormVisible && (
                                                            <div className={styles.adminFormContainer}>
                                                                      <h3 className={styles.adminFormContainerH3}>{editingId ? 'Խմբագրել նյութը' : 'Ավելացնել նոր նյութ'}</h3>
                                                                      <form onSubmit={handleFormSubmit} className={styles.form}>
                                                                                <select
                                                                                          className={styles.adminSelect}
                                                                                          value={formData.category}
                                                                                          onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'category', value: e.target.value })}
                                                                                          required
                                                                                >
                                                                                          {armenianFormCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                                                                </select>
                                                                                <input
                                                                                          type="text"
                                                                                          placeholder="Վերնագիր"
                                                                                          value={formData.title}
                                                                                          onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'title', value: e.target.value })}
                                                                                          required
                                                                                          className={styles.formInput}
                                                                                />
                                                                                <input
                                                                                          type="text"
                                                                                          placeholder="Հեղինակը (ընտրովի)"
                                                                                          value={formData.author}
                                                                                          onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'author', value: e.target.value })}
                                                                                          className={styles.formInput}
                                                                                />
                                                                                <input
                                                                                          type="text"
                                                                                          placeholder="Կարճ նկարագրություն"
                                                                                          value={formData.excerpt}
                                                                                          onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'excerpt', value: e.target.value })}
                                                                                          required
                                                                                          className={styles.formInput}
                                                                                />
                                                                                <textarea
                                                                                          placeholder="Բովանդակություն"
                                                                                          value={formData.content}
                                                                                          onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'content', value: e.target.value })}
                                                                                          required
                                                                                          className={styles.formTextarea}
                                                                                />
                                                                                <label htmlFor="armenian-file" className={styles.fileLabel}>
                                                                                          {formData.image ? formData.image.name : (editingId ? "Փոխել նկարը (ընտրովի)" : "Ընտրել նկարը")}
                                                                                </label>
                                                                                <input
                                                                                          id="armenian-file"
                                                                                          type="file"
                                                                                          accept="image/*"
                                                                                          className={styles.fileInput}
                                                                                          onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'image', value: e.target.files[0] })}
                                                                                          required={!editingId}
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

                              {activeCategory === null ? (
                                        // --- ՆԱԽԱԴԻՏՄԱՆ ԷԿՐԱՆ. մեկական նյութ ամեն ենթաբաժնից, սիմետրիկ շարքով ---
                                        previewItems.length === 0 ? (
                                                  <p className={styles.previewEmpty}>Դեռ նյութեր չկան։ Շուտով այստեղ կհայտնվեն հայ գրականության, պատմության և մշակույթի հետաքրքիր նյութեր։</p>
                                        ) : (
                                                  <div className={styles.previewGrid}>
                                                            {previewItems.map(item => (
                                                                      <div
                                                                                key={item._id}
                                                                                className={styles.previewCard}
                                                                                role="button"
                                                                                tabIndex={0}
                                                                                onClick={() => dispatch({ type: 'SET_CATEGORY', payload: item.category })}
                                                                                onKeyDown={(e) => {
                                                                                          if (e.key === 'Enter' || e.key === ' ') {
                                                                                                    e.preventDefault();
                                                                                                    dispatch({ type: 'SET_CATEGORY', payload: item.category });
                                                                                          }
                                                                                }}
                                                                      >
                                                                                <img
                                                                                          className={styles.previewCardImg}
                                                                                          src={getImageUrl(item.image)}
                                                                                          alt={item.title}
                                                                                          loading="lazy"
                                                                                          onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                                                                                />
                                                                                <div className={styles.previewCardBody}>
                                                                                          <span className={styles.previewCardCategory}>{getCategoryLabel(item.category)}</span>
                                                                                          <h2 className={styles.previewCardTitle}>{item.title}</h2>
                                                                                          <p className={styles.previewCardExcerpt}>{item.excerpt}</p>
                                                                                </div>
                                                                      </div>
                                                            ))}
                                                  </div>
                                        )
                              ) : (
                                        // --- ԼՐԻՎ ԲԱԺԻՆ. tab-երով ցանկ, ինչպես Գրականություն/Բլոգ էջերում ---
                                        <>
                                                  <button className={styles.backToPreviewBtn} onClick={() => dispatch({ type: 'SET_CATEGORY', payload: null })}>
                                                            <FiArrowLeft /> Հետ դեպի նախադիտում
                                                  </button>

                                                  <div className={styles.categoryTabs}>
                                                            {armenianCategories.map(c => (
                                                                      <button
                                                                                key={c.id}
                                                                                className={`${styles.categoryTabBtn} ${activeCategory === c.id ? styles.categoryTabBtnActive : ''}`}
                                                                                onClick={() => dispatch({ type: 'SET_CATEGORY', payload: c.id })}
                                                                      >
                                                                                {c.label}
                                                                      </button>
                                                            ))}
                                                  </div>

                                                  <div className={styles.searchContainer}>
                                                            <FiSearch className={styles.searchIcon} />
                                                            <input
                                                                      className={styles.searchInput}
                                                                      type="text"
                                                                      placeholder="Որոնել վերնագրով կամ հեղինակով..."
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
                                                            <p className={styles.noResults}>Նյութեր չեն գտնվել</p>
                                                  ) : (
                                                            <div className={styles.itemsGrid}>
                                                                      {filteredItems.map(item => (
                                                                                <article key={item._id} className={styles.itemCard}>
                                                                                          {isAdmin && (
                                                                                                    <div className={styles.adminItemActions}>
                                                                                                              <button className={styles.editDeleteBtn} onClick={() => handleEdit(item)}>✏️</button>
                                                                                                              <button className={styles.editDeleteBtn} onClick={() => handleDelete(item._id)}>🗑️</button>
                                                                                                    </div>
                                                                                          )}
                                                                                          <img
                                                                                                    className={styles.itemImg}
                                                                                                    src={getImageUrl(item.image)}
                                                                                                    alt={item.title}
                                                                                                    loading="lazy"
                                                                                                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                                                                                          />
                                                                                          <div className={styles.itemContent}>
                                                                                                    <span className={styles.itemCategoryTag}>{getCategoryLabel(item.category)}</span>
                                                                                                    <h2 className={styles.itemContentH2}>{item.title}</h2>
                                                                                                    {item.author && <span className={styles.itemAuthor}>{item.author}</span>}
                                                                                                    <p className={styles.itemContentP}>{item.excerpt}</p>
                                                                                                    <Link to={`/armenian/${item._id}`} className={styles.itemContentLink}>Կարդալ ավելին →</Link>
                                                                                          </div>
                                                                                </article>
                                                                      ))}
                                                            </div>
                                                  )}
                                        </>
                              )}
                    </div>
          );
};

export default Armenian;