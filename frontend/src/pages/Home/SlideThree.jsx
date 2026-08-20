import React from 'react';
import { heroContainer, heroContent, badge, heroTitle, highlight, ctaButton, heroImageStack, mainBookImg } from './heroStyles.js';
import book from '../../assets/tree2.png';



const SlideThree = () => (
  <div className={heroContainer}>
    <div className={heroContent}>
      <span className={badge}>Գիրքը քո մտքի լավագույն ընկերն է</span>
      <h1 className={heroTitle}>
        Այս կայքէջը կօգնի ոչ միայն գտնել Քեզ անհրաժեշտ գրքերը, <br />
        <span className={highlight}>նաև վաճառել այլ գրքեր</span>
      </h1>
      <button className={ctaButton} onClick={() => window.location.href = '/shop'}>
        Ցանկին ծանոթացիր այստեղ →
      </button>
    </div>
    <div className={heroImageStack}>
      <img src={book} alt="Գիրք" className={mainBookImg} />
    </div>
  </div>
);
export default SlideThree;
