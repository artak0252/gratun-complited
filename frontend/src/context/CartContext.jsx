import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

// Ստեղծում ենք Context-ը
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Սկզբնական վիճակը վերցնում ենք LocalStorage-ից, եթե կա
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('cart');
        return localData ? JSON.parse(localData) : [];
    });

    // Ամեն անգամ, երբ զամբյուղը փոխվում է, պահպանում ենք LocalStorage-ում
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // 1. Ավելացնել զամբյուղում
    const addToCart = useCallback((book) => {
        setCartItems((prevItems) => {
            // Ստուգում ենք՝ արդյոք գիրքն արդեն կա զամբյուղում
            const isBookInCart = prevItems.find((item) => item._id === book._id);

            if (isBookInCart) {
                // Եթե կա, մեծացնում ենք քանակը 1-ով
                return prevItems.map((item) =>
                    item._id === book._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // Եթե չկա, ավելացնում ենք նոր գիրք՝ quantity: 1-ով
            return [...prevItems, { ...book, quantity: 1 }];
        });
    }, []);

    // 2. Հեռացնել զամբյուղից
    const removeFromCart = useCallback((bookId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== bookId));
    }, []);

    // 3. Փոխել քանակը (+1 կամ -1)
    const updateQuantity = useCallback((bookId, amount) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item._id === bookId) {
                    const newQuantity = item.quantity + amount;
                    // Եթե քանակը դառնում է 0-ից քիչ, հեռացնում ենք
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                }
                return item;
            }).filter((item) => item.quantity > 0) // Ապահովության համար
        );
    }, []);

    // 4. Մաքրել զամբյուղը
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    // Value-ն memoize ենք անում, որպեսզի cartItems-ը չփոխվելու դեպքում
    // Context-ից կախված բոլոր component-ները ավելորդ re-render չկրեն
    const value = useMemo(
        () => ({ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }),
        [cartItems, addToCart, removeFromCart, updateQuantity, clearCart]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};