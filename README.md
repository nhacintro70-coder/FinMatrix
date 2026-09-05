# 💰 Tính Toán Tài Chính Cá Nhân (Personal Finance Calculator)

Một ứng dụng web (Single Page Application) hiện đại, chuyên nghiệp giúp bạn hoạch định tài chính cá nhân, dự báo sự tăng trưởng tài sản dựa trên sức mạnh của lãi kép và sự bào mòn của lạm phát.

## ✨ Tính năng nổi bật

- 📈 **Tính toán Lãi Kép & Lạm phát**: Mô phỏng sự tăng trưởng tài sản qua từng năm với công thức tính lãi kép hàng tháng và sức mua thực tế sau lạm phát.
- 🚀 **Tăng trưởng thu nhập thực tế**: Cho phép thiết lập **Tỉ lệ tăng tiền gửi hàng năm** để phản ánh đúng thực tế thu nhập và số tiền tích lũy tăng lên theo thời gian.
- 🎯 **Theo dõi Mục tiêu (Milestone Tracker)**: Đặt mục tiêu tài chính và xem ngay bạn sẽ mất bao nhiêu năm để đạt được con số đó.
- 📊 **Biểu đồ đa dạng, trực quan**: 
  - **Composed Chart**: Biểu đồ cột chồng (Tiền gốc + Lãi sinh ra) kết hợp với đường xu hướng Sức mua thực tế.
  - **Donut Chart**: Biểu đồ phân bổ tỷ trọng giữa Tiền Gốc và Lãi ở năm cuối cùng.
- 🎛️ **Giao diện Điều khiển (Control Panel) thân thiện**: Sử dụng các thanh trượt (slider) mượt mà kết hợp ô nhập số liệu có tự động định dạng hàng nghìn (dấu chấm) ngay khi gõ.
- 📋 **Bảng dòng tiền chi tiết**: Xem chính xác số tiền gốc, tiền lãi và tổng tài sản qua từng năm ở bảng dữ liệu chi tiết.
- 🌙 **Giao diện Dark Mode**: Thiết kế tối giản, sang trọng, tương phản cao, chuẩn UI/UX tài chính. Tương thích hoàn hảo trên cả điện thoại và máy tính.

## 🛠️ Công nghệ sử dụng

- **[ReactJS](https://react.dev/)** - Framework giao diện (Functional Components, Hooks).
- **[Vite](https://vitejs.dev/)** - Công cụ build siêu tốc.
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS Utility-first cho việc linh hoạt tuỳ biến giao diện.
- **[Recharts](https://recharts.org/)** - Thư viện biểu đồ React chuyên nghiệp, mượt mà.
- **[Lucide React](https://lucide.dev/)** - Thư viện icon đẹp và nhẹ.

## 🚀 Hướng dẫn cài đặt và chạy dự án

### Yêu cầu
Đảm bảo bạn đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18+ khuyến nghị).

### Các bước thực hiện

1. **Clone repository (nếu có) hoặc tải mã nguồn về máy**
   ```bash
   git clone <link-repo-cua-ban>
   cd <thu-muc-du-an>
   ```

2. **Cài đặt thư viện**
   ```bash
   npm install
   ```

3. **Khởi chạy môi trường phát triển (Dev Server)**
   ```bash
   npm run dev
   ```

4. **Trải nghiệm ứng dụng**
   Mở trình duyệt và truy cập vào địa chỉ: `http://localhost:5173/`

## 📝 Giấy phép
Dự án được phân phối dưới giấy phép MIT. Bạn hoàn toàn có thể tự do sử dụng, chỉnh sửa và phân phối.
