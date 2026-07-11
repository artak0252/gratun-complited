import React, { useReducer, useEffect, useState, useContext } from 'react';
import { blogCategories } from './constants';
import api from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import styles from './Blog.module.css';
import CategoryFilter from './CategoryFilter';
import adminStyles from './AdminFilter.module.css';

const initialState = {
    posts: [],
    loading: true,
    searchTerm: '',
    selectedCategory: 'all',
    editingId: null,
    formData: { title: '', excerpt: '', content: '', category: 'history', image: null }
};

const blogReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS': return { ...state, posts: action.payload, loading: false };
        case 'SET_LOADING': return { ...state, loading: action.payload };
        case 'ADD_POST': return { ...state, posts: [action.payload, ...state.posts], formData: initialState.formData, editingId: null };
        case 'UPDATE_POST': return { ...state, posts: state.posts.map(p => p._id === action.payload._id ? action.payload : p), formData: initialState.formData, editingId: null };
        case 'DELETE_POST': return { ...state, posts: state.posts.filter(p => p._id !== action.payload) };
        case 'SET_FORM_FIELD': return { ...state, formData: { ...state.formData, [action.field]: action.value } };
        case 'START_EDIT': return { ...state, editingId: action.payload._id, formData: { title: action.payload.title, excerpt: action.payload.excerpt, content: action.payload.content, category: action.payload.category, image: null } };
        case 'CANCEL_EDIT': return { ...state, editingId: null, formData: initialState.formData };
        case 'SET_SEARCH': return { ...state, searchTerm: action.payload };
        case 'SET_CATEGORY': return { ...state, selectedCategory: action.payload };
        default: return state;
    }
};

const Blog = () => {
    const [state, dispatch] = useReducer(blogReducer, initialState);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { posts, loading, formData, searchTerm, selectedCategory, editingId } = state;
    const { isAdmin } = useContext(AuthContext);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts');
                dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
            } catch (err) { dispatch({ type: 'SET_LOADING', payload: false }); }
        };
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Ջնջե՞լ այս հոդվածը:')) return;
        try {
            await api.delete(`/posts/${id}`);
            dispatch({ type: 'DELETE_POST', payload: id });
            alert('Հոդվածը ջնջվեց');
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
                const res = await api.put(`/posts/${editingId}`, data);
                dispatch({ type: 'UPDATE_POST', payload: res.data });
                setIsFormVisible(false);
                alert('Հոդվածը հաջողությամբ խմբագրվեց!');
            } else {
                const res = await api.post('/posts', data);
                dispatch({ type: 'ADD_POST', payload: res.data });
                setIsFormVisible(false);
                alert('Հոդվածը հաջողությամբ ավելացվեց!');
            }
        } catch (err) {
            console.error(err);
            alert(editingId ? 'Սխալ՝ խմբագրումը չհաջողվեց' : 'Սխալ՝ միայն ադմինները կարող են ավելացնել');
        }
    };

    const handleEdit = (post) => {
        dispatch({ type: 'START_EDIT', payload: post });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        dispatch({ type: 'CANCEL_EDIT' });
        setIsFormVisible(false);
    };

    if (loading) return <div className={styles.loading}>Բեռնվում է...</div>;

    const filteredPosts = posts.filter(p => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory || (selectedCategory === 'literature' && p.category?.startsWith('literature'));
        const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={styles.blogContainer}>
            {isAdmin && (
                <div className={styles.adminSection}>
                    <button className={styles.publishBtn} style={{ marginBottom: '20px' }} onClick={() => isFormVisible ? handleCancelEdit() : setIsFormVisible(true)}>
                        {isFormVisible ? 'Փակել ֆորման' : '+ Նոր հոդված ավելացնել'}
                    </button>
                    {isFormVisible && (
                        <div className={styles.adminFormContainer}>
                            <h3>{editingId ? 'Խմբագրել հոդվածը' : 'Ավելացնել նոր հոդված'}</h3>
                            <form onSubmit={handleFormSubmit}>
                                <input type="text" placeholder="Վերնագիր" value={formData.title} onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'title', value: e.target.value })} required />
                                <input type="text" placeholder="Կարճ նկարագրություն" value={formData.excerpt} onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'excerpt', value: e.target.value })} required />
                                <textarea placeholder="Բովանդակություն" value={formData.content} onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'content', value: e.target.value })} required />
                                <select className={adminStyles.adminSelect} value={formData.category} onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'category', value: e.target.value })} required>
                                    {blogCategories.filter(c => c.id !== 'all').map(c =>
                                        c.subCategories ? c.subCategories.map(s => <option key={s.id} value={s.id}>{c.label} - {s.label}</option>) : <option key={c.id} value={c.id}>{c.label}</option>
                                    )}
                                </select>
                                <label htmlFor="blog-file" className={styles.fileLabel}>{formData.image ? formData.image.name : (editingId ? "Փոխել նկարը (ընտրովի)" : "Ընտրել նկարը")}</label>
                                <input id="blog-file" type="file" className={styles.fileInput} onChange={e => dispatch({ type: 'SET_FORM_FIELD', field: 'image', value: e.target.files[0] })} required={!editingId} />
                                <button type="submit" className={styles.publishBtn}>{editingId ? 'Պահպանել փոփոխությունները' : 'Հրապարակել'}</button>
                                {editingId && <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>Չեղարկել</button>}
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
                        {isAdmin && (
                            <div className={styles.adminPostActions}>
                                <button className={styles.editPostBtn} onClick={() => handleEdit(post)}>✏️</button>
                                <button className={styles.deletePostBtn} onClick={() => handleDelete(post._id)}>🗑️</button>
                            </div>
                        )}
                        <img
                            className={styles.postImg}
                            src={post.image.startsWith('http') ? post.image : `https://ik.imagekit.io/hmtd5pr9d/${post.image}`}
                            alt={post.title}
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150";
                            }}
                        />
                        <div className={styles.postContent}>
                            <h2>{post.title}</h2>
                            <p>{post.excerpt}</p>
                            <Link to={`/blog/${post._id}`}>Կարդալ ավելին →</Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Blog;