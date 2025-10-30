#!/bin/bash

# Chef Claude - Easy GitHub Pages Deployment Script
# This script automates the deployment of your Chef Claude app to GitHub Pages

set -e  # Exit on any error

echo "🍳 Chef Claude - GitHub Pages Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository. Please initialize git first:"
    echo "  git init"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    print_error "No remote origin found. Please add your GitHub repository:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    exit 1
fi

print_status "Building production version..."
npm run build

print_status "Adding files to git..."
git add .

print_status "Committing changes..."
if git diff --cached --quiet; then
    print_warning "No changes to commit. Your app is already up to date!"
    exit 0
fi

# Generate commit message with timestamp
COMMIT_MSG="Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG"

print_status "Pushing to GitHub..."
git push origin main

print_success "🎉 Deployment complete!"
print_success "Your Chef Claude app will be live at:"
echo ""

# Extract repository URL and construct GitHub Pages URL
REPO_URL=$(git remote get-url origin)
if [[ $REPO_URL =~ github\.com[\/:]([^\/]+)\/([^\/\.]+) ]]; then
    USERNAME="${BASH_REMATCH[1]}"
    REPO_NAME="${BASH_REMATCH[2]}"
    GITHUB_PAGES_URL="https://${USERNAME}.github.io/${REPO_NAME}/"
    echo -e "${GREEN}${GITHUB_PAGES_URL}${NC}"
else
    print_warning "Could not determine GitHub Pages URL. Please check your repository settings."
fi

echo ""
print_status "Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Click Settings → Pages"
echo "3. Under 'Source', select 'GitHub Actions'"
echo "4. Your site should be live within a few minutes!"
echo ""
print_success "Happy cooking! 🍝"
