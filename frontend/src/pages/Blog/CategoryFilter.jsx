import React from 'react';
import styles from './CategoryFilter.module.css';

console.log("Styles object:", styles);

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory, className }) => {
          return (
                    <div className={`${styles.categoryFilterContainer} ${className || ''}`}>
                              {categories.map(cat => (
                                        <div key={cat.id} className={styles.categoryItem}>
                                                  {/* Հիմնական կատեգորիայի կոճակ */}
                                                  <button
                                                            className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.activeCategoryBtn : ''}`}
                                                            onClick={() => onSelectCategory(cat.id)}
                                                  >
                                                            {cat.label}
                                                  </button>

                                                  {/* Ենթակատեգորիաների ցուցադրում */}
                                                  {cat.subCategories && (
                                                            <div className={styles.subCategoryGroup}>
                                                                      {cat.subCategories.map(sub => (
                                                                                <button
                                                                                          key={sub.id}
                                                                                          className={`${styles.subCategoryBtn} ${selectedCategory === sub.id ? styles.activeCategoryBtn : ''}`}
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