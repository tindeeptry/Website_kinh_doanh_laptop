import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import ProductDetail from "./ProductDetail";
import { useContext } from "react"; 
import { CartContext } from "../CartContext";

export default function UserView({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const { addToCart } = useContext(CartContext);
  // STATE MỚI: Lưu sản phẩm đang được xem chi tiết (Mặc định là null)
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/sanpham`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // --- NẾU ĐANG CÓ SẢN PHẨM ĐƯỢC CHỌN -> HIỆN TRANG CHI TIẾT ---
  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)} // Truyền hàm quay lại để set về null
      />
    );
  }

  // --- CÒN KHÔNG THÌ HIỆN DANH SÁCH NHƯ CŨ ---
  
  // Logic lọc sản phẩm (giữ nguyên)
  const filteredProducts = products.filter(p => 
    p.TenSP.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const laptopMoi = filteredProducts.filter(p => p.LoaiSanPham === "Laptop" || p.LoaiSanPham === "Laptop Mới");
  const laptopCu = filteredProducts.filter(p => p.LoaiSanPham === "Laptop cũ" || p.LoaiSanPham === "Laptop 2nd");
  const linhKien = filteredProducts.filter(p => p.LoaiSanPham === "Linh kiện" || p.LoaiSanPham === "Phụ kiện");

  const ProductSection = ({ title, list }) => (
    <div className="category-section">
      <h2 className="category-title">{title}</h2>
      {list.length > 0 ? (
        <div className="product-grid">
          {list.map((p) => (
            <div key={p._id} className="product-card">
              <img
                src={`${API_URL}/img/${p.HinhAnh}`}
                onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
                alt={p.TenSP}
                // Bấm vào ảnh cũng xem chi tiết
                onClick={() => setSelectedProduct(p)} 
                style={{cursor: 'pointer'}}
              />
              <h3>{p.TenSP}</h3>
              <p style={{ color: "#e74c3c", fontWeight: "bold", fontSize: "1.1rem" }}>
                {Number(p.DonGia).toLocaleString()} ₫
              </p>
              <div style={{marginTop: 'auto', display: 'flex', gap: '5px', justifyContent: 'center'}}>
                 {/* Bấm nút Chi Tiết -> Lưu sản phẩm vào state selectedProduct */}
                 <button 
                    className="btn btn-primary" 
                    style={{padding: '5px 10px', fontSize: '12px'}}
                    onClick={() => setSelectedProduct(p)} 
                 >
                    Chi Tiết
                 </button>
                 <button className="btn btn-warning" style={{padding: '5px 10px', fontSize: '12px'}} onClick={() => addToCart(p)}>+ Giỏ</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-alert">Chưa có sản phẩm nào.</p>
      )}
    </div>
  );

  return (
    <div>
      {/* THANH MENU */}
      <div className="product-nav">
        <ul className="nav-list">
          <li className={`nav-item-product ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>Tất Cả</li>
          <li className={`nav-item-product ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>Laptop Mới</li>
          <li className={`nav-item-product ${activeTab === 'old' ? 'active' : ''}`} onClick={() => setActiveTab('old')}>Laptop Cũ</li>
          <li className={`nav-item-product ${activeTab === 'part' ? 'active' : ''}`} onClick={() => setActiveTab('part')}>Linh Kiện</li>
        </ul>
      </div>

      <div className="container">
        {(activeTab === 'all' || activeTab === 'new') && <ProductSection title="💻 Laptop Mới Chính Hãng" list={laptopMoi} />}
        {(activeTab === 'all' || activeTab === 'old') && <ProductSection title="♻️ Laptop Cũ Giá Rẻ" list={laptopCu} />}
        {(activeTab === 'all' || activeTab === 'part') && <ProductSection title="🖱️ Linh Kiện & Phụ Kiện" list={linhKien} />}
        
        {filteredProducts.length === 0 && (
           <div style={{textAlign: 'center', marginTop: '50px', color: '#777'}}>
              <h3>Không tìm thấy sản phẩm "{searchTerm}" 🤔</h3>
           </div>
        )}
      </div>
    </div>
  );
}