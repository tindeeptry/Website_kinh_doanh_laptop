import React from "react";
import { API_URL } from "../config";
import { useContext } from "react";
import { CartContext } from "../CartContext";

export default function ProductDetail({ product, onBack }) {
  const { addToCart } = useContext(CartContext);
  if (!product) return null;

  // 1. KIỂM TRA: Có phải là Laptop không?
  // Chuyển loại sản phẩm về chữ thường để so sánh (VD: "Laptop", "laptop", "LAPTOP" đều hiểu)
  const type = product.LoaiSanPham ? product.LoaiSanPham.toLowerCase() : "";
  const isLaptop = type.includes("laptop"); // Nếu tên loại có chữ "laptop" -> True

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <button 
        onClick={onBack} 
        className="btn" 
        style={{ background: "transparent", color: "#555", border: "1px solid #ccc", marginBottom: "20px" }}
      >
        ⬅ Quay lại danh sách
      </button>

      <div className="detail-wrapper">
        {/* --- CỘT TRÁI: ẢNH --- */}
        <div className="detail-image">
          <img
            src={`${API_URL}/img/${product.HinhAnh}`}
            onError={(e) => (e.target.src = "https://via.placeholder.com/500?text=No+Image")}
            alt={product.TenSP}
          />
        </div>

        {/* --- CỘT PHẢI: THÔNG TIN --- */}
        <div className="detail-info">
          <h1 className="detail-title">{product.TenSP}</h1>
          <p className="detail-price">{Number(product.DonGia).toLocaleString()} ₫</p>
          
          <div className="detail-status">
            Loại: <strong style={{textTransform: "capitalize"}}>{product.LoaiSanPham}</strong>
            <span style={{margin: "0 10px"}}>|</span>
            Tình trạng: 
            <span style={{ color: product.SoLuong > 0 ? "green" : "red", fontWeight: "bold", marginLeft: "5px" }}>
              {product.SoLuong > 0 ? "Còn hàng" : "Hết hàng"}
            </span>
          </div>

          <div className="detail-desc">
            
            {/* A. NẾU LÀ LAPTOP -> HIỆN BẢNG CẤU HÌNH */}
            {isLaptop && (
              <div style={{background: "#f8f9fa", padding: "15px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #eee"}}>
                <h4 style={{marginBottom: "10px", color: "#2c3e50"}}>⚙️ Thông số kỹ thuật:</h4>
                <ul style={{paddingLeft: "20px", color: "#444", lineHeight: "1.8"}}>
                    <li><strong>CPU:</strong> {product.CPU || "Đang cập nhật"}</li>
                    <li><strong>RAM:</strong> {product.RAM || "Đang cập nhật"}</li>
                    <li><strong>Ổ cứng:</strong> {product.SSD || "Đang cập nhật"}</li>
                    <li><strong>Màn hình:</strong> {product.ManHinh || "Đang cập nhật"}</li>
                </ul>
              </div>
            )}

            {/* B. MÔ TẢ (Dùng chung cho cả 2) */}
            <h4 style={{color: "#2c3e50"}}>📝 Mô tả chi tiết:</h4>
            <p style={{whiteSpace: "pre-line", color: "#555", lineHeight: "1.6", marginTop: "5px"}}>
              {product.MoTa || "Chưa có mô tả cho sản phẩm này."}
            </p>
          </div>

          {/* NÚT MUA HÀNG */}
          <div className="detail-actions">
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'15px'}}>
                <span>Số lượng:</span>
                <input type="number" min="1" defaultValue="1" style={{width: '60px', padding:'5px', borderRadius:'4px', border:'1px solid #ddd'}} />
            </div>
            <button className="btn btn-primary" style={{ padding: "12px", fontSize: "16px" }} onClick={() => addToCart(product)}>🛒 Thêm Vào Giỏ</button>
          </div>
        </div>
      </div>
    </div>
  );
}