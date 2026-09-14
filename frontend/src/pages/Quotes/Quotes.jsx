import React, { useReducer, useEffect, useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import { FiSearch, FiX, FiUser } from 'react-icons/fi';
import styles from './quotesStyles.js';
import Seo from '../Seo/Seo';

const emptyForm = { text: '', author: '', authorBio: '', authorNationality: '', authorEra: '', image: null };

const initialState = {
    authors: [],
    loading: true,
    searchTerm: '',
    formData: emptyForm
};

const quotesReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS': return { ...state, authors: action.payload, loading: false };
        case 'SET_LOADING': return { ...state, loading: action.payload };
        case 'ADD_AUTHOR_FROM_QUOTE': {
            // Նոր մեջբերում ավելացնելուց հետո՝ կամ նոր հեղինակի բոքս ենք ավելացնում,
            // կամ թարմացնում ենք գոյություն ունեցող հեղինակի quotesCount-ը/նկարը
            const q = action.payload;
            const key = q.author.trim().toLowerCase();
            const existing = state.authors.find(a => a.author.trim().toLowerCase() === key);
            if (existing) {
                return {
                    ...state,
                    authors: state.authors.map(a => a.author.trim().toLowerCase() === key
                        ? {
                            ...a,
                            quotesCount: a.quotesCount + 1,
                            authorImage: a.authorImage || q.authorImage,
                            authorBio: a.authorBio || q.authorBio,
                            authorNationality: a.authorNationality || q.authorNationality,
                            authorEra: a.authorEra || q.authorEra
                        }
                        : a),
                    formData: emptyForm
                };
            }
            return {
                ...state,
                authors: [{
                    author: q.author,
                    authorImage: q.authorImage || '',
                    authorBio: q.authorBio || '',
                    authorNationality: q.authorNationality || '',
                    authorEra: q.authorEra || '',
                    quotesCount: 1
                }, ...state.authors],
                formData: emptyForm
            };
        }
        case 'SET_FORM_FIELD': return { ...state, formData: { ...state.formData, [action.field]: action.value } };
        case 'RESET_FORM': return { ...state, formData: emptyForm };
        case 'SET_SEARCH': return { ...state, searchTerm: action.payload };
        default: return state;
    }
};

const normalize = (str = '') => str.toLowerCase().trim();

const getSearchTerms = (query) => normalize(query).split(/\s+/).filter(Boolean);

const authorMatchesSearch = (author, terms) => {
    if (terms.length === 0) return true;
    const haystack = `${normalize(author.author)} ${normalize(author.authorNationality)} ${normalize(author.authorEra)}`;
    return terms.every(term => haystack.includes(term));
};

const highlightText = (text, terms) => {
    if (!text || terms.length === 0) return text;
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
    const { authors, loading, formData, searchTerm } = state;
    const { isAdmin } = useContext(AuthContext);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const res = await api.get('/quotes/authors/list');
                dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
            } catch (err) { dispatch({ type: 'SET_LOADING', payload: false }); }
        };
        fetchAuthors();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('text', formData.text);
        data.append('author', formData.author);
        data.append('authorBio', formData.authorBio || '');
        data.append('authorNationality', formData.authorNationality || '');
        data.append('authorEra', formData.authorEra || '');
        if (formData.image) data.append('image', formData.image);

        try {
            const res = await api.post('/quotes', data);
            dispatch({ type: 'ADD_AUTHOR_FROM_QUOTE', payload: res.data });
            setIsFormVisible(false);
            alert('Մեջբերումը հաջողությամբ ավելացվեց!');
        } catch (err) {
            console.error(err);
            alert('Սխալ՝ միայն ադմինները կարող են ավելացնել');
        }
    };

    const handleCancel = () => {
        dispatch({ type: 'RESET_FORM' });
        setIsFormVisible(false);
    };

    const searchTerms = useMemo(() => getSearchTerms(searchTerm), [searchTerm]);

    const filteredAuthors = useMemo(
        () => authors.filter(a => authorMatchesSearch(a, searchTerms)),
        [authors, searchTerms]
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
                <h1 className={styles.pageHeaderH1}>Մեջբերումներ գրքերից</h1>
                <p className={styles.pageHeaderP}>Ընտրեք հեղինակին՝ նրա մասին ավելին իմանալու և բոլոր մեջբերումները տեսնելու համար</p>
            </div>

            {isAdmin && (
                <div className={styles.adminSection}>
                    <button className={styles.publishBtn} onClick={() => isFormVisible ? handleCancel() : setIsFormVisible(true)}>
                        {isFormVisible ? 'Փակել ֆորման' : '+ Նոր մեջբերում ավելացնել'}
                    </button>
                    {isFormVisible && (
                        <div className={styles.adminFormContainer}>
                            <h3 className={styles.adminFormContainerH3}>Ավելացնել նոր մեջբերում</h3>
                            <form onSubmit={handleFormSubmit} className={styles.form}>
                                <textarea
                                    placeholder="Մեջբերման տեքստը"
                                    value={formData.text}
                                    onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'text', value: e.target.value })}
                                    required
                                    className={styles.formTextarea}
                                />
                                <input
                                    type="text"
                                    placeholder="Հեղինակի անուն ազգանունը (օր.՝ Ֆրանց Կաֆկա)"
                                    value={formData.author}
                                    onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'author', value: e.target.value })}
                                    required
                                    className={styles.formInput}
                                />
                                <div className={styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Ազգություն (օր.՝ Չեխ)"
                                        value={formData.authorNationality}
                                        onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'authorNationality', value: e.target.value })}
                                        className={styles.formInput}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Ժամանակաշրջան (օր.՝ 1883–1924)"
                                        value={formData.authorEra}
                                        onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'authorEra', value: e.target.value })}
                                        className={styles.formInput}
                                    />
                                </div>
                                <textarea
                                    placeholder="Հեղինակի կենսագրություն (ընտրովի, երևում է հեղինակի մանրամասն էջում)"
                                    value={formData.authorBio}
                                    onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'authorBio', value: e.target.value })}
                                    className={styles.formTextarea}
                                />
                                <label htmlFor="quote-file" className={styles.fileLabel}>
                                    {formData.image ? formData.image.name : "Ընտրել հեղինակի նկարը (ընտրովի)"}
                                </label>
                                <input
                                    id="quote-file"
                                    type="file"
                                    accept="image/*"
                                    className={styles.fileInput}
                                    onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'image', value: e.target.files[0] })}
                                />
                                <button type="submit" className={styles.publishBtn}>Հրապարակել</button>
                                <button type="button" onClick={handleCancel} className={styles.cancelBtn}>Չեղարկել</button>
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
                    placeholder="Որոնել հեղինակ, ազգություն կամ ժամանակաշրջան..."
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
                        {filteredAuthors.length} արդյունք
                    </span>
                )}
            </div>

            {filteredAuthors.length === 0 ? (
                <p className={styles.noResults}>Հեղինակներ չեն գտնվել</p>
            ) : (
                <div className={styles.authorsGrid}>
                    {filteredAuthors.map(a => (
                        <Link key={a.author} to={`/quotes/${encodeURIComponent(a.author)}`} className={styles.authorCard}>
                            <div className={styles.authorImageWrap}>
                                {a.authorImage ? (
                                    <img className={styles.authorPhoto} src={a.authorImage} alt={a.author} loading="lazy" />
                                ) : (
                                    <div className={styles.authorPhotoFallback}><FiUser /></div>
                                )}
                                <span className={styles.authorTag}>
                                    {a.authorNationality || `${a.quotesCount} մեջբերում`}
                                </span>
                            </div>
                            <div className={styles.authorNameWrap}>
                                <h2 className={styles.authorName}>{highlightText(a.author, searchTerms)}</h2>
                                <p className={styles.authorMeta}>
                                    {[a.authorEra, `${a.quotesCount} մեջբերում`].filter(Boolean).join(' • ')}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Quotes;