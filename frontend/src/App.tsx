import { useState } from 'react';

const navModes = [
  { icon: '⚡', label: 'Bán nhanh', active: true },
  { icon: '🕒', label: 'Bán thường' },
  { icon: '🚚', label: 'Bán giao hàng' }
];

export default function App() {
  const [showCustomerModal, setShowCustomerModal] = useState(true);
  const [showProductModal, setShowProductModal] = useState(true);

  return (
    <div className="pos-page">
      <header className="topbar">
        <div className="search-box">🔍 Tìm hàng hóa (F3)</div>
        <div className="tab">↔ Hóa đơn 1 ✕</div>
        <div className="top-icons">👜 ↩ 🔁 🖨 0373746891 ☰</div>
      </header>

      <main className="content">
        <section className="left-panel">
          <div className="canvas" />
          <div className="note-box">✎ Ghi chú đơn hàng</div>
        </section>

        <section className="right-panel">
          <div className="info-row">
            <span>DuanNC</span>
            <span>30/04/2026 09:48</span>
          </div>
          <div className="customer-search">🔍 Tìm khách hàng (F4) ＋</div>

          <div className="summary">
            <div><span>Tổng tiền hàng</span><b>0</b></div>
            <div><span>Giảm giá</span><b>0</b></div>
            <div className="pay"><span>Khách cần trả</span><b>0</b></div>
          </div>

          <div className="bank-box">
            Bạn chưa có tài khoản ngân hàng
            <br />
            <span>+ Thêm tài khoản</span>
          </div>

          <button className="pay-btn">THANH TOÁN</button>
        </section>
      </main>

      <footer className="bottom-nav">
        <div className="mode-list">
          {navModes.map((item) => (
            <button key={item.label} className={`mode ${item.active ? 'active' : ''}`}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
        <div className="support">💬 1900 6522 ❔ 🟧</div>
      </footer>

      {showCustomerModal && (
        <div className="overlay" onClick={() => setShowCustomerModal(false)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm khách hàng</h3>
              <button onClick={() => setShowCustomerModal(false)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="avatar">👤</div>
              <input placeholder="Mã khách hàng" />
              <input placeholder="Nhóm" />
              <input placeholder="Tên khách hàng" />
              <input placeholder="Ngày sinh" />
              <input placeholder="Điện thoại" />
              <input placeholder="Email" />
              <input placeholder="Địa chỉ" />
              <input placeholder="Ghi chú" />
            </div>
            <div className="modal-actions">
              <button className="ghost">Bỏ qua</button>
              <button className="primary">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {showProductModal && (
        <div className="overlay second" onClick={() => setShowProductModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm mới hàng hóa</h3>
              <button onClick={() => setShowProductModal(false)}>✕</button>
            </div>
            <div className="form-grid two-col">
              <input placeholder="Mã hàng" />
              <input placeholder="Giá vốn" />
              <input placeholder="Mã vạch" />
              <input placeholder="Giá bán" />
              <input placeholder="Tên hàng" />
              <input placeholder="Tồn kho" />
              <input placeholder="Nhóm hàng" />
              <input placeholder="Đơn vị cơ bản" />
            </div>
            <div className="images-row">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="img-ph">🖼</div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="ghost">Bỏ qua</button>
              <button className="primary">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
