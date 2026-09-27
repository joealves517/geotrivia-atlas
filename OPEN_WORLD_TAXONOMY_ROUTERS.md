# GeoTrivia Atlas — Bảng Chuẩn Hoá 17 Router Chuyên Mục & Kho Dữ Liệu Mở Wikipedia
> **Tài liệu tham chiếu kiến trúc Taxonomy & Router**: Dùng làm căn cứ chuẩn để cào dữ liệu từ Wikipedia, ánh xạ Router hệ thống và định hướng AI biên tập tự động.

---

## 1. Kiểm Tra Xung Đột Router (Route Collision Audit)

### 1.1. So với Route Hệ Thống của Client App (`geotrivia-client`)
Toàn bộ chuyên mục Atlas đều được tổ chức dưới prefix `/atlas/*` (hoặc domain con `atlas.geotriviax.com`), do đó **hoàn toàn không xung đột** với các route nghiệp vụ của app client:
- `/leaderboard` (Bảng xếp hạng thành tích người chơi game) $\neq$ `/atlas/rankings` (Bảng xếp hạng chỉ số bách khoa địa lý toàn cầu).
- `/learn`, `/play`, `/pvp`, `/quests`, `/shop`, `/mastery`... giữ nguyên không bị ảnh hưởng.

### 1.2. So với 9 Danh Mục Hiện Tại Của Atlas
8 router mới lấp đầy các khoảng trống về đề tài khám phá địa lý, độc lập 100% với 9 danh mục cũ:

| Nhóm | Số lượng | Danh sách Router Slugs |
| :--- | :---: | :--- |
| **9 Danh mục trụ cột hiện tại (V1)** | 9 | `/atlas/world-landmarks`, `/atlas/castles-and-palaces`, `/atlas/cities-and-capitals`, `/atlas/natural-wonders`, `/atlas/street-view-and-discovery`, `/atlas/countries-and-territories`, `/atlas/flags-and-symbols`, `/atlas/culture-and-arts`, `/atlas/history-and-civilization` |
| **8 Danh mục mở rộng mới (V2)** | 8 | `/atlas/rankings`, `/atlas/paradoxes`, `/atlas/extremes`, `/atlas/borders`, `/atlas/micronations`, `/atlas/abandoned`, `/atlas/enigmas`, `/atlas/indigenous` |
| **TỔNG CỘNG HỆ THỐNG** | **17** | **17 Chuyên mục bách khoa địa lý toàn cầu** |

---

## 2. Chi Tiết 8 Router Mở Rộng & Mapping Trực Tiếp Wikipedia 100%

### 1. Router: `/atlas/rankings` (Xếp Hạng & Chỉ Số Toàn Cầu)
* **Tên hiển thị:** Rankings & Indices / Bảng Xếp Hạng & Chỉ Số Địa Cầu
* **Trang danh sách mẹ trên Wikipedia:** `List of international rankings`, `Global Liveability Index`, `List of oldest continuously inhabited cities`
* **Mục tiêu nội dung:** Các báo cáo thường niên, chỉ số văn minh, thành phố đáng sống và kỷ lục so sánh giữa các quốc gia.
* **10 Bài viết mẫu có sẵn 100% trên Wikipedia:**
  1. `Global Liveability Index` *(Chỉ số thành phố đáng sống nhất thế giới — Vienna, Copenhagen, Zurich...)*
  2. `List of oldest continuously inhabited cities` *(Top đô thị cổ nhất thế giới còn cư ngụ: Jericho, Damascus, Byblos, Varanasi)*
  3. `List of capital cities by elevation` *(Thủ đô cao nhất thế giới: La Paz 3.640m đối lập thủ đô thấp nhất Baku -28m)*
  4. `World Happiness Report` *(Báo cáo chỉ số hạnh phúc các quốc gia của Liên Hợp Quốc)*
  5. `Human Development Index` *(Chỉ số phát triển con người HDI)*
  6. `List of sovereign states by date of formation` *(Niên đại hình thành các quốc gia cổ xưa nhất)*
  7. `List of countries by system of government` *(Phân loại các thể chế chính trị và mô hình nhà nước trên thế giới)*
  8. `List of islands by area` *(Xếp hạng các hòn đảo tự nhiên lớn nhất hành tinh)*
  9. `List of largest cities` *(Xếp hạng các vùng đô thị đông dân nhất thế giới)*
  10. `Passport Index` *(Bảng xếp hạng quyền lực hộ chiếu toàn cầu)*

---

### 2. Router: `/atlas/paradoxes` (Nghịch Lý & Dị Biệt Địa Lý)
* **Tên hiển thị:** Geographic Paradoxes / Nghịch Lý Địa Lý
* **Trang danh sách mẹ trên Wikipedia:** `Geographical paradox`, `Enclave and exclave`, `List of enclaves and exclaves`
* **Mục tiêu nội dung:** Các điểm bất thường trên bản đồ, vùng đất lọt, vùng múi giờ dị biệt và lãnh thổ chia cắt kỳ lạ.
* **10 Bài viết mẫu có sẵn 100% trên Wikipedia:**
  1. `Baarle-Nassau` *(Thị trấn Hà Lan đan xen 22 mảnh đất tách rời của Bỉ Baarle-Hertog, cắt đôi từng ngôi nhà)*
  2. `Llívia` *(Thị trấn Tây Ban Nha nằm trọn trong lãnh thổ nước Pháp)*
  3. `Campione d'Italia` *(Lãnh thổ Ý nằm hoàn toàn trong bang Ticino của Thụy Sĩ)*
  4. `Diomede Islands` *(Đảo Hôm Qua và Đảo Ngày Mai: cách nhau 3.8 km nhưng lệch nhau 21 giờ do vướng IDL)*
  5. `Point Roberts, Washington` *(Mảnh đất của Mỹ không giáp đất liền với Mỹ, chỉ vào được qua đường bộ Canada)*
  6. `Northwest Angle` *(Mũi cực bắc của bang Minnesota bị bao quanh bởi hồ và lãnh thổ Canada)*
  7. `Kentucky Bend` *(Mảnh đất bang Kentucky bị uốn cong lọt thỏm giữa Missouri và Tennessee)*
  8. `Jungholz` *(Ngôi làng Áo chỉ nối với phần còn lại của nước Áo qua đúng một điểm đỉnh núi cao)*
  9. `Büsingen am Hochrhein` *(Thị trấn Đức nằm hoàn toàn trong lòng Thụy Sĩ, dùng franc Thụy Sĩ)*
  10. `Madha` & `Nahwa` *(Vùng đất lọt lồng nhau 3 tầng: Nahwa của UAE nằm trong Madha của Oman, Madha lại nằm trong UAE)*

---

### 3. Router: `/atlas/extremes` (Kỷ Lục & Điểm Cực Trái Đất)
* **Tên hiển thị:** Earth Extremes / Kỷ Lục & Điểm Cực Địa Cầu
* **Trang danh sách mẹ trên Wikipedia:** `Extremes on Earth`, `Lists of extreme points`, `Poles of inaccessibility`
* **Mục tiêu nội dung:** Các tọa độ giới hạn của Trái Đất về độ cao, độ sâu, nhiệt độ, độ ẩm và mức độ cô lập.
* **10 Bài viết mẫu có sẵn 100% trên Wikipedia:**
  1. `Point Nemo` *(Cực bất khả tiếp cận đại dương — nơi xa đất liền nhất trên Trái Đất, cách đất liền 2.688 km)*
  2. `Tristan da Cunha` *(Quần đảo có người định cư cô lập nhất thế giới giữa Nam Đại Tây Dương)*
  3. `Oymyakon` *(Ngôi làng có người ở vĩnh viễn lạnh nhất Trái Đất: từng chạm mốc -67.7°C)*
  4. `Furnace Creek, California` *(Thung lũng Chết — nơi ghi nhận nhiệt độ không khí nóng nhất lịch sử: 56.7°C)*
  5. `Mount Chimborazo` *(Đỉnh núi gần vũ trụ nhất hành tinh do Trái Đất phình to ở vùng xích đạo)*
  6. `Dead Sea` *(Vùng đất trũng tự nhiên thấp nhất trên cạn: -430 mét dưới mực nước biển)*
  7. `Challenger Deep` *(Điểm sâu nhất hành tinh ở đáy rãnh Mariana: gần 11.000 mét)*
  8. `Atacama Desert` *(Sa mạc khô hạn nhất thế giới, nhiều trạm khí tượng chưa từng thấy một giọt mưa)*
  9. `Mawsynram` *(Ngôi làng tại Meghalaya, Ấn Độ — nơi có lượng mưa trung bình năm cao nhất Trái Đất)*
  10. `Bouvet Island` *(Hòn đảo hoang dã cô lập nhất thế giới ở Nam Đại Dương, bao phủ 93% bởi băng tuyết)*

---

### 4. Router: `/atlas/borders` (Biên Giới Kỳ Lạ & Lãnh Thổ Vô Chủ)
* **Tên hiển thị:** Borders & Frontiers / Biên Giới & Lãnh Thổ Đặc Biệt
* **Trang danh sách mẹ trên Wikipedia:** `Terra nullius`, `Condominium (international law)`, `List of divided cities`
* **Mục tiêu nội dung:** Những đường biên giới đặc thù, vùng tranh chấp độc đáo, vùng đất không người nhận và hiệp ước chia sẻ lãnh thổ.
* **10 Bài viết mẫu có sẵn 100% trên Wikipedia:**
  1. `Bir Tawil` *(Vùng đất vô chủ 2.060 km² giữa Ai Cập và Sudan mà không quốc gia nào chịu nhận)*
  2. `Pheasant Island` *(Đảo Pheasant trên sông Bidasoa: cứ 6 tháng đổi chủ một lần giữa Pháp và Tây Ban Nha)*
  3. `Marie Byrd Land` *(Vùng đất vô chủ lớn nhất thế giới tại Nam Cực, diện tích 1.610.000 km²)*
  4. `Haskell Free Library and Opera House` *(Thư viện có đường biên giới Mỹ - Canada kẻ ngang sàn nhà)*
  5. `Hotel Arbez` *(Khách sạn biên giới Pháp - Thụy Sĩ với giường ngủ và phòng ăn nằm ở hai quốc gia)*
  6. `Korean Demilitarized Zone` *(Khu phi quân sự DMZ vĩ tuyến 38 — biên giới quân sự căng thẳng nhất thế giới)*
  7. `Green Line (Cyprus)` *(Vùng đệm Liên Hợp Quốc chia đôi thủ đô Nicosia của đảo Síp)*
  8. `Triple Frontier` *(Ngã ba biên giới ngã ba sông giữa Argentina, Brazil và Paraguay)*
  9. `Hans Island` *(Hòn đảo từng diễn ra "Cuộc chiến Whiskey" hòa bình giữa Đan Mạch và Canada)*
  10. `Derby Line, Vermont` *(Thị trấn nơi vỉa hè và sân nhà người dân là đường biên giới quốc tế)*

---

### 5. Router: `/atlas/micronations` (Vi Quốc Gia & Thực Thể Tự Xưng)
* **Tên hiển thị:** Micronations / Vi Quốc Gia & Thực Thể Đặc Thù
* **Trang danh sách mẹ trên Wikipedia:** `List of micronations`, `Micronation`, `List of states with limited recognition`
* **Mục tiêu nội dung:** Các thực thể có cờ, hiến pháp, hộ chiếu riêng nhưng không có sự công nhận quốc tế chính thức.
* **10 Bài viết mẫu có sẵn 100% trên Wikipedia:**
  1. `Principality of Sealand` *(Pháo đài biển thời Thế chiến II ngoài khơi Anh tuyên bố độc lập năm 1967)*
  2. `Freetown Christiania` *(Khu tự trị không xe hơi, có cờ và luật lệ riêng ngay trung tâm thủ đô Copenhagen)*
  3. `Republic of Molossia` *(Vi quốc gia tự xưng tại Nevada, Mỹ với đơn vị tiền tệ dựa trên bột làm bánh)*
  4. `Principality of Hutt River` *(Vùng đất từng tuyên bố ly khai khỏi nước Úc suốt 50 năm)*
  5. `Liberland` *(Quốc gia tự do tự xưng trên dải đất tranh chấp Gornja Siga ven sông Danube)*
  6. `Sovereign Military Order of Malta` *(Thực thể có chủ quyền được LHQ cấp quy chế quan sát viên dù không có đất đai)*
  7. `Mount Athos` *(Bán đảo tự trị linh thiêng tại Hy Lạp cấm hoàn toàn phụ nữ suốt hơn 1.000 năm qua)*
  8. `Principality of Seborga` *(Ngôi làng cổ ở Ý tuyên bố họ chưa từng được sáp nhập hợp pháp vào nước Ý)*
  9. `Ladonia (micronation)` *(Vi quốc gia nghệ thuật dựng trên bãi biển khu bảo tồn thiên nhiên Kullaberg, Thụy Điển)*
  10. `Empire of Atlantium` *(Vi quốc gia phi lãnh thổ ủng hộ quyền tự do công dân toàn cầu sáng lập tại Sydney)*

---

### 6. Router: `/atlas/abandoned` (Đô Thị Ma & Địa Danh Lãng Quên)
* **Tên hiển thị:** Ghost Towns & Ruins / Đô Thị Ma & Di Tích Lãng Quên
* **Trang danh sách mẹ trên Wikipedia:** `List of ghost towns`, `Modern ruins`
* **Mục tiêu nội dung:** Các đô thị, hòn đảo và công trình từng sầm uất nhưng bị bỏ hoang do thảm họa, cạn kiệt tài nguyên hoặc chiến sự.
* **10 Bài viết mẫu có sẵn 100% trên Wikipedia:**
  1. `Pripyat` *(Thành phố 50.000 dân bị bỏ hoang vĩnh viễn sau thảm họa hạt nhân Chernobyl năm 1986)*
  2. `Hashima Island` *(Đảo chiến hạm khai thác than ngoài khơi Nagasaki bị bỏ hoang từ năm 1974)*
  3. `Centralia, Pennsylvania` *(Thị trấn Mỹ có mỏ than cháy ngầm dưới lòng đất suốt từ 1962, mặt đường nứt bốc khói)*
  4. `Kolmanskop` *(Thị trấn kim cương thịnh vượng đầu thế kỷ 20 giữa sa mạc Namibia nay bị cát nuốt chửng)*
  5. `Craco` *(Thành phố cổ thời Trung cổ trên đỉnh núi đá ở Ý bị bỏ hoang do sạt lở đất)*
  6. `Varosha, Famagusta` *(Khu nghỉ dưỡng biển sang trọng bậc nhất Síp bị phong tỏa bởi hàng rào quân sự từ năm 1974)*
  7. `Oradour-sur-Glane` *(Ngôi làng tại Pháp được giữ nguyên hiện trạng đổ nát làm đài tưởng niệm Thế chiến II)*
  8. `Bodie, California` *(Thị trấn ma thời kỳ sốt vàng đào Wild West được bảo tồn nguyên bản)*
  9. `Kayaköy` *(Ngôi làng đá Hy Lạp cổ trên sườn núi ở Thổ Nhĩ Kỳ bị bỏ hoang sau cuộc trao đổi dân cư 1923)*
  10. `Humberstone and Santa Laura Saltpeter Works` *(Thị trấn khai thác diêm sinh bỏ hoang giữa sa mạc Atacama, Chile)*

---

### 7. Router: `/atlas/enigmas` (Hiện Tượng Tự Nhiên Kỳ Bí)
* **Tên hiển thị:** Earth Enigmas / Bí Ẩn Địa Cầu
* **Trang danh sách mẹ trên Wikipedia:** `List of unusual natural phenomena`, `Impact crater`, `Geological formation`
* **Mục tiêu nội dung:** Các kỳ quan địa chất dị thường, cấu trúc không gian nhìn từ vệ tinh và hiện tượng thiên nhiên bí ẩn.
* **10 Bài viết mẫu có sẵn 100% trên Wikipedia:**
  1. `Darvaza gas crater` *(Cổng Địa Ngục ở Turkmenistan — hố khí gas bốc cháy liên tục từ năm 1971)*
  2. `Richat Structure` *(Mắt của Sahara — cấu trúc địa chất tròn đồng tâm khổng lồ đường kính 40km)*
  3. `Catatumbo lightning` *(Cửa sông ở Venezuela nơi sét đánh liên tục tới 280 lần mỗi giờ)*
  4. `Blood Falls` *(Thác Nước Máu đỏ như rỉ sắt chảy ra từ sông băng Taylor ở Nam Cực)*
  5. `Racetrack Playa` *(Lòng hồ khô cạn ở Thung lũng Chết nơi những tảng đá tự di chuyển trên bùn)*
  6. `Socotra` *(Quần đảo tách biệt ở Yemen với loài cây máu rồng và thực vật như hành tinh khác)*
  7. `Lake Nyos` *(Hồ nước núi lửa ở Cameroon từng giải phóng đám mây khí CO2 ngầm gây thảm họa năm 1986)*
  8. `Morning Glory cloud` *(Hiện tượng mây cuộn hình ống dài hàng nghìn km hiếm gặp ở Vịnh Carpentaria, Úc)*
  9. `Bioluminescent bay` *(Các vịnh phát quang sinh học ở Puerto Rico phát sáng xanh lục lộng lẫy trong đêm)*
  10. `Great Blue Hole` *(Hố sụt khổng lồ dưới đáy biển ngoài khơi Belize, thiên đường thám hiểm đại dương)*

---

### 8. Router: `/atlas/indigenous` (Văn Hóa Bản Địa & Nhân Chủng Học Độc Bản)
* **Tên hiển thị:** Indigenous & Peoples / Văn Hóa Bản Địa & Bộ Lạc Độc Bản
* **Trang danh sách mẹ trên Wikipedia:** `Uncontacted peoples`, `Indigenous peoples`, `Nomad`
* **Mục tiêu nội dung:** Các tộc người giữ gìn tập tục sinh tồn nguyên bản, các cộng đồng sống hòa hợp với môi trường khắc nghiệt.
* **10 Bài viết mẫu có sẵn 100% trên Wikipedia:**
  1. `Sama-Bajau` *(Người du mục biển Đông Nam Á có lá lách to hơn 50% để lặn tự do săn mồi)*
  2. `Sentinelese` *(Bộ tộc săn bắt hái lượm sống cô lập tuyệt đối trên đảo Bắc Sentinel, vịnh Bengal)*
  3. `Tuareg people` *(Hiệp sĩ xanh của sa mạc Sahara nơi nam giới giữ tập tục đeo khăn che mặt Indigo)*
  4. `Sámi people` *(Tộc người bản địa duy nhất tại Châu Âu với văn hóa du mục tuần lộc tuyết)*
  5. `Yanomami` *(Bộ tộc sống trong những ngôi nhà tròn khổng lồ shabono sâu trong rừng già Amazon)*
  6. `Coober Pedy` *(Thị trấn khai thác đá mắt mèo ở Úc nơi cộng đồng sinh sống và xây nhà thờ dưới lòng đất)*
  7. `Maasai people` *(Cộng đồng bán du mục Đông Phi nổi tiếng với trang phục Shúkà và điệu nhảy bật cao Adumu)*
  8. `Ainu people` *(Tộc người bản địa của đảo Hokkaido, Nhật Bản với ngôn ngữ và tín ngưỡng thờ gấu độc lập)*
  9. `Hadzabe people` *(Một trong những bộ tộc săn bắt hái lượm thuần túy cuối cùng còn lại ở Tanzania)*
  10. `Inuit` *(Các dân tộc bản địa vùng Bắc Cực với nghệ thuật sinh tồn băng tuyết và nhà vòm tuyết Igloo)*

---

## 3. Bản Đồ Tổng Hợp 17 Router Chuẩn Hóa Cho AI Biên Tập

Khi đưa vào pipeline biên tập AI, mô hình chỉ cần nhận 3 tham số đầu vào:
1. `topic` (Tên thực thể tiếng Anh trên Wikipedia).
2. `category` (1 trong 17 router slugs dưới đây).
3. `subject` (Từ khóa ngữ cảnh nếu có).

```
1.  /atlas/world-landmarks           --> Kỳ quan kiến trúc, di tích cổ đại (Wikipedia: Category:Landmarks)
2.  /atlas/castles-and-palaces       --> Lâu đài, cung điện hoàng gia (Wikipedia: Category:Castles)
3.  /atlas/natural-wonders           --> Thác, núi lửa, hẻm vực, đại dương (Wikipedia: Category:Natural wonders)
4.  /atlas/flags-and-symbols         --> Quốc kỳ, biểu trưng, quốc huy (Wikipedia: Portal:Vexillology)
5.  /atlas/countries-and-territories --> Quốc gia, địa lý tổng quan lãnh thổ (Wikipedia: Portal:Geography)
6.  /atlas/cities-and-capitals       --> Thủ đô, siêu đô thị lịch sử (Wikipedia: Category:Cities)
7.  /atlas/street-view-and-discovery --> Cung đường ngoạn mục, toạ độ 360° (Wikipedia: Category:Exploration)
8.  /atlas/culture-and-arts          --> Nghệ thuật truyền thống, ẩm thực, lễ hội (Wikipedia: Portal:Culture)
9.  /atlas/history-and-civilization  --> Đế chế cổ đại, mốc son lịch sử (Wikipedia: Portal:History)
10. /atlas/rankings                  --> Xếp hạng thành phố, quốc gia, chỉ số đáng sống (Wikipedia: Global Liveability Index)
11. /atlas/paradoxes                 --> Vùng đất lọt, nghịch lý bản đồ, múi giờ (Wikipedia: Category:Geographical paradoxes)
12. /atlas/extremes                  --> Cực Point Nemo, nơi nóng nhất, lạnh nhất, sâu nhất (Wikipedia: Category:Extreme points of Earth)
13. /atlas/borders                   --> Vùng đất vô chủ, biên giới chia cắt, đảo dùng chung (Wikipedia: Category:International borders)
14. /atlas/micronations              --> Vi quốc gia, pháo đài tự xưng, cộng đồng độc lập (Wikipedia: Category:Micronations)
15. /atlas/abandoned                 --> Thành phố ma Chernobyl, mỏ than cháy Centralia (Wikipedia: Category:Ghost towns)
16. /atlas/enigmas                   --> Cổng địa ngục, Mắt Sahara, sét vĩnh cửu (Wikipedia: Category:Natural phenomena)
17. /atlas/indigenous                --> Người du mục biển Bajau, bộ lạc cô lập Sentinel (Wikipedia: Category:Indigenous peoples)
```
