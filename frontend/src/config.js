// src/config.js
export const API_URL = "http://localhost:3000";

export const DB_CONFIG = {
  sanpham: {
    label: "Sản Phẩm",
    cols: [
      { key: "MaSP", type: "number" },
      { key: "TenSP", type: "text" },
      { key: "DonGia", type: "number" },
      { key: "LoaiSanPham", type: "text" },
      { key: "SoLuong", type: "number" },
      { key: "HinhAnh", type: "file" },
      { key: "CPU", type: "text" },
      { key: "RAM", type: "text" },
      { key: "SSD", type: "text" },
      { key: "ManHinh", type: "text" },
      { key: "MoTa", type: "textarea" },
    ],
  },

  nhanvien: {
    label: "Nhân Viên",
    cols: [
      { key: "MaNV", type: "number" },
      { key: "TenNV", type: "text" },
      { key: "SDT", type: "text" },
      { key: "Email", type: "text" },
      { key: "ChucVu", type: "text" },
    ],
  },

  khachhang: {
    label: "Khách Hàng",
    cols: [
      { key: "MaKH", type: "number" },
      { key: "TenKhachHang", type: "text" },
      { key: "SDT", type: "text" },
      { key: "Email", type: "text" },
      { key: "DiaChi", type: "text" },
    ],
  },

  nhacungcap: {
    label: "Nhà Cung Cấp",
    cols: [
      { key: "MaNCC", type: "number" },
      { key: "TenNCC", type: "text" },
      { key: "SDT", type: "text" },
      { key: "DiaChi", type: "text" },
    ],
  },

  hoadon: {
    label: "Hóa Đơn",
    cols: [
      { key: "MaHoaDon", type: "number" },
      { key: "ThoiGianHoaDon", type: "datetime-local" }, 
      { key: "MaKH", type: "number" },
      { key: "MaNV", type: "number" },
    ]
  },

  chitiet_hoadon: {
    label: "Chi Tiết Hóa Đơn",
    cols: [
      { key: "MaHoaDon", type: "number" },
      { key: "MaSP", type: "number" },
      { key: "SoLuong", type: "number" },
      { key: "DonGia", type: "number" },
    ]
  },

  chitiet_cungcap: {
    label: "Chi Tiết Cung Cấp",
    cols: [
      { key: "MaSP", type: "number" },
      { key: "MaNCC", type: "number" },
      { key: "SoLuong", type: "number" },
      { key: "GiaNhap", type: "number" },
      { key: "NgayNhap", type: "date" }, // Dùng input chọn ngày
    ]
  },
  
  taikhoan: {
    label: "Tài Khoản Hệ Thống",
    cols: [
      { key: "userName", type: "text" },
      { key: "passWord", type: "text" }, // Lưu ý: thực tế nên ẩn password
      { key: "role", type: "text" },
    ],
  },

  donhang: {
    label: "Quản Lý Đơn Hàng",
    cols: [
      { key: "TenKH", type: "text" },
      { key: "SDT", type: "text" },
      { key: "DiaChi", type: "text" },
      { key: "TongTien", type: "number" },
      { key: "TrangThai", type: "text" },
      { key: "NgayDat", type: "text" }, // Admin chỉ cần xem ngày
    ],
  },
};