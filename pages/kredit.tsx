import { useEffect, useState } from "react";
import axios from "axios";
import DataTable, { TableColumn } from "react-data-table-component";
import Header from "../components/Header"; // Pastikan ada Header

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Kredit {
  id: number;
  months: number;
  interest_rate: number;
}

export default function KreditPage() {
  const [kreditList, setKreditList] = useState<Kredit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data kredit dari API
  const fetchKredit = async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ data: Kredit[] }>(`${API_URL}/kredit`);
      setKreditList(res.data.data);
    } catch (error) {
      console.error("Error fetching kredit data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKredit();
  }, []);

  // Konfigurasi kolom untuk DataTable
  const columns: TableColumn<Kredit>[] = [
    { name: "ID", selector: (row: Kredit) => row.id, sortable: true, width: "80px" },
    { name: "Durasi (Bulan)", selector: (row: Kredit) => `${row.months} Bulan`, sortable: true },
    { name: "Bunga (%)", selector: (row: Kredit) => `${row.interest_rate.toFixed(2)}%`, sortable: true },
  ];

  return (
    <div>
      <Header />
      <div className="max-w-10xl mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Data Kredit</h1>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Tabel Kredit</h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading data...</p>
          ) : (
            <DataTable
              columns={columns}
              data={kreditList}
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
