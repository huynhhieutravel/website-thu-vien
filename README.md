# AERIVE — Private Aviation (Full Clone A-Z)

Dự án clone 100% nguyên bản website **AERIVE** (`https://aerive-template.modulify.website/`).

## 🚀 Tính năng & Hiệu ứng đã sao chép hoàn chỉnh:
- **Hero Window Zoom & Canvas Mask**: Thuật toán xử lý chroma-key kính cửa sổ máy bay thời gian thực qua Canvas 2D, zoom xuyên qua ô cửa khi cuộn chuột.
- **Lenis Smooth Scroll**: Cuộn trang mượt mà chuẩn lướt lụa, đồng bộ chặt chẽ với GSAP ticker.
- **GSAP ScrollTrigger Pinned Timelines**:
  - Hero text blur & stagger character entrance ("Precision in motion", "Discretion at altitude").
  - Flying wordmark AERIVE tự động bay từ giữa màn hình lên thanh header cố định.
  - Parallax mây trôi tự nhiên (`sky-drift-track`) và mây quét ngang qua cửa sổ.
  - About cards stagger reveal với blur & translation.
  - Cloud rise spacer: vệt mây bồng bềnh dâng lên cùng câu thì thầm *"Above the weather, the world goes quiet."*.
  - Chuyển đổi theme Light / Dark tự động (Ivory background vs Obsidian dark).
  - Fleet Flagship: máy bay xoay góc nghiêng tiến vào, hiệu ứng vẽ viền cabin nội thất (SVG stroke-dashoffset), danh sách thông số kỹ thuật (Specs) và mô tả.
  - Advantages: Accordion tương tác 4 tab, chuyển đổi ảnh mượt mà (scale + fade), đồng hồ hiển thị giờ thực tế của người dùng (Live Local Time).
  - Global: Địa cầu xoay với ánh kim vàng Champagne, các đường bay quỹ đạo với chấm sáng di chuyển, carousel đổi thành phố bay tự động ("London", "Geneva", "Nice", "Mykonos", "Tokyo",...).
  - Boarding pass card bay vào với góc nghiêng sang trọng.
- **Booking Dialog Modal**: Modal đặt chuyến bay chuẩn `<dialog>`, kiểm tra lỗi dữ liệu (validation), chuyển sang màn hình xác nhận sau khi gửi thành công.
- **Mobile Menu Drawer**: Menu trượt trên thiết bị di động kèm nút đặt vé nổi.
- **Film grain**: Lớp phủ hạt phim tăng cảm giác điện ảnh sang trọng.

## 🛠️ Cài đặt & Chạy:

```bash
# Cài đặt thư viện (nếu cần)
npm install

# Khởi chạy máy chủ phát triển
npm run dev

# Build bản tối ưu cho production
npm run build

# Xem thử bản build
npm run preview
```

Server đang chạy tại: `http://localhost:5188/`
