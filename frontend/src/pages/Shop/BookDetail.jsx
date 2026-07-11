import React, { useReducer, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import styles from './BookDetail.module.css';
import { bookGenres } from './genreConstants';

const initialState = {
          book: null,
          loading: true,
          error: null
};

const bookReducer = (state, action) => {
          switch (action.type) {
                    case 'FETCH_START':
                              return { ...state, loading: true };
                    case 'FETCH_SUCCESS':
                              return { ...state, book: action.payload, loading: false };
                    case 'FETCH_ERROR':
                              return { ...state, error: action.payload, loading: false };
                    default:
                              return state;
          }
};

const BookDetail = () => {
          const { id } = useParams();
          const [state, dispatch] = useReducer(bookReducer, initialState);
          const { book, loading, error } = state;
          const { addToCart } = useContext(CartContext);

          useEffect(() => {
                    const fetchBook = async () => {
                              dispatch({ type: 'FETCH_START' });
                              try {
                                        const response = await api.get(`/books/${id}`);
                                        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
                              } catch (err) {
                                        dispatch({ type: 'FETCH_ERROR', payload: 'Գիրքը չգտնվեց' });
                              }
                    };
                    fetchBook();
          }, [id]);

          const handleAddToCart = () => {
                    addToCart(book);
                    toast.success(`${book.title} գիրքը ավելացվեց զամբյուղի մեջ!`, { icon: '🛒', duration: 2000 });
          };

          if (loading) return <div className={styles.loading}>Բեռնվում է...</div>;
          if (error) return <div className={styles.loading}>{error}</div>;

          return (
                    <div className={styles.detailContainer}>
                              <Link to="/shop" className={styles.backBtn}>← Հետ դեպի խանութ</Link>

                              <div className={styles.bookDetailCard}>
                                        <img
                                                  className={styles.bookDetailImg}
                                                  src={book.image.startsWith('http') ? book.image : `https://ik.imagekit.io/hmtd5pr9d/${book.image}`}
                                                  alt={book.title}
                                                  onError={(e) => {
                                                            e.target.src = "https://via.placeholder.com/150";
                                                  }}
                                        />

                                        <div className={styles.bookDetailBody}>
                                                  <span className={styles.genreTag}>
                                                            {bookGenres.find(g => g.id === book.genre)?.label || book.genre}
                                                  </span>
                                                  <h1 className={styles.bookDetailTitle}>{book.title}</h1>
                                                  <p className={styles.bookDetailAuthor}>{book.author}</p>

                                                  {book.description && (
                                                            <p className={styles.bookDetailDescription} style={{ whiteSpace: 'pre-wrap' }}>
                                                                      {book.description}
                                                            </p>
                                                  )}

                                                  <div className={styles.bookDetailFooter}>
                                                            <span className={styles.bookDetailPrice}>{book.price} ֏</span>
                                                            <button className={styles.buyBtn} onClick={handleAddToCart}>Ավելացնել զամբյուղ</button>
                                                  </div>
                                        </div>
                              </div>
                    </div>
          );
};

export default BookDetail;