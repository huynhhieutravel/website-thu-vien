// Teachers module stub for Every Joule
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('bar');
  if (bar) {
    bar.innerHTML = '<a href="index.html" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:#273463;color:#fff;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.15)">← Quay lại Every Joule 3D Book</a>';
    bar.style.padding = '16px';
    bar.style.position = 'sticky';
    bar.style.top = '0';
    bar.style.background = '#f6f0e3';
    bar.style.borderBottom = '1px solid #e2d9c5';
    bar.style.zIndex = '50';
  }
  const main = document.getElementById('main');
  if (main) {
    main.innerHTML = `
      <article style="max-width:44rem;margin:40px auto;padding:0 24px;font-family:Georgia,serif;color:#1c2433;line-height:1.75">
        <h1 style="font-size:2.2rem;font-weight:600;margin-bottom:12px;color:#273463">Every Joule · Ghi chú giảng dạy (Teachers’ Notes)</h1>
        <p style="font-size:1.1rem;color:#555;margin-bottom:28px">Tài liệu phân tích các định luật bảo toàn năng lượng, hệ thống các bình chứa (energy stores) và hướng dẫn thực nghiệm 3D.</p>
        <div style="background:#fff;border:1px solid #e5dcc7;border-radius:12px;padding:24px;margin-bottom:24px;box-shadow:0 4px 12px rgba(0,0,0,0.03)">
          <h2 style="font-size:1.3rem;margin-top:0;color:#273463">Các mô hình năng lượng cốt lõi trong sách:</h2>
          <ul style="padding-left:20px;line-height:1.9">
            <li><strong>Kinetic Store (Động năng):</strong> Năng lượng chuyển động của các vật thể.</li>
            <li><strong>Gravitational Store (Thế năng trọng trường):</strong> Tích trữ khi nâng vật lên cao chống lại trọng lực.</li>
            <li><strong>Elastic Store (Thế năng đàn hồi):</strong> Tích trữ trong lò xo hoặc dây cao su bị biến dạng.</li>
            <li><strong>Thermal Store (Nhiệt năng):</strong> Năng lượng dao động phân tử, tăng khi có ma sát.</li>
            <li><strong>Chemical Store (Hóa năng):</strong> Tích trữ trong liên kết hóa học, pin, thức ăn.</li>
          </ul>
        </div>
        <p><a href="index.html" style="display:inline-block;padding:10px 20px;background:#b8412e;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Khám Phá Sách 3D Tương Tác →</a></p>
      </article>
    `;
  }
});
export default {};
