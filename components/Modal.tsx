import { useEffect } from "react";

interface ModalProps {
  title?: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

export default function Modal({ title = "Notification", message, type = "info", onClose }: ModalProps) {
  // Auto close modal after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Pilih warna berdasarkan tipe modal
  const modalStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        {/* Header Modal */}
        {/* <div className={`text-white text-lg font-semibold p-3 rounded-t ${modalStyles[type]}`}>
          {title}
        </div> */}

        {/* Body Modal */}
        <div className="p-4 text-gray-800 text-center">{message}</div>

        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
