import React, { useReducer, useEffect, useState, useContext, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import { FiSearch, FiX, FiUser } from 'react-icons/fi';
import styles from './Quotes.module.css';
import Seo from '../Seo/Seo';

const initialState = {
    quotes: [],
    loading: true,
    searchTerm: '',
    editingId: null,
    formData: { text: '', author: '', image: null }
};

const quotesReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS': return { ...state, quotes: action.payload, loading: false };
        case 'SET_LOADING': return { ...state, loading: action.payload };
        case 'ADD_QUOTE': return { ...state, quotes: [action.payload, ...state.quotes], formData: initialState.formData, editingId: null };
        case 'UPDATE_QUOTE': return { ...state, quotes: state.quotes.map(q => q._id === action.payload._id ? action.payload : q), formData: initialState.formData, editingId: null };
        case 'DELETE_QUOTE': return { ...state, quotes: state.quotes.filter(q => q._id !== action.payload) };
        case 'SET_FORM_FIELD': return { ...state, formData: { ...state.formData, [action.field]: action.value } };
        case 'START_EDIT': return { ...state, editingId: action.payload._id, formData: { text: action.payload.text, author: action.payload.author, image: null } };
        case 'CANCEL_EDIT': return { ...state, editingId: null, formData: initialState.formData };
        case 'SET_SEARCH': return { ...state, searchTerm: action.payload };
        default: return state;
    }
};

// Փոքրիկ, բայց "հզոր" որոնման util. մի քանի բառ մուտքագրելիս (օր.՝ "հեմինգուեյ գիրք")
// յուրաքանչյուր բառ պետք է հանդիպի կամ մեջբերման տեքստում, կամ հեղինակի անվան մեջ (AND տրամաբանություն),
// ոչ թե ամբողջ query-ն որպես մեկ substring, ինչպես սովորական .includes() որոնումը
const normalize = (str = '') => str.toLowerCase().trim();

const getSearchTerms = (query) => normalize(query).split(/\s+/).filter(Boolean);

const quoteMatchesSearch = (quote, terms) => {
    if (terms.length === 0) return true;
    const haystack = `${normalize(quote.text)} ${normalize(quote.author)}`;
    return terms.every(term => haystack.includes(term));
};

// Համապատասխան հատվածները ընդգծում ենք <mark>-ով, որպեսզի օգտատերը տեսնի,
// թե կոնկրետ ինչի հիման վրա է մեջբերումը հայտնվել արդյունքներում
const highlightText = (text, terms) => {
    if (terms.length === 0) return text;
    const pattern = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
        terms.includes(normalize(part))
            ? <mark key={i} className={styles.highlight}>{part}</mark>
            : part
    );
};

const Quotes = () => {
    const [state, dispatch] = useReducer(quotesReducer, initialState);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { quotes, loading, formData, searchTerm, editingId } = state;
    const { isAdmin } = useContext(AuthContext);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const res = await api.get('/quotes');
                dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
            } catch (err) { dispatch({ type: 'SET_LOADING', payload: false }); }
        };
        fetchQuotes();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Ջնջե՞լ այս մեջբերումը:')) return;
        try {
            await api.delete(`/quotes/${id}`);
            dispatch({ type: 'DELETE_QUOTE', payload: id });
        } catch (err) { alert('Մուտքը մերժված է'); }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('text', formData.text);
        data.append('author', formData.author);
        if (formData.image) data.append('image', formData.image);

        try {
            if (editingId) {
                const res = await api.put(`/quotes/${editingId}`, data);
                dispatch({ type: 'UPDATE_QUOTE', payload: res.data });
                setIsFormVisible(false);
                alert('Մեջբերումը հաջողությամբ խմբագրվեց!');
            } else {
                const res = await api.post('/quotes', data);
                dispatch({ type: 'ADD_QUOTE', payload: res.data });
                setIsFormVisible(false);
                alert('Մեջբերումը հաջողությամբ ավելացվեց!');
            }
        } catch (err) {
            console.error(err);
            alert(editingId ? 'Սխալ՝ խմբագրումը չհաջողվեց' : 'Սխալ՝ միայն ադմինները կարող են ավելացնել');
        }
    };

    const handleEdit = (quote) => {
        dispatch({ type: 'START_EDIT', payload: quote });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        dispatch({ type: 'CANCEL_EDIT' });
        setIsFormVisible(false);
    };

    const searchTerms = useMemo(() => getSearchTerms(searchTerm), [searchTerm]);

    const filteredQuotes = useMemo(
        () => quotes.filter(q => quoteMatchesSearch(q, searchTerms)),
        [quotes, searchTerms]
    );

    if (loading) return <div className={styles.loading}>Բեռնվում է...</div>;

    return (
        <div className={styles.quotesPage}>
            <Seo
                title="Մեջբերումներ գրքերից"
                description="Ոգեշնչող մեջբերումներ սիրված գրքերից և հեղինակներից Գրատուն առցանց գրախանութում։"
                url="https://www.gratunhub.am/quotes"
            />

            <div className={styles.pageHeader}>
                <h1>Մեջբերումներ գրքերից</h1>
                <p>Ընտրյալ մտքեր և տողեր, որոնք արժե պահել հիշողության մեջ</p>
            </div>

            {isAdmin && (
                <div className={styles.adminSection}>
                    <button className={styles.publishBtn} onClick={() => isFormVisible ? handleCancelEdit() : setIsFormVisible(true)}>
                        {isFormVisible ? 'Փակել ֆորման' : '+ Նոր մեջբերում ավելացնել'}
                    </button>
                    {isFormVisible && (
                        <div className={styles.adminFormContainer}>
                            <h3>{editingId ? 'Խմբագրել մեջբերումը' : 'Ավելացնել նոր մեջբերում'}</h3>
                            <form onSubmit={handleFormSubmit}>
                                <textarea
                                    placeholder="Մեջբերման տեքստը"
                                    value={formData.text}
                                    onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'text', value: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Հեղինակի անունը (օր.՝ Էռնեստ Հեմինգուեյ)"
                                    value={formData.author}
                                    onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'author', value: e.target.value })}
                                    required
                                />
                                <label htmlFor="quote-file" className={styles.fileLabel}>
                                    {formData.image ? formData.image.name : (editingId ? "Փոխել հեղինակի նկարը (ընտրովի)" : "Ընտրել հեղինակի նկարը (ընտրովի)")}
                                </label>
                                <input
                                    id="quote-file"
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
                    placeholder="Որոնել մեջբերում կամ հեղինակ..."
                    value={searchTerm}
                    onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                />
                {searchTerm && (
                    <button className={styles.clearSearchBtn} onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })} aria-label="Մաքրել որոնումը">
                        <FiX />
                    </button>
                )}
                {searchTerm && (
                    <span className={styles.resultsCount}>
                        {filteredQuotes.length} արդյունք
                    </span>
                )}
            </div>

            {filteredQuotes.length === 0 ? (
                <p className={styles.noResults}>Մեջբերումներ չեն գտնվել</p>
            ) : (
                <div className={styles.quotesGrid}>
                    {filteredQuotes.map(quote => (
                        <article key={quote._id} className={styles.quoteCard}>
                            {isAdmin && (
                                <div className={styles.adminQuoteActions}>
                                    <button className={styles.editQuoteBtn} onClick={() => handleEdit(quote)}>✏️</button>
                                    <button className={styles.deleteQuoteBtn} onClick={() => handleDelete(quote._id)}>🗑️</button>
                                </div>
                            )}
                            <div className={styles.imageSide}>
                                {quote.authorImage ? (
                                    <img
                                        className={styles.authorPhoto}
                                        src={quote.authorImage}
                                        alt={quote.author}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className={styles.authorPhotoFallback}>
                                        <FiUser />
                                    </div>
                                )}
                            </div>
                            <div className={styles.textSide}>
                                <span className={styles.quoteMark}>&#8221;</span>
                                <p className={styles.quoteText}>{highlightText(quote.text, searchTerms)}</p>
                                <span className={styles.author}>— {highlightText(quote.author, searchTerms)}</span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Quotes;
