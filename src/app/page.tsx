"use client";

import { useState } from "react";

export default function Home() {
  const [importText, setImportText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleImport = async () => {
    if (!importText.trim()) return;
    setIsExtracting(true);
    setError("");
    setExtractedData(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: importText }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to extract data");
      
      setExtractedData(data.result);
    } catch (err: any) {
      setError(err.message || "Something went wrong while extracting the order. Your original message was saved. You can try again or enter the information manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Import New Order</h2>
        <p className="text-slate-500 mb-4 text-sm">Paste a WhatsApp message or plain text below. The AI will extract the details automatically.</p>
        
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="e.g., Please deliver 2 burgers from Kareem Restaurant to Ali at 123 Main St. Phone 010xxxxx. Total 350 EGP, delivery fee 50 EGP cash."
          className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-none"
        />
        
        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={handleImport}
            disabled={isExtracting}
            className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isExtracting ? "Extracting Details..." : "Extract Order"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}
      </div>

      {extractedData && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Review Extracted Data</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoField label="Customer Name" value={extractedData.customerName} />
            <InfoField label="Phone Number" value={extractedData.customerPhone} />
            <InfoField label="Address" value={extractedData.customerAddress} />
            <InfoField label="Merchant" value={extractedData.merchantName} />
            <InfoField label="Delivery Fee" value={extractedData.deliveryFee} />
            <InfoField label="Total Amount" value={extractedData.totalOrderAmount} />
            <InfoField label="Payment Method" value={extractedData.paymentMethod} />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Confirm & Save Order
            </button>
            <button className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors">
              Edit Manually
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoField({ label, value }: { label: string, value: any }) {
  const isMissing = value === null || value === "";
  
  return (
    <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
      <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">{label}</span>
      {isMissing ? (
        <span className="text-orange-500 text-sm flex items-center font-medium">
          ⚠ Missing Information
        </span>
      ) : (
        <span className="text-slate-800 font-medium">{value}</span>
      )}
    </div>
  );
}
