# IPFS Setup Instructions

## Overview
This project now uses IPFS (InterPlanetary File System) for decentralized file storage instead of local storage. All files are stored on IPFS and their hashes are recorded in the blockchain.

## Prerequisites

### 1. Install IPFS
Download and install IPFS from: https://ipfs.io/docs/install/

### 2. Initialize IPFS Node
```bash
# Initialize IPFS
ipfs init

# Start IPFS daemon
ipfs daemon
```

The IPFS daemon will run on `localhost:5001` by default.

## Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/mern_blockchain

# Server Configuration
PORT=5000

# Blockchain Configuration
DIFFICULTY=2

# IPFS Configuration
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_PROTOCOL=http
IPFS_GATEWAY=https://ipfs.io/ipfs/
```

## Alternative IPFS Gateways

You can use different IPFS gateways by changing the `IPFS_GATEWAY` environment variable:

- `https://ipfs.io/ipfs/` (Default)
- `https://gateway.pinata.cloud/ipfs/`
- `https://cloudflare-ipfs.com/ipfs/`
- `https://dweb.link/ipfs/`

## Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

**Note**: The project now uses a simple HTTP-based IPFS client that doesn't require additional npm packages, making it more reliable and easier to set up.

## Running the Application

1. Start IPFS daemon:
```bash
ipfs daemon
```

2. Start the backend server:
```bash
cd backend
npm start
```

3. Start the frontend:
```bash
cd frontend
npm start
```

## Features

### Admin Upload
- Files are uploaded directly to IPFS
- IPFS hash is stored in the blockchain
- IPFS URL is provided for file access

### User Verification
- Files are verified against blockchain records
- If verified, IPFS URL is provided for file access
- File integrity is maintained through IPFS

### IPFS Integration
- Decentralized file storage
- Immutable file references
- Global file accessibility
- Content addressing

## API Endpoints

- `POST /api/admin/upload` - Upload file to IPFS and blockchain
- `POST /api/user/verify` - Verify file against blockchain
- `GET /api/file/:ipfsHash` - Download file from IPFS
- `GET /api/file-info/:ipfsHash` - Get file information from IPFS
- `GET /api/ipfs/status` - Check IPFS connection status

## Troubleshooting

### IPFS Connection Issues
- Ensure IPFS daemon is running
- Check IPFS_HOST and IPFS_PORT in .env file
- Verify IPFS is accessible at the configured address

### File Access Issues
- Check if IPFS gateway is accessible
- Try different IPFS gateways
- Ensure file is pinned in IPFS

### Performance Considerations
- IPFS performance depends on network connectivity
- Consider using a local IPFS node for better performance
- Pin important files to prevent garbage collection
