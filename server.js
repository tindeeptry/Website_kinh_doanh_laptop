const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();

// === 1. CẤU HÌNH CORS (QUAN TRỌNG) ===
// Chỉ giữ lại 1 lần khai báo này thôi.
// Cho phép React (port 5173) gọi API và gửi cookie/token.
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
}));

// === 2. MIDDLEWARE CƠ BẢN ===
app.use(express.json());

// Cấu hình thư mục tĩnh để xem ảnh
// Truy cập: http://localhost:3000/img/ten-anh.jpg
app.use('/img', express.static(path.join(__dirname, 'public/img')));
// (Tùy chọn) Serve file tĩnh khác nếu cần
app.use(express.static("public")); 

const JWT_SECRET = "DAY_LA_KHOA_BI_MAT_CUA_BAN_123456";

// === 3. KẾT NỐI DATABASE ===
mongoose.connect("mongodb://127.0.0.1:27017/LAPTOPBUSINESS")
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch(err => console.error("❌ Lỗi MongoDB:", err));

// === 4. CẤU HÌNH UPLOAD ẢNH (MULTER) ===
// Đảm bảo bạn đã tạo thư mục: public/img
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img') 
  },
  filename: function (req, file, cb) {
    // Thêm thời gian vào tên file để tránh trùng lặp
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage });

// === 5. ĐỊNH NGHĨA SCHEMA ===
const models = {
  taikhoan: mongoose.model("User", new mongoose.Schema({ 
    userName: String, 
    passWord: String, 
    role: { type: String, default: 'user' } 
  }), "taikhoan"),
  
  sanpham: mongoose.model("SanPham", new mongoose.Schema({ 
    MaSP: Number, 
    TenSP: String, 
    DonGia: Number, 
    LoaiSanPham: String, 
    SoLuong: Number, 
    HinhAnh: String,
    MoTa: String,      
    CPU: String,      
    RAM: String,       
    SSD: String,       
    ManHinh: String    
  }), "sanpham"),

  nhanvien: mongoose.model("NhanVien", new mongoose.Schema({ 
    MaNV: Number, 
    TenNV: String, 
    NgaySinh: String, 
    SDT: String, 
    Email: String, 
    DiaChi: String, 
    ChucVu: String 
  }), "nhanvien"),

  khachhang: mongoose.model("KhachHang", new mongoose.Schema({ 
    MaKH: Number, 
    TenKhachHang: String, 
    SDT: String, 
    Email: String, 
    DiaChi: String 
  }), "khachhang"),

  nhacungcap: mongoose.model("NhaCungCap", new mongoose.Schema({ 
    MaNCC: Number, 
    TenNCC: String, 
    DiaChi: String, 
    SDT: String, 
    Email: String 
  }), "nhacungcap"),

  hoadon: mongoose.model("HoaDon", new mongoose.Schema({ 
    MaHoaDon: Number, 
    ThoiGianHoaDon: String, 
    MaKH: Number, 
    MaNV: Number 
  }), "hoadon"),

  chitiet_hoadon: mongoose.model("ChiTietHoaDon", new mongoose.Schema({ 
    MaHoaDon: Number, 
    MaSP: Number, 
    SoLuong: Number, 
    DonGia: Number 
  }), "chitiet_hoadon"),
  
  chitiet_cungcap: mongoose.model("ChiTietCungCap", new mongoose.Schema({ 
    MaSP: Number, 
    MaNCC: Number, 
    SoLuong: Number, 
    GiaNhap: Number, 
    NgayNhap: String 
  }), "chitiet_cungcap"),
  
  donhang: mongoose.model("DonHang", new mongoose.Schema({ 
    TenKH: String,
    SDT: String,
    DiaChi: String,
    NgayDat: { type: Date, default: Date.now },
    TrangThai: { type: String, default: "Mới" }, // Mới, Đang giao, Hoàn thành
    TongTien: Number,
    // Lưu danh sách sản phẩm dưới dạng mảng
    ChiTiet: [
      { TenSP: String, SoLuong: Number, DonGia: Number, HinhAnh: String }
    ]
  }), "donhang")
};

//API CHO ĐẶT HÀNG 
app.post("/api/donhang", async (req, res) => {
  try {
    const newOrder = new models.donhang(req.body);
    await newOrder.save();
    res.json(newOrder);
  } catch (e) {
    res.status(500).json(e);
  }
});

// === 6. API UPLOAD ẢNH ===
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Chưa chọn file" });
  // Trả về filename để React lưu vào field HinhAnh trong DB
  res.json({ filename: req.file.filename }); 
});

// === 7. API AUTH ===
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const exist = await models.taikhoan.findOne({ userName: username });
    if (exist) return res.status(400).json({ message: "Tên đã tồn tại" });
    const user = new models.taikhoan({ userName: username, passWord: password, role: 'user' });
    await user.save();
    res.json({ message: "Đăng ký thành công" });
  } catch (e) { res.status(500).json({ message: "Lỗi server" }); }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await models.taikhoan.findOne({ userName: username });
  if (!user || user.passWord !== password) return res.status(401).json({ message: "Sai thông tin" });
  
  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.userName }, 
    JWT_SECRET, 
    { expiresIn: '4h' }
  );
  res.json({ message: "OK", token, role: user.role, name: user.userName });
});

// Middleware kiểm tra Admin
const isAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy token sau chữ Bearer
  
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: "Không phải Admin" });
    next();
  } catch (err) { res.status(401).json({ message: "Token lỗi hoặc hết hạn" }); }
};

// === 8. API CRUD ĐỘNG ===
// Lấy danh sách (Ai cũng xem được)
app.get("/api/:collection", async (req, res) => {
  const model = models[req.params.collection];
  if (!model) return res.status(404).json({ message: "Bảng không tồn tại" });
  try {
      const data = await model.find();
      res.json(data);
  } catch (e) { res.status(500).json(e); }
});

// Thêm mới (Chỉ Admin)
app.post("/api/:collection", isAdmin, async (req, res) => {
  const model = models[req.params.collection];
  if (!model) return res.status(404).json({ message: "Bảng không tồn tại" });
  try { 
      const newItem = new model(req.body); 
      await newItem.save(); 
      res.json(newItem); 
  } catch (e) { res.status(500).json(e); }
});

// Xóa (Chỉ Admin)
app.delete("/api/:collection/:id", isAdmin, async (req, res) => {
  const model = models[req.params.collection];
  if (!model) return res.status(404).json({ message: "Bảng không tồn tại" });
  try { 
      await model.findByIdAndDelete(req.params.id); 
      res.json({msg:"OK"}); 
  } catch (e) { res.status(500).json(e); }
});

// chỉnh sửa (Chỉ Admin)
app.put("/api/:collection/:id", isAdmin, async (req, res) => {
  const model = models[req.params.collection];
  if (!model) return res.status(404).json({ message: "Bảng không tồn tại" });
  try {
    // Tìm và cập nhật theo ID, {new: true} để trả về dữ liệu mới sau khi sửa
    const updatedItem = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (e) {
    res.status(500).json(e);
  }
});
// Chạy Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🌐 Server Backend chạy tại http://localhost:${PORT}`));