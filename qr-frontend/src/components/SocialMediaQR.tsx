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
        // Generate QR code with high error correction to allow for logo overlay
        await QRCode.toCanvas(canvas, socialUrl, {
          color: {
            dark: platform.color,
            light: "#FFFFFF",
          },
          width: 300,
          margin: 2,
          errorCorrectionLevel: "H", // High error correction for logo overlay
        });

        // Add platform logo in the center
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const size = canvas.width;
          const logoSize = size * 0.2; // Logo is 20% of QR code size
          const x = (size - logoSize) / 2;
          const y = (size - logoSize) / 2;

          // Create a white circle background for the logo
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, logoSize / 2 + 10, 0, 2 * Math.PI);
          ctx.fill();

          // Draw a colored circle for the platform
          ctx.fillStyle = platform.color;
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, logoSize / 2, 0, 2 * Math.PI);
          ctx.fill();

          // Create and draw the icon using SVG
          const iconSvg = getPlatformIconSvg(platform.id, logoSize);
          const img = new Image();
          const svgBlob = new Blob([iconSvg], {
            type: "image/svg+xml;charset=utf-8",
          });
          const url = URL.createObjectURL(svgBlob);

          img.onload = () => {
            ctx.drawImage(img, x, y, logoSize, logoSize);
            URL.revokeObjectURL(url);
            setQrCodeUrl(canvas.toDataURL("image/png", 1.0));
            setIsGenerating(false);
          };

          img.onerror = () => {
            URL.revokeObjectURL(url);
            setQrCodeUrl(canvas.toDataURL("image/png", 1.0));
            setIsGenerating(false);
          };

          img.src = url;
        } else {
          setQrCodeUrl(canvas.toDataURL("image/png", 1.0));
          setIsGenerating(false);
        }
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Error generating QR code. Please check your username.");
      setIsGenerating(false);
    }
  };

  const getPlatformIconSvg = (platformId: string, size: number) => {
    const iconColor = "#FFFFFF";

    const icons: Record<string, string> = {
      instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="5" y="5" width="14" height="14" rx="3" ry="3"/>
        <circle cx="12" cy="12" r="3"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="${iconColor}"/>
      </svg>`,
      facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${iconColor}">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>`,
      linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${iconColor}">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>`,
      github: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${iconColor}">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>`,
      twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${iconColor}">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>`,
      youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${iconColor}">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>`,
    };

    return icons[platformId] || icons.instagram;
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
