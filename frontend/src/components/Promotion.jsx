import React from "react";

export default function Promotion({ onShopNow }) {
  return (
    <div className="container" style={{ marginTop: "20px" }}>
      
      {/* 1. HERO BANNER: Ảnh bìa lớn */}
      <div className="promo-banner">
        <div className="promo-content">
          <h1>ĐẠI TIỆC CÔNG NGHỆ 🎉</h1>
          <h2>SALE SẬP SÀN - ƯU ĐÃI ĐẾN 50%</h2>
          <p>Áp dụng cho Laptop Gaming và toàn bộ Linh Kiện</p>
          <button className="btn btn-warning" style={{padding: '12px 30px', fontSize: '18px'}} onClick={onShopNow}>
            SĂN DEAL NGAY
          </button>
        </div>
      </div>

      {/* 2. DANH SÁCH KHUYẾN MÃI */}
      <div style={{ margin: "40px 0" }}>
        <h2 className="category-title" style={{borderLeft: '5px solid #e74c3c'}}>🔥 Chương Trình Hot Nhất Tháng</h2>
        
        <div className="promo-grid">
          {/* Card 1 */}
          <div className="promo-card">
            <div className="promo-badge">HOT</div>
            <h3>BACK TO SCHOOL</h3>
            <p className="promo-desc">Giảm ngay <strong>500.000đ</strong> cho Học sinh - Sinh viên khi mua Laptop bất kỳ.</p>
            <div className="promo-code">Mã: <span>STUDENT500</span></div>
            <p className="promo-note">* Cần mang thẻ SV khi nhận máy</p>
          </div>

          {/* Card 2 */}
          <div className="promo-card">
            <div className="promo-badge" style={{background: '#9b59b6'}}>COMBO</div>
            <h3>MUA 1 TẶNG 1</h3>
            <p className="promo-desc">Tặng ngay <strong>Chuột Gaming Zades</strong> trị giá 300k khi mua Laptop trên 20 triệu.</p>
            <div className="promo-code">Mã: <span>GIFT2025</span></div>
            <p className="promo-note">* Số lượng quà tặng có hạn</p>
          </div>          
        </div>
      </div>

      {/* 3. CAM KẾT */}
      <div style={{background: 'white', padding: '30px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
         <h3 style={{color: '#2c3e50'}}>🛡️ Cam Kết Chất Lượng</h3>
         <div style={{display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '20px', flexWrap: 'wrap'}}>
            <div>
                <div style={{fontSize: '30px'}}>✅</div>
                <p>Hàng chính hãng 100%</p>
            </div>
            <div>
                <div style={{fontSize: '30px'}}>🚀</div>
                <p>Giao hàng siêu tốc</p>
            </div>
            <div>
                <div style={{fontSize: '30px'}}>🔧</div>
                <p>Bảo hành tận nơi</p>
            </div>
         </div>
      </div>

    </div>
  );
}