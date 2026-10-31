# ADR 0001: Scrollytelling Narrative & Executive Drawer Pattern

## Trạng thái
Đã chấp thuận (Accepted)

## Bối cảnh (Context)
Trang `http://localhost:4328/yep-private-cruise` được kế thừa phong cách lướt điện ảnh (Scrollytelling) từ `http://localhost:4328/aerive`.
Tuy nhiên, phiên bản ban đầu dài tới **20.592px**, trong đó riêng khối `#case-study` (bài đọc phân tích chuyên sâu 7 chương) đã chiếm **10.157px** (gần 50% độ dài trang). Điều này tạo ra một "hố văn bản" (text wall) nghẽn mạch cuộn thị giác, khiến người xem mỏi mắt và bỏ lỡ 6 bức ảnh chụp thực tế cùng phần kêu gọi hành động (CTA) ở cuối trang. Đồng thời, ảnh nền AI bị lặp lại nhiều lần trong khi ảnh chụp thật của FIT TOUR chưa được tôn vinh xứng tầm.

## Quyết định (Decision)
1. **Phân tách Kiến trúc Nội dung (Decoupled Content Architecture)**:
   - Trên luồng cuộn chính: Cô đọng Case Study thành **3 Thẻ Trải Nghiệm Điểm Nhấn (Executive Story Cards)**:
     - *01 / Bài toán VIP*: Nhu cầu gắn kết thực chất cho 140 khách, tránh vận động ngoài trời, bảo mật danh tính VIP.
     - *02 / Giải pháp Độc Bản*: Nhịp kép Indoor Activities + Du thuyền riêng Gala Dinner kết hợp Acoustic Band độc quyền.
     - *03 / Giá trị Tạo Nên*: Trải nghiệm mới mẻ ngay tại TP.HCM, không cần đi xa, thưởng ngoạn Sài Gòn về đêm.
   - Toàn văn 7 chương chuyên sâu, bảng thông số kỹ thuật (overview table), và danh mục điều hướng nhanh được đóng gói vào **Slide-over Drawer Modal** (`#case-drawer`). Khi người đọc cần nghiên cứu kỹ lưỡng, họ bấm "Đọc toàn văn Case Study" để trượt ngăn đọc ra mà không bao giờ bị đứt đoạn trải nghiệm trang chính.

2. **Tôn vinh Bằng chứng Thực tế (Documentary Proof Integration)**:
   - Thay thế các backdrop AI lặp lại bằng chính 6 ảnh chụp thực tế của FIT TOUR trải đều qua 6 trạm trải nghiệm: Đón khách → Indoor Games → Sân khấu riêng → Gala Dinner → Ban nhạc Acoustic → Khách ngắm sông Sài Gòn về đêm.

3. **Bảo toàn Nhận diện & Chuẩn Tương phản**:
   - Giữ nguyên 100% Header FIT TOUR hiện hữu theo yêu cầu.
   - Thêm lớp phủ scrim mờ tối phía sau khối chữ Sài Gòn về đêm để đảm bảo độ tương phản WCAG sắc nét.

## Hệ quả (Consequences)
- Chiều dài trang chính giảm từ 20.592px xuống 15.274px (khối Case Study giảm từ 10.157px xuống 1.148px, tối ưu hơn 88% không gian cuộn).
- Giữ trọn 100% nội dung phân tích chuyên sâu cho các khách hàng B2B / CEO cần tham khảo.
- Nhịp lướt mượt mà, sang trọng và đậm chất cinematic tương đương chuẩn mẫu Aerive.

