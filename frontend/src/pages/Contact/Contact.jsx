import React, { useState } from 'react';
import styles from './Contact.module.css'; // Փոխված իմպորտը

const Contact = () => {
  

  return (
    <div className={styles.contactContainer}>
      <h1>Կապվեք մեզ հետ</h1>
      <p>Ունե՞ք հարցեր կամ առաջարկներ։ Գրեք մեզ, և մենք կպատասխանենք հնարավորինս շուտ։</p>

      <div className={styles.contactContent}>
        {/* Կոնտակտային տվյալներ */}
        <div className={styles.contactInfo}>
          <h2>Մեր կոնտակտները</h2>
         
          <p>📞 Հեռ՝ +374 41736074</p>
          <p>📧 Էլ. փոստ՝ gratun2026@gmail.com</p>
         
          <h3>✅Քո վաճառքի գիրքը կարող է լինել այս հարթակում</h3>
          <h3>✅Քո կողմից տրամադրվող նյութերը կարող են լինել մեր բլոգում</h3>
          <h3>😊Կապվիր մեզ հետ մանրամասների համար</h3>
          <div className={styles.socialLinks}>
            <a  href="https://www.facebook.com/grk.i.tun">Facebook</a> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;