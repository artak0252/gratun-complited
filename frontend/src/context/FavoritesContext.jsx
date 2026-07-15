import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
          const [favorites, setFavorites] = useState(() => {
                    const localData = localStorage.getItem('favorites');
                    return localData ? JSON.parse(localData) : [];
          });

          useEffect(() => {
                    localStorage.setItem('favorites', JSON.stringify(favorites));
          }, [favorites]);

          const isFavorite = useCallback(
                    (bookId) => favorites.some((item) => item._id === bookId),
                    [favorites]
          );

          const toggleFavorite = useCallback((book) => {
                    setFavorites((prevItems) => {
                              const exists = prevItems.find((item) => item._id === book._id);
                              if (exists) {
                                        return prevItems.filter((item) => item._id !== book._id);
                              }
                              return [...prevItems, book];
                    });
          }, []);

          const removeFavorite = useCallback((bookId) => {
                    setFavorites((prevItems) => prevItems.filter((item) => item._id !== bookId));
          }, []);

          // Value-ն memoize ենք անում, որպեսզի favorites-ը չփոխվելու դեպքում
          // Context-ից կախված component-ները ավելորդ re-render չկրեն
          const value = useMemo(
                    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite }),
                    [favorites, isFavorite, toggleFavorite, removeFavorite]
          );

          return (
                    <FavoritesContext.Provider value={value}>
                              {children}
                    </FavoritesContext.Provider>
          );
};