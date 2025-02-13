import { useEffect } from "react";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

export default function Alert({ message, type = "info", onClose }: AlertProps) {
  // Auto close alert after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Pilih warna berdasarkan tipe alert
  const alertStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  return (
    <div className={`border-l-4 p-3 rounded-md shadow-md mb-4 ${alertStyles[type]} transition`}>
      <div className="flex justify-between items-center">
        <span className="font-medium">{message}</span>
        <button className="text-xl font-bold text-gray-500 hover:text-gray-700" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
}
