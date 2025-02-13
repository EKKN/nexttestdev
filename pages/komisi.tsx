import { useEffect, useState } from "react";
import axios from "axios";
import DataTable, { TableColumn } from "react-data-table-component";

import Header from "../components/Header";




const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Komisi {
  id: number;
  min_omzet: number;
  max_omzet: number;
  persentase: number;
}

export default function KomisiPage() {
  const [komisiList, setKomisiList] = useState<Komisi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data dari API Golang
  const fetchKomisi = async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ data: Komisi[] }>(`${API_URL}/komisi`);
      setKomisiList(res.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKomisi();
  }, []);

  // Konfigurasi kolom untuk DataTable
  const columns: TableColumn<Komisi>[] = [
    {
      name: "Min Omzet",
      selector: (row: Komisi) => row.min_omzet.toLocaleString("id-ID"),
      sortable: true,
    },
    {
      name: "Max Omzet",
      selector: (row: Komisi) =>
        row.max_omzet > 0 ? row.max_omzet.toLocaleString("id-ID") : "∞",
      sortable: true,
    },
    {
      name: "Persentase Komisi",
      selector: (row: Komisi) => `${row.persentase}%`,
      sortable: true,
    },
  ];

  return (
    <div>
      <Header />
      <div className="max-w-10xl mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
          Daftar Komisi Berdasarkan Omzet
        </h1>

        {/* Loading */}
        {loading && <p className="text-center text-gray-600">Loading data...</p>}

        {/* DataTable */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">List Komisi</h2>
          <DataTable
            columns={columns}
            data={komisiList}
            pagination
            highlightOnHover
            striped
            className="border border-gray-200 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
