import { useEffect, useState } from "react";
import axios from "axios";
import DataTable, { TableColumn } from "react-data-table-component";
import Header from "../components/Header";
import Modal from "../components/Modal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Marketing {
    id: number;
    name: string;
    is_active: boolean;
}

export default function MarketingPage() {
    const [marketingList, setMarketingList] = useState<Marketing[]>([]);
    const [name, setName] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const [errors, setErrors] = useState<Record<string, string>>({});


    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [modalType, setModalType] = useState<"success" | "error" | "warning" | "info">("info");

    const fetchMarketing = async () => {
        setLoading(true);
        try {
            const response = await axios.get<{ data: Marketing[]; status?: string; message?: string }>(`${API_URL}/marketing`);

            if (response.data.status === "error") {
                console.error(response.data.message || "Failed to fetch marketing data");
                return;
            }

            if (!response.data.data || !Array.isArray(response.data.data)) {
                console.error("Invalid response format from server");
                return;
            }

            setMarketingList(response.data.data);
        } catch (error: any) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset error sebelum validasi
        setErrors({});

        // Validasi input sebelum mengirim request
        if (!name.trim()) {
            setErrors({ name: "Name is required" });
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/marketing`, { name, is_active: isActive });

            if (response.data.status === "error") {
                if (response.data.errors) {
                    const formattedErrors: Record<string, string> = {};
                    response.data.errors.forEach((err: Record<string, string>) => {
                        const key = Object.keys(err)[0]; // Ambil key pertama
                        formattedErrors[key] = err[key]; // Simpan pesan error
                    });

                    setErrors(formattedErrors); // Set state errors
                } else {
                    setErrors({ name: response.data.message });
                }

                return;
            } else {

                setModalMessage("Marketing added successfully!");
                setModalType("success");
                
            fetchMarketing();
            setName("");
            setIsActive(true);
            }

        } catch (error) {
            console.error("Error creating marketing", error);
        }
    };

    const toggleMarketingActive = async (id: number) => {
        try {
            await axios.put(`${API_URL}/marketing/${id}/toggle`);
            fetchMarketing();
        } catch (error) {
            console.error("Error toggling marketing status", error);
        }
    };

    useEffect(() => {
        fetchMarketing();
    }, []);

    // Konfigurasi kolom untuk DataTable
    const columns: TableColumn<Marketing>[] = [
        { name: "ID", selector: (row: Marketing) => row.id, sortable: true },
        { name: "Name", selector: (row: Marketing) => row.name, sortable: true },
        {
            name: "Active",
            sortable: true,
            cell: (row: Marketing) => (
                <span className={`px-2 py-1 text-sm font-semibold rounded-lg ${row.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {row.is_active ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            name: "Actions",
            cell: (row: Marketing) => (
                <button
                    onClick={() => toggleMarketingActive(row.id)}
                    className={`px-4 py-2 rounded-lg transition font-semibold ${row.is_active ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
                >
                    {row.is_active ? "Deactivate" : "Activate"}
                </button>
            ),
        },
    ];

    return (
        <div>
            <Header />
            <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
                {modalMessage && <Modal message={modalMessage} type={modalType} onClose={() => setModalMessage(null)} />}

                {/* Form Input */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Marketing</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Name:</label>
                            <input
                                type="text"
                                className={`w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 transition ${errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter marketing name..."
                            />
                            {/* Tampilkan error jika ada */}
                            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="w-6 h-6 text-blue-600 rounded focus:ring-blue-400"
                                checked={isActive}
                                onChange={() => setIsActive(!isActive)}
                            />
                            <label className="ml-2 text-gray-700 font-medium">Active</label>
                        </div>

                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition">
                            Add Marketing
                        </button>
                    </form>
                </div>

                {/* Loading */}
                {loading && <p className="text-center text-gray-600">Loading data...</p>}

                {/* DataTable */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Marketing List</h2>
                    <DataTable
                        columns={columns}
                        data={marketingList}
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
