import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import styles from './Login.module.css';

const Login = () => {
          const [credentials, setCredentials] = useState({ username: '', password: '' });
          const [showPassword, setShowPassword] = useState(false);
          const navigate = useNavigate();
          const { refreshAuth } = useContext(AuthContext);

          const handleChange = (e) => {
                    const { name, value } = e.target;
                    setCredentials(prev => ({ ...prev, [name]: value }));
          };

          const handleLogin = async (e) => {
                    e.preventDefault();
                    try {
                              // Token-ն այլևս response body-ում չի գալիս. սերվերն ինքն է դնում
                              // httpOnly cookie (withCredentials: true axiosInstance-ում)։
                              await api.post('/login', credentials);
                              await refreshAuth(); // թարմացնում ենք role-ը (admin/author) app-ի context-ում
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
                                        <div className={styles.passwordWrapper}>
                                                  <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            name="password"
                                                            value={credentials.password}
                                                            onChange={handleChange}
                                                            placeholder="Գաղտնաբառ"
                                                            className={styles.loginInput}
                                                            required
                                                            autoComplete="current-password"
                                                  />
                                                  <button
                                                            type="button"
                                                            className={styles.passwordToggle}
                                                            onClick={() => setShowPassword(prev => !prev)}
                                                            aria-label={showPassword ? 'Թաքցնել գաղտնաբառը' : 'Ցույց տալ գաղտնաբառը'}
                                                            tabIndex={-1}
                                                  >
                                                            {showPassword ? (
                                                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.9 10.9 0 0 1 12 4c7 0 11 7 11 7a18.6 18.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                                                <line x1="1" y1="1" x2="23" y2="23" />
                                                                      </svg>
                                                            ) : (
                                                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                                                                                <circle cx="12" cy="12" r="3" />
                                                                      </svg>
                                                            )}
                                                  </button>
                                        </div>
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