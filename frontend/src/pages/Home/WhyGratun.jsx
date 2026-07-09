import React from 'react';
import { FiTruck, FiShield, FiBookOpen, FiHeadphones } from 'react-icons/fi';
import styles from './WhyGratun.module.css';

const items = [
  {
    icon: <FiTruck />,
    title: 'Առաքում',
    text: 'Առաքումը կատարվում է ամբողջ Հայաստանում Հայփոստի միջոցով',
  },
  {
    icon: <FiBookOpen />,
    title: 'Ընտրված գրքեր',
    text: 'Մեր գրքերը կօգնեն Ձեզ փոխել Ձեր կյանքը',
  },
  {
    icon: <FiHeadphones />,
    title: 'Միշտ Ձեր կողքին',
    text: 'Հարց ունե՞ք․ գրեք մեզ, կպատասխանենք հնարավորինս շուտ',
  },
];

const WhyGratun = () => {
  return (
    <section className={styles.whyContainer}>
      <div className={styles.whyGrid}>
        {items.map((item, i) => (
          <div className={styles.whyCard} key={i}>
            <div className={styles.iconWrap}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyGratun;
