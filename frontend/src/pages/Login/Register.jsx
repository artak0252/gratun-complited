import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import styles from './Login.module.css'; // Կարող ես օգտագործել նույն ոճը

const Register = () => {
          const [formData, setFormData] = useState({ username: '', email: '', password: '' });
          const navigate = useNavigate();

          const handleChange = (e) => {
                    const { name, value } = e.target;
                    setFormData(prev => ({ ...prev, [name]: value }));
          };

          const handleRegister = async (e) => {
                    e.preventDefault();
                    try {
                              await api.post('/register', formData);
                              alert('Գրանցումը հաջողվեց! Այժմ կարող եք մուտք գործել։');
                              navigate('/login');
                    } catch (err) {
                              alert('Գրանցումը ձախողվեց։ Խնդրում ենք փորձել նորից։');
                    }
          };

          return (
                    <div className={styles.loginContainer}>
                              <h2 className={styles.loginTitle}>Գրանցում</h2>
                              <form onSubmit={handleRegister} className={styles.loginForm}>
                                        <input type="text" name="username" placeholder="Օգտանուն" onChange={handleChange} className={styles.loginInput} required />
                                        <input type="email" name="email" placeholder="Էլ. փոստ" onChange={handleChange} className={styles.loginInput} required />
                                        <input type="password" name="password" placeholder="Գաղտնաբառ" onChange={handleChange} className={styles.loginInput} required />
                                        <button type="submit" className={styles.loginButton}>Գրանցվել</button>
                              </form>
                              <div style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                                        <p>Արդեն ունե՞ք հաշիվ։
                                                  <Link to="/login" style={{ color: '#FF6600', textDecoration: 'none', marginLeft: '5px', fontWeight: 'bold' }}>
                                                            Մուտք
                                                  </Link>
                                        </p>
                              </div>
                    </div>
          );
};

export default Register;