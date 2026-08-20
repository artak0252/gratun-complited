import React, { useReducer, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

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

    if (loading) return <div className="text-center py-[100px] font-['Noto_Serif_Armenian','Playfair_Display',serif] text-2xl">Բեռնվում է...</div>;
    if (error) return <div className="text-center py-[100px] font-['Noto_Serif_Armenian','Playfair_Display',serif] text-2xl">{error}</div>;

    const postImage = post.image.startsWith('http')
        ? post.image
        : `https://ik.imagekit.io/hmtd5pr9d/${post.image}`;

    return (
        <div className="px-[8%] py-[70px] bg-white min-h-screen max-[900px]:px-[6%] max-[900px]:py-[50px] max-[480px]:px-[5%] max-[480px]:py-[35px]">
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
            <Link to="/blog" className="inline-block mb-10 text-[#8e44ad] no-underline font-semibold font-[Noto_Sans_Armenian,Poppins,sans-serif] max-[480px]:mb-[25px]">← Հետ դեպի օրագիր</Link>

            <article className="flex flex-row items-start gap-[60px] max-w-[1200px] mx-auto max-[900px]:gap-[35px] max-[700px]:flex-col">
                <img
                    className="w-[400px] h-[520px] shrink-0 object-cover rounded-3xl sticky top-[100px] max-[900px]:w-[280px] max-[900px]:h-[400px] max-[900px]:static max-[700px]:w-full max-[700px]:h-[260px] max-[700px]:static max-[480px]:h-[220px] max-[480px]:rounded-2xl"
                    src={post.image.startsWith('http') ? post.image : `https://ik.imagekit.io/hmtd5pr9d/${post.image}`}
                    alt={post.title}
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                    }}
                />

                <div className="flex-1 min-w-0">
                    <div className="text-[#888] text-[13px] uppercase tracking-[1px] font-[Noto_Sans_Armenian,Poppins,sans-serif] flex gap-[15px]">
                        <span className="">{post.category}</span>
                        <span className="">
                            {new Date(post.date).toLocaleDateString('hy-AM')}
                        </span>
                    </div>
                    <h1 className="font-['Noto_Serif_Armenian','Playfair_Display',serif] text-[42px] font-semibold text-[#1a1a1a] my-[15px] mb-[30px] leading-[1.25] max-[900px]:text-[32px] max-[480px]:text-[26px] max-[480px]:my-3 max-[480px]:mb-5">{post.title}</h1>

                    <div className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[17px] leading-[1.9] text-[#333] text-left max-[480px]:text-base">
                        <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default SinglePost;