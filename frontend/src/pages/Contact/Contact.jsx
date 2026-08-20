import React, { useState } from 'react';
import Seo from '../Seo/Seo';

const Contact = () => {


  return (
    <div className="max-w-[700px] mx-auto my-20 p-[60px] bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] text-center font-[Noto_Sans_Armenian,Poppins,sans-serif] max-[600px]:p-[30px] max-[600px]:m-5">
      <Seo
        title="Կապվեք մեզ հետ"
        description="Ունե՞ք հարցեր կամ առաջարկներ Գրատուն առցանց գրախանութի վերաբերյալ։ Կապվեք մեզ հետ։"
        url="https://www.gratunhub.am/contact"
      />
      <h1 className="font-['Playfair_Display',Noto_Sans_Armenian,Georgia,serif] text-[2.8rem] text-[#1a1a1a] mb-5 font-bold">
        Կապվեք մեզ հետ
      </h1>
      <p className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[1.1rem] text-[#666] leading-[1.6] mb-[50px] max-w-[500px] mx-auto">
        Ունե՞ք հարցեր կամ առաջարկներ։ Գրեք մեզ, և մենք կպատասխանենք հնարավորինս շուտ։
      </p>

      <div>
        {/* Կոնտակտային տվյալներ */}
        <div className="bg-[#fdfdfd] border border-[#eee] p-10 rounded-[20px] inline-block text-left">
          <h2 className="font-['Playfair_Display',Noto_Sans_Armenian,Georgia,serif] text-[#6B3245] text-[1.6rem] font-bold mb-[25px]">
            Մեր կոնտակտները
          </h2>

          <p className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[1.05rem] text-[#444] my-[15px] flex items-center gap-[15px]">📞 Հեռ՝ +374 43736074</p>
          <p className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[1.05rem] text-[#444] my-[15px] flex items-center gap-[15px]">📧 Էլ. փոստ՝ gratun2026@gmail.com</p>

          <h3 className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[#5f4f4f] mb-[25px] text-[1.15rem] font-semibold">✅Քո վաճառքի գիրքը կարող է լինել այս հարթակում</h3>
          <h3 className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[#5f4f4f] mb-[25px] text-[1.15rem] font-semibold">✅Քո կողմից տրամադրվող նյութերը կարող են լինել մեր բլոգում</h3>
          <h3 className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[#5f4f4f] mb-[25px] text-[1.15rem] font-semibold">😊Կապվիր մեզ հետ մանրամասների համար</h3>
          <div className="mt-[30px] pt-[25px] border-t border-[#eee] flex justify-center gap-5">
            <a
              href="https://www.facebook.com/grk.i.tun"
              className="font-[Noto_Sans_Armenian,Poppins,sans-serif] no-underline text-[#6B3245] font-semibold text-[1.1rem] transition-colors duration-300 hover:text-[#8A4E63]"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
