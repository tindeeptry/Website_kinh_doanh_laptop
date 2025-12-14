import React, { useContext, useState } from "react";
import axios from "axios";
import { CartContext } from "../CartContext";
import { API_URL } from "../config";

export default function Cart({ onContinueShopping }) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  
  // State form thông tin giao hàng
  const [customer, setCustomer] = useState({
    name: localStorage.getItem("name") || "", // Tự điền nếu đã đăng nhập
    phone: "",
    address: ""
  });

  const totalAmount = cart.reduce((sum, item) => sum + item.DonGia * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Giỏ hàng trống!");
    if (!customer.name || !customer.phone || !customer.address) {
      return alert("Vui lòng điền đầy đủ thông tin giao hàng!");
    }

    // Chuẩn bị dữ liệu gửi lên Server
    const orderData = {
      TenKH: customer.name,
      SDT: customer.phone,
      DiaChi: customer.address,
      TongTien: totalAmount,
      TrangThai: "Mới", // Mặc định là đơn mới
      ChiTiet: cart.map(item => ({
        TenSP: item.TenSP,
        SoLuong: item.quantity,
        DonGia: item.DonGia,
        HinhAnh: item.HinhAnh
      }))
    };

    try {
      // Gọi API tạo đơn hàng (Dùng chung API thêm mới của Admin)
      await axios.post(`${API_URL}/api/donhang`, orderData);
      
      alert("🎉 Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.");
      clearCart(); // Xóa sạch giỏ hàng
      onContinueShopping(); // Quay về trang chủ
    } catch (err) {
      alert("Lỗi đặt hàng: " + err.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2 style={{ color: '#7f8c8d' }}>Giỏ hàng đang trống 🛒</h2>
        <button className="btn btn-primary" onClick={onContinueShopping} style={{ marginTop: '20px' }}>
           Quay lại mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "20px", display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
      
      {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
      <div style={{ flex: 2, minWidth: '300px' }}>
        <h2 style={{ borderBottom: '2px solid #3498db', display: 'inline-block', marginBottom: '20px' }}>Giỏ Hàng</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Sản Phẩm</th>
                <th>Giá</th>
                <th>SL</th>
                <th>Tổng</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={`${API_URL}/img/${item.HinhAnh}`} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                    <span style={{fontSize:'14px'}}>{item.TenSP}</span>
                  </td>
                  <td>{Number(item.DonGia).toLocaleString()}</td>
                  <td>
                    <div style={{display:'flex', gap:'5px'}}>
                        <button className="btn" style={{padding:'0 5px', background:'#eee'}} onClick={() => updateQuantity(item._id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button className="btn" style={{padding:'0 5px', background:'#eee'}} onClick={() => updateQuantity(item._id, 1)}>+</button>
                    </div>
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
                    {Number(item.DonGia * item.quantity).toLocaleString()}
                  </td>
                  <td>
                    <button className="btn btn-danger" onClick={() => removeFromCart(item._id)} style={{ padding: '2px 8px', fontSize:'12px' }}>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '20px', fontWeight: 'bold' }}>
           Tổng tiền: <span style={{ color: '#e74c3c' }}>{totalAmount.toLocaleString()} ₫</span>
        </div>
      </div>

      {/* CỘT PHẢI: THÔNG TIN GIAO HÀNG */}
      <div style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: 'fit-content' }}>
        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Thông Tin Giao Hàng</h3>
        
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{fontWeight:'bold', fontSize:'13px'}}>Họ và tên:</label>
          <input 
            type="text" 
            className="form-input" 
            style={{width:'100%', padding:'10px', marginTop:'5px', border:'1px solid #ddd', borderRadius:'4px'}}
            placeholder="Nhập họ tên..."
            value={customer.name}
            onChange={e => setCustomer({...customer, name: e.target.value})}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{fontWeight:'bold', fontSize:'13px'}}>Số điện thoại:</label>
          <input 
            type="text" 
            className="form-input" 
            style={{width:'100%', padding:'10px', marginTop:'5px', border:'1px solid #ddd', borderRadius:'4px'}}
            placeholder="Nhập số điện thoại..."
            value={customer.phone}
            onChange={e => setCustomer({...customer, phone: e.target.value})}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{fontWeight:'bold', fontSize:'13px'}}>Địa chỉ nhận hàng:</label>
          <textarea 
            rows="3"
            style={{width:'100%', padding:'10px', marginTop:'5px', border:'1px solid #ddd', borderRadius:'4px'}}
            placeholder="Số nhà, đường, phường, xã..."
            value={customer.address}
            onChange={e => setCustomer({...customer, address: e.target.value})}
          ></textarea>
        </div>

        <button 
            className="btn btn-danger" 
            style={{ width: '100%', padding: '15px', fontSize: '18px', fontWeight: 'bold' }}
            onClick={handleCheckout}
        >
            ĐẶT HÀNG NGAY ({totalAmount.toLocaleString()} ₫)
        </button>
        
        <p style={{textAlign:'center', marginTop:'10px', fontSize:'13px', color:'#777'}}>
            Thanh toán tiền mặt khi nhận hàng (COD)
        </p>
      </div>

    </div>
  );
}