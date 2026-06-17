import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
          const [books, setBooks] = useState([]);
          const [isAdmin, setIsAdmin] = useState(false);
          const navigate = useNavigate();

          useEffect(() => {
                    // 1. Ստուգում ենք՝ արդյոք ադմին է, թե ոչ (Frontend պաշտպանություն)
                    const token = localStorage.getItem('token');
                    if (!token) {
                              navigate('/login');
                              return;
                    }

                    try {
                              const decoded = jwtDecode(token);
                              setIsAdmin(decoded.role === 'admin');
                    } catch (e) {
                              navigate('/login');
                    }

                    fetchBooks();
          }, [navigate]);

          const fetchBooks = async () => {
                    try {
                              const res = await axios.get('http://localhost:5000/api/books');
                              setBooks(res.data);
                    } catch (error) {
                              toast.error("Գրքերը չբեռնվեցին");
                    }
          };

          const deleteBook = async (id) => {
                    try {
                              const token = localStorage.getItem('token');
                              await axios.delete(`http://localhost:5000/api/books/${id}`, {
                                        headers: { Authorization: `Bearer ${token}` }
                              });
                              toast.success("Գիրքը ջնջվեց");
                              fetchBooks();
                    } catch (error) {
                              toast.error("Ջնջելը չհաջողվեց. Հնարավոր է իրավունք չունես");
                    }
          };

          return (
                    <div style={{ padding: '20px' }}>
                              <h1>Գրքերի կառավարում</h1>
                              {/* 2. Ավելացնելու կոճակը ցույց ենք տալիս միայն ադմինին */}
                              {isAdmin && (
                                        <button onClick={() => navigate('/add-book')}>Ավելացնել նոր գիրք</button>
                              )}

                              <ul>
                                        {books.map(book => (
                                                  <li key={book._id} style={{ margin: '10px 0' }}>
                                                            {book.title} - {book.author}

                                                            {/* 3. Ջնջելու կոճակը ցույց ենք տալիս միայն ադմինին */}
                                                            {isAdmin && (
                                                                      <button onClick={() => deleteBook(book._id)} style={{ marginLeft: '10px', color: 'red' }}>
                                                                                Ջնջել
                                                                      </button>
                                                            )}
                                                  </li>
                                        ))}
                              </ul>
                    </div>
          );
};

export default AdminDashboard;