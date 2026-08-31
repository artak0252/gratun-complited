import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import Seo from '../Seo/Seo';

const initialForm = { name: '', email: '', subject: '', text: '' };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.text.trim()) {
      toast.error('Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը');
      return;
    }

    setIsSending(true);
    try {
      const res = await api.post('/contact', form);
      toast.success(res.data?.message || 'Ձեր նամակը ուղարկվեց։ Շնորհակալություն', { duration: 3000 });
      setForm(initialForm);
    } catch (err) {
      const message = err.response?.data?.message || 'Չհաջողվեց ուղարկել նամակը, խնդրում ենք փորձել կրկին';
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto my-20 px-5">
      <Seo
        title="Կապվեք մեզ հետ"
        description="Ունե՞ք հարցեր կամ առաջարկներ Գրատուն առցանց գրախանութի վերաբերյալ։ Կապվեք մեզ հետ։"
        url="https://www.gratunhub.am/contact"
      />
      <h1 className="font-['Playfair_Display',Noto_Sans_Armenian,Georgia,serif] text-[2.8rem] text-[#1a1a1a] mb-5 font-bold text-center">
        Կապվեք մեզ հետ
      </h1>
      <p className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[1.1rem] text-[#666] leading-[1.6] mb-[50px] max-w-[500px] mx-auto text-center">
        Ունե՞ք հարցեր կամ առաջարկներ։ Գրեք մեզ, և մենք կպատասխանենք հնարավորինս շուտ։
      </p>

      <div className="flex gap-10 items-start flex-wrap max-[800px]:flex-col">
        {/* Կոնտակտային տվյալներ */}
        <div className="bg-[#fdfdfd] border border-[#eee] p-10 rounded-[20px] text-left flex-1 min-w-[280px]">
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

      {/* Հաղորդագրության ձև */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#fdfdfd] border border-[#eee] p-10 rounded-[20px] text-left flex-1 min-w-[280px] flex flex-col gap-4"
      >
        <h2 className="font-['Playfair_Display',Noto_Sans_Armenian,Georgia,serif] text-[#6B3245] text-[1.6rem] font-bold mb-1.5">
          Գրեք մեզ նամակ
        </h2>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ձեր անունը *"
          required
          className="font-[Noto_Sans_Armenian,Poppins,sans-serif] w-full border border-[#ddd] rounded-xl px-4 py-3 text-[1rem] text-[#1a1a1a] outline-none transition-colors duration-200 focus:border-[#6B3245]"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Ձեր էլ. փոստը *"
          required
          className="font-[Noto_Sans_Armenian,Poppins,sans-serif] w-full border border-[#ddd] rounded-xl px-4 py-3 text-[1rem] text-[#1a1a1a] outline-none transition-colors duration-200 focus:border-[#6B3245]"
        />
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Թեմա (ոչ պարտադիր)"
          className="font-[Noto_Sans_Armenian,Poppins,sans-serif] w-full border border-[#ddd] rounded-xl px-4 py-3 text-[1rem] text-[#1a1a1a] outline-none transition-colors duration-200 focus:border-[#6B3245]"
        />
        <textarea
          name="text"
          value={form.text}
          onChange={handleChange}
          placeholder="Ձեր հաղորդագրությունը *"
          required
          rows={5}
          className="font-[Noto_Sans_Armenian,Poppins,sans-serif] w-full border border-[#ddd] rounded-xl px-4 py-3 text-[1rem] text-[#1a1a1a] outline-none resize-y transition-colors duration-200 focus:border-[#6B3245]"
        />

        <button
          type="submit"
          disabled={isSending}
          className="font-[Noto_Sans_Armenian,Poppins,sans-serif] bg-[#6B3245] text-white border-none rounded-xl px-6 py-3.5 text-[1.05rem] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#8A4E63] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSending ? 'Ուղարկվում է...' : 'Ուղարկել'}
        </button>
      </form>
    </div>
    </div >
  );
};

export default Contact;