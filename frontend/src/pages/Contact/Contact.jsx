import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiPhone, FiMail, FiSend, FiUser, FiTag, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { FaFacebook } from 'react-icons/fa6';
import api from '../../api/axiosInstance';
import Seo from '../Seo/Seo';

const initialForm = { name: '', email: '', subject: '', text: '' };

const perks = [
  'Քո վաճառքի գիրքը կարող է լինել այս հարթակում',
  'Քո կողմից տրամադրվող նյութերը կարող են լինել մեր բլոգում',
  'Կապվիր մեզ հետ մանրամասների համար',
];

const inputClass =
  'w-full bg-white border border-[#e4ddd6] rounded-xl pl-11 pr-4 py-3.5 text-[1rem] text-[#1a1a1a] placeholder:text-[#a89e94] outline-none transition-all duration-200 focus:border-[#6B3245] focus:ring-4 focus:ring-[#6B3245]/10';

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    <div className="bg-[#E4E8F0]">
      <Seo
        title="Կապվեք մեզ հետ"
        description="Ունե՞ք հարցեր կամ առաջարկներ Գրատուն առցանց գրախանութի վերաբերյալ։ Կապվեք մեզ հետ։"
        url="https://www.gratunhub.am/contact"
      />

      <div className="max-w-[1100px] mx-auto px-5 py-16 max-[600px]:py-12">
        {/* Header */}
        <div className="text-center mb-14 max-[600px]:mb-10">
          <span className="inline-block font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[0.8rem] font-semibold uppercase tracking-[2px] text-[#6B3245] bg-[#6B3245]/10 px-4 py-1.5 rounded-full mb-4">
            Հետադարձ կապ
          </span>
          <h1 className="font-['Playfair_Display',Noto_Sans_Armenian,Georgia,serif] text-[2.8rem] leading-[1.15] text-[#1a1a1a] font-bold mb-4 max-[600px]:text-[2.1rem]">
            Կապվեք մեզ հետ
          </h1>
          <p className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[1.1rem] text-[#666] leading-[1.6] max-w-[520px] mx-auto">
            Ունե՞ք հարցեր կամ առաջարկներ։ Գրեք մեզ, և մենք կպատասխանենք հնարավորինս շուտ։
          </p>
        </div>

        <div className="grid grid-cols-[0.85fr_1.15fr] gap-8 items-start max-[860px]:grid-cols-1">
          {/* Կոնտակտային տվյալներ */}
          <div className="bg-white border border-[#eee] p-9 rounded-[20px] shadow-[0_4px_24px_rgba(58,50,44,0.06)] flex flex-col h-full">
            <h2 className="font-['Playfair_Display',Noto_Sans_Armenian,Georgia,serif] text-[#6B3245] text-[1.5rem] font-bold mb-6">
              Մեր կոնտակտները
            </h2>

            <div className="flex flex-col gap-4 mb-8">
              <a
                href="tel:+37443736074"
                className="group flex items-center gap-4 font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[1.02rem] text-[#3A322C] no-underline"
              >
                <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-full bg-[#6B3245]/10 text-[#6B3245] text-[1.15rem] transition-colors duration-200 group-hover:bg-[#6B3245] group-hover:text-white">
                  <FiPhone />
                </span>
                <span>
                  <span className="block text-[0.78rem] text-[#999] leading-tight">Հեռախոս</span>
                  +374 43 736074
                </span>
              </a>

              <a
                href="mailto:gratun2026@gmail.com"
                className="group flex items-center gap-4 font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[1.02rem] text-[#3A322C] no-underline"
              >
                <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-full bg-[#6B3245]/10 text-[#6B3245] text-[1.15rem] transition-colors duration-200 group-hover:bg-[#6B3245] group-hover:text-white">
                  <FiMail />
                </span>
                <span>
                  <span className="block text-[0.78rem] text-[#999] leading-tight">Էլ. փոստ</span>
                  gratun2026@gmail.com
                </span>
              </a>
            </div>

            <div className="h-px bg-[#eee] mb-7" />

            <ul className="flex flex-col gap-4 mb-2 list-none p-0">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-3 font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[0.98rem] text-[#5f4f4f] leading-[1.5]"
                >
                  <FiCheckCircle className="shrink-0 mt-[3px] text-[#6B3245]" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-7 border-t border-[#eee] flex justify-center">
              <a
                href="https://www.facebook.com/grk.i.tun"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-[Noto_Sans_Armenian,Poppins,sans-serif] no-underline text-[#6B3245] font-semibold text-[1rem] transition-colors duration-200 hover:text-[#8A4E63]"
              >
                <FaFacebook className="text-[1.2rem]" />
                Facebook
              </a>
            </div>
          </div>

          {/* Հաղորդագրության ձև */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#eee] p-9 rounded-[20px] shadow-[0_4px_24px_rgba(58,50,44,0.06)] flex flex-col gap-4"
          >
            <h2 className="font-['Playfair_Display',Noto_Sans_Armenian,Georgia,serif] text-[#6B3245] text-[1.5rem] font-bold mb-1">
              Գրեք մեզ նամակ
            </h2>

            <div className="grid grid-cols-2 gap-4 max-[500px]:grid-cols-1">
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89e94]" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ձեր անունը *"
                  required
                  className={`font-[Noto_Sans_Armenian,Poppins,sans-serif] ${inputClass}`}
                />
              </div>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89e94]" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Ձեր էլ. փոստը *"
                  required
                  className={`font-[Noto_Sans_Armenian,Poppins,sans-serif] ${inputClass}`}
                />
              </div>
            </div>

            <div className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89e94]" />
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Թեմա (ոչ պարտադիր)"
                className={`font-[Noto_Sans_Armenian,Poppins,sans-serif] ${inputClass}`}
              />
            </div>

            <div className="relative">
              <FiMessageSquare className="absolute left-4 top-4 text-[#a89e94]" />
              <textarea
                name="text"
                value={form.text}
                onChange={handleChange}
                placeholder="Ձեր հաղորդագրությունը *"
                required
                rows={5}
                className={`font-[Noto_Sans_Armenian,Poppins,sans-serif] ${inputClass} resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="flex items-center justify-center gap-2 font-[Noto_Sans_Armenian,Poppins,sans-serif] bg-[#6B3245] text-white border-none rounded-xl px-6 py-3.5 text-[1.05rem] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#8A4E63] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isSending ? 'Ուղարկվում է...' : (
                <>
                  Ուղարկել
                  <FiSend className="text-[0.95rem]" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;