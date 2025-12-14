import React, { useState, useEffect } from "react";
import axios from "axios";
import { DB_CONFIG, API_URL } from "../config";

export default function AdminPanel({ token }) {
  const [activeTab, setActiveTab] = useState("sanpham");
  const [data, setData] = useState([]);
  
  // State Form
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE MỚI: ĐỂ XEM CHI TIẾT ĐƠN HÀNG ---
  const [selectedOrder, setSelectedOrder] = useState(null); 

  useEffect(() => {
    fetchData();
    resetForm();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sắp xếp dữ liệu mới nhất lên đầu
      const sortedData = res.data.reverse();
      setData(sortedData);
    } catch (err) {
      console.error("Lỗi tải dữ liệu");
    }
  };

  const resetForm = () => {
    setFormData({});
    setFile(null);
    setEditingId(null);
    const formEl = document.getElementById("admin-form");
    if (formEl) formEl.reset();
  };

  const handleInputChange = (e, key) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData(item);
    document.querySelector(".admin-content").scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = { ...formData };

    if (file) {
      const uploadData = new FormData();
      uploadData.append("image", file);
      try {
        const res = await axios.post(`${API_URL}  `, uploadData);
        payload.HinhAnh = res.data.filename;
      } catch (err) {
        alert("Lỗi upload ảnh"); 
        return;
      }
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (editingId) {
        await axios.put(`${API_URL}/api/${activeTab}/${editingId}`, payload, { headers });
        alert("Cập nhật thành công!");
      } else {
        await axios.post(`${API_URL}/api/${activeTab}`, payload, { headers });
        alert("Thêm mới thành công!");
      }
      fetchData();
      resetForm();
    } catch (err) {
      alert("Lỗi lưu dữ liệu: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Chắc chắn xóa?")) return;
    try {
      await axios.delete(`${API_URL}/api/${activeTab}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      alert("Lỗi xóa");
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      val ? val.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false
    )
  );

  const config = DB_CONFIG[activeTab];

  return (
    <div className="admin-layout">
      <div className="sidebar">
        {Object.keys(DB_CONFIG).map((key) => (
          <div key={key} className={`menu-item ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>
            {DB_CONFIG[key].label}
          </div>
        ))}
      </div>

      <div className="admin-content">
        <h2 style={{ display: 'flex', justifyContent: 'space-between' }}>
            Quản Lý {config.label}
            {editingId && <span style={{ fontSize: '14px', color: '#e67e22' }}>(Đang chỉnh sửa)</span>}
        </h2>
        
        {/* Form nhập liệu */}
        <form id="admin-form" className="crud-form" onSubmit={handleSubmit} style={{ border: editingId ? '2px solid #f39c12' : 'none' }}>
          {config.cols.map((col) => (
            <div key={col.key} className="form-group">
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>{col.key}</label>
              {col.type === "file" ? (
                 <div style={{display:'flex', flexDirection:'column'}}>
                    <input type="file" onChange={handleFileChange} />
                    {editingId && formData[col.key] && !file && <small>Hiện tại: {formData[col.key]}</small>}
                 </div>
              ) : col.type === "textarea" ? (
                <textarea
                  rows="5" className="form-input"
                  style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px", resize: "vertical" }}
                  placeholder={`Nhập ${col.key}...`}
                  onChange={(e) => handleInputChange(e, col.key)}
                  value={formData[col.key] || ""}
                ></textarea>
              ) : (
                <input
                  type={col.type || "text"} placeholder={col.key}
                  onChange={(e) => handleInputChange(e, col.key)}
                  value={formData[col.key] || ""}
                />
              )}
            </div>
          ))}
          <div style={{ width: '100%', display: 'flex', gap: '10px', marginTop: 'auto' }}>
            <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-primary'}`} style={{ flex: 1 }}>
                {editingId ? "Cập Nhật" : "Thêm Mới"}
            </button>
            {editingId && <button type="button" className="btn btn-secondary" onClick={resetForm}>Hủy</button>}
          </div>
        </form>

        <div className="admin-toolbar">
            <input type="text" className="admin-search" placeholder={`🔍 Tìm kiếm...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <div style={{color: '#777', fontSize: '14px'}}>Tổng số: <strong>{filteredData.length}</strong> dòng</div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                {config.cols.map((col) => <th key={col.key}>{col.key}</th>)}
                <th style={{ minWidth: '180px' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item._id} style={{ backgroundColor: editingId === item._id ? '#fff3cd' : 'transparent' }}>
                  {config.cols.map((col) => (
                    <td key={col.key} style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={item[col.key]}>
                      {col.type === "file" ? (
                        item[col.key] ? <img src={`${API_URL}/img/${item[col.key]}`} alt="img" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} /> : ""
                      ) : (
                        item[col.key] && item[col.key].toString().length > 50 ? item[col.key].toString().substring(0, 50) + "..." : item[col.key]
                      )}
                    </td>
                  ))}
                  <td>
                    {/* NÚT XEM CHI TIẾT (CHỈ HIỆN CHO ĐƠN HÀNG) */}
                    {activeTab === 'donhang' && (
                        <button 
                            className="btn" 
                            style={{background: '#3498db', color: 'white', marginRight: '5px', padding: "5px 10px", fontSize: "12px"}}
                            onClick={() => setSelectedOrder(item)}
                        >
                            Xem
                        </button>
                    )}

                    <button className="btn btn-edit" onClick={() => handleEdit(item)} style={{ padding: "5px 10px", fontSize: "12px" }}>Sửa</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item._id)} style={{ padding: "5px 10px", fontSize: "12px" }}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL CHI TIẾT ĐƠN HÀNG --- */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-box" style={{width: '600px', maxWidth: '90%'}} onClick={e => e.stopPropagation()}>
                <h3 style={{borderBottom:'1px solid #eee', paddingBottom:'10px', marginBottom:'15px'}}>
                    Chi Tiết Đơn Hàng #{selectedOrder._id.slice(-6)}
                </h3>
                
                <div style={{marginBottom:'20px'}}>
                    <p><strong>Khách hàng:</strong> {selectedOrder.TenKH}</p>
                    <p><strong>SĐT:</strong> {selectedOrder.SDT}</p>
                    <p><strong>Địa chỉ:</strong> {selectedOrder.DiaChi}</p>
                    <p><strong>Trạng thái:</strong> <span style={{color:'blue', fontWeight:'bold'}}>{selectedOrder.TrangThai}</span></p>
                </div>

                <div style={{maxHeight:'300px', overflowY:'auto', border:'1px solid #eee', borderRadius:'4px'}}>
                    <table style={{width:'100%'}}>
                        <thead style={{background:'#f9f9f9'}}>
                            <tr>
                                <th style={{padding:'8px', fontSize:'12px'}}>Ảnh</th>
                                <th style={{padding:'8px', fontSize:'12px'}}>Tên SP</th>
                                <th style={{padding:'8px', fontSize:'12px'}}>SL</th>
                                <th style={{padding:'8px', fontSize:'12px'}}>Đơn Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.ChiTiet && selectedOrder.ChiTiet.map((sp, index) => (
                                <tr key={index}>
                                    <td style={{padding:'8px'}}>
                                        <img src={`${API_URL}/img/${sp.HinhAnh}`} style={{width:'40px', height:'40px', objectFit:'cover'}} />
                                    </td>
                                    <td style={{padding:'8px', fontSize:'13px'}}>{sp.TenSP}</td>
                                    <td style={{padding:'8px', textAlign:'center', fontWeight:'bold'}}>{sp.SoLuong}</td>
                                    <td style={{padding:'8px', color:'#c0392b'}}>{Number(sp.DonGia).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{textAlign:'right', marginTop:'15px', fontSize:'18px'}}>
                    Tổng tiền: <span style={{color:'#c0392b', fontWeight:'bold'}}>{Number(selectedOrder.TongTien).toLocaleString()} ₫</span>
                </div>

                <button className="btn btn-danger" style={{marginTop:'15px', width:'100%'}} onClick={() => setSelectedOrder(null)}>Đóng</button>
            </div>
        </div>
      )}

    </div>
  );
}