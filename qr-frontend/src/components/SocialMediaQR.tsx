import {
  Copy,
  Download,
  ExternalLink,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

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
      icon: FaInstagram,
      url: "https://instagram.com/",
      color: "#E91E63",
      gradient: "from-pink-500 to-rose-500",
      placeholder: "your_username",
      description: "Share your Instagram profile",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: FaFacebook,
      url: "https://facebook.com/",
      color: "#1877F2",
      gradient: "from-blue-600 to-blue-700",
      placeholder: "your.profile",
      description: "Connect on Facebook",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: FaLinkedin,
      url: "https://linkedin.com/in/",
      color: "#0A66C2",
      gradient: "from-blue-700 to-blue-800",
      placeholder: "your-profile",
      description: "Professional networking",
    },
    {
      id: "github",
      name: "GitHub",
      icon: FaGithub,
      url: "https://github.com/",
      color: "#171515",
      gradient: "from-gray-800 to-gray-900",
      placeholder: "yourusername",
      description: "Showcase your code",
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: FaTwitter,
      url: "https://twitter.com/",
      color: "#1DA1F2",
      gradient: "from-sky-500 to-sky-600",
      placeholder: "yourusername",
      description: "Follow on Twitter",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: FaYoutube,
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
          const logoSize = size * 0.15; // Reduced from 0.2 to 0.15 (15% of QR code size)
          const iconSize = logoSize * 0.6; // Icon is 60% of logo circle
          const x = (size - iconSize) / 2;
          const y = (size - iconSize) / 2;

          // Create a white circle background for the logo
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, logoSize / 2 + 8, 0, 2 * Math.PI);
          ctx.fill();

          // Draw a colored circle for the platform
          ctx.fillStyle = platform.color;
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, logoSize / 2, 0, 2 * Math.PI);
          ctx.fill();

          // Create and draw the icon using SVG
          const iconSvg = getPlatformIconSvg(platform.id, iconSize);
          const img = new Image();
          const svgBlob = new Blob([iconSvg], {
            type: "image/svg+xml;charset=utf-8",
          });
          const url = URL.createObjectURL(svgBlob);

          img.onload = () => {
            ctx.drawImage(img, x, y, iconSize, iconSize);
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
      instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="18" cy="6" r="1" fill="${iconColor}"/>
      </svg>`,
      facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${iconColor}">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
      </svg>`,
      linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${iconColor}">
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
      </svg>`,
      github: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${iconColor}">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>`,
      twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${iconColor}">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
      </svg>`,
      youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${iconColor}">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
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
