import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import styles from './Cart.module.css';

const API_BASE_URL = 'https://gratun-backend.onrender.com';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    cartItems
                }),
            });

            if (response.ok) {
                toast.success('Պատվերն հաջողությամբ ուղարկվեց!');
                clearCart();
                setShowForm(false);
            } else {
                toast.error('Ինչ-որ բան սխալ գնաց, փորձեք նորից:');
            }
        } catch (error) {
            console.error('Սխալ:', error);
            toast.error('Սերվերը հասանելի չէ:');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className={`${styles.cartContainer} ${styles.emptyCart}`}>
                <h2>Ձեր զամբյուղը դատարկ է</h2>
                <p>Վերադարձեք խանութ՝ գրքեր ավելացնելու համար:</p>
            </div>
        );
    }

    return (
        <div className={styles.cartContainer}>
            {!showForm ? (
                <>
                    <h2 className={styles.cartPageTitle}>Ձեր Զամբյուղը</h2>
                    <div className={styles.cartContent}>
                        <div className={styles.cartItemsList}>
                            {cartItems.map((item) => (
                                <div key={item._id} className={styles.cartItemCard}>
                                    <img src={item.image} alt={item.title} className={styles.cartItemImage} />
                                    <div className={styles.cartItemDetails}>
                                        <h3>{item.title}</h3>
                                        <p>{item.author}</p>
                                        <p>{item.price} ֏</p>
                                    </div>
                                    <div className={styles.cartItemQuantity}>
                                        <button onClick={() => updateQuantity(item._id, -1)} className={styles.qtyBtn}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, 1)} className={styles.qtyBtn}>+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item._id)} className={styles.cartItemDeleteBtn}>🗑️</button>
                                </div>
                            ))}
                        </div>
                        <div className={styles.cartSummaryPanel}>
                            <h3>Պատվերի Ամփոփում</h3>
                            <p>Ընդհանուր գումար՝ <strong>{totalPrice} ֏</strong></p>
                            <button onClick={() => setShowForm(true)} className={styles.checkoutBtn}>Ձևակերպել Պատվեր</button>
                            <button onClick={clearCart} className={styles.clearCartBtn}>Դատարկել</button>
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.orderFormContainer}>
                    <h3>Լրացրեք Ձեր տվյալները</h3>
                    <form onSubmit={submitOrder}>
                        <input name="name" placeholder="Անուն, Ազգանուն" required onChange={handleInputChange} />
                        <input name="phone" placeholder="Հեռախոսահամար" required onChange={handleInputChange} />
                        <input name="address" placeholder="Հասցե" required onChange={handleInputChange} />
                        <button type="submit" className={styles.checkoutBtn} disabled={isSubmitting}>
                            {isSubmitting ? 'Ուղարկվում է...' : 'Հաստատել Պատվերը'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className={styles.clearCartBtn}>Հետ</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Cart;