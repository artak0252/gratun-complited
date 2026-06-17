import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <header className={styles.aboutHeader}>
        <h1>Մեր պատմությունը</h1>
        <p>Մենք սիրահարված ենք գրքերին և գաղափարներին</p>
      </header>

      <section className={styles.aboutContent}>
        <div className={styles.aboutText}>
          <h2>Ինչո՞ւ ստեղծեցինք այս բլոգը</h2>
          <p>
            Մեր կայքը ծնվել է գրականության հանդեպ ունեցած մեծ սիրուց: Մենք հավատում ենք, որ յուրաքանչյուր գիրք նոր աշխարհ է, իսկ յուրաքանչյուր հոդված՝ այդ աշխարհը ճանաչելու փոքրիկ քայլ:
          </p>
          <p>
            Այստեղ մենք կիսվում ենք մեր ընթերցանության փորձով, վերլուծում ենք փիլիսոփայական մտքեր և փորձել ստեղծել մի համայնք, որտեղ գրքերը դառնում են զրույցի առարկա:
          </p>
        </div>
        <div className={styles.aboutValues}>
          <h3>Մեր սկզբունքները</h3>
          <ul>
            <li><span>📚</span> Խորը վերլուծություն</li>
            <li><span>🔍</span> Ճշմարտացի կարծիքներ</li>
            <li><span>💡</span> Մտքերի փոխանակում</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;