import React, { useState } from 'react';

// Միասնական գրքի շապիկի շրջանակ ամբողջ կայքի համար։
// - Շրջանակը միշտ նույն համամասնությամբ է (2:3), ուստի բոլոր քարտերը միանման են երևում։
// - Եթե նկարը սովորական հարթ շապիկ է (համամասնությունը մոտ է 2:3-ին), լցնում է ամբողջ շրջանակը։
// - Եթե նկարը թեք մոկապ է կամ քառակուսի/լայն է, ամբողջությամբ տեղավորվում է շրջանակի մեջ
//   (object-contain), իսկ սպիտակ ֆոնը «հալվում է» շրջանակի գույնի մեջ (mix-blend-multiply),
//   որ սպիտակ քառակուսի չերևա։
const COVER_RATIO_MIN = 0.58;
const COVER_RATIO_MAX = 0.78;

const BookCover = ({
  src,
  alt = '',
  className = '',
  bg = 'bg-[#f1f5f9]',
  rounded = 'rounded-2xl',
  loading = 'lazy',
  onError,
  children,
}) => {
  const [flat, setFlat] = useState(false);

  const handleLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (w && h) {
      const ratio = w / h;
      setFlat(ratio >= COVER_RATIO_MIN && ratio <= COVER_RATIO_MAX);
    }
  };

  const handleError = onError || ((e) => { e.currentTarget.style.display = 'none'; });

  return (
    <div className={`relative isolate aspect-[2/3] overflow-hidden box-border ${bg} ${rounded} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`block w-full h-full ${flat ? 'object-cover object-top' : 'object-contain p-[6%] mix-blend-multiply'}`}
      />
      {children}
    </div>
  );
};

export default BookCover;
