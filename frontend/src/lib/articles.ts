export interface Article {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  titleZh: string;
  excerpt: string;
  excerptEn: string;
  excerptZh: string;
  body: string;
  bodyEn: string;
  bodyZh: string;
  category: string;
  categoryEn: string;
  categoryZh: string;
  author: string;
  date: string;
  readMin: number;
  image: string;
  featured?: boolean;
}

export const articles: Article[] = [
  {
    id: "1",
    slug: "thi-truong-bds-tphcm-q1-2026",
    title: "Thị trường BĐS TP.HCM Q1/2026: Phân khúc căn hộ phục hồi mạnh, giao dịch tăng 35%",
    titleEn: "HCMC Real Estate Q1/2026: Apartment Segment Rebounds Strongly, Transactions Up 35%",
    titleZh: "胡志明市2026年第一季度房地产：公寓市场强劲复苏，交易量增长35%",
    excerpt: "Theo báo cáo từ CBRE Việt Nam, phân khúc căn hộ tại TP.HCM ghi nhận lượng giao dịch tăng 35% trong Q1/2026 so với cùng kỳ năm ngoái.",
    excerptEn: "According to CBRE Vietnam, the HCMC apartment segment saw a 35% increase in transactions in Q1/2026 compared to the same period last year.",
    excerptZh: "据CBRE越南报告，2026年第一季度胡志明市公寓交易量同比增长35%。",
    body: `Theo báo cáo từ CBRE Việt Nam công bố đầu tháng 5/2026, phân khúc căn hộ tại TP.HCM ghi nhận lượng giao dịch tăng **35%** trong Q1/2026 so với cùng kỳ năm ngoái, đánh dấu sự phục hồi mạnh mẽ sau giai đoạn thị trường trầm lắng kéo dài.

## Nguyên nhân phục hồi

Có ba yếu tố chính thúc đẩy thị trường:

1. **Lãi suất cho vay mua nhà giảm** xuống còn 8–9%/năm (từ mức đỉnh 13–14% năm 2023), kéo nhu cầu thực tế tăng mạnh.
2. **Nguồn cung mới chất lượng cao** từ các dự án lớn như Vinhomes Grand Park, Masteri Centre Point và The Global City tung hàng trong quý.
3. **Dòng vốn FDI** tiếp tục chảy vào lĩnh vực bất động sản, đặc biệt từ nhà đầu tư Hàn Quốc, Nhật Bản và Singapore.

## Phân khúc nổi bật

Căn hộ hạng trung (1–3 tỷ đồng) ghi nhận tỷ lệ hấp thụ tốt nhất, đặc biệt tại khu Đông TP.HCM (TP. Thủ Đức). Căn hộ hạng sang (trên 5 tỷ) cũng có giao dịch tăng song tốc độ chậm hơn.

## Dự báo Q2/2026

Chuyên gia CBRE nhận định Q2/2026 sẽ tiếp tục xu hướng tích cực, tuy nhiên cảnh báo về nguy cơ tăng giá quá nhanh ở một số dự án do nguồn cung vẫn còn hạn chế.`,
    bodyEn: `According to a report by CBRE Vietnam published in early May 2026, the HCMC apartment segment recorded a **35% increase** in transactions in Q1/2026 compared to the same period last year, marking a strong recovery after a prolonged market slowdown.

## Key Recovery Drivers

Three main factors are driving the market:

1. **Lower mortgage rates** down to 8–9%/year (from a peak of 13–14% in 2023), boosting real demand.
2. **New quality supply** from major projects like Vinhomes Grand Park, Masteri Centre Point, and The Global City launching during the quarter.
3. **Continued FDI inflows** into real estate, especially from Korean, Japanese, and Singaporean investors.

## Standout Segments

Mid-range apartments (1–3 billion VND) recorded the best absorption rates, particularly in eastern HCMC (Thu Duc City). Luxury apartments (above 5 billion VND) also saw increased transactions, albeit at a slower pace.

## Q2/2026 Outlook

CBRE experts believe Q2/2026 will continue the positive trend, but warn about the risk of excessive price increases in some projects due to still-limited supply.`,
    bodyZh: `据CBRE越南2026年5月初发布的报告，2026年第一季度胡志明市公寓交易量同比增长**35%**，标志着在漫长低迷期后市场强劲复苏。

## 主要复苏驱动因素

三大因素推动市场：

1. **房贷利率下降**至8-9%/年（从2023年高峰13-14%回落），带动真实需求增加。
2. **优质新供应**：Vinhomes大公园、Masteri中央广场及The Global City等大型项目在本季度推出。
3. **FDI持续流入**房地产领域，尤其来自韩国、日本和新加坡投资者。

## 突出细分市场

中端公寓（10-30亿越南盾）在胡志明市东部（守德市）录得最佳吸纳率。豪华公寓（50亿以上）交易量同样增加，但速度较慢。

## 2026年第二季度展望

CBRE专家认为第二季度将延续积极趋势，但警惕部分项目因供应仍有限而价格过快上涨的风险。`,
    category: "Thị trường", categoryEn: "Market", categoryZh: "市场",
    author: "Nguyễn Minh Tuấn", date: "2026-04-28", readMin: 5,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200",
    featured: true,
  },
  {
    id: "2",
    slug: "nghi-dinh-mua-nha-nguoi-nuoc-ngoai-2026",
    title: "Nghị định mới mở rộng quyền mua nhà cho người nước ngoài tại Việt Nam",
    titleEn: "New Decree Expands Property Rights for Foreigners in Vietnam",
    titleZh: "新法令扩大外国人在越南的购房权利",
    excerpt: "Chính phủ Việt Nam vừa ban hành nghị định cho phép người nước ngoài sở hữu căn hộ tại Việt Nam lên đến 70 năm, tăng từ mức 50 năm trước đó.",
    excerptEn: "The Vietnamese government has issued a new decree allowing foreigners to own apartments in Vietnam for up to 70 years, increased from the previous 50-year limit.",
    excerptZh: "越南政府新发布法令，允许外国人持有越南公寓产权最长70年，从此前的50年提高。",
    body: `Ngày 15/4/2026, Chính phủ Việt Nam chính thức ban hành Nghị định số 45/2026/NĐ-CP quy định chi tiết về quyền sở hữu nhà ở của tổ chức, cá nhân nước ngoài tại Việt Nam.

## Những điểm mới quan trọng

### Thời hạn sở hữu kéo dài
Người nước ngoài được phép sở hữu căn hộ chung cư tại Việt Nam **lên đến 70 năm** (tăng từ 50 năm theo Luật Nhà ở 2014). Đặc biệt, chủ sở hữu được gia hạn thêm **một lần** nữa với thời hạn tương đương.

### Mở rộng đối tượng
Ngoài cá nhân nước ngoài nhập cảnh hợp pháp, nay còn bao gồm:
- Người Việt Nam định cư ở nước ngoài (Việt kiều)
- Doanh nghiệp FDI đang hoạt động tại Việt Nam
- Tổ chức quốc tế có trụ sở tại Việt Nam

### Điều kiện và giới hạn
- Tổng số căn hộ nước ngoài không vượt quá **30%** mỗi tòa nhà
- Không mua tại khu vực quốc phòng, an ninh
- Phải thông qua sàn giao dịch bất động sản được cấp phép

## Tác động lên thị trường

Chuyên gia bất động sản đánh giá đây là bước tiến quan trọng, dự kiến thu hút thêm 15–20% lượng cầu từ người nước ngoài vào các dự án cao cấp tại TP.HCM, Hà Nội và Đà Nẵng.`,
    bodyEn: `On April 15, 2026, the Vietnamese government officially issued Decree No. 45/2026/ND-CP detailing the housing ownership rights of foreign organizations and individuals in Vietnam.

## Key New Provisions

### Extended Ownership Period
Foreigners may own condominiums in Vietnam for **up to 70 years** (increased from 50 years under the 2014 Housing Law). Owners may renew for **one additional term** of equivalent duration.

### Expanded Eligibility
Beyond legally-entered foreign individuals, the decree now covers:
- Overseas Vietnamese (Viet Kieu)
- FDI enterprises operating in Vietnam
- International organizations headquartered in Vietnam

### Conditions and Limits
- Foreign-owned units cannot exceed **30%** of any single building
- No purchases in national defense or security zones
- Transactions must go through licensed real estate exchanges

## Market Impact

Real estate experts view this as a significant step forward, expected to attract an additional 15–20% in foreign demand for premium projects in HCMC, Hanoi, and Da Nang.`,
    bodyZh: `2026年4月15日，越南政府正式颁布第45/2026/NĐ-CP号法令，详细规定外国组织和个人在越南的住房所有权。

## 主要新规定

### 延长产权期限
外国人可在越南持有公寓**最长70年**（较2014年《住房法》的50年有所提高）。业主可续期**一次**，期限相同。

### 扩大适用范围
除合法入境的外国人外，现包括：
- 海外越南人（越侨）
- 在越南运营的FDI企业
- 在越南设有总部的国际组织

### 条件与限制
- 每栋楼中外资持有单元不得超过**30%**
- 不得在国防、安全地区购房
- 须通过持牌房地产交易所进行交易

## 市场影响

房地产专家认为这是重要进步，预计将为胡志明市、河内和岘港的高端项目带来额外15-20%的外国需求。`,
    category: "Pháp lý", categoryEn: "Legal", categoryZh: "法规",
    author: "Trần Thu Hà", date: "2026-04-22", readMin: 4,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200",
    featured: true,
  },
  {
    id: "3",
    slug: "dat-nen-ngoai-thanh-ha-noi-2026",
    title: "Đất nền ngoại thành Hà Nội: Cơ hội đầu tư cuối 2026 hay bẫy thanh khoản?",
    titleEn: "Hanoi Suburban Land: Investment Opportunity in Late 2026 or Liquidity Trap?",
    titleZh: "河内郊区土地：2026年末投资机会还是流动性陷阱？",
    excerpt: "Giá đất nền tại các huyện ngoại thành Hà Nội như Mê Linh, Sóc Sơn, Hoài Đức đang có dấu hiệu phục hồi nhờ hạ tầng giao thông được đầu tư mạnh.",
    excerptEn: "Land prices in Hanoi's suburban districts like Me Linh, Soc Son, and Hoai Duc are showing recovery signs as infrastructure improves.",
    excerptZh: "随着交通基础设施改善，河内美灵、朔山等郊区地价出现回暖迹象。",
    body: `Trong bối cảnh thị trường đất nền đô thị trung tâm Hà Nội tiếp tục neo ở mức giá cao, nhiều nhà đầu tư đang chuyển hướng sang các huyện ngoại thành với mức giá hợp lý hơn.

## Khu vực đang được chú ý

**Mê Linh**: Hưởng lợi trực tiếp từ tuyến Metro số 5 (Văn Cao – Hòa Lạc) dự kiến hoàn thành 2028. Giá đất hiện ở mức 18–25 triệu/m², tăng khoảng 15% so với đầu năm.

**Sóc Sơn**: Gần sân bay Nội Bài, hưởng lợi từ cao tốc Nội Bài – Nhật Tân mở rộng. Giá từ 12–20 triệu/m².

**Hoài Đức**: Đang được phát triển mạnh với nhiều khu đô thị mới. Giá 30–45 triệu/m² cho vị trí gần đường lớn.

## Cảnh báo về thanh khoản

Tuy nhiên, nhiều chuyên gia cảnh báo:
- **Thanh khoản thấp**: Thời gian bán trung bình 6–18 tháng
- **Pháp lý chưa hoàn thiện**: Nhiều lô đất vẫn chưa có sổ đỏ từng nền
- **Rủi ro quy hoạch**: Thông tin quy hoạch thay đổi thường xuyên

## Kết luận

Đất nền ngoại thành Hà Nội phù hợp cho **nhà đầu tư dài hạn** (5–10 năm) với vốn nhàn rỗi. Không phù hợp cho người cần thanh khoản nhanh hoặc dùng vốn vay.`,
    bodyEn: `As central Hanoi land prices remain elevated, many investors are shifting to suburban districts with more reasonable pricing.

## Areas of Interest

**Me Linh**: Directly benefiting from Metro Line 5 (Van Cao – Hoa Lac) expected to complete in 2028. Current land prices: 18–25 million VND/sqm, up ~15% since early year.

**Soc Son**: Near Noi Bai Airport, benefiting from expanded Noi Bai – Nhat Tan expressway. Prices: 12–20 million VND/sqm.

**Hoai Duc**: Under strong development with multiple new urban zones. Prices: 30–45 million VND/sqm for major road frontage.

## Liquidity Warnings

However, experts warn:
- **Low liquidity**: Average selling time of 6–18 months
- **Incomplete legal documents**: Many plots still lack individual red books
- **Planning risks**: Zoning information changes frequently

## Conclusion

Hanoi suburban land suits **long-term investors** (5–10 years) with idle capital. Not suitable for those needing quick liquidity or leveraged purchases.`,
    bodyZh: `在河内市中心地价持续居高的背景下，许多投资者正转向价格更合理的郊区。

## 关注区域

**美灵**：直接受益于预计2028年完工的5号地铁线（文高-和乐）。当前地价：1800-2500万越南盾/平方米，较年初上涨约15%。

**朔山**：临近内排机场，受益于内排-日新高速扩建。价格：1200-2000万越南盾/平方米。

**怀德**：正在大力发展，有多个新城区项目。大路沿线地价：3000-4500万越南盾/平方米。

## 流动性警示

专家警告：
- **流动性低**：平均出售周期6-18个月
- **法律文件不完整**：许多地块仍无单独红书
- **规划风险**：区划信息频繁变动

## 结论

河内郊区土地适合有**长期规划**（5-10年）且资金充裕的投资者，不适合需要快速变现或使用贷款购买者。`,
    category: "Đầu tư", categoryEn: "Investment", categoryZh: "投资",
    author: "Lê Quang Hào", date: "2026-04-19", readMin: 6,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
    featured: false,
  },
  {
    id: "4",
    slug: "van-phong-cho-thue-quan-1-hcm",
    title: "Văn phòng hạng A quận 1 TP.HCM: Tỷ lệ lấp đầy đạt 92%, giá thuê tăng nhẹ",
    titleEn: "Grade A Offices in District 1 HCMC: 92% Occupancy, Rental Rates Edge Up",
    titleZh: "胡志明市第一区A级写字楼：入住率达92%，租金小幅上涨",
    excerpt: "Thị trường văn phòng hạng A tại trung tâm TP.HCM tiếp tục ổn định với tỷ lệ lấp đầy ở mức cao 92%.",
    excerptEn: "The Grade A office market in central HCMC remains stable with a high 92% occupancy rate.",
    excerptZh: "胡志明市中心A级写字楼市场保持稳定，入住率高达92%。",
    body: `Theo báo cáo Q1/2026 của JLL Việt Nam, thị trường văn phòng hạng A tại Quận 1 và quận trung tâm TP.HCM tiếp tục duy trì tỷ lệ lấp đầy ổn định ở mức **92%**.

## Giá thuê hiện tại

- **Hạng A**: 45–55 USD/m²/tháng (tăng 3–5% so với 2025)
- **Hạng B**: 25–35 USD/m²/tháng
- **Xu hướng**: Giá thuê văn phòng hạng A có khả năng tăng thêm 5–7% trong nửa cuối 2026

## Dự án mới sắp ra mắt

Hai tòa nhà văn phòng hạng A mới dự kiến hoàn thiện cuối 2026:
- **One Central HCM** tại đường Võ Văn Kiệt (~40,000 m² sàn văn phòng)
- **Thiso Mall & Offices** tại khu vực Thủ Đức (~25,000 m²)

## Xu hướng thuê mặt bằng

Các công ty công nghệ, fintech và startup tiếp tục là nhóm khách thuê lớn nhất, chiếm 35% lượng hợp đồng mới. Nhiều công ty đa quốc gia cũng đang tái cấu trúc không gian làm việc theo mô hình hybrid.`,
    bodyEn: `According to JLL Vietnam's Q1/2026 report, the Grade A office market in District 1 and central HCMC continues to maintain a stable occupancy rate of **92%**.

## Current Rental Rates

- **Grade A**: $45–55/sqm/month (up 3–5% vs 2025)
- **Grade B**: $25–35/sqm/month
- **Outlook**: Grade A rental rates likely to increase another 5–7% in H2 2026

## Upcoming New Projects

Two new Grade A office buildings expected to complete by end-2026:
- **One Central HCM** on Vo Van Kiet Street (~40,000 sqm office space)
- **Thiso Mall & Offices** in Thu Duc area (~25,000 sqm)

## Leasing Trends

Technology companies, fintech, and startups remain the largest tenant group, accounting for 35% of new contracts. Many multinationals are also restructuring workspace under hybrid models.`,
    bodyZh: `据JLL越南2026年第一季度报告，胡志明市第一区及中央商务区A级写字楼市场保持稳定入住率**92%**。

## 当前租金水平

- **A级**：45-55美元/平方米/月（较2025年上涨3-5%）
- **B级**：25-35美元/平方米/月
- **展望**：A级写字楼租金有望在2026年下半年再涨5-7%

## 即将推出的新项目

两栋新A级写字楼预计2026年底竣工：
- **One Central HCM**（武文杰大道，约4万平方米办公面积）
- **Thiso Mall & Offices**（守德区，约2.5万平方米）

## 租赁趋势

科技公司、金融科技和初创企业继续是最大租户群体，占新合同的35%。许多跨国公司也在按混合办公模式重组工作空间。`,
    category: "Thương mại", categoryEn: "Commercial", categoryZh: "商业",
    author: "Phạm Hương Giang", date: "2026-04-15", readMin: 3,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
    featured: false,
  },
  {
    id: "5",
    slug: "phu-my-hung-q7-bien-dong-gia",
    title: "Biệt thự Phú Mỹ Hưng quận 7: Giá neo cao, giao dịch chậm nhưng sóng mới đang đến",
    titleEn: "Phu My Hung District 7 Villas: Prices Stay High, Slow Transactions but New Wave Coming",
    titleZh: "第七区富美兴别墅：价格坚挺，交易缓慢但新一波行情即将到来",
    excerpt: "Phân khúc biệt thự tại Phú Mỹ Hưng vẫn neo giá cao từ 25–45 tỷ đồng/căn. Giao dịch chậm nhưng theo nhiều chuyên gia, sóng cơ sở hạ tầng mới sắp hoàn thiện sẽ thúc đẩy giá trong cuối năm.",
    excerptEn: "Phu My Hung villas remain priced at 25–45 billion VND per unit. While transactions are slow, experts believe upcoming infrastructure completions will drive prices up by year-end.",
    excerptZh: "富美兴别墅价格坚挺在250-450亿越南盾区间，交易缓慢，但专家预计年底将出现新行情。",
    body: `Khu đô thị Phú Mỹ Hưng, quận 7 tiếp tục là một trong những khu vực có giá biệt thự cao nhất tại TP.HCM, với mức giá dao động **25–45 tỷ đồng/căn** tùy vị trí và diện tích.

## Tình hình giao dịch hiện tại

Giao dịch thực tế chậm, chỉ khoảng 15–20 căn/tháng trong toàn khu. Phần lớn giao dịch thứ cấp (mua đi bán lại), không có sơ cấp mới từ chủ đầu tư Phú Mỹ Hưng Corporation.

## Yếu tố hỗ trợ giá

Các dự án hạ tầng sắp hoàn thiện:
- **Đường Nguyễn Hữu Thọ mở rộng**: Giảm thời gian di chuyển vào trung tâm Q1 xuống còn 15–20 phút
- **Tuyến Metro số 4**: Kết nối Phú Mỹ Hưng với ga Bến Thành, dự kiến 2027
- **Trung tâm thương mại SC VivoCity mở rộng**: Thêm 30,000 m² khu vui chơi giải trí

## Lời khuyên đầu tư

Chuyên gia khuyến nghị nhà đầu tư nên **chờ đến Q4/2026** khi Metro số 4 có nhiều cập nhật rõ ràng hơn trước khi quyết định đầu tư. Biệt thự Phú Mỹ Hưng phù hợp cho đầu tư dài hạn, không phải lướt sóng ngắn hạn.`,
    bodyEn: `Phu My Hung urban zone in District 7 continues to be one of HCMC's highest-priced villa areas, with prices ranging from **25–45 billion VND per unit** depending on location and size.

## Current Transaction Status

Actual transactions are slow at around 15–20 units/month for the entire zone. Most are secondary market transactions (resale), with no new primary supply from Phu My Hung Corporation.

## Price Support Factors

Upcoming infrastructure projects:
- **Widened Nguyen Huu Tho Road**: Reducing downtown District 1 travel time to 15–20 minutes
- **Metro Line 4**: Connecting Phu My Hung to Ben Thanh station, expected 2027
- **SC VivoCity Mall Expansion**: Adding 30,000 sqm entertainment space

## Investment Advice

Experts recommend investors **wait until Q4/2026** for clearer updates on Metro Line 4 before committing. Phu My Hung villas suit long-term investors, not short-term flippers.`,
    bodyZh: `富美兴第7区城市区仍是胡志明市别墅价格最高的地区之一，价格因位置和面积不同在**250-450亿越南盾/套**之间波动。

## 当前交易状况

整个区域实际交易缓慢，每月约15-20套。大多数为二手交易（转售），富美兴公司无新的一手供应。

## 价格支撑因素

即将完成的基础设施项目：
- **阮惠道路拓宽**：将前往第一区中心的时间缩短至15-20分钟
- **4号地铁线**：连接富美兴与滨城站，预计2027年
- **SC VivoCity商场扩建**：新增3万平方米娱乐空间

## 投资建议

专家建议投资者**等到2026年第四季度**待4号地铁线有更明确进展后再决策。富美兴别墅适合长期投资，不适合短期炒作。`,
    category: "Thị trường", categoryEn: "Market", categoryZh: "市场",
    author: "Nguyễn Thanh Phong", date: "2026-04-10", readMin: 4,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200",
    featured: false,
  },
  {
    id: "6",
    slug: "kien-thuc-mua-nha-lan-dau",
    title: "Hướng dẫn toàn diện cho người mua nhà lần đầu tại Việt Nam năm 2026",
    titleEn: "Complete Guide for First-Time Home Buyers in Vietnam 2026",
    titleZh: "2026年越南首次购房完全指南",
    excerpt: "Mua nhà lần đầu có thể gây choáng ngợp. Bài viết này tổng hợp từ A đến Z: kiểm tra pháp lý, thủ tục vay ngân hàng, phí trước bạ, thuế và những lưu ý khi ký hợp đồng.",
    excerptEn: "Buying your first home can be overwhelming. This guide covers legal checks, bank loans, registration fees, taxes, and contract signing tips.",
    excerptZh: "首次购房可能令人不知所措。本文涵盖法律检查、银行贷款、过户费、税收及合同注意事项。",
    body: `Mua nhà lần đầu là quyết định tài chính lớn nhất cuộc đời nhiều người. Hướng dẫn này sẽ đưa bạn qua từng bước của quá trình mua nhà tại Việt Nam năm 2026.

## Bước 1: Chuẩn bị tài chính

**Vốn tự có tối thiểu**: Ngân hàng thường cho vay tối đa 70–80% giá trị bất động sản. Bạn cần chuẩn bị 20–30% tiền mặt + chi phí phát sinh.

**Chi phí phát sinh cần biết**:
- Phí trước bạ: **0.5%** giá trị hợp đồng (nhà đất)
- Thuế TNCN người bán: 2% (thường được chuyển cho người mua đàm phán)
- Phí công chứng: 0.1–0.5% giá trị hợp đồng
- Phí đăng bộ: ~1–2 triệu đồng

## Bước 2: Kiểm tra pháp lý

**Sổ đỏ/Sổ hồng**: Đây là điều kiện bắt buộc. Yêu cầu chủ nhà cung cấp bản photocopy công chứng và kiểm tra tại Văn phòng đăng ký đất đai.

**Những điều cần kiểm tra**:
- Không có tranh chấp, thế chấp, cưỡng chế
- Quy hoạch: tra cứu tại cổng thông tin quy hoạch tỉnh/thành
- Chủ sở hữu thực sự (tránh mua qua ủy quyền)

## Bước 3: Vay ngân hàng

Lãi suất hiện tại (tháng 5/2026): **8–9.5%/năm** cố định 1–2 năm đầu, sau đó thả nổi.

Top ngân hàng cho vay mua nhà tốt nhất 2026: Vietcombank, BIDV, Techcombank, MB Bank.

## Bước 4: Ký hợp đồng

- Đặt cọc: tối đa 10% (quy định mới 2024)
- Hợp đồng mua bán phải công chứng
- Kiểm tra kỹ điều khoản phạt, tiến độ bàn giao, bảo hành

## Lời khuyên cuối

Đừng vội. Dành thời gian xem ít nhất **10–15 căn** trước khi quyết định. Tư vấn pháp lý độc lập luôn là khoản đầu tư xứng đáng.`,
    bodyEn: `Buying your first home is one of the most significant financial decisions in life. This guide walks you through every step of the home-buying process in Vietnam in 2026.

## Step 1: Prepare Finances

**Minimum down payment**: Banks typically lend up to 70–80% of property value. You need 20–30% cash plus additional costs.

**Additional costs to know**:
- Registration tax: **0.5%** of contract value (house/land)
- Seller's personal income tax: 2% (often negotiated to buyer)
- Notarization fee: 0.1–0.5% of contract value
- Registration fee: ~1–2 million VND

## Step 2: Legal Due Diligence

**Red/Pink Book**: This is mandatory. Request a notarized photocopy from the seller and verify at the Land Registration Office.

**Check for**:
- No disputes, mortgages, or enforcement orders
- Zoning: check the provincial/city planning portal
- Actual owner (avoid purchases via power of attorney)

## Step 3: Bank Loan

Current interest rates (May 2026): **8–9.5%/year** fixed for 1–2 years, then floating.

Top home loan banks 2026: Vietcombank, BIDV, Techcombank, MB Bank.

## Step 4: Sign the Contract

- Deposit: maximum 10% (new 2024 regulation)
- Sales contract must be notarized
- Review penalty clauses, handover schedule, warranty terms

## Final Advice

Don't rush. Take time to view at least **10–15 properties** before deciding. Independent legal consultation is always a worthwhile investment.`,
    bodyZh: `购买人生中的第一套房是最重大的财务决策之一。本指南将带您了解2026年在越南购房的每个步骤。

## 第一步：准备资金

**最低首付**：银行通常贷款最多70-80%的房产价值。您需要准备20-30%现金加上额外费用。

**需要了解的额外费用**：
- 过户税：合同价值的**0.5%**（房屋/土地）
- 卖方个人所得税：2%（通常协商转给买方）
- 公证费：合同价值的0.1-0.5%
- 登记费：约100-200万越南盾

## 第二步：法律尽职调查

**红书/粉书**：这是必须的。要求卖方提供公证复印件，并在土地登记处核实。

**需检查**：
- 无纠纷、抵押或强制执行令
- 规划：查询省/市规划信息门户
- 实际所有人（避免通过委托书购买）

## 第三步：银行贷款

当前利率（2026年5月）：前1-2年固定**8-9.5%/年**，之后浮动。

2026年最佳住房贷款银行：Vietcombank、BIDV、Techcombank、MB Bank。

## 第四步：签订合同

- 定金：最多10%（2024年新规定）
- 购房合同必须公证
- 仔细审查违约条款、交付时间表、保修条款

## 最终建议

不要急于决定。在做决定前至少查看**10-15套**房产。独立法律咨询始终是值得的投资。`,
    category: "Kiến thức", categoryEn: "Knowledge", categoryZh: "知识",
    author: "VietRealty Team", date: "2026-04-05", readMin: 10,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",
    featured: false,
  },
];
