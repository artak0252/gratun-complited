import React, { useReducer, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiZoomIn, FiX } from 'react-icons/fi';

import Seo from '../Seo/Seo';
import { getCategoryLabel } from './constants';

const SITE_URL = 'https://www.gratunhub.am';

const initialState = {
    item: null,
    loading: true,
    error: null
};

const itemReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, item: action.payload, loading: false };
        case 'FETCH_ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

const SingleLiterature = () => {
    const { id } = useParams();
    const [state, dispatch] = useReducer(itemReducer, initialState);
    const { item, loading, error } = state;
    const [showAnswer, setShowAnswer] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [isImageZoomed, setIsImageZoomed] = useState(false);

    const API_URL = '/api';

    useEffect(() => {
        const fetchItem = async () => {
            dispatch({ type: 'FETCH_START' });
            setShowAnswer(false);
            setUserAnswer('');
            try {
                const response = await axios.get(`${API_URL}/literature/${id}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
            } catch (err) {
                dispatch({ type: 'FETCH_ERROR', payload: 'Նյութը չգտնվեց' });
            }
        };
        fetchItem();
    }, [id]);

    // Նկարը մեծացված ցուցադրելիս՝ արգելափակել էջի scroll-ը և Escape-ով փակել
    useEffect(() => {
        if (!isImageZoomed) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsImageZoomed(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isImageZoomed]);

    if (loading) return <div className="text-center py-[100px] font-['Noto_Serif_Armenian','Playfair_Display',serif] text-2xl">Բեռնվում է...</div>;
    if (error) return <div className="text-center py-[100px] font-['Noto_Serif_Armenian','Playfair_Display',serif] text-2xl">{error}</div>;

    const itemImage = item.image.startsWith('http')
        ? item.image
        : `https://ik.imagekit.io/hmtd5pr9d/${item.image}`;

    return (
        <div className="px-[8%] py-[70px] bg-white min-h-screen max-[900px]:px-[6%] max-[900px]:py-[50px] max-[480px]:px-[5%] max-[480px]:py-[35px]">
            <Seo
                title={`${item.title}${item.author ? ` — ${item.author}` : ''}`}
                description={item.excerpt || item.content?.slice(0, 160)}
                image={itemImage}
                url={`${SITE_URL}/literature/${item._id}`}
                type="article"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'CreativeWork',
                    headline: item.title,
                    image: itemImage,
                    datePublished: item.date,
                    description: item.excerpt,
                    author: { '@type': item.author ? 'Person' : 'Organization', name: item.author || 'Գրատուն' },
                    mainEntityOfPage: `${SITE_URL}/literature/${item._id}`,
                }}
            />
            <Link to="/literature" className="inline-block mb-10 text-[#14315C] no-underline font-semibold font-[Noto_Sans_Armenian,Poppins,sans-serif] hover:text-[#d35400] max-[480px]:mb-[25px]">← Հետ դեպի Գրականություն</Link>

            <article className="flex flex-row items-start gap-[60px] max-w-[1200px] mx-auto max-[900px]:gap-[35px] max-[700px]:flex-col">
                <button
                    type="button"
                    onClick={() => setIsImageZoomed(true)}
                    aria-label="Մեծացնել նկարը"
                    className="group relative w-[400px] h-[520px] shrink-0 rounded-3xl sticky top-[100px] p-0 border-none bg-transparent cursor-zoom-in max-[900px]:w-[280px] max-[900px]:h-[400px] max-[900px]:static max-[700px]:w-full max-[700px]:h-[260px] max-[700px]:static max-[480px]:h-[220px] max-[480px]:rounded-2xl"
                >
                    <img
                        className="w-full h-full object-cover rounded-3xl transition-transform duration-300 group-hover:scale-[1.02] max-[480px]:rounded-2xl"
                        src={itemImage}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                        }}
                    />
                    <span className="absolute bottom-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-white/85 text-[#14315C] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-[900px]:opacity-100">
                        <FiZoomIn size={18} />
                    </span>
                </button>

                {isImageZoomed && (
                    <div
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 px-[5%] py-[5%]"
                        onClick={() => setIsImageZoomed(false)}
                    >
                        <button
                            type="button"
                            onClick={() => setIsImageZoomed(false)}
                            aria-label="Փակել"
                            className="absolute top-5 right-5 flex items-center justify-center w-11 h-11 rounded-full bg-white/15 text-white border-none cursor-pointer hover:bg-white/25 transition-colors max-[480px]:top-3 max-[480px]:right-3"
                        >
                            <FiX size={24} />
                        </button>
                        <img
                            src={itemImage}
                            alt={item.title}
                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="text-[#d35400] text-[13px] uppercase tracking-[1px] font-[Noto_Sans_Armenian,Poppins,sans-serif] font-semibold flex gap-[15px]">
                        <span>{getCategoryLabel(item.category)}</span>
                        {item.date && (
                            <span className="text-[#888] font-normal normal-case tracking-normal">
                                {new Date(item.date).toLocaleDateString('hy-AM')}
                            </span>
                        )}
                    </div>
                    <h1 className="font-['Noto_Serif_Armenian','Playfair_Display',serif] text-[42px] font-semibold text-[#14315C] my-[15px] mb-2.5 leading-[1.25] max-[900px]:text-[32px] max-[480px]:text-[26px] max-[480px]:my-3">{item.title}</h1>
                    {item.author && (
                        <p className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[17px] text-[#6B3245] font-medium mb-[30px] max-[480px]:mb-5">{item.author}</p>
                    )}

                    <div className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[17px] leading-[1.9] text-[#333] text-left max-[480px]:text-base">
                        <p style={{ whiteSpace: 'pre-wrap' }}>{item.content}</p>
                    </div>

                    {item.category === 'riddles' && (
                        <div className="mt-[30px] p-6 bg-[#E4E8F0] rounded-2xl">
                            <label
                                htmlFor="riddle-answer-input"
                                className="block font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[15px] font-semibold text-[#14315C] mb-2.5"
                            >
                                Գրիր քո պատասխանը այստեղ՝
                            </label>
                            <textarea
                                id="riddle-answer-input"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Փորձիր ինքդ գուշակել, ապա ստուգիր..."
                                rows={4}
                                className="w-full box-border resize-y rounded-xl border border-[#c7cee0] bg-white p-3.5 font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[16px] text-[#333] leading-[1.6] outline-none transition-colors duration-300 focus:border-[#14315C]"
                            />

                            {item.answer && (
                                <div className="mt-4">
                                    {showAnswer ? (
                                        <p className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[17px] text-[#14315C]">
                                            <strong>Ճիշտ պատասխանը՝ </strong>{item.answer}
                                        </p>
                                    ) : (
                                        <button
                                            onClick={() => setShowAnswer(true)}
                                            className="bg-[#14315C] text-white border-none px-[25px] py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:bg-[#d35400]"
                                        >
                                            Ցույց տալ պատասխանը
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
};

export default SingleLiterature;