// helpers/utils.ts

/** 
 * Fungsi untuk memformat angka ke format Rupiah (IDR) 
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  /**
   * Fungsi untuk membersihkan format Rupiah sebelum menyimpan ke state
   * Menghapus semua karakter kecuali angka (0-9)
   */
  export const parseCurrency = (value: string): number => {
    return Number(value.replace(/\D/g, "")); // Hanya mengambil angka
  };
  