import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | BinHorizon",
  description: "Chính sách bảo mật và quyền riêng tư của BinHorizon – nền tảng bất động sản #1 Việt Nam",
};

const LAST_UPDATED = "01/05/2026";

export default function ChinhSachBaoMatPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-red-600 text-sm hover:underline">← Trang chủ</Link>
        <h1 className="text-3xl font-black text-gray-900 mt-4 mb-2">Chính sách bảo mật</h1>
        <p className="text-gray-500 text-sm">Cập nhật lần cuối: {LAST_UPDATED}</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. Giới thiệu</h2>
          <p>
            BinHorizon (binhorizon.com) cam kết bảo vệ quyền riêng tư của người dùng. Chính sách này mô tả cách chúng tôi
            thu thập, sử dụng và bảo vệ thông tin cá nhân khi bạn sử dụng nền tảng và ứng dụng di động của chúng tôi.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. Thông tin chúng tôi thu thập</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Thông tin tài khoản:</strong> Tên, địa chỉ email, số điện thoại khi đăng ký</li>
            <li><strong>Thông tin đăng tin:</strong> Địa chỉ, giá, mô tả, hình ảnh bất động sản bạn đăng tải</li>
            <li><strong>Dữ liệu sử dụng:</strong> Trang bạn xem, tìm kiếm, thao tác trong ứng dụng</li>
            <li><strong>Vị trí:</strong> Chỉ khi bạn cho phép, dùng để hiển thị bất động sản gần bạn</li>
            <li><strong>Thiết bị:</strong> Loại thiết bị, hệ điều hành, phiên bản ứng dụng</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. Mục đích sử dụng thông tin</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cung cấp và cải thiện dịch vụ tìm kiếm, đăng tin bất động sản</li>
            <li>Gửi thông báo về tin đăng phù hợp với nhu cầu của bạn</li>
            <li>Xác thực danh tính và bảo mật tài khoản</li>
            <li>Phân tích xu hướng thị trường bất động sản (dữ liệu ẩn danh)</li>
            <li>Liên lạc hỗ trợ khi bạn cần</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. Chia sẻ thông tin</h2>
          <p>
            Chúng tôi <strong>không bán</strong> thông tin cá nhân của bạn cho bên thứ ba.
            Thông tin liên hệ (tên, số điện thoại) trong tin đăng bất động sản sẽ hiển thị công khai
            theo yêu cầu của bạn. Chúng tôi có thể chia sẻ dữ liệu ẩn danh với đối tác phân tích.
          </p>
          <p className="mt-2">Các đối tác dịch vụ:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Supabase (lưu trữ dữ liệu, xác thực) — tuân thủ GDPR</li>
            <li>Cloudflare (CDN, bảo mật mạng) — tuân thủ GDPR</li>
            <li>Mapbox (bản đồ) — chỉ nhận dữ liệu vị trí ẩn danh</li>
            <li>Google (đăng nhập OAuth) — theo chính sách Google</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. Quyền của bạn</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Truy cập:</strong> Xem dữ liệu cá nhân trong mục "Tài khoản"</li>
            <li><strong>Chỉnh sửa:</strong> Cập nhật thông tin hồ sơ bất kỳ lúc nào</li>
            <li><strong>Xóa:</strong> Yêu cầu xóa tài khoản qua email info@binhorizon.com</li>
            <li><strong>Từ chối:</strong> Tắt thông báo push trong cài đặt thiết bị</li>
            <li><strong>Vị trí:</strong> Từ chối cấp quyền vị trí mà vẫn dùng được ứng dụng</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. Bảo mật dữ liệu</h2>
          <p>
            Dữ liệu được mã hóa TLS/HTTPS khi truyền tải. Mật khẩu được băm (không lưu plaintext).
            Chúng tôi áp dụng Row Level Security (RLS) để mỗi người dùng chỉ truy cập dữ liệu của mình.
            Không ai trong đội ngũ có thể xem mật khẩu của bạn.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. Cookie và theo dõi</h2>
          <p>
            Chúng tôi dùng cookie để duy trì phiên đăng nhập và ghi nhớ ngôn ngữ của bạn.
            Không dùng cookie quảng cáo bên thứ ba. Bạn có thể xóa cookie trong cài đặt trình duyệt.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">8. Quyền riêng tư trẻ em</h2>
          <p>
            Dịch vụ không dành cho người dưới 18 tuổi. Chúng tôi không cố ý thu thập thông tin
            của trẻ em. Nếu phát hiện, vui lòng liên hệ ngay để xóa.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">9. Thay đổi chính sách</h2>
          <p>
            Khi chính sách thay đổi, chúng tôi sẽ cập nhật ngày và thông báo qua email hoặc
            thông báo trong ứng dụng. Tiếp tục sử dụng đồng nghĩa với việc chấp nhận chính sách mới.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">10. Liên hệ</h2>
          <p>
            Mọi thắc mắc về quyền riêng tư, vui lòng liên hệ:<br />
            📧 <a href="mailto:info@binhorizon.com" className="text-red-600 hover:underline">info@binhorizon.com</a><br />
            📞 Hotline: <a href="tel:18006834" className="text-red-600 hover:underline">1800 6834</a><br />
            Địa chỉ: TP. Hồ Chí Minh, Việt Nam
          </p>
        </section>

      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
        <Link href="/" className="text-center text-sm bg-red-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors">
          Về trang chủ
        </Link>
        <Link href="/dang-ky" className="text-center text-sm border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
          Đăng ký tài khoản
        </Link>
      </div>
    </div>
  );
}
