import React from 'react';
import { heroContainer, heroContent, badge, heroTitle, highlight, heroDesc, ctaButton, heroImageStack, mainBookImg } from './heroStyles.js';
import book from '../../assets/tree1.png';

const SlideTwo = () => (
  <div className={heroContainer}>
    <div className={heroContent}>
      <span className={badge}>Քո նյութը՝ այստեղ</span>
      <h1 className={heroTitle}>
        Շատ ուրախ կլինենք՝ տեսնել քո նյութը մեր կայքէջում։ <br />
        <span className={highlight}>Ձևաչափին ծանոթացիր Բլոգ բաժնում</span>
      </h1>
      <p className={heroDesc}>
        Կիսվիր Քո գիտելիքներով
      </p>
      <button className={ctaButton} onClick={() => window.location.href = '/blog'}>
        Դիտել ձևաչափը <span>→</span>
      </button>
    </div>

    <div className={heroImageStack}>
      <img
        src={book}
        alt="Գրքերի հավաքածու"
        className={mainBookImg}
      />
    </div>
  </div>
);
export default SlideTwo;
