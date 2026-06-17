import React, { useState } from 'react';
import styles from './Contact.module.css'; // Փոխված իմպորտը

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Շնորհակալություն, ${formData.name}: Ձեր հաղորդագրությունն ուղարկված է:`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className={styles.contactContainer}>
      <h1>Կապվեք մեզ հետ</h1>
      <p>Ունե՞ք հարցեր կամ առաջարկներ։ Գրեք մեզ, և մենք կպատասխանենք հնարավորինս շուտ։</p>

      <div className={styles.contactContent}>
        {/* Կոնտակտային տվյալներ */}
        <div className={styles.contactInfo}>
          <h3>Մեր կոնտակտները</h3>
          <p>📍 Հասցե՝ Երևան, Կենտրոն, Տերյան փողոց 1</p>
          <p>📞 Հեռ՝ +374 10 000 000</p>
          <p>📧 Էլ. փոստ՝ info@yourblog.am</p>
          <div className={styles.socialLinks}>
            <a href="#">Instagram</a> | <a href="#">Facebook</a> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;