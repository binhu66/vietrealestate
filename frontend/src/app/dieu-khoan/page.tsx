import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng | BinHorizon",
  description: "Điều khoản và điều kiện sử dụng dịch vụ BinHorizon - Sàn giao dịch bất động sản hàng đầu Việt Nam.",
};

export default function DieuKhoanPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Điều khoản sử dụng</h1>
      <p className="text-gray-400 text-sm mb-10">Cập nhật lần cuối: 01/01/2026</p>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Chấp nhận điều khoản</h2>
          <p>Bằng cách truy cập và sử dụng BinHorizon, bạn đồng ý bị ràng buộc bởi các điều khoản và điều kiện này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. Quy định đăng tin</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Thông tin đăng tải phải trung thực, chính xác và không gây nhầm lẫn.</li>
            <li>Nghiêm cấm đăng tin giả mạo, lừa đảo hoặc vi phạm pháp luật.</li>
            <li>Người đăng tin chịu trách nhiệm về tính hợp pháp của bất động sản.</li>
            <li>BinHorizon có quyền xóa bất kỳ tin đăng nào vi phạm quy định.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. Trách nhiệm của người dùng</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Bảo mật thông tin tài khoản và không chia sẻ với bên thứ ba.</li>
            <li>Không sử dụng dịch vụ cho mục đích phi pháp hoặc gây hại.</li>
            <li>Tự chịu trách nhiệm về các giao dịch thực hiện thông qua nền tảng.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Giới hạn trách nhiệm</h2>
          <p>BinHorizon là nền tảng kết nối và không chịu trách nhiệm về tính xác thực của thông tin do người dùng cung cấp. Mọi giao dịch bất động sản cần được thực hiện theo đúng quy định pháp luật Việt Nam.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Quyền sở hữu trí tuệ</h2>
          <p>Toàn bộ nội dung, thiết kế và tính năng của BinHorizon được bảo vệ bởi quyền sở hữu trí tuệ. Nghiêm cấm sao chép, phân phối mà không có sự đồng ý bằng văn bản.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. Thay đổi điều khoản</h2>
          <p>BinHorizon có quyền cập nhật điều khoản này bất cứ lúc nào. Người dùng sẽ được thông báo về các thay đổi quan trọng qua email đã đăng ký.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. Liên hệ</h2>
          <p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ: <a href="mailto:info@binhorizon.com" className="text-red-600 hover:underline">info@binhorizon.com</a></p>
        </section>
      </div>
    </div>
  );
}
