import {
  Copy,
  Download,
  Eye,
  FileText,
  Grid3X3,
  Package,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

interface QRItem {
  id: string;
  data: string;
  color: string;
  label: string;
}

const BulkQR = () => {
  const [qrItems, setQrItems] = useState<QRItem[]>([
    { id: "1", data: "https://github.com", color: "#2563eb", label: "GitHub" },
    {
      id: "2",
      data: "https://tailwindcss.com",
      color: "#059669",
      label: "Tailwind CSS",
    },
  ]);
  const [generatedQRs, setGeneratedQRs] = useState<{ [key: string]: string }>(
    {}
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = [
    { value: "#2563eb", name: "Blue", gradient: "from-blue-500 to-blue-600" },
    { value: "#dc2626", name: "Red", gradient: "from-red-500 to-red-600" },
    {
      value: "#059669",
      name: "Green",
      gradient: "from-green-500 to-green-600",
    },
    {
      value: "#7c3aed",
      name: "Purple",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      value: "#ea580c",
      name: "Orange",
      gradient: "from-orange-500 to-orange-600",
    },
    { value: "#0891b2", name: "Cyan", gradient: "from-cyan-500 to-cyan-600" },
    { value: "#be185d", name: "Pink", gradient: "from-pink-500 to-pink-600" },
    { value: "#1f2937", name: "Dark", gradient: "from-gray-700 to-gray-800" },
  ];

  const addQRItem = () => {
    const newId = (qrItems.length + 1).toString();
    setQrItems([
      ...qrItems,
      {
        id: newId,
        data: "",
        color: colors[qrItems.length % colors.length].value,
        label: `QR Code ${newId}`,
      },
    ]);
  };

  const removeQRItem = (id: string) => {
    if (qrItems.length > 1) {
      setQrItems(qrItems.filter((item) => item.id !== id));
      const newGeneratedQRs = { ...generatedQRs };
      delete newGeneratedQRs[id];
      setGeneratedQRs(newGeneratedQRs);
    }
  };

  const clearAllItems = () => {
    setQrItems([{ id: "1", data: "", color: "#2563eb", label: "QR Code 1" }]);
    setGeneratedQRs({});
  };

  const updateQRItem = (id: string, field: keyof QRItem, value: string) => {
    setQrItems(
      qrItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const generateAllQRs = async () => {
    const validItems = qrItems.filter((item) => item.data.trim());
    if (validItems.length === 0) return;

    setIsGenerating(true);
    setProgress(0);
    const newGeneratedQRs: { [key: string]: string } = {};

    try {
      for (let i = 0; i < validItems.length; i++) {
        const item = validItems[i];
        const canvas = document.createElement("canvas");
        await QRCode.toCanvas(canvas, item.data, {
          color: {
            dark: item.color,
            light: "#FFFFFF",
          },
          width: 300,
          margin: 2,
          errorCorrectionLevel: "M",
        });
        newGeneratedQRs[item.id] = canvas.toDataURL("image/png", 1.0);
        setProgress(((i + 1) / validItems.length) * 100);

        // Small delay for smooth progress animation
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      setGeneratedQRs(newGeneratedQRs);
    } catch (error) {
      console.error("Error generating QR codes:", error);
      alert("Error generating some QR codes. Please check your input.");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const downloadSingleQR = (id: string, label: string) => {
    const qrDataUrl = generatedQRs[id];
    if (qrDataUrl) {
      const link = document.createElement("a");
      link.download = `${label.replace(/[^a-zA-Z0-9]/g, "-")}-qrcode.png`;
      link.href = qrDataUrl;
      link.click();
    }
  };

  const downloadAllQRs = () => {
    Object.entries(generatedQRs).forEach(([id, dataUrl], index) => {
      const item = qrItems.find((qr) => qr.id === id);
      if (item) {
        setTimeout(() => {
          const link = document.createElement("a");
          link.download = `${item.label.replace(
            /[^a-zA-Z0-9]/g,
            "-"
          )}-qrcode.png`;
          link.href = dataUrl;
          link.click();
        }, 100 * index);
      }
    });
  };

  const copyQRToClipboard = async (id: string) => {
    const qrDataUrl = generatedQRs[id];
    if (qrDataUrl) {
      try {
        const blob = await fetch(qrDataUrl).then((r) => r.blob());
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target?.result as string;
        const lines = csvText.split("\n").filter((line) => line.trim());
        const headers = lines[0].split(",").map((h) => h.trim());

        const dataIndex = headers.findIndex(
          (h) =>
            h.toLowerCase().includes("data") ||
            h.toLowerCase().includes("text") ||
            h.toLowerCase().includes("url")
        );
        const labelIndex = headers.findIndex(
          (h) =>
            h.toLowerCase().includes("label") ||
            h.toLowerCase().includes("name") ||
            h.toLowerCase().includes("title")
        );

        if (dataIndex !== -1) {
          const newItems: QRItem[] = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim());
            if (values[dataIndex]) {
              newItems.push({
                id: i.toString(),
                data: values[dataIndex],
                color: colors[i % colors.length].value,
                label:
                  labelIndex !== -1 && values[labelIndex]
                    ? values[labelIndex]
                    : `QR Code ${i}`,
              });
            }
          }
          if (newItems.length > 0) {
            setQrItems(newItems);
            setGeneratedQRs({});
          }
        } else {
          alert(
            "CSV file must contain a column with 'data', 'text', or 'url' in the header."
          );
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generateSampleCSV = () => {
    const csvContent = `Label,Data,Description
GitHub,https://github.com,Code repository
LinkedIn,https://linkedin.com/company/example,Professional profile
Email Contact,mailto:contact@example.com,Business email
Phone Support,tel:+1234567890,Customer support
Office Location,geo:37.7749,-122.4194,San Francisco office
Welcome Message,Welcome to our service!,Greeting text
Special Offer,https://example.com/promo,Promotional link
Social Media,https://twitter.com/example,Twitter profile`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-bulk-sample.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Auto-generate when items change
  useEffect(() => {
    const validItems = qrItems.filter((item) => item.data.trim());
    if (validItems.length > 0) {
      const timer = setTimeout(generateAllQRs, 500);
      return () => clearTimeout(timer);
    }
  }, [qrItems]);

  const validItemsCount = qrItems.filter((item) => item.data.trim()).length;

  return (
    <div className="p-8 border glass rounded-2xl shadow-strong backdrop-blur-md border-white/20 animate-fade-in">
      <div className="flex flex-col justify-between mb-8 space-y-4 lg:flex-row lg:items-center lg:space-y-0">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
            Bulk QR Generator
          </h2>
          <div className="flex items-center space-x-2 text-orange-600">
            <Grid3X3 className="w-5 h-5" />
            <span className="text-sm font-medium">
              {validItemsCount} QR code{validItemsCount !== 1 ? "s" : ""} ready
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateSampleCSV}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus-ring"
          >
            <FileText className="w-4 h-4" />
            <span>Sample CSV</span>
          </button>
          <label className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] cursor-pointer focus-ring">
            <Upload className="w-4 h-4" />
            <span>Upload CSV</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </label>
          {qrItems.length > 1 && (
            <button
              onClick={clearAllItems}
              className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus-ring"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="p-4 border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
          <p className="text-sm leading-relaxed text-orange-800">
            <strong>💡 Pro Tip:</strong> Create multiple QR codes at once! Add
            them manually below or upload a CSV file. QR codes generate
            automatically as you type. Perfect for events, marketing campaigns,
            or bulk operations.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Generating QR codes...
            </span>
            <span className="text-sm text-slate-500">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200">
            <div
              className="h-2 transition-all duration-300 ease-out rounded-full bg-gradient-to-r from-orange-500 to-red-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* QR Items Input Section */}
      <div className="mb-8 space-y-4">
        {qrItems.map((item) => (
          <div
            key={item.id}
            className="p-5 transition-all duration-200 border group bg-white/60 backdrop-blur-sm rounded-xl border-slate-200 hover:border-slate-300 hover:shadow-medium"
          >
            <div className="grid items-end gap-4 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Label
                </label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) =>
                    updateQRItem(item.id, "label", e.target.value)
                  }
                  className="w-full px-3 py-2 transition-all duration-200 border rounded-lg bg-white/80 border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="QR Code label"
                />
              </div>

              <div className="lg:col-span-6">
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Data
                </label>
                <input
                  type="text"
                  value={item.data}
                  onChange={(e) =>
                    updateQRItem(item.id, "data", e.target.value)
                  }
                  className="w-full px-3 py-2 transition-all duration-200 border rounded-lg bg-white/80 border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="URL, text, email, phone number..."
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {colors.slice(0, 8).map((color) => (
                    <button
                      key={color.value}
                      onClick={() =>
                        updateQRItem(item.id, "color", color.value)
                      }
                      className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                        item.color === color.value
                          ? "border-slate-800 shadow-medium"
                          : "border-slate-300 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end lg:col-span-1">
                {qrItems.length > 1 && (
                  <button
                    onClick={() => removeQRItem(item.id)}
                    className="p-2 text-red-500 transition-all duration-200 rounded-lg hover:bg-red-50 group-hover:opacity-100 opacity-60 hover:opacity-100 focus-ring"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col items-center justify-between space-y-3 sm:flex-row sm:space-y-0">
          <button
            onClick={addQRItem}
            className="flex items-center space-x-2 font-medium text-orange-600 transition-colors duration-200 hover:text-orange-700 group"
          >
            <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            <span>Add Another QR Code</span>
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={generateAllQRs}
              disabled={isGenerating || validItemsCount === 0}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate All ({validItemsCount})</span>
                </>
              )}
            </button>

            {Object.keys(generatedQRs).length > 1 && (
              <button
                onClick={downloadAllQRs}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus-ring"
              >
                <Download className="w-4 h-4" />
                <span>Download All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Generated QR Codes Display */}
      {Object.keys(generatedQRs).length > 0 && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">
              Generated QR Codes ({Object.keys(generatedQRs).length})
            </h3>
            <div className="flex items-center space-x-2 text-green-600">
              <Package className="w-5 h-5" />
              <span className="text-sm font-medium">Ready to download</span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {qrItems.map((item) => {
              const qrDataUrl = generatedQRs[item.id];
              if (!qrDataUrl) return null;

              return (
                <div
                  key={item.id}
                  className="p-5 transition-all duration-300 border group bg-white/80 backdrop-blur-sm rounded-xl border-slate-200 hover:border-slate-300 hover:shadow-medium"
                >
                  <div className="text-center">
                    <h4
                      className="mb-3 font-semibold truncate text-slate-800"
                      title={item.label}
                    ></h4>

                    <div className="relative p-4 mb-4 transition-colors duration-200 bg-slate-50 rounded-xl group-hover:bg-white">
                      <img
                        src={qrDataUrl}
                        alt={`QR Code for ${item.label}`}
                        className="w-full max-w-[160px] h-auto mx-auto cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => setShowPreview(qrDataUrl)}
                      />
                      <button
                        onClick={() => setShowPreview(qrDataUrl)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white focus-ring"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <p className="p-2 text-xs leading-relaxed break-all rounded-lg text-slate-600 bg-slate-50">
                        {item.data}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadSingleQR(item.id, item.label)}
                        className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] text-sm focus-ring"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => copyQRToClipboard(item.id)}
                        className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus-ring"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowPreview(null)}
        >
          <div
            className="w-full max-w-md p-6 bg-white rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                QR Code Preview
              </h3>
              <button
                onClick={() => setShowPreview(null)}
                className="p-2 transition-colors rounded-lg hover:bg-slate-100 focus-ring"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center">
              <img
                src={showPreview}
                alt="QR Code Preview"
                className="w-full max-w-[300px] h-auto mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkQR;
