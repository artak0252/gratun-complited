import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import hemingwayPhoto from '../../assets/ErnestHemingway.jpg';
import { FiUser } from 'react-icons/fi';

// Եթե backend-ից մեջբերումներ չհաջողվի բերել (կամ դատարկ է), ցույց ենք
// տալիս այս ֆոլբեք մեջբերումը՝ որպեսզի բլոկը երբեք դատարկ չմնա
const fallbackQuote = {
  text: 'Վստահիր գրքերին, նրանք ամենամտերիմներն են. նրանք լռում են, երբ պետք է, և խոսում են, երբ պետք է՝ անհրաժեշտության դեպքում բացելով ձեր առջև աշխարհը։',
  author: 'Էռնեստ Հեմինգուեյ',
  authorImage: hemingwayPhoto,
};

const ReadingQuote = () => {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRandomQuote = async () => {
      try {
        const res = await api.get('/quotes');
        const quotes = res.data;
        if (isMounted) {
          if (Array.isArray(quotes) && quotes.length > 0) {
            // Ամեն անգամ, երբ բեռնվում է էջը, պատահականորեն ընտրում ենք
            // մեկ մեջբերում ամբողջ ցանկից, որ բլոկը միշտ փոխվի
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const picked = quotes[randomIndex];
            // Հեղինակի նկարը պահվում է մեջբերումների վրա, բայց միշտ չէ, որ ընտրված
            // մեջբերումն է այն ունենում (օր.՝ Քամյուի դեպքում). ուստի նկարը վերցնում ենք
            // նույն հեղինակի ցանկացած այլ մեջբերումից, որպեսզի ավատարի փոխարեն նկար երևա
            const key = (picked.author || '').trim().toLowerCase();
            const authorImage = picked.authorImage
              || quotes.find(q => (q.author || '').trim().toLowerCase() === key && q.authorImage)?.authorImage
              || '';
            setQuote({ ...picked, authorImage });
          } else {
            setQuote(fallbackQuote);
          }
        }
      } catch (err) {
        if (isMounted) setQuote(fallbackQuote);
      }
    };

    fetchRandomQuote();
    return () => { isMounted = false; };
  }, []);

  if (!quote) return null;

  return (
    <section
      className="bg-[#E4E8F0] border-b-[5px] border-white px-[8%] py-[50px] box-border max-[700px]:px-[6%] max-[700px]:py-10"
      aria-label="Մեջբերում ընթերցանության մասին"
    >
      <div className="flex flex-col items-center text-center gap-6 max-w-[860px] mx-auto">
        <div className="flex-none">
          {quote.authorImage ? (
            <img
              src={quote.authorImage}
              alt={quote.author}
              className="w-[140px] h-[140px] rounded-full object-cover border-4 border-white shadow-[0_0_0_3px_#14315C] block"
            />
          ) : (
            <div className="w-[140px] h-[140px] rounded-full border-4 border-white shadow-[0_0_0_3px_#14315C] bg-[#14315C] text-white flex items-center justify-center text-[48px]">
              <FiUser />
            </div>
          )}
        </div>
        <div className="relative w-full">
          <span className="font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[64px] leading-[0] text-[#d35400] block mb-1.5">"</span>
          <p className="font-['Playfair_Display','Noto_Serif_Armenian',serif] italic font-semibold text-[22px] text-[#14315C] leading-[1.55] mb-4 max-[700px]:text-[19px]">
            {quote.text}
          </p>
          <span className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[15px] font-semibold text-[#525252] tracking-[0.5px]">— {quote.author}</span>
        </div>
      </div>
    </section>
  );
};

export default ReadingQuote;
