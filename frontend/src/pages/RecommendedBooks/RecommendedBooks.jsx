import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { EXCLUDED_FROM_RECOMMENDED } from '../Shop/genreConstants';


const RECOMMENDED_COUNT = 5;

const RecommendedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get('/api/books')
      .then(res => {
        // Հին հրատարակությունների ժանրի գրքերը երբեք չպետք է
        // հայտնվեն այս բաժնում, նույնիսկ եթե ամենավերջին ավելացվածներից են
        const eligibleBooks = res.data.filter(
          book => !EXCLUDED_FROM_RECOMMENDED.includes(book.genre)
        );
        const sorted = [...eligibleBooks].sort((a, b) => (a._id < b._id ? 1 : -1));
        setBooks(sorted.slice(0, RECOMMENDED_COUNT));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (book) => {
    addToCart(book);
    toast.success(`${book.title} գիրքը ավելացվեց զամբյուղի մեջ!`, { icon: '🛒', duration: 2000 });
  };

  // Եթե դեռ բեռնվում է կամ գրքեր չկան, բաժինը ընդհանրապես չի ցուցադրվում
  if (loading || books.length === 0) return null;

  return (
    <section className="w-full bg-[#E4E8F0] px-6 py-8 box-border border-b-[5px] border-white max-lg:py-7 max-[480px]:px-4 max-[480px]:py-6">
      <div className="max-w-[1300px] mx-auto flex flex-col items-center gap-6">
        <div className="text-center max-w-[620px]">
          <h2 className="font-[Georgia,'Noto_Serif_Armenian','Times_New_Roman',serif] text-[28px] font-bold text-[#6B3245] mb-2 leading-[1.2] [text-shadow:0_3px_8px_rgba(107,50,69,0.18)] max-md:text-2xl max-[480px]:text-xl">
            Առաջարկվող գրքեր
          </h2>
          <p className="text-[15px] text-[#14315C] opacity-80 mb-2 leading-[1.4] [text-shadow:0_1px_3px_rgba(58,50,44,0.1)]">
            Մեր վերջին գրքերն այս ցանկում
          </p>
          <p className="text-[13px] text-[#14315C] opacity-75 leading-[1.5] m-0">
            Հատուկ ընտրված գրքեր՝ դասական և ժամանակակից հեղինակներից,
            որոնք արժանի են Ձեր գրադարանում իրենց տեղն ունենալուն։ Նոր գրքերն ավելացվում են
            պարբերաբար, այցելեք հաճախ😊
          </p>
        </div>

        <div className="flex-none grid grid-cols-[repeat(5,minmax(0,200px))] justify-center gap-[18px] w-full max-lg:grid-cols-[repeat(5,minmax(0,150px))] max-lg:gap-3 max-md:flex max-md:flex-nowrap max-md:overflow-x-auto max-md:justify-start max-md:gap-3 max-md:pb-2 max-md:[-webkit-overflow-scrolling:touch]">
          {books.map(book => (
            <div
              key={book._id}
              className="relative bg-white border border-[rgba(220,213,200,0.5)] rounded-[10px] p-2.5 overflow-hidden flex flex-col items-center text-center shadow-[0_6px_14px_rgba(58,50,44,0.1)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1 hover:shadow-[0_12px_22px_rgba(58,50,44,0.16)] max-md:flex-[0_0_130px] max-[480px]:flex-[0_0_115px] max-[480px]:p-2"
            >
              <div className="w-full aspect-[3/4] overflow-hidden rounded-md mb-2 bg-[#E4E8F0]">
                <img
                  src={book.image.startsWith('http') ? book.image : `https://ik.imagekit.io/hmtd5pr9d/${book.image}`}
                  alt={book.title}
                  onError={(e) => { e.target.style.display = 'none'; }}
                  className="w-full h-full object-cover object-[center_top] block"
                />
              </div>
              <h3 className="font-[Georgia,'Noto_Serif_Armenian','Times_New_Roman',serif] text-[13px] font-bold text-[#14315C] my-[2px] leading-[1.3] max-[480px]:text-xs">
                {book.title}
              </h3>
              <p className="text-[11px] italic text-[#14315C] opacity-70 mb-1.5">{book.author}</p>
              <span className="inline-block text-xs font-bold text-[#6B3245] bg-[rgba(107,50,69,0.08)] px-2.5 py-0.5 rounded-full mb-2">
                {book.price} ֏
              </span>
              <button
                className="w-full bg-[#14315C] text-white border-none rounded-md px-2.5 py-[7px] text-xs font-semibold cursor-pointer transition-[background-color,transform] duration-200 hover:bg-[#6B3245] hover:text-white active:scale-[0.97]"
                onClick={() => handleAddToCart(book)}
              >
                Ավելացնել զամբյուղ
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedBooks;
