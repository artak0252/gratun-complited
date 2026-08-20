import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { loginContainer, loginTitle, loginForm, loginInput, loginButton } from './loginStyles.js';

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
    <div className={loginContainer}>
      <h2 className={loginTitle}>Գրանցում</h2>
      <form onSubmit={handleRegister} className={loginForm}>
        <input type="text" name="username" placeholder="Օգտանուն" onChange={handleChange} className={loginInput} required />
        <input type="email" name="email" placeholder="Էլ. փոստ" onChange={handleChange} className={loginInput} required />
        <input type="password" name="password" placeholder="Գաղտնաբառ (նվազագույնը 8 նիշ)" onChange={handleChange} className={loginInput} required minLength={8} />
        <button type="submit" className={loginButton}>Գրանցվել</button>
      </form>
      <div className="mt-5 text-[0.9rem]">
        <p>Արդեն ունե՞ք հաշիվ։
          <Link to="/login" className="text-[#FF6600] no-underline ml-[5px] font-bold">
            Մուտք
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
