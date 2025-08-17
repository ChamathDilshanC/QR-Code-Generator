import {
  Copy,
  Download,
  ExternalLink,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Twitter,
  Youtube,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

const SocialMediaQR = () => {
  const [username, setUsername] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const socialPlatforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/",
      color: "#E4405F",
      gradient: "from-pink-500 to-rose-500",
      placeholder: "your_username",
      description: "Share your Instagram profile",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/",
      color: "#1877F2",
      gradient: "from-blue-600 to-blue-700",
      placeholder: "your.profile",
      description: "Connect on Facebook",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/",
      color: "#0A66C2",
      gradient: "from-blue-700 to-blue-800",
      placeholder: "your-profile",
      description: "Professional networking",
    },
    {
      id: "github",
      name: "GitHub",
      icon: Github,
      url: "https://github.com/",
      color: "#171515",
      gradient: "from-gray-800 to-gray-900",
      placeholder: "yourusername",
      description: "Showcase your code",
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/",
      color: "#1DA1F2",
      gradient: "from-sky-500 to-sky-600",
      placeholder: "yourusername",
      description: "Follow on Twitter",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/@",
      color: "#FF0000",
      gradient: "from-red-600 to-red-700",
      placeholder: "yourchannel",
      description: "Subscribe to channel",
    },
  ];

  const platform = socialPlatforms.find((p) => p.id === selectedPlatform);

  useEffect(() => {
    if (platform && username.trim()) {
      setPreviewUrl(platform.url + username);
      const timer = setTimeout(generateSocialQR, 300);
      return () => clearTimeout(timer);
    } else {
      setPreviewUrl("");
      setQrCodeUrl(null);
    }
  }, [username, selectedPlatform]);

  const generateSocialQR = async () => {
    if (!username.trim()) {
      setQrCodeUrl(null);
      return;
    }

    if (!platform) return;

    setIsGenerating(true);
    const socialUrl = platform.url + username;

    try {
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, socialUrl, {
          color: {
            dark: platform.color,
            light: "#FFFFFF",
          },
          width: 300,
          margin: 2,
          errorCorrectionLevel: "M",
        });
        setQrCodeUrl(canvas.toDataURL("image/png", 1.0));
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Error generating QR code. Please check your username.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.download = `${selectedPlatform}-${username}-qrcode.png`;
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

  const openPreview = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  return (
    <div className="glass rounded-2xl shadow-strong p-8 backdrop-blur-md border border-white/20 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Social Media QR Codes
        </h2>
        <div className="flex items-center space-x-2 text-purple-600">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm font-medium">Connect & Grow</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Platform Selection & Input */}
        <div className="space-y-6">
          {/* Username Input */}
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={platform?.placeholder || "Enter username"}
                className="w-full px-4 py-4 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 group-hover:border-slate-300 text-lg"
              />
              {platform && (
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                  <span className="sr-only">{platform.url}</span>
                </div>
              )}
            </div>
            {previewUrl && (
              <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600 truncate mr-2">
                    <strong>Preview URL:</strong> {previewUrl}
                  </div>
                  <button
                    onClick={openPreview}
                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Open</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-4">
              Select Platform
            </label>
            <div className="grid grid-cols-2 gap-3">
              {socialPlatforms.map((platformOption) => {
                const IconComponent = platformOption.icon;
                const isSelected = selectedPlatform === platformOption.id;
                return (
                  <button
                    key={platformOption.id}
                    onClick={() => setSelectedPlatform(platformOption.id)}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] focus-ring ${
                      isSelected
                        ? `border-transparent bg-gradient-to-r ${platformOption.gradient} text-white shadow-medium`
                        : "border-slate-200 bg-white/50 hover:bg-white hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent
                        className={`w-6 h-6 transition-transform duration-300 ${
                          isSelected ? "scale-110" : "group-hover:scale-105"
                        }`}
                      />
                      <div className="text-left">
                        <div className="font-semibold text-sm">
                          {platformOption.name}
                        </div>
                        <div
                          className={`text-xs ${
                            isSelected ? "opacity-90" : "opacity-60"
                          }`}
                        >
                          {platformOption.description}
                        </div>
                      </div>
                    </div>

                    {/* Active glow effect */}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent pointer-events-none"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateSocialQR}
            disabled={isGenerating || !username.trim()}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus-ring flex items-center justify-center space-x-2 ${
              platform
                ? `bg-gradient-to-r ${platform.gradient} hover:opacity-90 text-white`
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Social QR</span>
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
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl flex items-center justify-center">
                    {platform && (
                      <platform.icon className="w-12 h-12 text-purple-500" />
                    )}
                  </div>
                  <p className="text-slate-500 font-medium">
                    {username.trim()
                      ? "Generating QR code..."
                      : "Enter username to generate QR code"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {platform?.description || "Select a platform above"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {qrCodeUrl && (
            <div className="flex flex-col sm:flex-row gap-3 w-full animate-slide-up">
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
        </div>
      </div>
    </div>
  );
};

export default SocialMediaQR;
