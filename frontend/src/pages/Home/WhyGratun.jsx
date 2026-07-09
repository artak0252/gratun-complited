import React from 'react';
import { FiTruck, FiShield, FiBookOpen, FiHeadphones } from 'react-icons/fi';
import styles from './WhyGratun.module.css';

const items = [
  {
    icon: <FiTruck />,
    title: 'Արագ առաքում',
    text: 'Հասցնում ենք ամբողջ Հայաստանում, արագ և հուսալի',
  },
  {
    icon: <FiShield />,
    title: 'Անվտանգ վճարում',
    text: 'Ձեր տվյալները և վճարումները միշտ պաշտպանված են',
  },
  {
    icon: <FiBookOpen />,
    title: 'Ընտրված գրքեր',
    text: 'Ամեն գիրք մեր հարթակում ուշադիր ընտրված է',
  },
  {
    icon: <FiHeadphones />,
    title: 'Միշտ կողքիդ',
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
