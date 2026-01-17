#!/bin/bash

# Deployment Preparation Script
# This script prepares the project for production deployment

set -e

echo "================================"
echo "E-Commerce Website Deployment"
echo "Preparation Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${YELLOW}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not found. Please install Node.js v16 or higher.${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"

# Check npm
echo -e "${YELLOW}Checking npm installation...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm not found. Please install npm.${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm ${NPM_VERSION} found${NC}"

echo ""

# Install root dependencies
echo -e "${YELLOW}Installing root dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Root dependencies installed${NC}"

echo ""

# Install client dependencies
echo -e "${YELLOW}Installing client dependencies...${NC}"
cd client
npm install
cd ..
echo -e "${GREEN}✓ Client dependencies installed${NC}"

echo ""

# Build client
echo -e "${YELLOW}Building client for production...${NC}"
cd client
npm run build
cd ..
echo -e "${GREEN}✓ Client built successfully${NC}"

echo ""

# Environment check
echo -e "${YELLOW}Checking environment files...${NC}"
if [ -f ".env.production" ]; then
    echo -e "${GREEN}✓ .env.production found${NC}"
else
    echo -e "${YELLOW}⚠ .env.production not found. Please create it before deployment.${NC}"
fi

if [ -f "client/.env.production" ]; then
    echo -e "${GREEN}✓ client/.env.production found${NC}"
else
    echo -e "${YELLOW}⚠ client/.env.production not found. Please create it before deployment.${NC}"
fi

echo ""

# Check build output
if [ -d "client/dist" ]; then
    echo -e "${GREEN}✓ Production build output found in client/dist${NC}"
    BUILD_SIZE=$(du -sh client/dist | cut -f1)
    echo "  Build size: ${BUILD_SIZE}"
else
    echo -e "${RED}✗ Production build not found. Running build again...${NC}"
    cd client
    npm run build
    cd ..
fi

echo ""

# Summary
echo -e "${GREEN}================================"
echo "Preparation Complete! ✓"
echo "================================${NC}"

echo ""
echo "Next steps:"
echo "1. Update .env.production with your production values:"
echo "   - Set CLIENT_URL to your domain"
echo "   - Verify all credentials are correct"
echo ""
echo "2. Test locally:"
echo "   npm start"
echo ""
echo "3. Deploy to your hosting platform"
echo ""
echo "For detailed deployment instructions, see DEPLOYMENT.md"
echo ""
