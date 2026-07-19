import React, { useReducer, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './SinglePost.module.css';
import Seo from '../Seo/Seo';

const SITE_URL = 'https://www.gratunhub.am';

const initialState = {
    post: null,
    loading: true,
    error: null
};

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

    const API_URL = '/api';

    useEffect(() => {
        const fetchPost = async () => {
            dispatch({ type: 'FETCH_START' });
            try {
                const response = await axios.get(`${API_URL}/posts/${id}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
            } catch (err) {
                dispatch({ type: 'FETCH_ERROR', payload: 'Հոդվածը չգտնվեց' });
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className={styles.loading}>Բեռնվում է...</div>;
    if (error) return <div className={styles.loading}>{error}</div>;

    const postImage = post.image.startsWith('http')
        ? post.image
        : `https://ik.imagekit.io/hmtd5pr9d/${post.image}`;

    return (
        <div className={styles.singlePostContainer}>
            <Seo
                title={post.title}
                description={post.excerpt || post.content?.slice(0, 160)}
                image={postImage}
                url={`${SITE_URL}/blog/${post._id}`}
                type="article"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: post.title,
                    image: postImage,
                    datePublished: post.date,
                    description: post.excerpt,
                    author: { '@type': 'Organization', name: 'Գրատուն' },
                    mainEntityOfPage: `${SITE_URL}/blog/${post._id}`,
                }}
            />
            <Link to="/blog" className={styles.backBtn}>← Հետ դեպի օրագիր</Link>

            <article className={styles.fullPost}>
                <img
                    className={styles.fullPostImg}
                    src={post.image.startsWith('http') ? post.image : `https://ik.imagekit.io/hmtd5pr9d/${post.image}`}
                    alt={post.title}
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                    }}
                />

                <div className={styles.fullPostBody}>
                    <div className={styles.fullPostMeta}>
                        <span className={styles.postCategory}>{post.category}</span>
                        <span className={styles.postDate}>
                            {new Date(post.date).toLocaleDateString('hy-AM')}
                        </span>
                    </div>
                    <h1 className={styles.fullPostTitle}>{post.title}</h1>

                    <div className={styles.fullPostContent}>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default SinglePost;