import React, { useState, useContext } from "react";
import axios from "axios";
import "./App.css";
import { API_URL } from "./config";
import AdminPanel from "./components/AdminPanel";
import UserView from "./components/UserView";
import Cart from "./components/Cart";
import { CartProvider, CartContext } from "./CartContext";
import Promotion from "./components/Promotion";

function MainContent() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [userName, setUserName] = useState(localStorage.getItem("name"));
  
  const [view, setView] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  
  // 1. SỬA STATE: Thêm trường confirmPassword
  const [authForm, setAuthForm] = useState({ 
      username: "", 
      password: "", 
      confirmPassword: "" // MỚI
  });

  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleAuth = async () => {
    // 2. LOGIC KIỂM TRA MẬT KHẨU (MỚI)
    if (isRegister) {
        if (authForm.password !== authForm.confirmPassword) {
            alert("❌ Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.");
            return; // Dừng lại, không gửi lên server
        }
    }

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    try {
      // Chỉ gửi username và password lên server (bỏ confirmPassword ra)
      const payload = { 
          username: authForm.username, 
          password: authForm.password 
      };
      
      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      
      if (isRegister) {
        alert("✅ Đăng ký thành công!"); 
        setIsRegister(false);
        // Reset form để người dùng đăng nhập
        setAuthForm({ username: "", password: "", confirmPassword: "" });
      } else {
        const { token, role, name } = res.data;
        localStorage.setItem("token", token); localStorage.setItem("role", role); localStorage.setItem("name", name);
        setToken(token); setRole(role); setUserName(name); setShowModal(false);
      }
    } catch (err) { alert(err.response?.data?.message || "Lỗi xác thực"); }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null); setRole(null); setUserName(null); setView("home");
    window.location.reload();
  };

  return (
    <div>
      <header>
        <div className="logo" onClick={() => setView("home")}>TSQ Store</div>

        {view !== "admin" && (
          <div className="search-bar">
            <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <span className="search-icon">🔍</span>
          </div>
        )}

        <div className="nav-menu">
          {view !== "admin" && (
            <>
              <div className="nav-item" onClick={() => setView("promotion")}>🔥 Khuyến Mãi</div>
              <div className="nav-item cart-icon" onClick={() => setView("cart")}>
                🛒 Giỏ Hàng <span className="cart-badge">{cartCount}</span>
              </div>
            </>
          )}

          {token ? (
            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
              <span style={{color:'#bdc3c7'}}>Hi, {userName}</span>
              {role === "admin" && (
                <button className="btn btn-warning" onClick={() => setView(view === "admin" ? "home" : "admin")}>
                  {view === "admin" ? "Trang Chủ" : "Admin"}
                </button>
              )}
              <button className="btn btn-danger" onClick={logout}>Thoát</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Tài Khoản</button>
          )}
        </div>
      </header>

      <main>
        {view === "admin" && role === "admin" ? (
          <AdminPanel token={token} />
        ) : view === "cart" ? (
          <Cart onContinueShopping={() => setView("home")} />
        ) : view === "promotion" ? ( // <--- THÊM ĐOẠN NÀY
          <Promotion onShopNow={() => setView("home")} />
        ) : (
          <UserView searchTerm={searchTerm} />
        )}
      </main>

      {/* MODAL AUTH */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
             <h2>{isRegister ? "Đăng Ký" : "Đăng Nhập"}</h2>
             
             <input 
                type="text" 
                placeholder="Nhập tên đăng nhập" 
                value={authForm.username} 
                onChange={e=>setAuthForm({...authForm, username:e.target.value})}
             />
             
             <input 
                type="password" 
                placeholder="Nhập mật khẩu" 
                value={authForm.password} 
                onChange={e=>setAuthForm({...authForm, password:e.target.value})}
             />

             {/* 3. Ô NHẬP XÁC NHẬN MẬT KHẨU (CHỈ HIỆN KHI ĐĂNG KÝ) */}
             {isRegister && (
                 <input 
                    type="password" 
                    placeholder="Nhập lại mật khẩu..." 
                    value={authForm.confirmPassword} 
                    onChange={e=>setAuthForm({...authForm, confirmPassword:e.target.value})}
                    style={{border: authForm.confirmPassword && authForm.password !== authForm.confirmPassword ? '1px solid red' : '1px solid #ddd'}}
                 />
             )}

             <button className="btn btn-primary" onClick={handleAuth}>Xác Nhận</button>
             
             <p style={{color:'blue', cursor:'pointer'}} onClick={()=>{
                 setIsRegister(!isRegister);
                 setAuthForm({ username: "", password: "", confirmPassword: "" }); // Reset form khi chuyển tab
             }}>
                 {isRegister ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
             </p>
             
             <button className="btn btn-danger" onClick={()=>setShowModal(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}