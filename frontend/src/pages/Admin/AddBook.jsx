import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
          const [formData, setFormData] = useState({ title: '', author: '', price: '' });
          const [image, setImage] = useState(null);
          const navigate = useNavigate();

          const handleSubmit = async (e) => {
                    e.preventDefault();

                    // Ստանում ենք թոքենը և ստուգում ենք՝ արդյոք այն գոյություն ունի
                    const token = localStorage.getItem('token');

                    if (!token) {
                              toast.error("Դուք մուտք չեք գործել։ Խնդրում եմ մուտք գործեք նորից։");
                              navigate('/login');
                              return;
                    }

                    const data = new FormData();
                    data.append('title', formData.title);
                    data.append('author', formData.author);
                    data.append('price', formData.price);
                    data.append('image', image);

                    try {
                              // Ուղարկում ենք հարցումը
                              await axios.post('http://localhost:5000/api/books', data, {
                                        headers: {
                                                  'Authorization': `Bearer ${token}` // Համոզվիր, որ token-ը այստեղ դատարկ չէ
                                        }
                              });

                              toast.success("Գիրքը հաջողությամբ ավելացվեց");
                              navigate('/admin');
                    } catch (error) {
                              console.error("Սերվերի սխալը՝", error.response?.data);
                              toast.error("Սխալ՝ գիրքը չավելացվեց։ Ստուգեք ադմինի իրավունքները։");
                    }
          };

          return (
                    <form onSubmit={handleSubmit} style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
                              <h2>Նոր գիրք</h2>
                              <input type="text" placeholder="Վերնագիր" onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /><br />
                              <input type="text" placeholder="Հեղինակ" onChange={(e) => setFormData({ ...formData, author: e.target.value })} required /><br />
                              <input type="number" placeholder="Գին" onChange={(e) => setFormData({ ...formData, price: e.target.value })} required /><br />
                              <input type="file" onChange={(e) => setImage(e.target.files[0])} required /><br />
                              <button type="submit">Ավելացնել</button>
                    </form>
          );
};

export default AddBook;