# 1 in 8 Billion (80억 분의 1) · Demographic Life Simulation

> **Một kiếp nhân sinh giữa hơn 8 tỷ người.**  
> Trò chơi mô phỏng cuộc đời con người dựa trên dữ liệu thống kê nhân khẩu học thực tế từ **Liên Hợp Quốc (UN)**, **Tổ chức Y tế Thế giới (WHO)**, **Ngân hàng Thế giới (World Bank)** và **UNESCO**.

Bản tái hiện chuẩn xác (authentic clone) của tựa game web nổi tiếng thế giới [1in8b.life](https://1in8b.life) (tên tiếng Hàn: *80억 분의 1*).

---

## 🌍 Ý tưởng chủ đạo (The Core Concept)

Hiện nay trên Trái Đất có hơn **8 tỷ người**, và trung bình mỗi giây có khoảng **4 em bé chào đời**. Khi bắt đầu vòng quay luân hồi, bạn không được chọn nơi mình sinh ra:
- Bạn có thể sinh ra trong một gia đình thuộc tầng lớp thượng lưu tại Na Uy, hoặc trong một túp lều ở vùng nông thôn Chad.
- Vị trí địa lý, tuổi thọ kỳ vọng của quốc gia, tỷ lệ tử vong trẻ sơ sinh, bình đẳng giới, thu nhập bình quân và chiến sự sẽ trực tiếp định hình những thăng trầm trong suốt cuộc đời bạn.
- Cùng lúc đó, **4 em bé khác sinh cùng giây với bạn** ở khắp các châu lục sẽ cùng lớn lên, đối mặt với sinh lão bệnh tử song song trong cùng một dòng thời gian.

---

## ✨ Tính năng nổi bật (Key Features)

### 1. 🏛️ Giao diện 3 cột phong cách Giấy Cổ Điển (Vintage Paper & ID Card)
- **Cột 1 (Trái):** Thẻ căn cước công dân (ID Card) với tem Guilloche dập nổi, chân dung động (Animated Passport Portrait), vạch mã số MRZ, chấm phân vị giàu nghèo ngũ phân vị (`●●●○○`), 5 thanh chỉ số sinh tồn (Sức khỏe, Hạnh phúc, Trí tuệ, Xã hội, Tài sản) và cây phả hệ gia đình.
- **Cột 2 (Giữa):** Khung cảnh Pixel Diorama sống động bề ngang toàn màn hình, nút chọn Trọng tâm năm nay (Học tập, Sự nghiệp, Gia đình, Thể lực, Sở thích), và Dòng thời gian biên niên sử sự kiện đời người (Chronological Life Feed).
- **Cột 3 (Phải):** Danh sách 4 bạn cùng sinh ("Sinh cùng giây"), Bản đồ lưới 100 năm cuộc đời (100-Year Life Grid), Biểu đồ đường cong sinh tồn Gompertz SVG, và Bảng thống kê nhân khẩu học quốc gia (UN/WHO Data).

### 2. 🎨 Bộ Engine đồ họa Pixel & Hoạt ảnh nguyên bản (`pixelArtOriginal.js`)
- Tái lập 100% thuật toán raster canvas gốc từ `1in8b.life` (kích thước raster 192x60, độ cao mặt đất 48):
  - **Ma trận Pixel nhân vật (`PX_PEOPLE`):** 5 giai đoạn lứa tuổi cho cả nam và nữ (`baby`, `small`, `child`, `teen`, `adult`).
  - **Hoạt ảnh sống động:** Nhịp thở phập phồng (breathing bob), chớp mắt tự nhiên (blinking), nhảy nhót khi tăng tuổi hoặc khi click chuột, bóng tim `♥` tương tác.
  - **Bối cảnh kiến trúc & thực vật sinh thái:** Nhà ở tự động nâng cấp theo mức độ giàu có (lều tị nạn, nhà tranh vách đất, chung cư, nhà phố, biệt thự sân vườn). Cây cối biến đổi theo lục địa (cây keo châu Phi `acacia`, cọ nhiệt đới `palm`, thông hàn đới `pine`, cây tròn ôn đới).
  - **Phương tiện & Nơi làm việc:** Xe hơi, xe máy giao hàng, nhà máy công nghiệp nhả khói, công trường cần cẩu, bệnh viện chữ thập đỏ, trường học, bến thuyền đánh cá.
  - **Nghi thức tang lễ tưởng niệm (`pxFuneral`):** Khi qua đời, khung cảnh chuyển sang bàn thờ di ảnh trang nghiêm với hoa trắng, lư hương nghi ngút khói và người thân quấn khăn tang đưa tiễn.

### 3. 👥 Bạn cùng sinh ("Sinh cùng giây")
- Sinh ra ngẫu nhiên 4 em bé sinh cùng giây tại 4 lục địa khác nhau.
- Tính toán xác suất tử vong hàng năm theo số liệu thực tế của quốc gia họ sinh sống. Người chơi có thể theo dõi ai còn sống, ai đã ra đi sớm do dịch bệnh hay tai nạn.

### 4. ⚖️ Hệ thống quyết định bước ngoặt cuộc đời (Decisions Engine)
Gặp phải những tình huống lưỡng nan xã hội chân thực tại các mốc tuổi then chốt:
- **2 tuổi:** Khám phá thế giới đầu đời (tò mò, năng động, nhạy cảm).
- **6 tuổi & 12 tuổi:** Tiếp cận giáo dục tiểu học và trung học.
- **15 tuổi & 18 tuổi:** Thi lên cấp 3, học đại học hay sớm đi làm kiếm sống.
- **26 tuổi:** Hôn nhân và tình yêu đôi lứa.
- **35 tuổi:** An cư mua nhà hay mạo hiểm lập nghiệp kinh doanh.
- **42 tuổi:** Khủng hoảng tuổi trung niên (U-shaped happiness curve).
- **62 tuổi:** Nghỉ hưu hay tiếp tục cống hiến.
- **74 tuổi:** Chọn ở cùng con cháu hay giữ lối sống độc lập.

### 5. 🧘 Các mốc chiêm nghiệm nhân khẩu học (`ReflectionModal`)
Tại các lứa tuổi **5, 15, 30, 50, 70**, trò chơi mở ra những khoảng lặng triết lý sâu sắc, nhắc nhở về những đặc ân hay bất công vô hình trong cuộc sống, đi kèm dữ liệu thống kê của Liên Hợp Quốc và WHO.

### 6. 🛍️ Hoạt động & Trải nghiệm cuộc sống (`ShopModal`)
Người chơi có thể dùng số tiền tích lũy được để:
- Tổ chức bữa cơm gia đình sum vầy.
- Khám sức khỏe định kỳ & tập thể thao cá nhân.
- Du lịch khám phá quê hương hoặc ra nước ngoài.
- Học các khóa đào tạo nâng cao tay nghề.
- Quyên góp giúp đỡ người khó khăn.
- Nhận nuôi một bé thú cưng bầu bạn (chó / mèo).

### 7. 🎹 Nhạc nền Piano Ambient Procedural (Web Audio API)
- Tạo âm thanh hòa âm trực tiếp bằng mã lệnh (`soundSynth.js`), không cần tải bất kỳ file mp3 nào:
  - Chuỗi hợp âm lofi êm dịu (`CHORDS`: Am7, Fmaj7, C, G, Em7,...).
  - Giai điệu ngũ cung thư thái (`PENTA`) thích ứng theo từng giai đoạn lứa tuổi (tuổi thơ, thanh xuân, trung niên, xế chiều).
  - Nút bật/tắt âm thanh (`♫` / `🔇`) nhanh chóng trên TopBar.

### 8. 🌐 Đa ngôn ngữ & Lưu trữ lịch sử kiếp trước
- Hỗ trợ đầy đủ **Tiếng Việt (mặc định)**, **English**, và **한국어**.
- Lưu trữ danh sách các kiếp sống đã qua vào LocalStorage (nghề nghiệp, tuổi thọ, nguyên nhân mất).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Ngôn ngữ & Nền tảng:** JavaScript (ESNext), React 19, Vite 8.
- **Giao diện & Styling:** TailwindCSS v4 (`@tailwindcss/vite`), SVG Guilloche banknote patterns, Typography `Hahmlet` & `Cinzel Decorative`.
- **Đồ họa Canvas:** HTML5 Canvas 2D Bitmap Renderer (Software Rasterizer với ma trận hòa sắc Bayer Dithering 4x4).
- **Âm thanh:** Web Audio API (OscillatorNode, GainNode, DynamicsCompressorNode, BiquadFilterNode).
- **Hiệu ứng:** Canvas-Confetti, Lucide Icons.
- **Vận hành:** 100% Client-side, không phụ thuộc máy chủ bên ngoài, hoạt động offline hoàn toàn.

---

## 📂 Cấu trúc thư mục (Project Structure)

```
1in8b-clone/
├── src/
│   ├── components/            # Giao diện React
│   │   ├── TopBar.jsx          # Thanh điều khiển (tốc độ, âm thanh, ngôn ngữ, theme)
│   │   ├── Hero.jsx            # Màn hình chào & nút xúc xắc định mệnh
│   │   ├── BirthCard.jsx       # Giấy khai sinh & thông số khởi đầu
│   │   ├── Dashboard.jsx       # Bảng điều khiển chính 3 cột
│   │   ├── SceneDiorama.jsx    # Khung cảnh pixel nhân vật & tang lễ
│   │   ├── AnimatedPortrait.jsx# Ảnh thẻ hộ chiếu có nhịp thở & chớp mắt
│   │   ├── PeerBabies.jsx      # Danh sách 4 em bé sinh cùng giây
│   │   ├── SurvivalCurve.jsx   # Biểu đồ sống sót Gompertz SVG
│   │   ├── DecisionModal.jsx   # Hộp thoại lựa chọn quyết định
│   │   ├── ReflectionModal.jsx # Hộp thoại chiêm nghiệm cột mốc (5, 15, 30, 50, 70)
│   │   ├── ShopModal.jsx       # Cửa hàng trải nghiệm đời sống & thú cưng
│   │   ├── DeathSummary.jsx    # Bản điếu văn & tổng kết cuộc đời
│   │   └── PastLivesModal.jsx  # Lưu trữ các kiếp sống đã qua
│   ├── engine/                # Logic mô phỏng & Đồ họa
│   │   ├── demographics.js     # Thuật toán quay quốc gia & tạo danh tính
│   │   ├── simulation.js       # Vòng lặp mô phỏng sinh lão bệnh tử
│   │   ├── decisions.js        # Kịch bản quyết định & phân nhánh
│   │   ├── pixelArtOriginal.js # Engine vẽ pixel art & ma trận nhân vật
│   │   ├── pixelScene.js       # Engine cảnh quan & chân dung hộ chiếu
│   │   ├── soundSynth.js       # Máy tổng hợp nhạc nền Web Audio API
│   │   └── random.js           # Bộ tạo số ngẫu nhiên có trọng số
│   ├── data/                  # Cơ sở dữ liệu nhân khẩu học
│   │   ├── countries.json      # 172 quốc gia & chỉ số UN/WHO
│   │   ├── country_vi.json     # Tên quốc gia Tiếng Việt
│   │   ├── cities.json         # Danh sách thành phố lớn toàn cầu
│   │   ├── names.json          # Kho tên họ bản địa các nước
│   │   ├── jobs.json           # 50+ nghề nghiệp, bậc lương, rủi ro
│   │   ├── causes.json         # 33 nguyên nhân tử vong WHO
│   │   ├── dishes.json         # 172 món ăn truyền thống thế giới
│   │   ├── reflections.json    # Câu hỏi chiêm nghiệm các mốc tuổi
│   │   ├── shop.json           # Danh mục hoạt động & mua sắm
│   │   ├── hobbies.json        # 20 môn thể thao & sở thích
│   │   ├── festivals.json      # Lễ hội truyền thống các quốc gia
│   │   └── world.json          # Tọa độ địa lý bản đồ
│   ├── scripts/               # Các script cào và định dạng dữ liệu
│   │   ├── scrape_full_data.js
│   │   └── scrape_full_assets.js
│   ├── docs/                  # Tài liệu kỹ thuật chi tiết
│   │   ├── PLAN.md             # Kế hoạch chi tiết ban đầu
│   │   ├── ARCHITECTURE.md     # Kiến trúc hệ thống
│   │   ├── DATASETS.md         # Bảng tra cứu cấu trúc dữ liệu
│   │   └── GAMEPLAY.md         # Hướng dẫn cơ chế trò chơi
│   ├── App.jsx                # Component gốc điều phối trạng thái
│   └── main.jsx               # Điểm khởi chạy React
├── package.json
└── vite.config.js
```

---

## 🚀 Hướng dẫn cài đặt & Chạy cục bộ (Getting Started)

### Yêu cầu môi trường
- [Node.js](https://nodejs.org/) phiên bản 18+ trở lên.
- Trình quản lý gói `npm`.

### Cài đặt và Khởi chạy
```bash
# 1. Đi tới thư mục dự án
cd 1in8b-clone

# 2. Cài đặt các thư viện phụ thuộc
npm install

# 3. Khởi chạy máy chủ phát triển
npm run dev
```

Mở trình duyệt và truy cập:
👉 **`http://localhost:5173/`**

### Đóng gói ứng dụng (Production Build)
```bash
npm run build
```
Mã nguồn tối ưu sau khi build sẽ nằm trong thư mục `dist/` và có thể triển khai lên GitHub Pages, Vercel, Netlify hoặc bất kỳ web hosting tĩnh nào.

---

## 📜 Nguồn dữ liệu tham khảo (Data Sources & Credits)

- Ý tưởng gốc và thiết kế đồ họa pixel lấy cảm hứng từ trang web [1in8b.life](https://1in8b.life) (tác giả người Hàn Quốc).
- Dữ liệu nhân khẩu học, kinh tế và y tế được thu thập và chuẩn hóa từ:
  - **UN Population Division:** World Population Prospects (WPP).
  - **World Health Organization (WHO):** Global Health Observatory (GHO) Mortality Database.
  - **World Bank:** World Development Indicators (GDP per capita PPP, Gini index).
  - **UNESCO Institute for Statistics:** Expected Years of Schooling & Literacy.
  - **Our World in Data:** Cause of Death by Age Group.

---

*Dự án được xây dựng vì mục đích học tập, giáo dục và nghiên cứu mô phỏng xã hội học.*
