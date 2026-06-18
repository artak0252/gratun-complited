import React, { useReducer, useEffect, useState } from 'react';
import { blogCategories } from './constants';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './Blog.module.css';
import CategoryFilter from './CategoryFilter';
import adminStyles from './AdminFilter.module.css';

const initialState = {
    posts: [],
    loading: true,
    searchTerm: '',
    selectedCategory: 'all',
    formData: { title: '', excerpt: '', content: '', category: 'history', image: null }
};

const blogReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS': return { ...state, posts: action.payload, loading: false };
        case 'SET_LOADING': return { ...state, loading: action.payload };
        case 'ADD_POST': return { ...state, posts: [action.payload, ...state.posts], formData: initialState.formData };
        case 'DELETE_POST': return { ...state, posts: state.posts.filter(p => p._id !== action.payload) };
        case 'SET_FORM_FIELD': return { ...state, formData: { ...state.formData, [action.field]: action.value } };
        case 'SET_SEARCH': return { ...state, searchTerm: action.payload };
        case 'SET_CATEGORY': return { ...state, selectedCategory: action.payload };
        default: return state;
    }
};

const Blog = () => {
    const [state, dispatch] = useReducer(blogReducer, initialState);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { posts, loading, formData, searchTerm, selectedCategory } = state;

    // Օգտագործում ենք Render-ի բեքենդի հղումը
    const API_URL = 'https://gratun-backend.onrender.com';

    const isAdmin = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            return jwtDecode(token).role === 'admin';
        } catch { return false; }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/posts`);
                dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
            } catch (err) { dispatch({ type: 'SET_LOADING', payload: false }); }
        };
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Ջնջե՞լ այս հոդվածը:')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}/api/posts/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            dispatch({ type: 'DELETE_POST', payload: id });
            alert('Հոդվածը ջնջվեց');
        } catch (err) { alert('Մուտքը մերժված է'); }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        try {
            const res = await axios.post(`${API_URL}/api/posts`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch({ type: 'ADD_POST', payload: res.data });
            setIsFormVisible(false);
            alert('Հոդվածը հաջողությամբ ավելացվեց!');
        } catch (err) {
            console.error(err);
            alert('Սխալ՝ միայն ադմինները կարող են ավելացնել');
        }
    };

    if (loading) return <div className={styles.loading}>Բեռնվում է...</div>;

    const filteredPosts = posts.filter(p => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory || (selectedCategory === 'literature' && p.category?.startsWith('literature'));
        const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={styles.blogContainer}>
            {isAdmin() && (
                <div className={styles.adminSection}>
                    <button className={styles.publishBtn} style={{ marginBottom: '20px' }} onClick={() => setIsFormVisible(!isFormVisible)}>
                        {isFormVisible ? 'Փակել ֆորման' : '+ Նոր հոդված ավելացնել'}
                    </button>
                    {isFormVisible && (
                        <div className={styles.adminFormContainer}>
                            <form onSubmit={handleFormSubmit}>
                                <input type="text" placeholder="Վերնագիր" value={formData.title} onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'title', value: e.target.value })} required />
                                <input type="text" placeholder="Կարճ նկարագրություն" value={formData.excerpt} onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'excerpt', value: e.target.value })} required />
                                <textarea placeholder="Բովանդակություն" value={formData.content} onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'content', value: e.target.value })} required />
                                <select className={adminStyles.adminSelect} value={formData.category} onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'category', value: e.target.value })} required>
                                    {blogCategories.filter(c => c.id !== 'all').map(c =>
                                        c.subCategories ? c.subCategories.map(s => <option key={s.id} value={s.id}>{c.label} - {s.label}</option>) : <option key={c.id} value={c.id}>{c.label}</option>
                                    )}
                                </select>
                                <label htmlFor="blog-file" className={styles.fileLabel}>{formData.image ? formData.image.name : "Ընտրել նկարը"}</label>
                                <input id="blog-file" type="file" className={styles.fileInput} onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'image', value: e.target.files[0] })} required />
                                <button type="submit" className={styles.publishBtn}>Հրապարակել</button>
                            </form>
                        </div>
                    )}
                </div>
            )}

            <CategoryFilter categories={blogCategories} selectedCategory={selectedCategory} onSelectCategory={(id) => dispatch({ type: 'SET_CATEGORY', payload: id })} />

            <div className={styles.searchContainer}>
                <input className={styles.searchInput} type="text" placeholder="Որոնել հոդված..." value={searchTerm} onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })} />
            </div>

            <div className={styles.postsGrid}>
                {filteredPosts.map(post => (
                    <article key={post._id} className={styles.postCard}>
                        {isAdmin() && (
                            <button className={styles.deletePostBtn} onClick={() => handleDelete(post._id)}>🗑️</button>
                        )}
                        {/* Ուղղակի օգտագործում ենք post.image-ը, որը արդեն ImageKit-ի URL է */}
                        <img src={post.image} alt={post.title} />
                        <h2>{post.title}</h2>
                        <p>{post.excerpt}</p>
                        <Link to={`/blog/${post._id}`}>Կարդալ ավելին →</Link>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Blog;