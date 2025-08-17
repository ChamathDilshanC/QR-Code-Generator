import {
  Copy,
  Download,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  Shield,
  Signal,
  Sparkles,
  Wifi,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

const WiFiQR = () => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState("WPA");
  const [hidden, setHidden] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const securityTypes = [
    {
      value: "WPA",
      label: "WPA/WPA2",
      icon: Shield,
      description: "Most secure (recommended)",
      color: "text-green-600",
    },
    {
      value: "WEP",
      label: "WEP",
      icon: Lock,
      description: "Legacy security (not recommended)",
      color: "text-orange-600",
    },
    {
      value: "nopass",
      label: "No Password",
      icon: Wifi,
      description: "Open network (public)",
      color: "text-blue-600",
    },
  ];

  useEffect(() => {
    if (ssid.trim()) {
      const timer = setTimeout(generateWiFiQR, 300);
      return () => clearTimeout(timer);
    } else {
      setQrCodeUrl(null);
    }
  }, [ssid, password, security, hidden]);

  const generateWiFiQR = async () => {
    if (!ssid.trim()) {
      setQrCodeUrl(null);
      return;
    }

    if (security !== "nopass" && !password.trim()) {
      setQrCodeUrl(null);
      return;
    }

    setIsGenerating(true);

    // WiFi QR Code format: WIFI:T:WPA;S:mynetwork;P:mypass;H:false;;
    const wifiString = `WIFI:T:${security};S:${ssid};P:${
      security === "nopass" ? "" : password
    };H:${hidden};;`;

    try {
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, wifiString, {
          color: {
            dark: "#059669",
            light: "#FFFFFF",
          },
          width: 300,
          margin: 2,
          errorCorrectionLevel: "M",
        });
        setQrCodeUrl(canvas.toDataURL("image/png", 1.0));
      }
    } catch (error) {
      console.error("Error generating WiFi QR code:", error);
      alert("Error generating WiFi QR code. Please check your input.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.download = `wifi-${ssid.replace(/[^a-zA-Z0-9]/g, "")}-qrcode.png`;
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

  const selectedSecurityType = securityTypes.find(
    (type) => type.value === security
  );

  return (
    <div className="glass rounded-2xl shadow-strong p-8 backdrop-blur-md border border-white/20 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          WiFi QR Code
        </h2>
        <div className="flex items-center space-x-2 text-green-600">
          <Signal className="w-5 h-5" />
          <span className="text-sm font-medium">Instant Connection</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              <Wifi className="w-4 h-4 inline mr-1" />
              Network Name (SSID)
            </label>
            <input
              type="text"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder="Enter WiFi network name"
              className="w-full px-4 py-4 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 group-hover:border-slate-300 text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-4">
              Security Type
            </label>
            <div className="space-y-3">
              {securityTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = security === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSecurity(type.value)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.01] focus-ring ${
                      isSelected
                        ? "border-green-500 bg-green-50 shadow-medium"
                        : "border-slate-200 bg-white/50 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent
                        className={`w-5 h-5 ${
                          isSelected ? "text-green-600" : type.color
                        }`}
                      />
                      <div className="text-left">
                        <div
                          className={`font-semibold ${
                            isSelected ? "text-green-700" : "text-slate-700"
                          }`}
                        >
                          {type.label}
                        </div>
                        <div
                          className={`text-sm ${
                            isSelected ? "text-green-600" : "text-slate-500"
                          }`}
                        >
                          {type.description}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {security !== "nopass" && (
            <div className="group animate-slide-up">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                <Lock className="w-4 h-4 inline mr-1" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter WiFi password"
                  className="w-full px-4 py-4 pr-12 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 group-hover:border-slate-300 text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus-ring rounded-lg p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="hidden"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
              className="w-4 h-4 text-green-600 bg-white border-slate-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <label
              htmlFor="hidden"
              className="text-sm font-medium text-slate-700 cursor-pointer"
            >
              Hidden Network (SSID not broadcast)
            </label>
          </div>

          <button
            onClick={generateWiFiQR}
            disabled={
              isGenerating ||
              !ssid.trim() ||
              (security !== "nopass" && !password.trim())
            }
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate WiFi QR</span>
              </>
            )}
          </button>
        </div>

        {/* QR Code Display */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 shadow-medium border border-slate-200 flex items-center justify-center min-h-[350px] transition-all duration-300 group-hover:shadow-strong">
              <canvas
                ref={canvasRef}
                className={`max-w-full h-auto rounded-lg transition-all duration-300 ${
                  qrCodeUrl ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                style={{ display: qrCodeUrl ? "block" : "none" }}
              />
              {!qrCodeUrl && (
                <div className="text-center animate-pulse">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-200 to-teal-200 rounded-2xl flex items-center justify-center">
                    <Wifi className="w-12 h-12 text-green-500" />
                  </div>
                  <p className="text-slate-500 font-medium">
                    {!ssid.trim()
                      ? "Enter network name to generate QR code"
                      : security !== "nopass" && !password.trim()
                      ? "Enter password to generate QR code"
                      : "Generating WiFi QR code..."}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {selectedSecurityType?.description ||
                      "Select security type above"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {qrCodeUrl && (
            <div className="w-full space-y-4 animate-slide-up">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">
                  Connection Details:
                </h3>
                <div className="space-y-1 text-sm text-green-700">
                  <div>
                    <strong>Network:</strong> {ssid}
                  </div>
                  <div>
                    <strong>Security:</strong> {selectedSecurityType?.label}
                  </div>
                  {security !== "nopass" && (
                    <div>
                      <strong>Password:</strong> {"•".repeat(password.length)}
                    </div>
                  )}
                  {hidden && (
                    <div>
                      <strong>Hidden:</strong> Yes
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
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
                      ? "bg-gradient-to-r from-green-600 to-teal-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WiFiQR;
