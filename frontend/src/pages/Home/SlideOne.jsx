import React from 'react';
import { heroContainer, heroContent, badge, heroTitle, highlight, heroDesc, ctaButton, heroImageStack, mainBookImg } from './heroStyles.js';
import book from '../../assets/tree.png';

const SlideOne = () => (
  <div className={heroContainer}>
    <div className={heroContent}>

      <span className={badge}>Գիրքը քո լավագույն ընկերն է</span>
      <h1 className={heroTitle}>
        Մեր գրքերի հավաքածուն կօգնի Ձեզ փոխել Ձեր
        աշխարհայացքը։
        <span className={highlight}>Սկսե՛ք ձեր ճանապարհորդությունը հենց հիմա</span>
      </h1>
      <p className={heroDesc}>
        Ուսումնասիրեք՝ գրքեր բաժնում
      </p>
      <button className={ctaButton} onClick={() => window.location.href = '/shop'}>
        Դիտել հավաքածուն <span>→</span>
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
export default SlideOne;
