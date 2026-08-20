import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { FiBookOpen } from 'react-icons/fi';

// Գլխավոր էջում ամբողջ տեքստը ցույց չենք տալիս, միայն մի հատված, որ բլոկը
// չծանրանա. մնացածի համար "Կարդալ ավելին" հղումը տանում է /thematic էջին
const MAX_CHARS = 150;

const truncate = (text = '', max = MAX_CHARS) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
};

const ThematicTeaser = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    api.get('/thematic-books')
      .then(res => {
        if (!isMounted) return;
        const items = res.data;
        if (Array.isArray(items) && items.length > 0) {
          // Պատահական մեկը, որ ReadingQuote-ի պես ամեն բեռնման ժամանակ փոխվի
          const randomIndex = Math.floor(Math.random() * items.length);
          setItem(items[randomIndex]);
        }
        setLoading(false);
      })
      .catch(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, []);

  // Դատարկ է, թե դեռ բեռնվում է. բլոկն ընդհանրապես չենք ցուցադրում,
  // որ էջում դատարկ տեղ չմնա (RecommendedBooks-ի նույն տրամաբանությունը)
  if (loading || !item) return null;

  return (
    <section
      className="bg-[#E4E8F0] border-b-[5px] border-white px-[8%] py-[50px] box-border max-[700px]:px-[6%] max-[700px]:py-10"
      aria-label="Ինչ գիրք կարդալ ըստ տրամադրության"
    >
      <div className="flex items-center justify-center gap-[50px] max-w-[1300px] mx-auto max-[700px]:flex-col max-[700px]:text-center max-[700px]:gap-6">
        <div className="flex-none">
          {item.image ? (
            <img
              className="w-[180px] h-[245px] rounded-[10px] object-cover border-4 border-white shadow-[0_8px_24px_rgba(20,49,92,0.25)] block"
              src={item.image}
              alt={item.bookTitle}
              loading="lazy"
            />
          ) : (
            <div className="w-[180px] h-[245px] rounded-[10px] bg-[#E4E8F0] border-4 border-white shadow-[0_8px_24px_rgba(20,49,92,0.15)] flex items-center justify-center text-[48px] text-[#14315C]">
              <FiBookOpen />
            </div>
          )}
        </div>
        <div className="flex-[1_1_500px] max-w-[780px] relative max-[700px]:flex-[1_1_auto] max-[700px]:w-full max-[700px]:max-w-full">
          <span className="inline-block font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[13px] font-semibold tracking-[0.5px] uppercase text-white bg-[#d35400] px-3.5 py-1.5 rounded-full mb-3.5">
            {item.theme}
          </span>
          <p className="font-['Playfair_Display','Noto_Serif_Armenian',serif] italic font-semibold text-[21px] text-[#14315C] leading-[1.55] mb-3.5 max-[700px]:text-[18px]">
            {truncate(item.text)}
          </p>
          <div className="flex flex-wrap items-baseline gap-1.5 mb-[22px] max-[700px]:justify-center">
            <span className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[15px] font-bold text-[#14315C]">{item.bookTitle}</span>
            {item.bookAuthor && (
              <span className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-sm text-[#6b7280]">— {item.bookAuthor}</span>
            )}
          </div>
          <Link
            to="/thematic"
            className="inline-block bg-[#14315C] text-white no-underline font-[Poppins,Noto_Sans_Armenian,sans-serif] text-sm font-semibold px-[26px] py-3 rounded-[10px] transition-all duration-300 hover:bg-[#d35400] hover:scale-[1.03]"
          >
            Կարդալ ավելին
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ThematicTeaser;
