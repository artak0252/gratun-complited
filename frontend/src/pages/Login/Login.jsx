import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const Login = () => {
          const [credentials, setCredentials] = useState({ username: '', password: '' });
          const navigate = useNavigate();

          // Render-ի բեքենդի հասցեն
          const API_URL = 'https://gratun-backend.onrender.com';

          const handleChange = (e) => {
                    const { name, value } = e.target;
                    setCredentials(prev => ({ ...prev, [name]: value }));
          };

          const handleLogin = async (e) => {
                    e.preventDefault();
                    try {
                              // Ավելացրել ենք /api/login հասցեն
                              const res = await axios.post(`${API_URL}/api/login`, credentials);
                              localStorage.setItem('token', res.data.token);
                              alert('Մուտքը հաջողված է');
                              navigate('/blog');
                    } catch (err) {
                              console.error(err);
                              alert('Սխալ օգտանուն կամ գաղտնաբառ');
                    }
          };

          return (
                    <div className={styles.loginContainer}>
                              <h2 className={styles.loginTitle}>Ադմին մուտք</h2>
                              <form onSubmit={handleLogin} className={styles.loginForm}>
                                        <input
                                                  type="text"
                                                  name="username"
                                                  value={credentials.username}
                                                  onChange={handleChange}
                                                  placeholder="Օգտանուն"
                                                  className={styles.loginInput}
                                                  required
                                        />
                                        <input
                                                  type="password"
                                                  name="password"
                                                  value={credentials.password}
                                                  onChange={handleChange}
                                                  placeholder="Գաղտնաբառ"
                                                  className={styles.loginInput}
                                                  required
                                        />
                                        <button type="submit" className={styles.loginButton}>Մուտք</button>
                              </form>

                              <div className={styles.registerLink} style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                                        <p>Դեռ գրանցվա՞ծ չեք։
                                                  <Link to="/register" style={{ color: '#FF6600', textDecoration: 'none', marginLeft: '5px', fontWeight: 'bold' }}>
                                                            Գրանցվել
                                                  </Link>
                                        </p>
                              </div>
                    </div>
          );
};

export default Login;