import React from 'react';
import { FiTruck, FiShield, FiBookOpen, FiHeadphones } from 'react-icons/fi';

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
    <section className="bg-[#E4E8F0] px-[8%] py-[70px] border-b-[5px] border-white max-[500px]:px-[6%] max-[500px]:py-[50px]">
      <div className="max-w-[1100px] mx-auto flex justify-center flex-wrap gap-[35px]">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-[18px] px-[30px] py-10 text-center shadow-[0_10px_25px_rgba(0,0,0,0.04)] transition-[transform,box-shadow] duration-[250ms] flex-[1_1_280px] max-w-[320px] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(107,50,69,0.12)]"
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#14315C] text-white flex items-center justify-center text-[1.8rem]">
              {item.icon}
            </div>
            <h3 className="font-['Playfair_Display',Noto_Sans_Armenian,Georgia,serif] text-[1.2rem] text-[#6B3245] mb-3 font-bold">
              {item.title}
            </h3>
            <p className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[0.95rem] text-[#5f5750] leading-[1.5] m-0">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyGratun;
