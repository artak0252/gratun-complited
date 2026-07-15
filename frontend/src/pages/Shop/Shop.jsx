import React, { useReducer, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import { CartContext } from '../../context/CartContext';
import { FavoritesContext } from '../../context/FavoritesContext';
import toast from 'react-hot-toast';
import styles from './Shop.module.css';
import { bookGenres } from './genreConstants';
import GenreFilter from './GenreFilter';
import { FiHeart } from 'react-icons/fi';

const initialState = {
    books: [],
    loading: true,
    searchTerm: '',
    selectedGenre: 'all',
    editingId: null,
    formData: { title: '', author: '', price: '', genre: 'fiction', description: '', image: null }
};

function shopReducer(state, action) {
    switch (action.type) {
        case 'SET_BOOKS': return { ...state, books: action.payload, loading: false };
        case 'ADD_BOOK': return { ...state, books: [...state.books, action.payload] };
        case 'UPDATE_BOOK': return { ...state, books: state.books.map(b => b._id === action.payload._id ? action.payload : b) };
        case 'DELETE_BOOK': return { ...state, books: state.books.filter(b => b._id !== action.payload) };
        case 'SET_SEARCH': return { ...state, searchTerm: action.payload };
        case 'SET_GENRE': return { ...state, selectedGenre: action.payload };
        case 'SET_FORM': return { ...state, formData: { ...state.formData, ...action.payload } };
        case 'RESET_FORM': return { ...state, formData: { title: '', author: '', price: '', genre: 'fiction', description: '', image: null }, editingId: null };
        case 'START_EDIT': return { ...state, editingId: action.payload._id, formData: { title: action.payload.title, author: action.payload.author, price: action.payload.price, genre: action.payload.genre, description: action.payload.description || '', image: null } };
        default: return state;
    }
}

const Shop = () => {
    const [state, dispatch] = useReducer(shopReducer, initialState);
    const { addToCart } = useContext(CartContext);
    const { isAdmin } = useContext(AuthContext);
    const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
    const [searchParams] = useSearchParams();

    // Եթե Home-ի GenreShowcase-ից եկել ենք ուղիղ հղումով (/shop?genre=fantasy),
    // ուրեմն URL-ի genre պարամետրը դառնում է նախնական ընտրված ժանրը
    useEffect(() => {
        const genreFromUrl = searchParams.get('genre');
        if (genreFromUrl) {
            dispatch({ type: 'SET_GENRE', payload: genreFromUrl });
        }
    }, [searchParams]);

    const handleAddToCart = (book) => {
        addToCart(book);
        toast.success(`${book.title} գիրքը ավելացվեց զամբյուղի մեջ!`, { icon: '🛒', duration: 2000 });
    };

    const handleToggleFavorite = (book) => {
        const wasFavorite = isFavorite(book._id);
        toggleFavorite(book);
        toast.success(
            wasFavorite ? `${book.title} հեռացվեց հավանածներից` : `${book.title} ավելացվեց հավանածների մեջ`,
            { icon: '❤️', duration: 2000 }
        );
    };

    useEffect(() => {
        api.get('/books')
            .then(res => dispatch({ type: 'SET_BOOKS', payload: res.data }))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('title', state.formData.title);
        formData.append('author', state.formData.author);
        formData.append('price', state.formData.price);
        formData.append('genre', state.formData.genre);
        formData.append('description', state.formData.description || '');
        // Խմբագրելիս, եթե admin-ը նոր նկար չի ընտրել, image դաշտը չենք ուղարկում,
        // որպեսզի backend-ը հին նկարը թողնի անփոփոխ
        if (state.formData.image) formData.append('image', state.formData.image);

        try {
            if (state.editingId) {
                const res = await api.put(`/books/${state.editingId}`, formData);
                dispatch({ type: 'UPDATE_BOOK', payload: res.data });
                dispatch({ type: 'RESET_FORM' });
                toast.success('Գիրքը հաջողությամբ խմբագրվեց');
            } else {
                const res = await api.post('/books', formData);
                dispatch({ type: 'ADD_BOOK', payload: res.data });
                dispatch({ type: 'RESET_FORM' });
                toast.success('Գիրքը հաջողությամբ ավելացվեց');
            }
        } catch (error) {
            console.error("FULL ERROR RESPONSE:", error.response?.data);
            toast.error(error.response?.data?.message || (state.editingId ? 'Սխալ խմբագրման ժամանակ' : 'Սխալ գրքի ավելացման ժամանակ'));
        }
    };

    const handleEdit = (book) => {
        dispatch({ type: 'START_EDIT', payload: book });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        dispatch({ type: 'RESET_FORM' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս գիրքը։')) {
            try {
                await api.delete(`/books/${id}`);
                dispatch({ type: 'DELETE_BOOK', payload: id });
                toast.success('Գիրքը ջնջվեց');
            } catch (error) {
                toast.error('Մուտքը մերժված է');
            }
        }
    };

    const filteredBooks = state.books.filter(b => {
        const matchesSearch = b.title?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            b.author?.toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesGenre = state.selectedGenre === 'all' || b.genre === state.selectedGenre;
        return matchesSearch && matchesGenre;
    });

    if (state.loading) return <div className={styles.loading}>Բեռնվում է...</div>;

    return (
        <div className={styles.shopContainer}>
            {isAdmin && (
                <div className={styles.adminFormContainer}>
                    <h3>{state.editingId ? 'Խմբագրել Գիրքը' : 'Ավելացնել Նոր Գիրք'}</h3>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Վերնագիր" value={state.formData.title} onChange={e => dispatch({ type: 'SET_FORM', payload: { title: e.target.value } })} required />
                        <input type="text" placeholder="Հեղինակ" value={state.formData.author} onChange={e => dispatch({ type: 'SET_FORM', payload: { author: e.target.value } })} required />
                        <input type="number" placeholder="Գինը" value={state.formData.price} onChange={e => dispatch({ type: 'SET_FORM', payload: { price: e.target.value } })} required />
                        <select
                            className={styles.genreSelect}
                            value={state.formData.genre}
                            onChange={e => dispatch({ type: 'SET_FORM', payload: { genre: e.target.value } })}
                            required
                        >
                            {bookGenres.filter(g => g.id !== 'all').map(g => (
                                <option key={g.id} value={g.id}>{g.label}</option>
                            ))}
                        </select>
                        <textarea
                            className={styles.descriptionInput}
                            placeholder="Նկարագրություն"
                            value={state.formData.description}
                            onChange={e => dispatch({ type: 'SET_FORM', payload: { description: e.target.value } })}
                        />
                        <label htmlFor="file-upload" className={styles.fileLabel}>
                            {state.formData.image ? state.formData.image.name : (state.editingId ? "Փոխել նկարը (ընտրովի)" : "Ընտրել նկարը")}
                        </label>
                        <input id="file-upload" type="file" className={styles.fileInput} onChange={e => dispatch({ type: 'SET_FORM', payload: { image: e.target.files[0] } })} required={!state.editingId} />
                        <button type="submit">{state.editingId ? 'Պահպանել փոփոխությունները' : 'Ավելացնել'}</button>
                        {state.editingId && <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>Չեղարկել</button>}
                    </form>
                </div>
            )}

            <input className={styles.searchInput} placeholder="Որոնել գիրք..." value={state.searchTerm} onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })} />

            <div className={styles.shopLayout}>
                <GenreFilter
                    genres={bookGenres}
                    selectedGenre={state.selectedGenre}
                    onSelectGenre={(id) => dispatch({ type: 'SET_GENRE', payload: id })}
                />

                <div className={styles.booksGrid}>
                    {filteredBooks.length === 0 && (
                        <p className={styles.noResults}>Այս ժանրով գրքեր դեռ չկան</p>
                    )}
                    {filteredBooks.map(book => (
                        <div key={book._id} className={styles.bookCard}>
                            {isAdmin && (
                                <div className={styles.adminBookActions}>
                                    <button className={styles.editBtn} onClick={() => handleEdit(book)}>✏️</button>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(book._id)}>🗑️</button>
                                </div>
                            )}

                            <div className={styles.imageWrapper}>
                                <img
                                    src={book.image.startsWith('http') ? book.image : `https://ik.imagekit.io/hmtd5pr9d/${book.image}`}
                                    alt={book.title}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <button
                                    className={`${styles.favBtn} ${isFavorite(book._id) ? styles.favBtnActive : ''}`}
                                    onClick={() => handleToggleFavorite(book)}
                                    aria-label="Հավանել"
                                >
                                    <FiHeart />
                                </button>
                            </div>
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            <span className={styles.genreTag}>{bookGenres.find(g => g.id === book.genre)?.label || book.genre}</span>
                            <span>{book.price} ֏</span>
                            <div className={styles.bookCardActions}>
                                <Link to={`/shop/${book._id}`} className={styles.viewBtn}>Դիտել</Link>
                                <button className={styles.buyBtn} onClick={() => handleAddToCart(book)}>Ավելացնել զամբյուղ</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Shop;