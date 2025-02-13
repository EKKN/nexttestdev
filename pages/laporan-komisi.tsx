import { useEffect, useState } from "react";
import axios from "axios";
import DataTable, { TableColumn } from "react-data-table-component";
import Header from "../components/Header";



const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LaporanKomisi {
    marketing: string;
    bulan: string;
    omzet: number;
    komisi_persen: number;
    komisi_nominal: number;
}

export default function LaporanKomisiPage() {
    const [laporanList, setLaporanList] = useState<LaporanKomisi[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch data dari API Golang
    const fetchLaporanKomisi = async () => {
        setLoading(true);
        try {
            const res = await axios.get<{ data: LaporanKomisi[] }>(`${API_URL}/laporan-komisi`);
            setLaporanList(res.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLaporanKomisi();
    }, []);

    // Konfigurasi kolom untuk DataTable
    const columns: TableColumn<LaporanKomisi>[] = [
        {
            name: "Marketing",
            selector: (row: LaporanKomisi) => row.marketing,
            sortable: true,
        },
        {
            name: "Bulan",
            selector: (row: LaporanKomisi) => row.bulan,
            sortable: true,
        },
        {
            name: "Omzet",
            selector: (row: LaporanKomisi) => row.omzet.toLocaleString("id-ID"),
            sortable: true,
        },
        {
            name: "Komisi %",
            selector: (row: LaporanKomisi) => `${row.komisi_persen}%`,
            sortable: true,
        },
        {
            name: "Komisi Nominal",
            selector: (row: LaporanKomisi) => row.komisi_nominal.toLocaleString("id-ID"),
            sortable: true,
        },
    ];

    return (
        <div>
            <Header />
            <div className="max-w-10xl mx-auto p-6 bg-gray-50 min-h-screen">
                <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
                    Laporan Penjualan Per Bulan
                </h1>

                {/* Loading */}
                {loading && <p className="text-center text-gray-600">Loading data...</p>}

                {/* DataTable */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">List Laporan </h2>
                    <DataTable
                        columns={columns}
                        data={laporanList}
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
