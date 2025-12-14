import React, { createContext, useState, useEffect } from "react";

// Tạo chiếc "xe đẩy" ảo
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Lấy dữ liệu từ LocalStorage nếu có, không thì là mảng rỗng
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Mỗi khi giỏ hàng thay đổi, lưu ngay vào LocalStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // HÀM 1: Thêm vào giỏ
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Kiểm tra xem món này đã có trong giỏ chưa
      const existingItem = prevCart.find((item) => item._id === product._id);
      
      if (existingItem) {
        // Nếu có rồi -> Tăng số lượng lên 1
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Nếu chưa có -> Thêm mới vào và set số lượng là 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    alert(`Đã thêm "${product.TenSP}" vào giỏ!`);
  };

  // HÀM 2: Xóa khỏi giỏ
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // HÀM 3: Tăng/Giảm số lượng
  const updateQuantity = (productId, amount) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item._id === productId) {
          const newQuantity = item.quantity + amount;
          // Không cho giảm xuống dưới 1
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      });
    });
  };

  // HÀM 4: Xóa sạch giỏ (sau khi thanh toán xong)
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};