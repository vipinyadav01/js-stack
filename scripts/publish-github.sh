#!/bin/bash

# Script to publish only README.md to GitHub documentation repository
# This keeps your source code separate from public documentation

# Create a temporary directory
rm -rf temp-github-publish
mkdir temp-github-publish
cd temp-github-publish

# Initialize git repository
git init
git branch -M main

# Copy only the README.md
cp ../README.md .

# Create a basic package.json for GitHub display
cat > package.json << 'EOF'
{
  "name": "create-js-stack",
  "version": "1.0.11",
  "description": "A modern CLI tool for scaffolding JavaScript full-stack projects",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/vipinyadav01/create-js-stack.git"
  },
  "keywords": ["cli", "javascript", "fullstack", "scaffold", "generator"],
  "author": "vipinyadav01",
  "license": "MIT"
}
EOF

# Add and commit
git add .
git commit -m "Update documentation"

# Add remote and push (replace with your GitHub repo URL)
git remote add origin https://github.com/vipinyadav01/create-js-stack.git
git push -u origin main

# Clean up
cd ..
rm -rf temp-github-publish

echo "README.md published to GitHub successfully!"