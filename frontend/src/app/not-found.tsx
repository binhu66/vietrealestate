import type { Metadata } from "next";
import NotFoundClient from "./not-found-client";

export const metadata: Metadata = {
  title: "Không tìm thấy trang | VietRealty",
};

export default function NotFound() {
  return <NotFoundClient />;
}
