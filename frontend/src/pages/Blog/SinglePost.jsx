import React, { useReducer, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './SinglePost.module.css';

// Սահմանում ենք սկզբնական վիճակը
const initialState = {
    post: null,
    loading: true,
    error: null
};

// Ռեդյուսեր ֆունկցիան
const postReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, post: action.payload, loading: false };
        case 'FETCH_ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

const SinglePost = () => {
    const { id } = useParams();
    const [state, dispatch] = useReducer(postReducer, initialState);
    const { post, loading, error } = state;

    // Render-ի բեքենդի հասցեն
    const API_URL = 'https://gratun-backend.onrender.com';

    useEffect(() => {
        const fetchPost = async () => {
            dispatch({ type: 'FETCH_START' });
            try {
                const response = await axios.get(`${API_URL}/api/posts/${id}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
            } catch (err) {
                dispatch({ type: 'FETCH_ERROR', payload: 'Հոդվածը չգտնվեց' });
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className={styles.loading}>Բեռնվում է...</div>;
    if (error) return <div className={styles.loading}>{error}</div>;

    return (
        <div className={styles.singlePostContainer}>
            <Link to="/blog" className={styles.backBtn}>← Հետ դեպի օրագիր</Link>

            <article className={styles.fullPost}>
                <div className={styles.fullPostHeader}>
                    {/* ImageKit-ի հղումը աշխատում է անմիջապես post.image-ով */}
                    <img
                        src={post.image}
                        alt={post.title}
                        className={styles.fullPostImg}
                    />
                    <div className={styles.fullPostMeta}>
                        <span className={styles.postCategory}>{post.category}</span>
                        <span className={styles.postDate}>
                            {new Date(post.date).toLocaleDateString('hy-AM')}
                        </span>
                    </div>
                    <h1 className={styles.fullPostTitle}>{post.title}</h1>
                </div>

                <div className={styles.fullPostContent}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                </div>
            </article>
        </div>
    );
};

export default SinglePost;