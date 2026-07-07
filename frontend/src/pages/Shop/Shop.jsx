import React, { useReducer, useEffect, useContext } from 'react';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import styles from './Shop.module.css';

const initialState = {
    books: [],
    loading: true,
    searchTerm: '',
    formData: { title: '', author: '', price: '', image: null }
};

function shopReducer(state, action) {
    switch (action.type) {
        case 'SET_BOOKS': return { ...state, books: action.payload, loading: false };
        case 'ADD_BOOK': return { ...state, books: [...state.books, action.payload] };
        case 'DELETE_BOOK': return { ...state, books: state.books.filter(b => b._id !== action.payload) };
        case 'SET_SEARCH': return { ...state, searchTerm: action.payload };
        case 'SET_FORM': return { ...state, formData: { ...state.formData, ...action.payload } };
        case 'RESET_FORM': return { ...state, formData: { title: '', author: '', price: '', image: null } };
        default: return state;
    }
}

const Shop = () => {
    const [state, dispatch] = useReducer(shopReducer, initialState);
    const { addToCart } = useContext(CartContext);
    const { isAdmin } = useContext(AuthContext);

    const handleAddToCart = (book) => {
        addToCart(book);
        toast.success(`${book.title} գիրքը ավելացվեց զամբյուղի մեջ!`, { icon: '🛒', duration: 2000 });
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
        formData.append('image', state.formData.image);

        try {
            const res = await api.post('/books', formData);
            dispatch({ type: 'ADD_BOOK', payload: res.data });
            dispatch({ type: 'RESET_FORM' });
            toast.success('Գիրքը հաջողությամբ ավելացվեց');
        } catch (error) {
            console.error("FULL ERROR RESPONSE:", error.response?.data);
            toast.error(error.response?.data?.message || 'Սխալ գրքի ավելացման ժամանակ');
        }
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

    const filteredBooks = state.books.filter(b =>
        b.title?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        b.author?.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

    if (state.loading) return <div className={styles.loading}>Բեռնվում է...</div>;

    return (
        <div className={styles.shopContainer}>
            {isAdmin && (
                <div className={styles.adminFormContainer}>
                    <h3>Ավելացնել Նոր Գիրք</h3>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Վերնագիր" value={state.formData.title} onChange={e => dispatch({ type: 'SET_FORM', payload: { title: e.target.value } })} required />
                        <input type="text" placeholder="Հեղինակ" value={state.formData.author} onChange={e => dispatch({ type: 'SET_FORM', payload: { author: e.target.value } })} required />
                        <input type="number" placeholder="Գինը" value={state.formData.price} onChange={e => dispatch({ type: 'SET_FORM', payload: { price: e.target.value } })} required />
                        <label htmlFor="file-upload" className={styles.fileLabel}>
                            {state.formData.image ? state.formData.image.name : "Ընտրել նկարը"}
                        </label>
                        <input id="file-upload" type="file" className={styles.fileInput} onChange={e => dispatch({ type: 'SET_FORM', payload: { image: e.target.files[0] } })} required />
                        <button type="submit">Ավելացնել</button>
                    </form>
                </div>
            )}

            <input className={styles.searchInput} placeholder="Որոնել գիրք..." value={state.searchTerm} onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })} />

            <div className={styles.booksGrid}>
                {filteredBooks.map(book => (
                    <div key={book._id} className={styles.bookCard}>
                        {isAdmin && (
                            <button className={styles.deleteBtn} onClick={() => handleDelete(book._id)}>🗑️</button>
                        )}

                        <img
                            src={book.image.startsWith('http') ? book.image : `https://ik.imagekit.io/hmtd5pr9d/${book.image}`}
                            alt={book.title}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                        <span>{book.price} ֏</span>
                        <button className={styles.buyBtn} onClick={() => handleAddToCart(book)}>Ավելացնել զամբյուղ</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;