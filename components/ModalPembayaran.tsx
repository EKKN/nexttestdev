import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";

interface PembayaranDetail {
  id: number;
  year: number;
  month: number;
  amount: number;
  status: string;
}

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  data: PembayaranDetail[];
  loading: boolean;
}

const Modal: React.FC<ModalProps> = ({ visible, onClose, data, loading }) => {
  if (!visible) return null;

  // Konfigurasi kolom untuk DataTable
  const columns: TableColumn<PembayaranDetail>[] = [
    { name: "Tahun", selector: (row) => row.year, sortable: true },
    { name: "Bulan", selector: (row) => row.month, sortable: true },
    {
      name: "Jumlah",
      selector: (row) => row.amount.toLocaleString("id-ID"),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-lg text-sm font-semibold ${
            row.status === "Lunas"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
        <h2 className="text-2xl font-bold mb-4">Detail Pembayaran</h2>

        {/* Loading State */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            striped
            className="border border-gray-200 rounded-lg"
          />
        )}

        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
