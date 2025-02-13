import { useEffect, useState } from "react";
import axios from "axios";
import DataTable, { TableColumn } from "react-data-table-component";
import Header from "../components/Header";
import { NumericFormat } from "react-number-format"; // ✅ Import react-number-format
import Modal from "../components/Modal";


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
    cargo_fee: number;
    total_balance: number;
    grand_total: number;
}

export default function PenjualanPage() {
    const [penjualanList, setPenjualanList] = useState<Penjualan[]>([]);
    const [marketingList, setMarketingList] = useState<Marketing[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // State untuk form input
    const [transactionNum, setTransactionNum] = useState<string>("");
    const [marketingID, setMarketingID] = useState<number>(1);
    const [date, setDate] = useState<string>("");
    const [cargoFee, setCargoFee] = useState<string>("");
    const [totalBalance, setTotalBalance] = useState<string>("");
    const [grandTotal, setGrandTotal] = useState<string>("0");




    const [errors, setErrors] = useState<Record<string, string>>({});


    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [modalType, setModalType] = useState<"success" | "error" | "warning" | "info">("info");

    useEffect(() => {
        const cargo = parseInt(cargoFee.replace(/,/g, ""), 10) || 0;
        const total = parseInt(totalBalance.replace(/,/g, ""), 10) || 0;
        setGrandTotal((cargo + total).toLocaleString("en-US"));
    }, [cargoFee, totalBalance]);

    // Fetch data dari API
    const fetchData = async () => {
        setLoading(true);
        try {
            const penjualanRes = await axios.get<{ data: Penjualan[] }>(`${API_URL}/penjualan`);
            setPenjualanList(penjualanRes.data.data);

            const marketingRes = await axios.get<{ data: Marketing[] }>(`${API_URL}/marketing`);
            setMarketingList(marketingRes.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrors({});

        try {
            const response = await axios.post(`${API_URL}/penjualan`, {
                transaction_number: transactionNum,
                marketing_id: marketingID,
                date,
                cargo_fee: parseFloat(cargoFee.replace(/,/g, "")),
                total_balance: parseFloat(totalBalance.replace(/,/g, "")),
                grand_total: parseFloat(grandTotal.replace(/,/g, "")),
            });


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

                fetchData(); // Refresh data setelah insert
                setTransactionNum("");
                setMarketingID(1);
                setDate("");
                setCargoFee("0.00");
                setTotalBalance("0.00");
                setGrandTotal("0.00");
            }


        } catch (error) {
            console.error("Error creating transaction", error);
        }
    };

    // Konfigurasi kolom untuk DataTable
    const columns: TableColumn<Penjualan>[] = [
        { name: "Transaksi", selector: (row: Penjualan) => row.transaction_number, sortable: true },
        { name: "Marketing", selector: (row: Penjualan) => row.marketing?.name || "Unknown", sortable: true },
        { name: "Tanggal", selector: (row: Penjualan) => row.date, sortable: true },
        { name: "Cargo Fee", selector: (row: Penjualan) => row.cargo_fee.toLocaleString("id-ID"), sortable: true },
        { name: "Total Balance", selector: (row: Penjualan) => row.total_balance.toLocaleString("id-ID"), sortable: true },
        { name: "Grand Total", selector: (row: Penjualan) => row.grand_total.toLocaleString("id-ID"), sortable: true },
    ];


    return (
        <div>
            <Header />
            <div className="max-w-10xl mx-auto p-6 bg-gray-50 min-h-screen">
                <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
                    Data Penjualan
                </h1>

                {/* Form Input */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Tambah Penjualan</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        {/* Transaction Number */}
                        <div>
                            <label className="block text-gray-700 font-medium">Transaction Number</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                value={transactionNum}
                                onChange={(e) => setTransactionNum(e.target.value)}
                                required
                            />
                            {errors.transaction_number && <span className="text-red-500 text-sm">{errors.transaction_number}</span>}
                        </div>

                        {/* Marketing Select */}
                        <div>
                            <label className="block text-gray-700 font-medium">Marketing</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                value={marketingID}
                                onChange={(e) => setMarketingID(Number(e.target.value))}
                                required
                            >
                                <option value="">-- Pilih Marketing --</option>
                                {marketingList.length === 0 ? (
                                    <option value="" disabled>Loading...</option>
                                ) : (
                                    marketingList.map((mkt) => (
                                        <option key={mkt.id} value={mkt.id}>
                                            {mkt.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-gray-700 font-medium">Tanggal</label>
                            <input
                                type="date"
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        {/* Cargo Fee */}
                        <div>
                            <label className="block text-gray-700 font-medium">Cargo Fee</label>
                            <NumericFormat
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                value={cargoFee}
                                thousandSeparator=","
                                decimalSeparator="."
                                decimalScale={0}
                                fixedDecimalScale
                                allowNegative={false}
                                onValueChange={(values) => setCargoFee(values.value)}
                            />
                            {errors.cargo_fee && <span className="text-red-500 text-sm">{errors.cargo_fee}</span>}
                        </div>

                        {/* Total Balance */}
                        <div>
                            <label className="block text-gray-700 font-medium">Total Balance</label>
                            <NumericFormat
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                value={totalBalance}
                                thousandSeparator=","
                                decimalSeparator="."
                                decimalScale={0}
                                fixedDecimalScale
                                allowNegative={false}
                                onValueChange={(values) => setTotalBalance(values.value)}
                            />
                            {errors.total_balance && <span className="text-red-500 text-sm">{errors.total_balance}</span>}
                        </div>

                        {/* Grand Total */}
                        <div>
                            <label className="block text-gray-700 font-medium">Grand Total</label>
                            <NumericFormat
                                className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100"
                                value={grandTotal}
                                thousandSeparator=","
                                decimalSeparator="."
                                decimalScale={0}
                                fixedDecimalScale
                                allowNegative={false}
                                onValueChange={(values) => setGrandTotal(values.value)}
                            />
                            {errors.grand_total && <span className="text-red-500 text-sm">{errors.grand_total}</span>}
                        </div>


                        <button
                            type="submit"
                            className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
                        >
                            Tambah Transaksi
                        </button>
                    </form>
                </div>
                {/* DataTable */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Daftar Penjualan</h2>
                    {loading ? (
                        <p className="text-center text-gray-600">Loading data...</p>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={penjualanList}
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

