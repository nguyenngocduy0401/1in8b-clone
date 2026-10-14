# Kiến trúc kỹ thuật (Technical Architecture) · 1 in 8 Billion Clone

Tài liệu này mô tả chi tiết các phân tầng kiến trúc, luồng dữ liệu và thiết kế các module trong trò chơi mô phỏng nhân khẩu học **1 in 8 Billion**.

---

## 1. Tổng quan kiến trúc hệ thống

Trò chơi được xây dựng hoàn toàn phía client (Single Page Application - SPA) chạy trong môi trường React 19 + Vite, áp dụng mô hình trạng thái một chiều (Unidirectional Data Flow) kết hợp với Canvas 2D Software Rasterizer độc lập để vẽ pixel art.

```
                    ┌─────────────────────────┐
                    │      App Component      │
                    │   (Root State Manager)  │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Simulation Loop │    │ UI Presentation  │    │  Procedural Audio│
│ (advanceOneYear) │    │   (Dashboard)    │    │   (soundSynth)   │
└────────┬─────────┘    └────────┬─────────┘    └──────────────────┘
         │                       │
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│ Decisions Engine │    │ Pixel Art Canvas │
│  & Reflections   │    │ (pixelArtOriginal│
└──────────────────┘    └──────────────────┘
```

---

## 2. Các phân tầng chính

### 2.1. Phân tầng Dữ liệu (Data Layer - `src/data/`)
Lưu trữ các bộ dữ liệu tĩnh JSON được trích xuất và chuẩn hóa từ `1in8b.life`:
- **`countries.json`:** Danh sách 172 quốc gia với 25 trường thông số nhân khẩu học (tỷ lệ sinh, dân số, tuổi thọ, GDP PPP, chỉ số Gini, tỷ lệ tử vong trẻ em, tỷ lệ học vấn, v.v.).
- **`jobs.json`:** 50+ nghề nghiệp phân theo lĩnh vực (`agr`, `ind`, `ser`, `gov`), ngưỡng học vấn, phân vị thu nhập, nguy cơ nghề nghiệp.
- **`causes.json`:** 33 nguyên nhân tử vong quốc tế theo phân loại WHO.
- **`dishes.json`:** Món ăn truyền thống tiêu biểu của 172 quốc gia.
- **`reflections.json`:** Câu hỏi chiêm nghiệm triết lý tại các mốc tuổi 5, 15, 30, 50, 70.
- **`shop.json`:** Hoạt động và dịch vụ cuộc sống người chơi có thể đầu tư.
- **`hobbies.json` & `festivals.json`:** Sở thích và ngày lễ văn hóa dân tộc.
- **`names.json` & `cities.json`:** Kho dữ liệu tên gọi và các đô thị lớn trên toàn cầu.

### 2.2. Phân tầng Mô phỏng (Simulation & Engine Layer - `src/engine/`)

#### A. Demographics Engine (`demographics.js`)
- **`chooseCountry(countries)`:** Quay xúc xắc xác suất có trọng số dựa trên số lượng trẻ sơ sinh ra đời mỗi năm của từng quốc gia (`c.b / TOTAL_BIRTHS`).
- **`generateBirthIdentity(...)`:** Xác định giới tính (51% Nam, 49% Nữ), nơi sinh (Đô thị hoặc Nông thôn theo `c.urb`), ngũ phân vị kinh tế gia đình (`q` từ 1 đến 5), cha mẹ và tôn giáo (`rel`).
- **`generatePeerBabies(countries, namesPool)`:** Tạo ngẫu nhiên 4 em bé sinh cùng giây tại các lục địa khác nhau để theo dõi sự sinh tồn song song.

#### B. Simulation Loop (`simulation.js`)
Hàm cốt lõi `advanceOneYear(state)` thực thi mỗi chu kỳ năm:
1. **Tính toán nguy cơ tử vong:**
   - Dưới 1 tuổi: Dựa trên tỷ lệ tử vong trẻ sơ sinh `c.im / 1000`.
   - 1 đến 4 tuổi: Dựa trên tỷ lệ tử vong dưới 5 tuổi `(c.u5 - c.im) / 4000`.
   - Dưới 50 tuổi: Nguy cơ cơ bản kết hợp tai nạn giao thông `c.road`, xung đột vũ trang `c.war`, và bạo lực `c.hom`.
   - Trên 50 tuổi: Áp dụng đường cong hàm mũ Gompertz-Makeham $P(\text{death}) = 0.003 \cdot 1.09^{(\text{age} - 50)} \cdot (78 / \text{le})^{2.2}$.
2. **Cập nhật gia đình:** Tính tuổi và xác suất qua đời tự nhiên của cha mẹ.
3. **Cập nhật việc làm & kinh tế:** Tính thu nhập hàng năm dựa trên GDP PPP quốc gia, nghề nghiệp và ngũ phân vị xã hội.
4. **Mô phỏng 4 bạn cùng sinh (`advancePeers`):** Cập nhật tình trạng sống sót của các bạn cùng sinh.
5. **Kiểm tra sự kiện bước ngoặt (`decisions.js`) và chiêm nghiệm (`reflections.json`):** Dừng mô phỏng khi có quyết định cần người chơi lựa chọn.

#### C. Pixel Art Software Renderer (`pixelArtOriginal.js`)
Tái hiện 100% thuật toán raster của bản gốc:
- Lớp `PxR`: Quản lý bộ đệm điểm ảnh `d` kích thước 192x60, hỗ trợ vẽ hình chữ nhật (`rect`), đĩa tròn (`disc`), đường thẳng Bresenham (`line`), hòa sắc Bayer Dithering 4x4 (`dither`), và ghép sprite (`blit`).
- `PX_PEOPLE`: Ma trận pixel nhân vật với màu da 6 cấp độ (`sk0` đến `sk5`) tương ứng với chủng tộc quốc gia.
- `pxScene`: Dựng khung cảnh theo thời gian trong ngày (bình minh `m`, ban ngày `d`, hoàng hôn `e`), tâm trạng (`low`, `mid`, `high`), môi trường (đô thị / nông thôn), bối cảnh công việc, xe cộ và nhà ở.
- `pxFuneral`: Dựng khung cảnh tang lễ tưởng niệm trang nghiêm khi nhân vật qua đời.

#### D. Procedural Audio Synthesizer (`soundSynth.js`)
- Tích hợp Web Audio API thuần túy, không dùng tệp âm thanh bên ngoài.
- Bộ lọc `BiquadFilterNode` (Low-pass 1600Hz) tạo chất âm ấm áp lofi như tiếng piano acoustic cổ.
- Chuỗi hợp âm `CHORDS` và chuỗi nốt ngũ cung `PENTA` được phối ngẫu nhiên theo nhịp điệu sinh học của từng độ tuổi.

### 2.3. Phân tầng Giao diện (UI Components Layer - `src/components/`)
- **`TopBar.jsx`:** Điều khiển tốc độ mô phỏng (1x, 2x, 4x, 8x), tạm dừng/tiếp tục, nhảy tới quyết định tiếp theo, bật/tắt nhạc nền, đổi ngôn ngữ (VI/EN/KO), chuyển theme sáng/tối.
- **`Dashboard.jsx`:** Bố cục 3 cột chuẩn mực của bản gốc:
  - Cột 1: Thẻ ID card ngân hàng, Guilloche SVG, chân dung động thở/chớp mắt, thanh chỉ số sinh tồn.
  - Cột 2: Khung tranh Pixel Diorama toàn chiều rộng, chọn trọng tâm năm, nhật ký biến cố đời người.
  - Cột 3: 4 bạn cùng sinh, lưới 100 năm cuộc đời, biểu đồ sống sót Gompertz SVG, số liệu UN/WHO.
- **`DecisionModal.jsx` & `ReflectionModal.jsx`:** Hộp thoại pop-up dừng thời gian để tương tác tình huống và chiêm nghiệm cuộc đời.
- **`ShopModal.jsx`:** Danh mục hoạt động đời sống để chi tiêu tài sản tích lũy.
- **`DeathSummary.jsx`:** Màn hình tưởng niệm và phân tích tổng kết kiếp người sau khi qua đời.

---

## 3. Quản lý trạng thái & Tính bền vững

- Trạng thái trò chơi được quản lý tập trung tại `App.jsx` thông qua React Hook `useState` và `useEffect`.
- Khi nhân vật qua đời, toàn bộ lịch sử tóm tắt (tuổi thọ, nguyên nhân mất, nghề nghiệp, tài sản) được lưu vào `localStorage` dưới khóa `1in8b_past_lives_v1`.
- Trò chơi không gửi bất kỳ dữ liệu nào ra mạng Internet bên ngoài, đảm bảo 100% quyền riêng tư và khả năng chạy offline.
