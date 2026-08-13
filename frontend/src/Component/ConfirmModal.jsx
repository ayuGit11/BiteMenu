import React from "react";
import { IoWarningOutline } from "react-icons/io5";

function ConfirmModal({title,message,confirmText,onConfirm,onCancel,danger = false}) {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
            {/* Background */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel}></div>
            {/* Confirmation Box */}
            <div className="relative z-10 bg-white w-[90%] max-w-md rounded-xl shadow-2xl p-6">
                <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <IoWarningOutline className="text-2xl text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                        <p className="text-gray-500 mt-2">{message} </p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={onCancel} className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} className={`px-5 py-2 rounded-lg text-white font-semibold ${
                            danger ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600" }`}
                    >
                       {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;