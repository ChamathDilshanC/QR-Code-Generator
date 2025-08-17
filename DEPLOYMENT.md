# 🚀 Firebase Deployment Guide

This guide will help you deploy your QR Code Generator to Firebase Hosting.

## Prerequisites

1. **Firebase CLI** - Install globally if not already installed:

   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Login** - Make sure you're logged in:
   ```bash
   firebase login
   ```

## 📦 Deployment Steps

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Build the Frontend

```bash
npm run build:frontend
```

### 3. Deploy Options

#### Deploy Frontend Only

```bash
npm run deploy:frontend
```

#### Deploy Functions Only

```bash
npm run deploy:functions
```

#### Deploy Everything

```bash
npm run deploy:all
```

## 🔧 Manual Deployment Steps

If you prefer to deploy manually:

### Step 1: Build Frontend

```bash
cd qr-frontend
npm run build
cd ..
```

### Step 2: Deploy to Firebase

```bash
firebase deploy --only hosting
```

Or deploy everything:

```bash
firebase deploy
```

## 📂 Project Structure

```
QR Code Generator/
├── qr-frontend/           # React frontend
│   ├── dist/             # Build output (created after npm run build)
│   └── package.json
├── functions/            # Firebase functions (backend)
├── firebase.json         # Firebase configuration
└── package.json         # Root package.json with deployment scripts
```

## 🌐 After Deployment

1. Your frontend will be available at: `https://your-project-id.web.app`
2. Your API functions will be at: `https://your-region-your-project-id.cloudfunctions.net`

## 🔄 Environment Configuration

Make sure your frontend is configured to use the correct API endpoints:

1. In your React app, update API calls to point to your deployed functions
2. For local development, you can use the Firebase emulator

## 🛠️ Troubleshooting

### Build Errors

- Ensure all dependencies are installed: `npm run install:all`
- Check TypeScript errors: `cd qr-frontend && npm run lint`

### Deployment Errors

- Verify Firebase login: `firebase login --reauth`
- Check Firebase project: `firebase projects:list`
- Ensure correct project: `firebase use your-project-id`

### CORS Issues

- Functions are configured with CORS for web deployment
- Verify the deployed function URLs match your frontend configuration

## 📊 Monitoring

After deployment, you can monitor:

- **Hosting**: Firebase Console > Hosting
- **Functions**: Firebase Console > Functions
- **Analytics**: Firebase Console > Analytics (if enabled)

## 🔐 Security

Your Firebase configuration includes:

- Automatic HTTPS
- CDN caching for static assets
- Secure function endpoints
- SPA routing support

## 💡 Tips

1. **Caching**: Static assets are cached for 1 year for optimal performance
2. **SPA Support**: All routes redirect to index.html for client-side routing
3. **Build Optimization**: Vite automatically optimizes your build for production
4. **Function Deployment**: Functions are automatically built before deployment
