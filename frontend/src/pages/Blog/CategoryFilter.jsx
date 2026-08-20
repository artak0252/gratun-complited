import React from 'react';

const categoryFilterContainer = "my-10 mx-auto max-w-[900px] flex flex-wrap justify-center gap-5 p-5 max-[480px]:my-5 max-[480px]:gap-2.5 max-[480px]:p-2.5";
const categoryItem = "flex flex-col items-center gap-2.5";
const categoryBtn = "bg-white border border-[#e2e8f0] px-5 py-2.5 rounded-full font-medium text-[#4a5568] cursor-pointer transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:bg-[#8e44ad] hover:text-white hover:border-[#8e44ad] max-[480px]:px-4 max-[480px]:py-2 max-[480px]:text-sm";
const categoryBtnActive = "!bg-[#8e44ad] !text-white !border-[#8e44ad]";
const subCategoryGroup = "flex gap-2 pt-1.5";
const subCategoryBtn = "bg-[#f1f5f9] border-none px-3 py-1.5 rounded-full text-xs text-[#64748b] cursor-pointer transition-all duration-300 hover:bg-[#e2e8f0] hover:text-[#1a1a1a] max-[480px]:px-2.5 max-[480px]:py-1 max-[480px]:text-[11px]";
const subCategoryBtnActive = "!bg-[#1a1a1a] !text-white";

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory, className }) => {
  return (
    <div className={`${categoryFilterContainer} ${className || ''}`}>
      {categories.map(cat => (
        <div key={cat.id} className={categoryItem}>
          {/* Հիմնական կատեգորիայի կոճակ */}
          <button
            className={`${categoryBtn} ${selectedCategory === cat.id ? categoryBtnActive : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.label}
          </button>

          {/* Ենթակատեգորիաների ցուցադրում */}
          {cat.subCategories && (
            <div className={subCategoryGroup}>
              {cat.subCategories.map(sub => (
                <button
                  key={sub.id}
                  className={`${subCategoryBtn} ${selectedCategory === sub.id ? subCategoryBtnActive : ''}`}
                  onClick={() => onSelectCategory(sub.id)}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter;
