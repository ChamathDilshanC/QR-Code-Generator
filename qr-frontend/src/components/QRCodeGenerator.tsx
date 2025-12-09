import {
  Copy,
  Download,
  Eye,
  EyeOff,
  Palette,
  RefreshCw,
  Settings,
  Sparkles,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

const QRCodeGenerator = () => {
  const [qrData, setQrData] = useState("https://github.com");
  const [qrColor, setQrColor] = useState("#2563eb");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(300);
  const [errorLevel, setErrorLevel] = useState("M");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const errorLevels = [
    {
      value: "L",
      label: "Low (~7%)",
      description: "Fastest generation",
      icon: "⚡",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50 hover:bg-red-100",
      textColor: "text-red-700",
      borderColor: "border-red-200",
    },
    {
      value: "M",
      label: "Medium (~15%)",
      description: "Recommended",
      icon: "✨",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
    },
    {
      value: "Q",
      label: "Quartile (~25%)",
      description: "Better recovery",
      icon: "🛡️",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 hover:bg-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-200",
    },
    {
      value: "H",
      label: "High (~30%)",
      description: "Best recovery",
      icon: "💎",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
    },
  ];

  const presetColors = [
    "#2563eb",
    "#dc2626",
    "#059669",
    "#7c3aed",
    "#ea580c",
    "#0891b2",
    "#be185d",
    "#4338ca",
    "#000000",
    "#374151",
    "#6b7280",
    "#1f2937",
  ];

  const generateQR = async () => {
    if (!qrData.trim()) {
      alert("Please enter some data");
      return;
    }

    setIsGenerating(true);

    try {
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, qrData, {
          color: {
            dark: qrColor,
            light: bgColor,
          },
          width: qrSize,
          margin: 2,
          errorCorrectionLevel: errorLevel as any,
        });
        setQrCodeUrl(canvas.toDataURL("image/png", 1.0));
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Error generating QR code. Please check your input.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.download = `qrcode-${Date.now()}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const copyToClipboard = async () => {
    if (qrCodeUrl) {
      try {
        const blob = await fetch(qrCodeUrl).then((r) => r.blob());
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  useEffect(() => {
    if (qrData.trim()) {
      const timer = setTimeout(generateQR, 300);
      return () => clearTimeout(timer);
    }
  }, [qrData, qrColor, bgColor, qrSize, errorLevel]);

  return (
    <div className="p-4 sm:p-6 md:p-8 border glass rounded-2xl shadow-strong backdrop-blur-md border-white/20 animate-fade-in">
      <div className="flex flex-col items-start gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
          Generate QR Code
        </h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center px-3 sm:px-4 py-2 space-x-2 transition-colors duration-200 rounded-lg bg-slate-100 hover:bg-slate-200 focus-ring text-sm"
        >
          <Settings className="w-4 h-4" />
          <span className="font-medium">Advanced</span>
          {showAdvanced ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="group">
            <label className="block mb-3 text-sm font-semibold text-slate-700">
              Enter your data
            </label>
            <div className="relative">
              <textarea
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                placeholder="Enter text, URL, email, phone number, or any data..."
                className="w-full h-32 px-4 py-3 transition-all duration-200 border resize-none bg-white/80 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm group-hover:border-slate-300 focus-ring"
              />
              <div className="absolute text-xs top-3 right-3 text-slate-400">
                {qrData.length} chars
              </div>
            </div>
          </div>

          {/* Generate Button - Moved to top */}
          <button
            onClick={generateQR}
            disabled={isGenerating}
            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group shadow-lg"
          >
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 group-hover:opacity-100"></div>
            <div className="absolute inset-0 transition-transform duration-700 ease-out -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full"></div>
            {isGenerating ? (
              <>
                <RefreshCw className="z-10 w-5 h-5 animate-spin" />
                <span className="z-10 text-white">Generating...</span>
              </>
            ) : (
              <>
                <div className="z-10 p-1 transition-colors duration-300 rounded-full bg-white/20 group-hover:bg-white/30">
                  <Sparkles className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="z-10 text-white transition-colors duration-300 group-hover:text-white">
                  Generate QR Code
                </span>
                <div className="z-10 w-2 h-2 transition-all duration-300 rounded-full bg-white/40 group-hover:bg-white/60"></div>
              </>
            )}
          </button>

          {/* Color Selection */}
          <div className="space-y-6 sm:space-y-8">
            {/* Foreground Color Section */}
            <div className="relative p-4 sm:p-6 overflow-hidden transition-all duration-300 border bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-sm rounded-2xl border-slate-200/50 hover:border-slate-300/50 hover:shadow-lg group">
              <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 group-hover:opacity-100"></div>

              <div className="relative z-10">
                <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between sm:mb-6">
                  <label className="flex items-center space-x-2 sm:space-x-3 text-sm font-bold text-slate-800">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm">
                      <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base">Foreground Color</span>
                  </label>
                  <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full border border-blue-200">
                    QR Pattern
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Color Input Row */}
                  <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center">
                    <div className="relative group/color">
                      <input
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="w-16 h-16 sm:w-16 sm:h-16 transition-all duration-300 border-4 border-white shadow-lg cursor-pointer rounded-2xl hover:shadow-xl hover:scale-105 focus-ring"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none rounded-2xl bg-gradient-to-r from-white/20 to-transparent group-hover/color:opacity-100"></div>
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="w-full px-3 sm:px-4 py-3 sm:py-3 bg-white/90 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-mono text-sm backdrop-blur-sm hover:bg-white focus-ring shadow-sm"
                        placeholder="#2563eb"
                      />
                    </div>
                  </div>

                  {/* Color Presets */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <span className="text-xs font-semibold tracking-wider uppercase text-slate-600 whitespace-nowrap">
                        Popular Colors
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-6 gap-2 sm:gap-3 md:grid-cols-8 lg:grid-cols-6">
                      {presetColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setQrColor(color)}
                          className={`relative w-full aspect-square rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-3 focus-ring group/preset ${
                            qrColor === color
                              ? "ring-4 ring-blue-500 ring-offset-2 shadow-lg scale-110"
                              : "hover:shadow-md"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        >
                          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-lg sm:rounded-xl bg-gradient-to-t from-black/20 to-transparent group-hover/preset:opacity-100"></div>
                          {qrColor === color && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full shadow-sm animate-pulse"></div>
                            </div>
                          )}
                          <div
                            className="absolute w-2 h-2 sm:w-3 sm:h-3 transition-all duration-300 delay-75 rounded-full opacity-0 -top-1 -right-1 group-hover/preset:opacity-100"
                            style={{
                              background: `linear-gradient(45deg, ${color}, white)`,
                              animation:
                                qrColor === color
                                  ? "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite"
                                  : "none",
                            }}
                          ></div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Color Section */}
            <div className="relative p-4 sm:p-6 overflow-hidden transition-all duration-300 border bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-sm rounded-2xl border-slate-200/50 hover:border-slate-300/50 hover:shadow-lg group">
              <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-r from-orange-500/5 via-pink-500/5 to-red-500/5 group-hover:opacity-100"></div>

              <div className="relative z-10">
                <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between sm:mb-6">
                  <label className="flex items-center space-x-2 sm:space-x-3 text-sm font-bold text-slate-800">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 shadow-sm">
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-sm"></div>
                    </div>
                    <span className="text-sm sm:text-base">Background Color</span>
                  </label>
                  <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full border border-orange-200">
                    Canvas
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Color Input Row */}
                  <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center">
                    <div className="relative group/bg">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-16 h-16 sm:w-16 sm:h-16 transition-all duration-300 border-4 border-white shadow-lg cursor-pointer rounded-2xl hover:shadow-xl hover:scale-105 focus-ring"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none rounded-2xl bg-gradient-to-r from-white/20 to-transparent group-hover/bg:opacity-100"></div>
                      {bgColor === "#ffffff" && (
                        <div className="absolute border-2 border-dashed pointer-events-none inset-2 border-slate-300 rounded-xl"></div>
                      )}
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full px-3 sm:px-4 py-3 sm:py-3 bg-white/90 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 font-mono text-sm backdrop-blur-sm hover:bg-white focus-ring shadow-sm"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  {/* Background Presets */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <span className="text-xs font-semibold tracking-wider uppercase text-slate-600 whitespace-nowrap">
                        Quick Backgrounds
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-3 sm:pb-2 sm:overflow-x-auto">
                      {[
                        "#ffffff",
                        "#f8fafc",
                        "#f1f5f9",
                        "#e2e8f0",
                        "#000000",
                        "#1e293b",
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => setBgColor(color)}
                          className={`relative flex-shrink-0 w-full sm:w-14 h-12 rounded-xl transition-all duration-300 transform hover:scale-105 focus-ring border-2 ${
                            bgColor === color
                              ? "border-orange-500 shadow-lg scale-105"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        >
                          {color === "#ffffff" && (
                            <div className="absolute border border-dashed rounded-lg inset-1.5 border-slate-300"></div>
                          )}
                          {bgColor === color && (
                            <div className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full -top-1 -right-1 animate-ping"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          <div className="relative group">
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 sm:p-8 shadow-medium border border-slate-200 flex items-center justify-center min-h-[300px] sm:min-h-[350px] transition-all duration-300 group-hover:shadow-strong">
              <canvas
                ref={canvasRef}
                className={`max-w-full h-auto rounded-lg transition-all duration-300 ${
                  qrCodeUrl ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                style={{ display: qrCodeUrl ? "block" : "none" }}
              />
              {!qrCodeUrl && (
                <div className="text-center animate-pulse">
                  <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-dashed border-slate-400 rounded-xl"></div>
                  </div>
                  <p className="font-medium text-sm sm:text-base text-slate-500">
                    Your QR code will appear here
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400">
                    Start typing to generate automatically
                  </p>
                </div>
              )}
            </div>
          </div>

          {qrCodeUrl && (
            <div className="flex flex-col w-full gap-3 sm:flex-row animate-slide-up">
              <button
                onClick={downloadQR}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus-ring"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={copyToClipboard}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus-ring ${
                  copied
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          )}

          {/* Advanced Settings - Moved here */}
          {showAdvanced && (
            <div className="w-full p-4 sm:p-6 space-y-4 border bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200 animate-slide-up shadow-medium">
              <div>
                <label className="block mb-3 text-sm font-semibold text-slate-700">
                  Size: {qrSize}px
                </label>
                <input
                  type="range"
                  min="200"
                  max="600"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 slider focus-ring"
                />
              </div>

              <div>
                <label className="block mb-3 text-sm font-semibold text-slate-700">
                  Error Correction Level
                </label>
                <div className="grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-2">
                  {errorLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setErrorLevel(level.value)}
                      className={`relative group p-3 sm:p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] focus-ring border-2 ${
                        errorLevel === level.value
                          ? `bg-gradient-to-r ${level.color} text-white border-transparent shadow-lg`
                          : `${level.bgColor} ${level.textColor} ${level.borderColor} hover:shadow-md`
                      }`}
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div
                          className={`text-xl sm:text-2xl transition-transform duration-300 ${
                            errorLevel === level.value
                              ? "scale-110"
                              : "group-hover:scale-110"
                          }`}
                        >
                          {level.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-bold text-xs sm:text-sm mb-1 ${
                              errorLevel === level.value
                                ? "text-white"
                                : level.textColor
                            }`}
                          >
                            {level.label}
                          </div>
                          <div
                            className={`text-xs transition-colors duration-300 ${
                              errorLevel === level.value
                                ? "text-white/90"
                                : "text-slate-500"
                            }`}
                          >
                            {level.description}
                          </div>
                        </div>
                        {errorLevel === level.value && (
                          <div className="absolute top-2 right-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                      {errorLevel === level.value && (
                        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-xl bg-gradient-to-r from-white/10 via-transparent to-white/10 group-hover:opacity-100"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setQrColor("#2563eb");
                  setBgColor("#ffffff");
                  setQrSize(300);
                  setErrorLevel("M");
                }}
                className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 focus-ring flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
