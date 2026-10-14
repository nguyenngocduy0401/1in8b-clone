# Hướng dẫn cơ chế trò chơi (Gameplay Guide) · 1 in 8 Billion

Tài liệu này hướng dẫn chi tiết cách thức vận hành của cuộc đời mô phỏng trong trò chơi **1 in 8 Billion**, từ khi cất tiếng khóc chào đời cho tới khi hoàn tất một kiếp nhân sinh.

---

## 1. Giai đoạn 1: Vòng quay số phận (The Birth Lottery)

1. **Khởi đầu ngẫu nhiên:**  
   Người chơi nhấn nút **"Bắt đầu kiếp sống mới" (Roll Birth)**. Hệ thống sẽ bốc ngẫu nhiên một quốc gia trên thế giới dựa trên số lượng trẻ em thực tế sinh ra hàng năm ($b_i / \sum b$).
   - Ví dụ: Ấn Độ (~23 triệu ca sinh/năm) và Trung Quốc (~9 triệu ca sinh/năm) có tỷ lệ bốc trúng cao nhất; các nước Bắc Âu hay vùng Baltic có tỷ lệ bốc trúng rất thấp.
2. **Xác định hoàn cảnh gia đình:**
   - **Giới tính:** ~51% Nam, 49% Nữ (theo tỷ lệ giới tính tự nhiên toàn cầu).
   - **Nơi sinh:** Quyết định đô thị hay nông thôn theo tỷ lệ đô thị hóa `urb`.
   - **Tầng lớp kinh tế (Ngũ phân vị `q`):**
     - `q = 1`: Hộ gia đình 20% nghèo nhất xã hội.
     - `q = 2`: Hộ gia đình 20-40% cận nghèo.
     - `q = 3`: Hộ gia đình trung lưu (40-60%).
     - `q = 4`: Hộ gia đình khá giả (60-80%).
     - `q = 5`: Hộ gia đình 20% giàu nhất xã hội.
   - **Tôn giáo:** Xác định theo cơ cấu tín ngưỡng quốc gia (`rel`).
   - **Tên gọi bản địa:** Lấy ngẫu nhiên từ kho tên phổ biến của quốc gia sở tại.
3. **Sinh ra 4 bạn cùng sinh ("Sinh cùng giây"):**  
   Hệ thống đồng thời tạo ra 4 đứa trẻ khác sinh cùng giây tại các châu lục khác nhau để cùng lớn lên song song.

---

## 2. Giai đoạn 2: Tiến trình thời gian & Sinh lão bệnh tử

- Thời gian trôi qua từng năm một (hoặc người chơi có thể tua nhanh với tốc độ **1x, 2x, 4x, 8x**).
- **Hàng năm, hệ thống tính toán nguy cơ tử vong:**
  - Nếu trẻ dưới 1 tuổi: Kiểm tra tỷ lệ tử vong sơ sinh `im`.
  - Nếu từ 1 đến 4 tuổi: Kiểm tra tỷ lệ tử vong dưới 5 tuổi `u5`.
  - Nếu từ 5 đến 49 tuổi: Tỷ lệ tử vong rất thấp, nhưng tăng vọt nếu ở quốc gia có chiến tranh ác liệt (`war`), tai nạn giao thông cao (`road`), hoặc làm nghề nguy hiểm (thợ mỏ, ngư dân, lính chiến).
  - Từ 50 tuổi trở lên: Áp dụng quy luật tử vong hàm mũ sinh học Gompertz-Makeham.
- **Biến động chỉ số:**
  - **Sức khỏe (Health):** Giảm dần tự nhiên khi về già; tăng lên khi đi khám bệnh hay rèn luyện thể thao.
  - **Hạnh phúc (Happiness):** Biến động theo đường cong chữ U (chạm đáy ở tuổi 40-45 và hồi phục ở tuổi già); tăng mạnh khi kết hôn, sinh con hoặc sum họp gia đình.
  - **Trí tuệ (Smarts):** Tăng khi đi học, đọc sách, nghiên cứu, học nghề.
  - **Mối quan hệ (Social):** Thể hiện sự gắn kết với cha mẹ, bạn đời, con cháu và bạn bè.
  - **Tài sản (Wealth):** Tích lũy hàng năm dựa trên thu nhập nghề nghiệp trừ chi phí sinh hoạt.

---

## 3. Giai đoạn 3: Quyết định bước ngoặt (Decisions)

Tại các lứa tuổi quy định, trò chơi tự động tạm dừng để bạn đưa ra lựa chọn:

| Tuổi | Quyết định | Ý nghĩa phân nhánh |
| :---: | :--- | :--- |
| **2** | **Tính cách khám phá** | Chọn tò mò ngắm nhìn thiên nhiên (tăng Trí tuệ), chạy nhảy náo nhiệt (tăng Sức khỏe), hay nép mình bên cha mẹ (tăng Hạnh phúc). |
| **6** | **Bước vào tiểu học** | Đi học đầy đủ rèn chữ nghĩa hay phải phụ giúp gia đình làm việc đồng áng sớm. |
| **12** | **Ngã rẽ trung học cơ sở** | Chăm chỉ học tập, chơi thể thao kết bạn, hay tham gia lao động kiếm thêm thu nhập. |
| **15** | **Định hướng trung học phổ thông** | Học trường chuyên hướng tới đại học, học trường nghề thực tế, hay bắt đầu đi làm nuôi thân. |
| **18** | **Ngưỡng cửa trưởng thành** | Học đại học danh giá, tham gia nghĩa vụ quân sự, hay ra đời lập nghiệp tự bươn chải. |
| **26** | **Tình yêu & Hôn nhân** | Kết hôn xây dựng mái ấm, tiếp tục độc thân tập trung sự nghiệp, hay phiêu lưu tìm kiếm cơ hội mới. |
| **35** | **An cư hay Mạo hiểm** | Dành dụm mua một căn nhà riêng khang trang, hay dùng toàn bộ vốn liếng khởi nghiệp kinh doanh mạo hiểm. |
| **42** | **Khủng hoảng tuổi trung niên** | Tìm lại sự cân bằng trước áp lực cuộc sống: dành thời gian cho bản thân, gắn kết gia đình, hay tiếp tục cày cuốc thăng tiến. |
| **62** | **Nghỉ hưu hay Cống hiến** | Nghỉ ngơi an hưởng tuổi già thảnh thơi bên thú cưng và vườn tược, hay tiếp tục làm cố vấn/tình nguyện viên xã hội. |
| **74** | **Nơi nương tựa xế chiều** | Chuyển về sống chung một mái nhà đầm ấm với con cháu, hay duy trì cuộc sống tự lập trong căn nhà quen thuộc. |

---

## 4. Giai đoạn 4: Các mốc chiêm nghiệm nhân khẩu học (Reflections)

Tại **5, 15, 30, 50, 70 tuổi**, bạn sẽ được đối diện với những câu hỏi suy ngẫm sâu sắc về những điều bình dị tưởng chừng đương nhiên:
- *Ví dụ ở tuổi 15:* Mái trường đối với bạn là nơi vui vẻ gặp bạn bè hay áp lực thi cử? Trong khi trên thế giới có hơn 250 triệu trẻ em cùng trang lứa không bao giờ được chạm tay vào cánh cổng trường học.
- Việc lựa chọn phương án không chỉ làm phong phú trải nghiệm cá nhân mà còn cộng điểm tinh thần và ghi lại cột mốc đáng nhớ trong biên niên sử cuộc đời.

---

## 5. Giai đoạn 5: Hoạt động & Cửa hàng đời sống (Shop)

Bất kỳ lúc nào trong quá trình sống, người chơi có thể bấm vào nút **"Hoạt động & Mua sắm"** để dùng tài sản của mình thực hiện:
- **Mời bữa cơm gia đình & bạn bè:** Tăng mạnh chỉ số quan hệ và niềm vui.
- **Khám sức khỏe tổng quát & Huấn luyện viên thể lực:** Tăng sức khỏe và giảm nguy cơ mắc các bệnh mãn tính nguy hiểm.
- **Du lịch trong nước & Nước ngoài:** Mở mang thế giới quan và nạp lại năng lượng tinh thần.
- **Khóa học nghề / Chứng chỉ:** Mở ra cơ hội đổi việc hoặc thăng chức nâng cao bậc lương.
- **Quyên góp từ thiện:** Đem lại niềm an ủi nội tâm to lớn.
- **Nhận nuôi thú cưng (Chó/Mèo):** Thú cưng sẽ xuất hiện sinh động ngay bên cạnh bạn trong khung tranh pixel diorama!

---

## 6. Giai đoạn 6: Kết thúc kiếp người & Tưởng niệm (Death & Memorial)

Khi nhịp tim dừng lại:
1. Khung tranh pixel diorama tự động chuyển thành **Lễ tưởng niệm trang nghiêm (`pxFuneral`)** với di ảnh người đã khuất, bàn thờ hoa trắng, khói nhang nghi ngút và người thân mặc tang phục đưa tiễn.
2. Bảng tổng kết cuộc đời sẽ hiển thị:
   - Tổng số năm đã sống trên đời và thứ hạng so với tuổi thọ trung bình của quốc gia.
   - Nguyên nhân qua đời cụ thể.
   - Tước hiệu cuộc đời (Ví dụ: *"Cuộc đời cống hiến 35 năm làm thợ may"*, *"Cuộc đời người lính đi qua khói lửa chiến tranh"*, *"Cuộc đời doanh nhân thành đạt"*).
   - Tình trạng sống sót của 4 người bạn sinh cùng giây.
3. Toàn bộ thông tin được ghi chép vào **Kho tàng tiền kiếp (Past Lives Archive)** để bạn có thể xem lại bất kỳ lúc nào.
4. Nhấn **"Đầu thai kiếp mới" (Reincarnate)** để khởi động lại một vòng luân hồi mới giữa 8 tỷ người!
