import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiClock, FiStar, FiSearch, FiSmile, FiFeather, FiHeart } from 'react-icons/fi';

const genres = [
  { id: 'fiction', label: 'Գեղարվեստական', icon: <FiBookOpen /> },
  { id: 'history', label: 'Պատմական', icon: <FiClock /> },
  { id: 'fantasy', label: 'Ֆանտաստիկա', icon: <FiStar /> },
  { id: 'detective', label: 'Դետեկտիվ', icon: <FiSearch /> },
  { id: 'children', label: 'Մանկական', icon: <FiSmile /> },
  { id: 'poetry', label: 'Պոեզիա', icon: <FiFeather /> },
  { id: 'psychology', label: 'Հոգեբանական', icon: <FiHeart /> },
];

const GenreShowcase = () => {
  return (
    <section className="w-full bg-[#E4E8F0] pt-[45px] pb-10 box-border border-b-[5px] border-white max-[500px]:pt-[35px] max-[500px]:pb-[30px]">
      <h2 className="text-center block w-full font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[1.7rem] text-[#6B3245] mb-[22px] font-bold">
        Ընտրիր ըստ ժանրի
      </h2>
      <div className="flex flex-wrap justify-center gap-3.5">
        {genres.map((g) => (
          <Link
            to={`/shop?genre=${g.id}`}
            className="flex flex-col items-center justify-center gap-2.5 px-[15px] py-[25px] min-h-[100px] flex-[0_1_130px] bg-white border border-[#DCD5C8] rounded-[14px] no-underline text-[#3A322C] transition-all duration-[250ms] hover:bg-[#6B3245] hover:border-[#6B3245] hover:text-white hover:-translate-y-1 max-[500px]:flex-[0_1_100px]"
            key={g.id}
          >
            <div className="text-[1.4rem] text-[#14315C]">{g.icon}</div>
            <span className="font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[0.85rem] font-semibold">{g.label}</span>
          </Link>
        ))}
      </div>
      <Link
        to="/shop"
        className="block w-fit mx-auto mt-6 font-[Noto_Sans_Armenian,Poppins,sans-serif] font-semibold text-base text-[#6B3245] no-underline border-b-2 border-[#14315C] pb-[3px] transition-colors duration-200 text-center hover:text-[#14315C]"
      >
        Տեսնել բոլոր գրքերը →
      </Link>
    </section>
  );
};

export default GenreShowcase;
