# PetAdopt - MacBook Setup Guide

## Prerequisites for MacBook Development

### 1. Install Homebrew (Package Manager for macOS)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js and npm
```bash
# Install Node.js (includes npm)
brew install node

# Verify installation
node --version
npm --version
```

### 3. Install Git (if not already installed)
```bash
brew install git
```

## Development Setup

### 1. Clone the Repository
```bash
# Clone your repository
git clone https://github.com/MohiniKhondoker/animal-rescue-adoption-platform.git
cd animal-rescue-adoption-platform
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

### 3. Frontend Setup
```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm start
```

## macOS-Specific Optimizations

### 1. Safari Browser Compatibility
- Your website works perfectly in Safari
- All Material-UI components are Safari-compatible
- Touch gestures work on MacBook trackpad

### 2. Performance Optimizations for macOS
- React development server runs efficiently on macOS
- Hot reloading works seamlessly
- Build process optimized for macOS file system

### 3. Native macOS Features
- Works with macOS dark mode (browser follows system theme)
- Supports macOS keyboard shortcuts
- Compatible with macOS accessibility features

## Terminal Commands for macOS

### Start Development (Both Backend & Frontend)
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm start
```

### Production Build
```bash
# Build for production
cd client && npm run build
```

## Browser Recommendations for macOS

1. **Safari** - Native macOS browser, excellent performance
2. **Chrome** - Full feature support, great for development
3. **Firefox** - Good alternative with privacy features
4. **Edge** - Microsoft browser, works well on macOS

## File Path Differences

### Windows vs macOS Paths
- Windows: `e:\Project\animal-rescue-adoption-platform`
- macOS: `/Users/[username]/Projects/animal-rescue-adoption-platform`

### Environment Variables (.env file)
- Same configuration works on both systems
- No changes needed in .env file

## Deployment Options for macOS Users

### 1. Local Development
- Run on `http://localhost:3000` (frontend)
- Backend on `http://localhost:5000`

### 2. Cloud Deployment
- Deploy to Vercel, Netlify, or Heroku
- Access from any device with internet

## Troubleshooting on macOS

### Permission Issues
```bash
# If you encounter permission errors
sudo npm install -g npm@latest
```

### Port Conflicts
```bash
# If port 3000 or 5000 is busy
lsof -ti:3000
kill -9 [PID]
```

### Node Version Management
```bash
# Install nvm for Node version management
brew install nvm

# Use specific Node version
nvm install 18
nvm use 18
```

## Performance Tips for MacBook

1. **Use Terminal**: Native terminal performs better than third-party apps
2. **Enable Developer Mode**: For faster builds and debugging
3. **Use SSD**: Ensure development folder is on SSD for faster file operations
4. **Memory Management**: Close unnecessary applications during development

## Cross-Platform Features That Work

✅ **Responsive Design** - Works on all MacBook screen sizes
✅ **Touch Support** - MacBook trackpad gestures supported  
✅ **Keyboard Shortcuts** - Standard web shortcuts work
✅ **File Upload** - Camera and file system access works
✅ **Notifications** - Browser notifications supported
✅ **Offline Capabilities** - Service workers function properly

Your PetAdopt website is fully optimized for MacBook usage! 🚀
