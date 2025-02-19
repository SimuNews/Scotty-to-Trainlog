Here's a quick tutorial on how to build the extension:

# Building the Browser Extension - Quick Guide

## Prerequisites
- **Operating System**: macOS, Linux, or Windows
- **Node.js**: v14.x or higher
- **npm**: v6.x or higher

## Steps

1. **Make the build script executable**
```bash
chmod +x build.sh
```

2. **Run the build script**
```bash
./build.sh
```

The script will:
- Clean previous builds
- Install all dependencies
- Build the extension for Firefox

## What happens during the build
- The extension will be built for all supported browsers
- Output files will be in the `extension` directory:
  - `extension/firefox.xpi` - Firefox version

## Troubleshooting
If you encounter any errors:
1. Make sure Node.js is installed correctly
2. Try deleting the `node_modules` folder and running `./build.sh` again
3. Check if all files are in the correct locations (webpack.config.js, .babelrc, etc.)