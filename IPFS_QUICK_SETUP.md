# Quick IPFS Setup Guide

## Current Status
Your application is now running in **Mock Mode** because IPFS is not installed or running. This allows you to test the blockchain functionality without IPFS.

## Option 1: Install IPFS (Recommended)

### Windows:
1. Download IPFS from: https://dist.ipfs.io/go-ipfs/v0.24.0/go-ipfs_v0.24.0_windows-amd64.zip
2. Extract to a folder (e.g., `C:\ipfs`)
3. Add the folder to your PATH environment variable
4. Open Command Prompt and run:
   ```bash
   ipfs init
   ipfs daemon
   ```

### macOS:
```bash
# Install via Homebrew
brew install ipfs

# Initialize and start
ipfs init
ipfs daemon
```

### Linux:
```bash
# Download and install
wget https://dist.ipfs.io/go-ipfs/v0.24.0/go-ipfs_v0.24.0_linux-amd64.tar.gz
tar -xzf go-ipfs_v0.24.0_linux-amd64.tar.gz
cd go-ipfs
sudo ./install.sh

# Initialize and start
ipfs init
ipfs daemon
```

## Option 2: Use Mock Mode (Current)

The application will work in mock mode, generating fake IPFS hashes for demonstration purposes. This is perfect for:
- Testing blockchain functionality
- Development and learning
- Demonstrations without IPFS setup

## Option 3: Use IPFS Gateway Service

You can also use a remote IPFS service like Pinata or Infura by updating the environment variables in your `.env` file:

```env
IPFS_HOST=api.pinata.cloud
IPFS_PORT=443
IPFS_PROTOCOL=https
IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

## Testing Your Setup

1. **With IPFS Running**: You'll see real IPFS hashes and can access files via IPFS URLs
2. **In Mock Mode**: You'll see mock hashes and a warning message

## Benefits of Each Mode

### Mock Mode:
- ✅ No installation required
- ✅ Perfect for development
- ✅ Blockchain functionality works
- ❌ Files not actually stored in IPFS

### Real IPFS:
- ✅ True decentralized storage
- ✅ Files accessible globally
- ✅ Real IPFS hashes
- ❌ Requires IPFS installation

## Next Steps

1. **For Development**: Continue with mock mode
2. **For Production**: Install IPFS and restart your application
3. **For Testing**: Try both modes to see the difference

Your blockchain application will work perfectly in either mode!
