# Cấu trúc dữ liệu & Chỉ mục thống kê (Datasets Reference)

Tài liệu này giải thích cấu trúc và ý nghĩa của các bộ dữ liệu nhân khẩu học được trích xuất từ **1in8b.life** và các tổ chức quốc tế (**UN, WHO, World Bank, UNESCO**).

---

## 1. `countries.json` (Dữ liệu 172 Quốc gia)

Mỗi quốc gia được định danh bằng mã ISO 3 chữ cái (alpha-3) với các chỉ số nhân khẩu học:

```json
{
  "id": "VNM",
  "ko": "베트남",
  "p": "se",
  "nm": "vi",
  "rel": "F80,B15,C7,O2",
  "sp": "football,badminton",
  "b": 1500000,
  "pop": 98858,
  "le": 75.4,
  "gap": 5.4,
  "u5": 18.9,
  "im": 13.9,
  "ppp": 14249,
  "gi": 0.36,
  "tfr": 1.94,
  "mmr": 46,
  "urb": 39,
  "agr": 28,
  "hiv": 0.3,
  "hom": 1.5,
  "road": 30.6,
  "mal": 0,
  "net": 79,
  "ter": 35,
  "eys": 13.0,
  "sm": 45,
  "sf": 2,
  "oop": 43,
  "cm": 2,
  "wh": 5.41,
  "cs": null,
  "war": 0,
  "mig": "USA,JPN,KOR,AUS",
  "haz": "F"
}
```

### Ý nghĩa các trường thông số:
| Ký hiệu | Ý nghĩa | Đơn vị / Mô tả | Nguồn gốc |
| :--- | :--- | :--- | :--- |
| `id` | Mã quốc gia ISO 3166-1 alpha-3 | Chuỗi 3 ký tự (VD: `VNM`, `USA`, `KOR`) | ISO |
| `ko` | Tên quốc gia tiếng Hàn | Dùng làm khóa chuẩn đối chiếu | 1in8b.life |
| `p` | Mã phân vùng lục địa | `se` (Đông Nam Á), `eap` (Đông Á), `sa` (Nam Á), `ssa` (Châu Phi hạ Sahara), `mena` (Trung Đông - Bắc Phi), `lac` (Mỹ Latinh), `hi` (Nước thu nhập cao), `eca` (Đông Âu - Trung Á) | UN |
| `nm` | Mã ngôn ngữ đặt tên họ | Ví dụ: `vi` (Việt Nam), `ko` (Hàn Quốc), `en` (Anh/Mỹ) | 1in8b.life |
| `rel` | Phân bố tôn giáo | `F` (Tín ngưỡng dân gian), `B` (Phật giáo), `C` (Kitô giáo), `M` (Hồi giáo), `H` (Ấn Độ giáo), `N` (Không tôn giáo) | Pew Research |
| `sp` | Môn thể thao phổ biến | Phục vụ tạo sự kiện thể thao thanh thiếu niên | 1in8b.life |
| `b` | Số lượng trẻ sinh ra hàng năm | Dùng để tính xác suất vòng quay sinh tử ($b_i / \sum b$) | UN WPP |
| `pop` | Dân số quốc gia | Nghìn người | UN WPP |
| `le` | Tuổi thọ trung bình khi sinh (Life Expectancy) | Năm (VD: `75.4` năm) | WHO |
| `gap` | Chênh lệch tuổi thọ Nữ - Nam | Năm (Nữ thường sống lâu hơn Nam từ 3 đến 8 năm) | WHO |
| `u5` | Tỷ lệ tử vong trẻ dưới 5 tuổi | Số ca tử vong trên 1.000 trẻ sinh sống | UNICEF / WHO |
| `im` | Tỷ lệ tử vong trẻ sơ sinh (Infant Mortality) | Số ca tử vong dưới 1 tuổi trên 1.000 trẻ sinh sống | UNICEF / WHO |
| `ppp` | Thu nhập bình quân đầu người GDP (PPP) | Đô la quốc tế theo sức mua tương đương | World Bank |
| `gi` | Hệ số bất bình đẳng thu nhập Gini | Từ `0.0` (bình đẳng tuyệt đối) đến `1.0` (bất bình đẳng tuyệt đối) | World Bank |
| `tfr` | Tổng tỷ suất sinh (Total Fertility Rate) | Số con trung bình của một phụ nữ | UN WPP |
| `mmr` | Tỷ lệ tử vong mẹ khi sinh nở (Maternal Mortality Ratio) | Số ca tử vong trên 100.000 ca sinh sống | WHO |
| `urb` | Tỷ lệ dân số thành thị (Urbanization) | Phần trăm (%) dân số sống tại đô thị | UN Habitat |
| `agr` | Tỷ lệ lao động làm việc trong nông nghiệp | Phần trăm (%) lực lượng lao động nông nghiệp | ILO |
| `hiv` | Tỷ lệ nhiễm HIV | Phần trăm (%) dân số độ tuổi 15-49 | UNAIDS |
| `hom` | Tỷ lệ giết người do bạo lực (Homicide) | Số ca trên 100.000 dân mỗi năm | UNODC |
| `road` | Tỷ lệ tử vong do tai nạn giao thông | Số ca trên 100.000 dân mỗi năm | WHO |
| `net` | Tỷ lệ tiếp cận Internet | Phần trăm (%) dân số sử dụng Internet | ITU |
| `ter` | Tỷ lệ nhập học giáo dục đại học / cao đẳng | Phần trăm (%) độ tuổi tham gia giáo dục bậc 3 | UNESCO |
| `eys` | Số năm đi học kỳ vọng (Expected Years of Schooling) | Số năm một đứa trẻ được dự kiến đi học | UNDP HDI |
| `war` | Chỉ số rủi ro chiến tranh / xung đột vũ trang | `0` (hòa bình), `1` (căng thẳng), `2+` (chiến sự ác liệt) | UCDP |

---

## 2. `jobs.json` (Nghề nghiệp & Rủi ro nghề nghiệp)

Chứa hơn 50 ngành nghề với phân cấp bậc lương và nguy cơ tử vong:

```json
{
  "fisher": {
    "n": { "vi": "Ngư dân đánh bắt thủy hải sản", "en": "Fisher / Fisherwoman", "ko": "어부" },
    "s": "agr",
    "e": 0,
    "lo": 0.08,
    "hi": 0.42,
    "u": -1,
    "risk": { "drown": 3 }
  },
  "engineer": {
    "n": { "vi": "Kỹ sư kỹ thuật", "en": "Engineer", "ko": "엔지니어" },
    "s": "ind",
    "e": 4,
    "lo": 0.7,
    "hi": 0.95,
    "u": 1
  }
}
```

- `s`: Nhóm ngành (`agr`: nông nghiệp, `ind`: công nghiệp sản xuất, `ser`: dịch vụ, `gov`: nhà nước, `none`: học sinh/nghỉ hưu).
- `e`: Ngưỡng trình độ học vấn yêu cầu (`0`: không bắt buộc, `1`: tiểu học, `2`: THCS, `3`: THPT, `4`: đại học, `5`: sau đại học).
- `lo` - `hi`: Phân vị thu nhập trong xã hội (Ví dụ `0.70` đến `0.95` tương ứng top 5-30% thu nhập).
- `u`: Môi trường làm việc (`1`: đô thị, `-1`: nông thôn/biển đảo, `0`: cả hai).
- `risk`: Hệ số nhân rủi ro tai nạn tử vong đặc thù (`drown`: đuối nước, `fall`: té ngã công trường, `inj`: chấn thương máy móc).

---

## 3. `causes.json` (Nguyên nhân tử vong quốc tế)

33 nhóm nguyên nhân y tế được chuẩn hóa theo phân loại bệnh tật quốc tế ICD-11:
- **Nhóm sơ sinh:** `neo` (sinh non, ngạt sơ sinh), `congenital` (dị tật bẩm sinh).
- **Nhóm truyền nhiễm:** `lri` (viêm phổi cấp), `diar` (tiêu chảy mất nước), `mal` (sốt rét), `tb` (lao phổi), `hiv` (HIV/AIDS).
- **Nhóm tai nạn ngoại cảnh:** `road` (tai nạn giao thông), `drown` (đuối nước), `fall` (té ngã), `fire` (hỏa hoạn), `inj` (tai nạn lao động).
- **Nhóm mãn tính người già:** `ihd` (nhồi máu cơ tim thiếu máu cục bộ), `stroke` (đột quỵ não), `cancer` (ung thư), `copd` (phổi tắc nghẽn mạn tính), `kidney` (suy thận), `diabetes` (tiểu đường).

---

## 4. `dishes.json` (172 Món ăn truyền thống)

Liên kết mã quốc gia alpha-3 với món ăn mang đậm bản sắc dân tộc, hiển thị trực quan dưới khung tranh pixel diorama.

---

## 5. `reflections.json` (Cột mốc chiêm nghiệm)

Chứa câu hỏi phản tỉnh đời người, các phương án chọn lựa và sự thật thống kê nhân khẩu tương ứng cho các lứa tuổi 5, 15, 30, 50, và 70.

---

## 6. `shop.json` (Hoạt động & Mua sắm)

Danh mục trải nghiệm sống giúp người chơi quy đổi tài sản tích lũy thành chỉ số sức khỏe, hạnh phúc, học vấn và kết nối xã hội.
