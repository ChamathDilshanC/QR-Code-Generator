# 🎯 QR Code Generator

<div align="center">

![QR Code Generator](https://img.shields.io/badge/QR%20Code-Generator-blue?style=for-the-badge&logo=qrcode&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)

**🌟 Modern • ⚡ Lightning Fast • 🎨 Beautiful**

_Create stunning QR codes with advanced customization options. Professional-grade tools for all your QR code needs._

[🚀 **Live Demo**](https://qr-code-generator-3f464.web.app) | [📱 **Try Now**](https://qr-code-generator-3f464.web.app) | [⭐ **Star on GitHub**](https://github.com/ChamathDilshanC/QR-Code-Generator)

</div>

## ✨ Features

### 🎯 **Basic QR Code Generation**

- **📝 Text & URLs** - Convert any text or website URL into QR codes
- **🎨 Custom Colors** - Choose foreground and background colors with live preview
- **📏 Size Control** - Adjustable QR code dimensions (200px - 600px)
- **🛡️ Error Correction** - Multiple levels (Low, Medium, Quartile, High)
- **💾 High-Quality Export** - Download as PNG with crystal-clear quality

### 📱 **Social Media QR Codes**

- **🔗 Instagram** - Direct links to profiles
- **🐦 Twitter/X** - Social media integration
- **💼 LinkedIn** - Professional networking
- **📘 Facebook** - Social connections
- **🎵 TikTok** - Content sharing

### 📶 **WiFi QR Codes**

- **🔐 Secure Networks** - WPA/WPA2 encryption support
- **🌐 Open Networks** - Public WiFi sharing
- **👁️ Hidden Networks** - SSID visibility options
- **📱 One-Scan Connect** - Instant WiFi access

### 📊 **Bulk Generation**

- **📋 Batch Processing** - Generate multiple QR codes simultaneously
- **📄 CSV Import** - Upload data from spreadsheets
- **💾 Bulk Download** - Export all codes as ZIP archive
- **⚡ Fast Processing** - Optimized for large datasets

## 🎨 Design Features

### 🖌️ **Modern UI/UX**

- **✨ Glass Morphism** - Contemporary design language
- **🌈 Gradient Animations** - Smooth color transitions
- **📱 Responsive Design** - Perfect on all devices
- **⚡ Smooth Animations** - Typing effects and transitions

### 🎯 **Advanced Customization**

- **🎨 Color Presets** - Popular color combinations
- **📐 Ultra-Modern Interface** - Professional-grade controls
- **👆 Touch-Friendly** - Optimized for mobile interaction
- **🔄 Real-Time Preview** - Instant visual feedback

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Firebase CLI (for deployment)

### ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/ChamathDilshanC/QR-Code-Generator.git

# Navigate to project
cd QR-Code-Generator

# Install frontend dependencies
cd qr-frontend
npm install

# Start development server
npm run dev

# Install backend dependencies (separate terminal)
cd ../functions
npm install

# Start Firebase emulator
firebase emulators:start
```

### 🌐 Live Demo

Visit the live application: **[https://qr-code-generator-3f464.web.app](https://qr-code-generator-3f464.web.app)**

## 🛠️ Tech Stack

### **Frontend**

- **⚛️ React 18** - Modern UI library
- **📘 TypeScript** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first styling
- **⚡ Vite** - Lightning-fast build tool
- **🎭 Lucide React** - Beautiful icons

### **Backend**

- **🔥 Firebase Functions** - Serverless backend
- **☁️ Firebase Hosting** - Fast global CDN
- **📊 Firebase Analytics** - Usage insights

### **Libraries**

- **📱 qrcode** - QR code generation
- **🎯 React Hooks** - State management
- **🌈 CSS Animations** - Smooth transitions

## 📁 Project Structure

```
QR-Code-Generator/
├── 📁 qr-frontend/          # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/   # Reusable UI components
│   │   │   ├── 📄 QRCodeGenerator.tsx
│   │   │   ├── 📄 SocialMediaQR.tsx
│   │   │   ├── 📄 WiFiQR.tsx
│   │   │   └── 📄 BulkQR.tsx
│   │   ├── 📄 App.tsx       # Main application
│   │   └── 📄 index.css     # Global styles
│   ├── 📄 package.json
│   └── 📄 vite.config.ts
├── 📁 functions/            # Firebase Cloud Functions
│   ├── 📁 src/
│   │   ├── 📄 index.ts      # API endpoints
│   │   └── 📄 qrService.ts  # QR generation service
│   └── 📄 package.json
├── 📄 firebase.json         # Firebase configuration
└── 📄 README.md            # This file
```

## 🎯 Usage Examples

### **Basic QR Code**

```typescript
// Generate QR code for URL
const qrData = "https://github.com/ChamathDilshanC";
const options = {
  color: "#2563eb",
  backgroundColor: "#ffffff",
  size: 300,
  errorCorrectionLevel: "M",
};
```

### **WiFi QR Code**

```typescript
// WiFi network configuration
const wifiConfig = {
  ssid: "MyNetwork",
  password: "SecurePassword123",
  security: "WPA",
  hidden: false,
};
```

## 🎨 Customization

### **Color Themes**

- 🔵 **Professional Blue** - `#2563eb`
- 🟣 **Modern Purple** - `#7c3aed`
- 🟢 **Fresh Green** - `#059669`
- 🔴 **Bold Red** - `#dc2626`

### **Size Options**

- 📱 **Mobile** - 200px
- 💻 **Desktop** - 300px
- 🖨️ **Print** - 600px

## 🚀 Deployment

### **Frontend Deployment**

```bash
# Build the frontend
cd qr-frontend
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### **Backend Deployment**

```bash
# Deploy Cloud Functions
firebase deploy --only functions
```

## 📱 Browser Support

| Browser          | Version |
| ---------------- | ------- |
| 🌐 Chrome        | 90+     |
| 🦊 Firefox       | 88+     |
| 🧭 Safari        | 14+     |
| 📱 Mobile Safari | iOS 14+ |
| 📱 Chrome Mobile | 90+     |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**

1. 🍴 Fork the repository
2. 🌿 Create a feature branch
3. 💻 Make your changes
4. ✅ Run tests
5. 📤 Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Chamath Dilshan**

- 🌐 Website: [Your Website](https://your-website.com)
- 📧 Email: [your.email@example.com](mailto:your.email@example.com)
- 🐙 GitHub: [@ChamathDilshanC](https://github.com/ChamathDilshanC)
- 💼 LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- **QRCode.js** - Excellent QR code generation library
- **React Team** - Amazing framework
- **Tailwind CSS** - Beautiful utility-first CSS
- **Firebase** - Reliable hosting and backend services
- **Lucide** - Beautiful icon set

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=ChamathDilshanC.QR-Code-Generator)
![GitHub stars](https://img.shields.io/github/stars/ChamathDilshanC/QR-Code-Generator?style=social)
![GitHub forks](https://img.shields.io/github/forks/ChamathDilshanC/QR-Code-Generator?style=social)

_Made with ❤️ by [Chamath Dilshan](https://github.com/ChamathDilshanC)_

</div>
