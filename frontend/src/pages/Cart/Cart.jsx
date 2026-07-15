import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import styles from './Cart.module.css';

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
            await api.post('/orders', {
                ...formData,
                cartItems,
                total: totalPrice
            });

            toast.success('Պատվերն հաջողությամբ ուղարկվեց!');
            clearCart();
            setShowForm(false);
        } catch (error) {
            console.error('Սխալ:', error?.response?.data || error.message);
            const serverMsg = error?.response?.data?.message;
            toast.error(serverMsg || 'Ինչ-որ բան սխալ գնաց, փորձեք նորից:');
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
                                        <p className={styles.cartItemAuthor}>{item.author}</p>
                                        <p className={styles.cartItemPrice}>{item.price} ֏</p>
                                    </div>
                                    <div className={styles.cartItemQuantity}>
                                        <button onClick={() => updateQuantity(item._id, -1)} className={styles.qtyBtn}>-</button>
                                        <span className={styles.qtyNumber}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, 1)} className={styles.qtyBtn}>+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item._id)} className={styles.cartItemDeleteBtn}>🗑️</button>
                                </div>
                            ))}
                        </div>
                        <div className={styles.cartSummaryPanel}>
                            <h3>Պատվերի Ամփոփում</h3>
                            <hr className={styles.summaryDivider} />
                            <div className={styles.summaryRow}>
                                <span>Ապրանքներ</span>
                                <span>{cartItems.reduce((count, item) => count + item.quantity, 0)}</span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.totalPriceRow}`}>
                                <span>Ընդհանուր գումար</span>
                                <span className={styles.goldText}>{totalPrice} ֏</span>
                            </div>
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
                        <input name="address" placeholder="Էլ․ հասցե" required onChange={handleInputChange} />
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