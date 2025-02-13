import { useEffect, useState } from "react";
import axios from "axios";
import DataTable, { TableColumn } from "react-data-table-component";
import Header from "../components/Header";
import ModalPembayaran from "../components/ModalPembayaran";
import { NumericFormat } from "react-number-format";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Marketing {
  id: number;
  name: string;
}

interface Penjualan {
  id: number;
  transaction_number: string;
  marketing_id: number;
  marketing?: Marketing;
  date: string;
  grand_total: number;
}

interface Kredit {
  id: number;
  months: number;
  interest_rate: number;
}

interface Pembayaran {
  id: number;
  penjualan: Penjualan;
  kredit: Kredit;
  jumlah_bayar: number;
  created_at: string;
  installment :number;
  credit_months: number;
  interest_rate: number;
}


interface PembayaranDetail {
  id: number;
  year: number;
  month: number;
  amount: number;
  status: string;
}

export default function PembayaranPage() {

  const [modalVisible, setModalVisible] = useState(false);
  const [pembayaranDetails, setPembayaranDetails] = useState<PembayaranDetail[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [penjualanList, setPenjualanList] = useState<Penjualan[]>([]);
  const [kreditList, setKreditList] = useState<Kredit[]>([]);
  const [pembayaranList, setPembayaranList] = useState<Pembayaran[]>([]);
  const [selectedPenjualan, setSelectedPenjualan] = useState<Penjualan | null>(null);
  const [selectedKredit, setSelectedKredit] = useState<Kredit | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data dari API
  const fetchData = async () => {
    setLoading(true);
    try {
      const penjualanRes = await axios.get<{ data: Penjualan[] }>(`${API_URL}/pembayaran/list-penjualan`);
      setPenjualanList(penjualanRes.data.data);

      const kreditRes = await axios.get<{ data: Kredit[] }>(`${API_URL}/kredit`);
      setKreditList(kreditRes.data.data);

      const pembayaranRes = await axios.get<{ data: Pembayaran[] }>(`${API_URL}/pembayaran`);
      setPembayaranList(pembayaranRes.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle submit pembayaran
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPenjualan || !selectedKredit) {
      alert("Silakan pilih transaksi dan jenis kredit!");
      return;
    }

    try {
      await axios.post(`${API_URL}/pembayaran`, {
        penjualan_id: selectedPenjualan.id,
        kredit_id: selectedKredit.id,

      });

      fetchData(); // Refresh data setelah insert
      setSelectedPenjualan(null);
      setSelectedKredit(null);
    } catch (error) {
      console.error("Error processing payment", error);
    }
  };

  // Menghitung total pembayaran setelah bunga
  const calculateTotalPayment = (amount: number, interestRate: number, months: number) => {
    return amount + (amount * interestRate / 100 * months / 12);
  };
  const calculateInstallment = (amount: number, interestRate: number, months: number) => {
    return calculateTotalPayment(amount, interestRate, months) / months;
  };


  const fetchPembayaranDetails = async (pembayaranID: number) => {
  setLoadingDetails(true);
  try {
    const res = await axios.get<{ data: PembayaranDetail[] }>(`${API_URL}/pembayaran/${pembayaranID}/details`);
    setPembayaranDetails(res.data.data);
    setModalVisible(true); // ✅ Tampilkan modal setelah data dimuat
  } catch (error) {
    console.error("Error fetching pembayaran details", error);
  }
  setLoadingDetails(false);
};


  const columns: TableColumn<Pembayaran>[] = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Transaksi",
      selector: (row) => row.penjualan.transaction_number,
      sortable: true,
      cell: (row) => (
        <button
          onClick={() => fetchPembayaranDetails(row.id)} // 🔥 Ambil detail saat diklik
          className="text-blue-500 underline hover:text-blue-700"
        >
          {row.penjualan.transaction_number}
        </button>
      ),
    },
    { name: "Marketing", selector: (row) => row.penjualan.marketing?.name || "Unknown", sortable: true },
    { name: "Tanggal Bayar", selector: (row) => row.created_at, sortable: true },
    { name: "Durasi Kredit", selector: (row) => `${row.credit_months} Bulan`, sortable: true },
    { name: "Bunga", selector: (row) => `${row.interest_rate}%`, sortable: true },
    {
      name: "installment",
      selector: (row) => `${row.installment.toLocaleString("id-ID")}`,
      sortable: true
    },
    {
      name: "Jumlah Bayar",
      selector: (row) => `${(row.installment*row.credit_months).toLocaleString("id-ID")}`,
      sortable: true
    },

  ];

  return (
    <div>
      <Header />
      <div className="max-w-10xl mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
          Pembayaran Kredit
        </h1>
        <ModalPembayaran
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  data={pembayaranDetails}
  loading={loadingDetails}
/>
        {/* Form Pembayaran */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Pilih Transaksi</h2>
          <label className="block text-gray-700 font-medium">Transaksi Penjualan</label>
          <select
            className="w-full border rounded-lg px-3 py-2 mt-1"
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selectedSale = penjualanList.find((sale) => sale.id === selectedId) || null;
              setSelectedPenjualan(selectedSale);
            }}
          >
            <option value="">-- Pilih Transaksi --</option>
            {penjualanList.map((sale) => (
              <option key={sale.id} value={sale.id}>
                {sale.transaction_number} - {sale.marketing?.name}
              </option>
            ))}
          </select>

          {/* Menampilkan Detail Transaksi */}
          {selectedPenjualan && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-100">
              <p><strong>Nomor Transaksi:</strong> {selectedPenjualan.transaction_number}</p>
              <p><strong>Marketing:</strong> {selectedPenjualan.marketing?.name}</p>
              <p><strong>Tanggal:</strong> {selectedPenjualan.date}</p>
              <p><strong>Total:</strong> <NumericFormat value={selectedPenjualan.grand_total} thousandSeparator="," decimalScale={2} displayType="text" /></p>
            </div>
          )}
        </div>

        {/* Pilih Jenis Kredit */}
        {selectedPenjualan && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Pilih Kredit</h2>
            <label className="block text-gray-700 font-medium">Jenis Kredit</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1"
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                const selectedCredit = kreditList.find((credit) => credit.id === selectedId) || null;
                setSelectedKredit(selectedCredit);
              }}
            >
              <option value="">-- Pilih Kredit --</option>
              {kreditList.map((credit) => (
                <option key={credit.id} value={credit.id}>
                  {credit.months} Bulan - Bunga {credit.interest_rate}%
                </option>
              ))}
            </select>

            {/* Menampilkan Total Pembayaran */}
            {selectedKredit && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                <p><strong>Durasi Kredit:</strong> {selectedKredit.months} Bulan</p>
                <p><strong>Bunga:</strong> {selectedKredit.interest_rate}%</p>
                <p><strong>Total Angsuran:</strong> {selectedKredit.months}</p>
                <p><strong>Instalment:</strong>
                  <NumericFormat
                    value={calculateInstallment(selectedPenjualan.grand_total, selectedKredit.interest_rate, selectedKredit.months)}
                    thousandSeparator=","
                    decimalScale={2}
                    displayType="text"
                  />
                </p>
                <p><strong>Total Pembayaran:</strong>
                  <NumericFormat
                    value={calculateTotalPayment(selectedPenjualan.grand_total, selectedKredit.interest_rate, selectedKredit.months)}
                    thousandSeparator=","
                    decimalScale={2}
                    displayType="text"
                  />
                </p>
              </div>
            )}
          </div>
        )}


        {/* Tombol Submit */}
        {selectedPenjualan && selectedKredit && (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Proses Pembayaran
          </button>
        )}


        {/* DataTable */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-5">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Daftar Pembayaran</h2>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <DataTable
              columns={columns}
              data={pembayaranList}
              pagination
              highlightOnHover
              striped
              className="border border-gray-200 rounded-lg"
            />
          )}
        </div>
      </div>
    </div>




  );
}
