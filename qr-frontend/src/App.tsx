import { Grid3X3, QrCode, Share2, Sparkles, Wifi, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import BulkQR from "./components/BulkQR";
import QRCodeGenerator from "./components/QRCodeGenerator";
import SocialMediaQR from "./components/SocialMediaQR";
import WiFiQR from "./components/WiFiQR";

function App() {
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoaded, setIsLoaded] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    // Typing animation for the main title
    const title = "QR Code Generator";
    let index = 0;

    const typeTitle = () => {
      if (index < title.length) {
        setTypedText(title.slice(0, index + 1));
        index++;
        setTimeout(typeTitle, 100);
      } else {
        // Show description after title is complete
        setTimeout(() => setShowDescription(true), 500);
      }
    };

    // Start typing after initial load
    setTimeout(typeTitle, 800);
  }, []);

  const tabs = [
    {
      id: "basic",
      name: "Basic QR",
      icon: QrCode,
      description: "Create QR codes for text, URLs, and more",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "social",
      name: "Social Media",
      icon: Share2,
      description: "Generate QR codes for social profiles",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "wifi",
      name: "WiFi",
      icon: Wifi,
      description: "Share WiFi credentials instantly",
      gradient: "from-green-500 to-teal-500",
    },
    {
      id: "bulk",
      name: "Bulk Generate",
      icon: Grid3X3,
      description: "Create multiple QR codes at once",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute rounded-full -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 blur-2xl animate-bounce-gentle"></div>
      </div>

      <div
        className={`container mx-auto px-4 py-8 relative z-10 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header */}
        <div className="mb-20 text-center animate-fade-in">
          <div className="flex flex-col items-center justify-center max-w-6xl mx-auto mb-8 space-y-6 lg:space-y-0 lg:flex-row lg:space-x-8 lg:justify-start lg:text-left">
            {/* Animated QR Icon */}
            <div className="relative flex-shrink-0">
              <div className="relative group">
                <QrCode className="relative z-10 w-20 h-20 text-transparent transition-all duration-500 transform lg:w-24 lg:h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 bg-clip-text filter drop-shadow-lg group-hover:scale-110 group-hover:rotate-3" />
                <div className="absolute inset-0 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-cyan-400/30 blur-2xl animate-pulse-slow"></div>
                <div
                  className="absolute inset-0 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-xl animate-ping"
                  style={{ animationDuration: "3s" }}
                ></div>
              </div>
            </div>

            {/* Title and Subtitle */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:flex-1">
              <div className="relative mb-4">
                <h1 className="text-5xl font-black leading-tight lg:text-7xl xl:text-8xl">
                  <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text bg-300% animate-gradient">
                    {typedText}
                    <span className="inline-block w-1 h-12 ml-1 lg:h-16 xl:h-20 bg-gradient-to-b from-blue-600 to-purple-600 animate-pulse"></span>
                  </span>
                </h1>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-500/10 blur-3xl opacity-30 animate-pulse-slow"></div>
              </div>

              {/* Dynamic Tagline */}
              <div
                className={`flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6 transition-all duration-700 ${
                  showDescription
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <div className="flex items-center px-4 py-2 space-x-2 border rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200/50 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-spin-slow" />
                  <span className="text-sm font-bold tracking-wider text-blue-700">
                    MODERN
                  </span>
                </div>
                <div className="flex items-center px-4 py-2 space-x-2 border rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200/50 backdrop-blur-sm">
                  <Zap className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span className="text-sm font-bold tracking-wider text-purple-700">
                    LIGHTNING FAST
                  </span>
                </div>
                <div className="flex items-center px-4 py-2 space-x-2 border rounded-full bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-cyan-200/50 backdrop-blur-sm">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 animate-ping"></div>
                  <span className="text-sm font-bold tracking-wider text-cyan-700">
                    BEAUTIFUL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Description */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              showDescription
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <p className="max-w-4xl mx-auto text-xl font-medium leading-relaxed lg:text-2xl text-slate-600">
              Create{" "}
              <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                stunning QR codes
              </span>{" "}
              with
              <span className="font-bold text-transparent bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text">
                {" "}
                advanced customization
              </span>{" "}
              options.
              <br className="hidden sm:block" />
              Professional-grade tools for all your QR code needs.
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-wrap items-center justify-center mt-8 space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
                <span>Instant Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                <span>High Quality Export</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
                <span>Multiple Formats</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500"></div>
                <span>Bulk Processing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="flex justify-center mb-12 animate-slide-up">
          <div className="p-3 glass rounded-2xl shadow-strong backdrop-blur-md">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {tabs.map((tab, index) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative p-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus-ring ${
                      isActive
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-medium`
                        : "text-slate-600 hover:bg-white/50 hover:text-slate-800"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <IconComponent
                        className={`w-6 h-6 transition-transform duration-300 ${
                          isActive ? "scale-110" : "group-hover:scale-105"
                        }`}
                      />
                      <span className="text-sm font-semibold">{tab.name}</span>
                      <span
                        className={`text-xs text-center leading-tight transition-opacity duration-300 ${
                          isActive
                            ? "opacity-90"
                            : "opacity-60 group-hover:opacity-80"
                        }`}
                      >
                        {tab.description}
                      </span>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-r from-white/20 to-transparent"></div>
                    )}

                    {/* Hover glow effect */}
                    <div
                      className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r ${tab.gradient} pointer-events-none`}
                    ></div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content with smooth transitions */}
        <div className="max-w-6xl mx-auto">
          <div
            className={`transition-all duration-500 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {activeTab === "basic" && <QRCodeGenerator />}
            {activeTab === "social" && <SocialMediaQR />}
            {activeTab === "wifi" && <WiFiQR />}
            {activeTab === "bulk" && <BulkQR />}
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-20 space-y-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-slate-500">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <span className="px-4 text-sm font-medium">
              Built with modern technologies
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>

          {/* Copyright and Links Section */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-slate-500">
              Copyright © 2025 Chamath Dilshan
            </span>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <a
                href="#"
                className="transition-colors hover:text-slate-600 underline-offset-2 hover:underline"
              >
                Trademark Policy
              </a>
              <span>·</span>
              <a
                href="#"
                className="transition-colors hover:text-slate-600 underline-offset-2 hover:underline"
              >
                Privacy Policy
              </a>
              <span>·</span>
              <a
                href="#"
                className="transition-colors hover:text-slate-600 underline-offset-2 hover:underline"
              >
                Terms of Service
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <span>React</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <span>TypeScript</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-teal-500"></div>
              <span>Tailwind CSS</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
              <span>Vite</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
