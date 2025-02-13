import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  // Fungsi untuk menambahkan class jika menu aktif
  const isActive = (path: string) =>
    router.pathname === path ? "border-b-4 border-white font-bold" : "opacity-80";

  return (
    <nav className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Test Dev</h1>

        {/* Menu Links */}
        <div className="space-x-6">
          <Link href="/komisi" className={`hover:underline ${isActive("/komisi")}`}>
            Komisi
          </Link>
          <Link href="/kredit" className={`hover:underline ${isActive("/kredit")}`}>
            Kredit
          </Link>
          <Link href="/laporan-komisi" className={`hover:underline ${isActive("/laporan-komisi")}`}>
            Laporan
          </Link>
          <Link href="/marketing" className={`hover:underline ${isActive("/marketing")}`}>
            Marketing
          </Link>
          <Link href="/penjualan" className={`hover:underline ${isActive("/penjualan")}`}>
            Penjualan
          </Link>
          <Link href="/pembayaran" className={`hover:underline ${isActive("/pembayaran")}`}>
            Pembayaran
          </Link>
        </div>
      </div>
    </nav>
  );
}
