# GeoTrivia Blog — Bộ Quy Chuẩn Biên Tập & Thiết Kế (Editorial & Design Rules)

Tài liệu này là quy chuẩn bắt buộc (Ground Truth Rules) cho toàn bộ hệ thống biên tập bài viết, thiết kế giao diện và pipeline tự động hóa của GeoTrivia Blog.

---

## 1. Quy Chuẩn Đặt Tiêu Đề Bài Viết (Headline / Title Formula)

### ❌ Những điều TUYỆT ĐỐI KHÔNG làm:
- Không dùng tên gọi danh từ riêng trơ trọi của Wikipedia (ví dụ: cấm để title chỉ là `"Colosseum"`, `"Tokyo"`, `"Neuschwanstein Castle"`).
- Không giật tít câu view rẻ tiền hoặc từ ngữ sáo rỗng đậm mùi AI (`"10 Secrets You Won't Believe...", "Everything You Need to Know..."`).

### ✅ Cấu trúc bắt buộc:
Tiêu đề bài viết bắt buộc phải tuân theo công thức **Compound Editorial Title**:
```
[Tên Địa Danh / Chủ Đề Gốc]: [Mỹ Từ Biên Tập / Đặc Trưng Nổi Bật]
```

### Các ví dụ chuẩn mẫu đã áp dụng:
| Chủ Đề Gốc | Tiêu Đề Biên Tập Chuẩn |
| :--- | :--- |
| Neuschwanstein Castle | **Neuschwanstein Castle: Fairytale Fortress of the Bavarian Alps** |
| The Colosseum | **The Colosseum: Monumental Amphitheatre of Imperial Rome** |
| Salar de Uyuni | **Salar de Uyuni: The World’s Giant Mirror Salt Flat** |
| Alhambra | **Alhambra: Moorish Citadel and Royal Palace of Granada** |
| Bran Castle | **Bran Castle: Transylvania’s Legendary Cliffside Fortress** |
| Amazon River | **Amazon River: The Mightiest Lifeline of the Global Biosphere** |
| Grand Canyon | **Grand Canyon: Monumental Gorge Carved by the Colorado River** |
| Route 66 | **Route 66: The Mother Road of American Exploration** |
| Tokyo | **Tokyo: Neon Metropolis and Imperial Heart of Japan** |
| Ancient Egypt | **Ancient Egypt: Pharaohs, Pyramids and Millennia Along the Nile** |
| Flag of Brazil | **Flag of Brazil: The Green, Gold and Starry Sky of Progress** |

Khi sinh bài viết tự động từ Wikipedia, script tự động ghép trường `dossier.description` đã viết hoa chữ cái đầu:
```javascript
const editorialTitle = dossier.description && !dossier.title.includes(':')
  ? `${dossier.title}: ${dossier.description.charAt(0).toUpperCase() + dossier.description.slice(1)}`
  : dossier.title;
```

---

## 2. Quy Chuẩn Đoạn Trích Dẫn Ngoài Thumbnail (Excerpt / Deck)

### Nguyên tắc:
- Không cắt ngang một câu văn giữa chừng hoặc để dấu ba chấm cộc lốc.
- Loại bỏ hoàn toàn các ký hiệu phiên âm quốc tế như `(German: [ˈʃlɔs...])`, `(French: [...])` hoặc ngoặc đơn giải thích ngữ âm của Wikipedia.
- Kết hợp câu mô tả ngắn gọn (`description`) làm đầu mối dẫn nhập + câu trích dẫn chắt lọc bối cảnh lịch sử/địa lý.
- **Độ dài lý tưởng**: 100 đến 160 ký tự.

### Ví dụ chuẩn:
> *"19th-century historicist palace in southwest Bavaria, Germany. Built by King Ludwig II on a rugged cliff soaring above the Pöllat Gorge, inspiring fairy-tale castles worldwide."*

---

## 3. Quy Chuẩn Thiết Kế Hình Ảnh & Thẻ Bài Viết (Visual & UI Rules)

1. **Hiệu Ứng Ảnh (Hover Effects)**:
   - **CẤM** hiệu ứng phóng to ảnh khi rê chuột (`group-hover:scale-105` hoặc `scale-110`).
   - Ảnh giữ nguyên kích thước tĩnh, sắc nét, chuyển màu nhẹ nhàng qua tiêu đề bài viết (`hover:text-[#3898ec]`).
2. **Độ Bo Cong Phân Cấp Theo Kích Thước (Tiered Border Radius)**:
   - **Ảnh nhỏ / Thumbnail phụ (< 150px)**: Dùng `rounded-md` (6px) gọn gàng, sắc sảo.
   - **Ảnh thẻ lưới trung bình (Grid Cards ~280px - 400px)**: Dùng `rounded-lg` (8px) tạo độ mềm mại vừa phải.
   - **Ảnh Hero / Banner / Bài viết lớn (> 600px)**: Dùng `rounded-xl` (12px) tạo cảm giác sang trọng, tạp chí cao cấp.
3. **Quy Chuẩn Tràn Khung & Khắc Phục Vệt Đen (Edge-to-Edge Cover Architecture)**:
   - Mọi khung chứa ảnh có `aspect-[...]` bắt buộc bọc thẻ `<a>` hoặc thẻ `<div>` con bằng `absolute inset-0 block w-full h-full`.
   - Component `<Image />` bắt buộc truyền `layout="cover"` kết hợp `class="w-full h-full object-cover object-center"`.
   - Điều này triệt tiêu hoàn toàn lỗi vệt đen ở đáy khung hình khi ảnh gốc có tỷ lệ rộng hơn khung (như cờ tỷ lệ 2:1 hoặc ảnh panorama).
4. **Nguồn Ảnh**:
   - 100% hình ảnh phân giải cao (1200px+) từ Wikimedia Commons có bản quyền mở (Public Domain, Creative Commons).
5. **Quy Chuẩn Nút Xem Thêm / Điều Hướng Mục (View all + Arrow Standard)**:
   - Thống nhất toàn bộ các link đầu mục (Section Headers) về định dạng chuẩn: `View all` kết hợp biểu tượng mũi tên SVG thanh mảnh.
   - Bỏ toàn bộ các tiền tố/hậu tố cộc lốc và ký tự thô như `All Castles »`, `All Wonders »`, `Browse Catalog »`.
   - Mũi tên có hiệu ứng trượt nhẹ sang phải khi rê chuột: `transition-transform duration-150 ease-out group-hover:translate-x-1`, màu xanh thương hiệu đồng nhất (`#3898ec` hover `#529bf5`).

---

## 4. Kiến Trúc Điều Hướng (Navbar 2-Tab Architecture)

Thanh menu điều hướng trên cùng luôn giữ cấu trúc gọn gàng:
```
[ GeoTrivia X ]    Home    [ Places & Nature ⌄ ]    [ Culture & History ⌄ ]    All Articles    [🔍] [☀️]
```

### Phân bổ 9 Chủ Đề vào 2 Tab:

- **Tab 1: `Places & Nature ⌄`**
  - Cột 1 (Architecture & Cities):
    - World Landmarks (`/category/world-landmarks`)
    - Castles & Palaces (`/category/castles-and-palaces`)
    - Cities & Capitals (`/category/cities-and-capitals`)
  - Cột 2 (Wild Earth & Routes):
    - Natural Wonders (`/category/natural-wonders`)
    - Street View & Routes (`/category/street-view-and-discovery`)
    - Countries & Territories (`/category/countries-and-territories`)
  - Featured Story: Lâu đài tiêu biểu (Neuschwanstein Castle)

- **Tab 2: `Culture & History ⌄`**
  - Cột 1 (Flags, Symbols & Arts):
    - Flags & Symbols (`/category/flags-and-symbols`)
    - Culture & Arts (`/category/culture-and-arts`)
  - Cột 2 (History & Archives):
    - History & Civilization (`/category/history-and-civilization`)
    - All Knowledge Catalog (`/blog`)
  - Featured Story: Di sản lịch sử cổ đại (The Roman Empire)

---

## 5. Danh Mục Bị Loại Bỏ Vĩnh Viễn (Excluded Topics)

- **Tiền Tệ (Currencies)**:
  - Bỏ toàn bộ các chủ đề liên quan đến tiền tệ (`Dollar`, `Euro`, `Yen`, `Franc`, `Pound`, `Dinar`, `Money`, `Banknotes`, `Coins`).
  - Bộ lọc trong script tự động [generate-blog-posts.js](file:///Users/alvesoscar517gmail.com/projects/geotrivia-webhook/scripts/generate-blog-posts.js) có regex chặn đứng mọi topic chứa các từ khóa tiền tệ.

---

## 6. Lệnh Vận Hành Pipeline Hàng Loạt (Automation CLI)

Script tại thư mục `geotrivia-webhook`:
```bash
# 1. Tạo bài viết cho một chủ đề cụ thể:
node scripts/generate-blog-posts.js --topic="Mount Fuji"

# 2. Quét tự động database câu hỏi và tạo 50 bài tiếp theo:
node scripts/generate-blog-posts.js --limit=50

# 3. Quét tự động và tạo 200 bài:
node scripts/generate-blog-posts.js --limit=200
```

Script sẽ tự động kiểm tra trùng lặp tệp, bỏ qua tiền tệ, lấy ảnh phân giải cao, ghép tiêu đề kép và tạo tệp `.md` chuẩn Astro Content Collections.

---

## 7. Quy Chuẩn Thẻ Phân Loại & Huy Hiệu (Badges & Tags)

1. **Kiểu Dáng Huy Hiệu (Badge Styling)**:
   - **Bỏ Hoàn Toàn Viền (Borderless)**: Không sử dụng `border`, giúp badge trông tinh tế, hòa hợp với nền tối và không bị đóng khung cứng nhắc.
   - **Bo Cong Tinh Tế (Soft Curved Corners)**: Sử dụng `rounded-md` (6px) tạo độ cong nhẹ nhàng tự nhiên (không dùng góc vuông `rounded-xs` hay viền gắt).
   - **Màu Sắc & Typography**: Nền xám tối dịu nhẹ (`bg-gray-100 dark:bg-slate-800`), chữ hoa tinh tế (`uppercase tracking-wider text-[11px] font-semibold text-gray-700 dark:text-slate-200`).
2. **Đa Chiều Nhãn Dán (Multi-Dimensional Smart Tags)**:
   - Mỗi bài viết sở hữu từ 3 đến 5 tag đa chiều được trích xuất từ dữ liệu Wikipedia/Atlas:
     - `Chuyên mục`: [World Landmarks], [Natural Wonders], v.v.
     - `Quốc gia`: [Italy], [Japan], [Bolivia], [Germany], v.v.
     - `Vùng địa lý / Khu vực`: [Bavaria], [Rome], [Andes], [East Asia], v.v.
     - `Đặc tính / Loại hình`: [Ancient Rome], [Salt Flat], [Alpine Fortress], [National Flag], v.v.
     - `Định danh di sản`: [UNESCO], [Extreme Landscape], [Metropolis], v.v.
---

## 8. Quy Chuẩn Chân Trang (Clean Landing Footer Architecture)

Theo đúng thiết kế tối giản của landing page dự án (`MotionFooter` trong `geotrivia-client`):

1. **Bố Cục Căn Giữa (Centered Minimalist Layout)**:
   - Thay thế bảng sitemap 5 cột dày đặc bằng cấu trúc tập trung, thoáng đãng và sang trọng.
   - Logo `GeoTrivia X` đặt chính giữa.
2. **Hiển Thị Danh Mục Của Trang (Site Categories)**:
   - Dàn ngang tinh gọn toàn bộ 9 chuyên mục trụ cột của tạp chí (`World Landmarks`, `Castles & Palaces`, `Cities & Capitals`, `Natural Wonders`, `Street View & Routes`, `Countries & Territories`, `Flags & Symbols`, `Culture & Arts`, `History & Civilization` + `All Articles`).
   - **LOẠI BỎ TOÀN BỘ** các đường link in-game không liên quan đến blog (`Play Online`, `World Map`, `Arena 1v1`, `Leaderboard`).
3. **Đường Ngăn Cách Nét Đứt (Dashed Divider)**:
   - Dùng đường kẻ `border-dashed` nhẹ nhàng ngăn cách khu vực danh mục với hàng bản quyền.
4. **Hàng Đáy (Bản Quyền, Điều Khoản & Mạng Xã Hội)**:
   - Bên trái: `© {year} GeoTrivia X. All rights reserved. · Privacy Policy · Terms of Service`
   - Bên phải: 4 icon mạng xã hội chính thức (`YouTube`, `TikTok`, `Instagram`, `Facebook`), **loại bỏ hoàn toàn icon RSS**.

---

## 9. Quy Chuẩn Hiển Thị Thẻ Lưới Đồng Đều (Uniform Card Grid Architecture)

Áp dụng cho toàn bộ các lưới bài viết chuẩn 4 cột (`Latest Dispatches` trang chủ, `Related Posts` trang chi tiết, danh mục):

1. **Chuẩn Hóa Tiêu Đề 3 Dòng (`line-clamp-3`)**:
   - Thẻ `<h3>` đặt `line-clamp-3`.
   - Với độ dài tiêu đề chuẩn (44–70 ký tự), toàn bộ bài viết sẽ hiển thị trọn vẹn 3 dòng, tạo nên độ cao tiêu đề đồng nhất tuyệt đối trên toàn bộ 4 cột mà không bị cắt cụt hay lệch dòng.
2. **Đoạn Trích Dẫn Chuẩn 2 Dòng (`line-clamp-2 text-sm mb-2.5`)**:
   - Thẻ `<p>` đặt `line-clamp-2 text-sm mb-2.5` để phần tóm tắt luôn đồng bộ chính xác 2 dòng trên mọi bài viết.
3. **Khoảng Cách Ngày Tháng Tự Nhiên Liền Kề**:
   - Khối thời gian `<time>` đặt ngay dưới đoạn trích dẫn với khoảng cách tự nhiên (`mb-2.5` ~ 10px), **không dùng `mt-auto` hay `min-h` cố định quá cao** tránh gây ra khoảng trống trắng nhân tạo giữa excerpt và ngày tháng.
   - Do tiêu đề (3 dòng) và excerpt (2 dòng) đều tăm tắp, toàn bộ ngày tháng tự động nằm trên cùng một đường kẻ ngang hoàn hảo.


