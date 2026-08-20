import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../../context/FavoritesContext';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { bookGenres } from '../Shop/genreConstants';
import { FiHeart } from 'react-icons/fi';

const Favorites = () => {
  const { favorites, removeFavorite } = useContext(FavoritesContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (book) => {
    addToCart(book);
    toast.success(`${book.title} գիրքը ավելացվեց զամբյուղի մեջ!`, { icon: '🛒', duration: 2000 });
  };

  const handleRemove = (book) => {
    removeFavorite(book._id);
    toast.success(`${book.title} հեռացվեց հավանածներից`, { icon: '💔', duration: 2000 });
  };

  if (favorites.length === 0) {
    return (
      <div className="px-[10%] py-20 bg-[#14315C] text-white min-h-screen text-center flex flex-col items-center justify-center">
        <h2 className="font-['Playfair_Display','Noto_Serif_Armenian',serif] text-white mb-2.5">Հավանած գրքեր դեռ չկան</h2>
        <p className="text-white mb-[25px]">Խանութում գրքի նկարի սրտիկին սեղմիր, որ այն հայտնվի այստեղ։</p>
        <Link to="/shop" className="bg-[#14315C] text-white px-7 py-3.5 rounded-xl font-semibold no-underline transition-[0.3s] hover:bg-[#14315C]">
          Անցնել խանութ
        </Link>
      </div>
    );
  }

  return (
    <div className="px-[10%] py-20 bg-[#14315C] text-white min-h-screen">
      <h2 className="font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[32px] text-white mb-10">Հավանած Գրքերը</h2>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-10">
        {favorites.map(book => (
          <div key={book._id} className="bg-white p-5 rounded-3xl transition-all duration-500 border border-[#f1f5f9] text-left flex flex-col hover:-translate-y-[15px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
            <div className="relative">
              <img
                src={book.image.startsWith('http') ? book.image : `https://ik.imagekit.io/hmtd5pr9d/${book.image}`}
                alt={book.title}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
                className="w-full h-[350px] object-contain bg-[#f1f5f9] rounded-2xl mb-5 p-3 box-border"
              />
              <button
                className="absolute top-2.5 right-2.5 w-[38px] h-[38px] rounded-full border-none bg-[rgba(255,255,255,0.9)] text-[#e74c3c] text-lg flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[0.2s] hover:scale-110"
                onClick={() => handleRemove(book)}
                aria-label="Հեռացնել հավանածներից"
              >
                <FiHeart />
              </button>
            </div>
            <h3 className="font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[22px] my-0 mb-[5px]">{book.title}</h3>
            <p className="text-[#718096] mb-[15px]">{book.author}</p>
            <span className="block self-start text-[18px] font-bold text-[#8e44ad] bg-[#f3e8f8] px-2.5 py-1 rounded-full mb-[15px]">
              {bookGenres.find(g => g.id === book.genre)?.label || book.genre}
            </span>
            <span className="font-bold text-lg text-[#8e44ad] block mb-[15px]">{book.price} ֏</span>
            <div className="flex gap-2.5 mt-auto">
              <Link to={`/shop/${book._id}`} className="flex-none bg-white text-[#1a1a1a] border border-[#1a1a1a] px-[18px] py-3.5 rounded-xl font-semibold cursor-pointer transition-[0.3s] no-underline text-center whitespace-nowrap hover:bg-[#1a1a1a] hover:text-white">
                Դիտել
              </Link>
              <button
                className="bg-[#1a1a1a] text-white border-none p-3.5 rounded-xl font-semibold cursor-pointer transition-[0.3s] flex-1 hover:bg-[#8e44ad]"
                onClick={() => handleAddToCart(book)}
              >
                Ավելացնել զամբյուղ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
