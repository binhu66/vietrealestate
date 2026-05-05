"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, TrendingUp, Building2, ChevronRight, Info } from "lucide-react";
import { useLocale } from "@/lib/locale";

// Vietnamese bank rates (approximate, 2025)
const BANKS = [
  { name: "Vietcombank",  rate: 7.5,  maxLTV: 70, color: "bg-green-600" },
  { name: "BIDV",         rate: 7.8,  maxLTV: 70, color: "bg-blue-700" },
  { name: "Vietinbank",   rate: 7.6,  maxLTV: 70, color: "bg-red-700" },
  { name: "Agribank",     rate: 7.3,  maxLTV: 65, color: "bg-red-600" },
  { name: "Techcombank",  rate: 8.5,  maxLTV: 80, color: "bg-red-500" },
  { name: "MB Bank",      rate: 8.2,  maxLTV: 75, color: "bg-purple-700" },
  { name: "VPBank",       rate: 9.0,  maxLTV: 80, color: "bg-orange-600" },
  { name: "ACB",          rate: 8.8,  maxLTV: 75, color: "bg-blue-500" },
];

function calcMonthly(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function fmtVND(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} tỷ`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)} triệu`;
  return n.toLocaleString("vi-VN") + " ₫";
}

function fmtM(n: number): string {
  return `${(n / 1_000_000).toFixed(1)} triệu/tháng`;
}

export default function TaiChinhPage() {
  const { locale } = useLocale();

  // Mortgage calculator state
  const [propPrice,   setPropPrice]   = useState("3");      // tỷ
  const [downPct,     setDownPct]     = useState("30");     // %
  const [loanYears,   setLoanYears]   = useState("20");
  const [annualRate,  setAnnualRate]  = useState("8.5");
  const [selectedBank, setSelectedBank] = useState<number | null>(null);

  // ROI calculator state
  const [roiPrice,    setRoiPrice]    = useState("3");      // tỷ
  const [roiRent,     setRoiRent]     = useState("15");     // triệu/tháng
  const [roiCost,     setRoiCost]     = useState("5");      // % of value per year for maintenance

  const mortgage = useMemo(() => {
    const price      = (parseFloat(propPrice) || 0) * 1_000_000_000;
    const down       = price * ((parseFloat(downPct) || 0) / 100);
    const principal  = price - down;
    const rate       = selectedBank !== null ? BANKS[selectedBank].rate : (parseFloat(annualRate) || 8.5);
    const years      = parseInt(loanYears) || 20;
    const monthly    = calcMonthly(principal, rate, years);
    const total      = monthly * years * 12;
    const interest   = total - principal;
    return { price, down, principal, monthly, total, interest, rate, years };
  }, [propPrice, downPct, annualRate, loanYears, selectedBank]);

  const roi = useMemo(() => {
    const price      = (parseFloat(roiPrice) || 0) * 1_000_000_000;
    const rent       = (parseFloat(roiRent) || 0) * 1_000_000;
    const annualRent = rent * 12;
    const costPct    = parseFloat(roiCost) || 5;
    const annualCost = price * (costPct / 100);
    const netRent    = annualRent - annualCost;
    const grossYield = price > 0 ? (annualRent / price) * 100 : 0;
    const netYield   = price > 0 ? (netRent / price) * 100 : 0;
    const payback    = netRent > 0 ? price / netRent : 0;
    return { grossYield, netYield, payback };
  }, [roiPrice, roiRent, roiCost]);

  const L = {
    vi: {
      title: "Công cụ tài chính bất động sản",
      sub: "Tính toán vay mua nhà, lợi suất đầu tư và so sánh lãi suất ngân hàng",
      mortgage: "Máy tính vay mua nhà",
      propPrice: "Giá trị bất động sản (tỷ VNĐ)",
      downPct: "Tỷ lệ vốn tự có (%)",
      years: "Thời hạn vay (năm)",
      rate: "Lãi suất (%/năm)",
      orChooseBank: "Hoặc chọn ngân hàng:",
      monthly: "Trả hàng tháng",
      principal: "Số tiền vay",
      totalInterest: "Tổng lãi phải trả",
      totalPayment: "Tổng tiền trả",
      roi: "Tính lợi nhuận cho thuê",
      roiPrice: "Giá mua (tỷ VNĐ)",
      roiRent: "Tiền thuê (triệu/tháng)",
      roiCost: "Chi phí vận hành (%/năm)",
      grossYield: "Lợi suất gộp",
      netYield: "Lợi suất ròng",
      payback: "Hoàn vốn",
      paybackUnit: "năm",
      bankRates: "Lãi suất ngân hàng hiện hành",
      maxLTV: "Tối đa vay",
      note: "* Lãi suất tham khảo, liên hệ ngân hàng để biết lãi suất thực tế",
      viewListings: "Tìm bất động sản phù hợp",
    },
    en: {
      title: "Real Estate Finance Tools",
      sub: "Calculate mortgage, rental yield and compare bank interest rates",
      mortgage: "Mortgage Calculator",
      propPrice: "Property Value (billion VND)",
      downPct: "Down Payment (%)",
      years: "Loan Term (years)",
      rate: "Interest Rate (%/year)",
      orChooseBank: "Or choose a bank:",
      monthly: "Monthly Payment",
      principal: "Loan Amount",
      totalInterest: "Total Interest",
      totalPayment: "Total Payment",
      roi: "Rental Yield Calculator",
      roiPrice: "Purchase Price (billion VND)",
      roiRent: "Monthly Rent (million VND)",
      roiCost: "Operating Cost (%/year)",
      grossYield: "Gross Yield",
      netYield: "Net Yield",
      payback: "Payback",
      paybackUnit: "years",
      bankRates: "Current Bank Rates",
      maxLTV: "Max LTV",
      note: "* Reference rates only. Contact banks for actual rates",
      viewListings: "Find properties",
    },
    zh: {
      title: "房产金融工具",
      sub: "计算房贷、租金回报率及银行利率对比",
      mortgage: "房贷计算器",
      propPrice: "房产价值（十亿越南盾）",
      downPct: "首付比例（%）",
      years: "贷款年限（年）",
      rate: "年利率（%）",
      orChooseBank: "或选择银行：",
      monthly: "每月还款",
      principal: "贷款金额",
      totalInterest: "总利息",
      totalPayment: "总还款",
      roi: "出租收益计算器",
      roiPrice: "购买价格（十亿越南盾）",
      roiRent: "月租金（百万越南盾）",
      roiCost: "运营成本（%/年）",
      grossYield: "毛收益率",
      netYield: "净收益率",
      payback: "回本周期",
      paybackUnit: "年",
      bankRates: "当前银行利率",
      maxLTV: "最高贷款比例",
      note: "* 参考利率，实际利率请联系银行",
      viewListings: "寻找合适房产",
    },
  }[locale] ?? {} as never;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{L.title}</h1>
        <p className="text-gray-500 text-sm">{L.sub}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* ── Mortgage Calculator ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{L.mortgage}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">{L.propPrice}</label>
              <div className="flex items-center gap-2">
                <input type="number" value={propPrice} onChange={e => setPropPrice(e.target.value)} min="0.1" step="0.1"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">tỷ VNĐ</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">
                {L.downPct} — <span className="text-red-600">{fmtVND(mortgage.down)}</span>
              </label>
              <input type="range" min="10" max="90" value={downPct} onChange={e => setDownPct(e.target.value)}
                className="w-full accent-red-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>10%</span><span className="font-semibold text-gray-700">{downPct}%</span><span>90%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">{L.years}</label>
                <select value={loanYears} onChange={e => setLoanYears(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  {[5,10,15,20,25,30].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">{L.rate}</label>
                <input type="number" value={selectedBank !== null ? BANKS[selectedBank].rate : annualRate}
                  onChange={e => { setAnnualRate(e.target.value); setSelectedBank(null); }}
                  min="1" max="30" step="0.1"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">{L.orChooseBank}</p>
              <div className="flex flex-wrap gap-2">
                {BANKS.map((b, i) => (
                  <button key={b.name} onClick={() => setSelectedBank(selectedBank === i ? null : i)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${selectedBank === i ? `${b.color} text-white border-transparent` : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                  >
                    {b.name} {b.rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="mt-5 bg-red-50 rounded-2xl p-5 space-y-3">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">{L.monthly}</p>
              <p className="text-3xl font-black text-red-600">{fmtM(mortgage.monthly)}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-red-100">
              <div className="text-center">
                <p className="text-[10px] text-gray-500">{L.principal}</p>
                <p className="text-sm font-bold text-gray-800">{fmtVND(mortgage.principal)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500">{L.totalInterest}</p>
                <p className="text-sm font-bold text-red-600">{fmtVND(mortgage.interest)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500">{L.totalPayment}</p>
                <p className="text-sm font-bold text-gray-800">{fmtVND(mortgage.total)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROI Calculator ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{L.roi}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">{L.roiPrice}</label>
              <div className="flex items-center gap-2">
                <input type="number" value={roiPrice} onChange={e => setRoiPrice(e.target.value)} min="0.1" step="0.1"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">tỷ VNĐ</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">{L.roiRent}</label>
              <div className="flex items-center gap-2">
                <input type="number" value={roiRent} onChange={e => setRoiRent(e.target.value)} min="0" step="0.5"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">tr/tháng</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">
                {L.roiCost} <span className="text-gray-400 text-xs">(quản lý, bảo trì, thuế...)</span>
              </label>
              <input type="range" min="0" max="15" value={roiCost} onChange={e => setRoiCost(e.target.value)}
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span><span className="font-semibold text-gray-700">{roiCost}%/năm</span><span>15%</span>
              </div>
            </div>
          </div>

          {/* ROI Result */}
          <div className="mt-5 bg-green-50 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-white rounded-xl p-4 border border-green-100">
                <p className="text-xs text-gray-500 mb-1">{L.grossYield}</p>
                <p className="text-2xl font-black text-green-600">{roi.grossYield.toFixed(2)}%</p>
              </div>
              <div className="text-center bg-white rounded-xl p-4 border border-green-100">
                <p className="text-xs text-gray-500 mb-1">{L.netYield}</p>
                <p className="text-2xl font-black text-emerald-600">{roi.netYield.toFixed(2)}%</p>
              </div>
            </div>
            <div className="text-center pt-2 border-t border-green-100">
              <p className="text-xs text-gray-500">{L.payback}</p>
              <p className="text-xl font-bold text-gray-800">
                {roi.payback > 0 ? `${roi.payback.toFixed(1)} ${L.paybackUnit}` : "—"}
              </p>
            </div>

            {/* Benchmark */}
            <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3 border border-amber-100">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700">
                {locale === "zh"
                  ? "越南住宅净收益率通常在 4–7%，商业地产 6–9%。银行存款约 5.5%。"
                  : locale === "en"
                  ? "Vietnam residential net yield typically 4–7%, commercial 6–9%. Bank savings ~5.5%."
                  : "Lợi suất ròng nhà ở VN thường 4–7%, thương mại 6–9%. Lãi tiết kiệm ~5.5%."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bank Rate Table ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">{L.bankRates}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 text-gray-500 font-semibold">Ngân hàng</th>
                <th className="text-center py-2 px-3 text-gray-500 font-semibold">Lãi suất</th>
                <th className="text-center py-2 px-3 text-gray-500 font-semibold">{L.maxLTV}</th>
                <th className="text-right py-2 text-gray-500 font-semibold">20 năm · 70%</th>
              </tr>
            </thead>
            <tbody>
              {BANKS.map((b) => {
                const examplePrice   = 3_000_000_000;
                const exampleLoan    = examplePrice * 0.7;
                const exampleMonthly = calcMonthly(exampleLoan, b.rate, 20);
                return (
                  <tr key={b.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${b.color}`} />
                        <span className="font-semibold text-gray-800">{b.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-red-600 font-bold">{b.rate}%</span>
                    </td>
                    <td className="py-3 px-3 text-center text-gray-600">{b.maxLTV}%</td>
                    <td className="py-3 text-right text-gray-700 font-medium">
                      {fmtM(exampleMonthly)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
          <Info className="w-3 h-3" /> {L.note}
        </p>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-lg mb-1">
            {locale === "zh" ? "找到合适的房产了吗？" : locale === "en" ? "Ready to find your property?" : "Đã tính xong? Tìm bất động sản ngay!"}
          </p>
          <p className="text-red-100 text-sm">
            {locale === "zh" ? "浏览越南最新房源，马上联系中介" : locale === "en" ? "Browse thousands of listings across Vietnam" : "Hàng nghìn tin đăng mua bán, cho thuê toàn quốc"}
          </p>
        </div>
        <Link href="/bat-dong-san" className="shrink-0 bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2">
          {L.viewListings} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
