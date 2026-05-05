import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu | VietRealty",
  description: "VietRealty - Sàn giao dịch bất động sản hàng đầu Việt Nam, kết nối người mua, người bán và môi giới bất động sản trên toàn quốc.",
};

export default function GioiThieuPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-3">Giới thiệu về VietRealty</h1>
      <p className="text-gray-500 mb-10">Sàn giao dịch bất động sản hàng đầu Việt Nam</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Sứ mệnh của chúng tôi</h2>
          <p className="text-gray-600 leading-relaxed">
            VietRealty được thành lập với sứ mệnh đơn giản nhưng mạnh mẽ: giúp mọi người Việt Nam dễ dàng tìm được ngôi nhà mơ ước của mình.
            Chúng tôi kết nối người mua, người bán và các chuyên gia môi giới uy tín trên toàn quốc thông qua nền tảng công nghệ hiện đại.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Tại sao chọn VietRealty?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🏠", title: "125,000+ Tin đăng", desc: "Cơ sở dữ liệu bất động sản lớn nhất Việt Nam" },
              { icon: "✅", title: "Xác minh uy tín", desc: "Mọi tin đăng và môi giới đều được kiểm duyệt" },
              { icon: "🗺️", title: "Tìm kiếm trên bản đồ", desc: "Công nghệ GIS tiên tiến hỗ trợ tìm nhà theo vị trí" },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Các dịch vụ của chúng tôi</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span>Mua bán nhà đất, căn hộ, biệt thự trên toàn quốc</li>
            <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span>Cho thuê nhà ở và bất động sản thương mại</li>
            <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span>Kết nối với mạng lưới môi giới uy tín</li>
            <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span>Công cụ tài chính: tính vay mua nhà, lợi suất đầu tư</li>
            <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span>Tin tức và phân tích thị trường bất động sản</li>
            <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span>Tìm kiếm bất động sản trên bản đồ tương tác</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Liên hệ</h2>
          <div className="bg-red-50 rounded-xl p-5 border border-red-100">
            <p className="text-gray-700 mb-1">📞 Hotline: <strong>1800 6834</strong> (miễn phí, 8:00–21:00)</p>
            <p className="text-gray-700 mb-1">✉️ Email: <a href="mailto:info@vietrealty.vn" className="text-red-600 hover:underline">info@vietrealty.vn</a></p>
            <p className="text-gray-700">📍 Địa chỉ: TP. Hồ Chí Minh, Việt Nam</p>
          </div>
        </section>
      </div>
    </div>
  );
}
