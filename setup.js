const fs = require("fs")
const path = require("path")

console.log("🚀 Setting up LegalMitra AI App...\n")

// Create .env.local template
const envTemplate = `# LegalMitra AI Configuration
# Add your Groq API key below (get it from https://console.groq.com)
GROQ_API_KEY=your_groq_api_key_here

# Python Backend Configuration (auto-configured)
PYTHON_BACKEND_URL=http://localhost:5000
FLASK_ENV=development
PORT=5000

# Next.js Configuration (auto-configured)
NEXT_PUBLIC_APP_NAME=LegalMitra AI
NEXT_PUBLIC_APP_VERSION=1.0.0
`

// Create .env.local if it doesn't exist
if (!fs.existsSync(".env.local")) {
  fs.writeFileSync(".env.local", envTemplate)
  console.log("✅ Created .env.local file")
} else {
  console.log("📄 .env.local already exists")
}

// Create requirements.txt for Python
const requirements = `flask==2.3.3
flask-cors==4.0.0
nltk==3.8.1
pandas==2.0.3
numpy==1.24.3
matplotlib==3.7.2
requests==2.31.0
python-dotenv==1.0.0
gunicorn==21.2.0
`

fs.writeFileSync("requirements.txt", requirements)
console.log("✅ Created requirements.txt")

// Create package.json scripts section update
const packageJsonPath = "package.json"
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

  // Add helpful scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    setup: "node setup.js",
    "install-python": "pip install -r requirements.txt",
    "start-backend": "python app.py",
    "start-frontend": "npm run dev",
    "start-all": 'concurrently "npm run start-backend" "npm run start-frontend"',
    "check-env": "node check-env.js",
  }

  // Add concurrently for running both servers
  if (!packageJson.devDependencies) packageJson.devDependencies = {}
  packageJson.devDependencies.concurrently = "^8.2.0"

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log("✅ Updated package.json with helpful scripts")
}

// Create environment checker
const envChecker = `const fs = require('fs');
const path = require('path');

console.log('🔍 Checking LegalMitra AI Configuration...\\n');

// Check .env.local
if (!fs.existsSync('.env.local')) {
    console.log('❌ .env.local file not found!');
    console.log('   Run: npm run setup');
    process.exit(1);
}

const envContent = fs.readFileSync('.env.local', 'utf8');
const hasGroqKey = envContent.includes('GROQ_API_KEY=') && 
                   !envContent.includes('GROQ_API_KEY=your_groq_api_key_here');

if (!hasGroqKey) {
    console.log('❌ Groq API key not configured!');
    console.log('   1. Get your API key from: https://console.groq.com');
    console.log('   2. Edit .env.local file');
    console.log('   3. Replace "your_groq_api_key_here" with your actual key');
    console.log('   4. Run: npm run dev\\n');
    process.exit(1);
}

console.log('✅ Groq API key configured');
console.log('✅ Environment variables ready');
console.log('✅ All systems ready!\\n');
console.log('🚀 Start the app with: npm run start-all');
console.log('   Or separately:');
console.log('   - Frontend: npm run dev');
console.log('   - Backend: python app.py\\n');
`

fs.writeFileSync("check-env.js", envChecker)
console.log("✅ Created environment checker")

// Create start script
const startScript = `#!/bin/bash

echo "🚀 Starting LegalMitra AI App..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found! Run: npm run setup"
    exit 1
fi

# Check if Groq API key is configured
if grep -q "your_groq_api_key_here" .env.local; then
    echo "❌ Please add your Groq API key to .env.local"
    echo "   Get it from: https://console.groq.com"
    exit 1
fi

# Install Python dependencies if needed
if [ ! -d "venv" ]; then
    echo "📦 Setting up Python virtual environment..."
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Start both servers
echo "🚀 Starting Python backend and Next.js frontend..."
npm run start-all
`

fs.writeFileSync("start.sh", startScript)
fs.chmodSync("start.sh", "755")
console.log("✅ Created start.sh script")

// Create README with simple instructions
const readme = `# 🚀 LegalMitra AI - One-Click Setup

## Quick Start (Only 3 Steps!)

### 1️⃣ Get Your Groq API Key
- Go to [https://console.groq.com](https://console.groq.com)
- Sign up/Login and create an API key
- Copy the key (starts with \`gsk_...\`)

### 2️⃣ Add API Key
- Open \`.env.local\` file
- Replace \`your_groq_api_key_here\` with your actual API key
- Save the file

### 3️⃣ Start the App
\`\`\`bash
npm run start-all
\`\`\`

That's it! 🎉

## 📱 Access Your App
- **Frontend**: http://localhost:3000
- **Python Backend**: http://localhost:5000
- **Chat Interface**: http://localhost:3000/chat

## 🛠️ Available Commands

\`\`\`bash
npm run setup          # Initial setup
npm run check-env       # Check configuration
npm run start-all       # Start both frontend & backend
npm run dev            # Start frontend only
python app.py          # Start backend only
\`\`\`

## 🔧 Manual Setup (if needed)

\`\`\`bash
# 1. Install Node dependencies
npm install

# 2. Setup Python environment
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt

# 3. Start backend
python app.py

# 4. Start frontend (new terminal)
npm run dev
\`\`\`

## 🎯 Features
- ⚡ Lightning-fast Groq AI responses
- 🐍 Python backend for legal processing
- 🎨 Beautiful animated UI
- 🔒 Legal-only query validation
- 🌐 Bilingual support (English/Hindi)
- 📱 Responsive design

## 🆘 Troubleshooting
- **API Key Issues**: Make sure your Groq API key is valid
- **Port Conflicts**: Change ports in .env.local if needed
- **Python Issues**: Ensure Python 3.8+ is installed
- **Dependencies**: Run \`npm install\` and \`pip install -r requirements.txt\`

## 📞 Support
If you need help, check the console logs for detailed error messages.
`

fs.writeFileSync("README.md", readme)
console.log("✅ Created comprehensive README.md")

console.log("\n🎉 Setup Complete!\n")
console.log("📋 Next Steps:")
console.log("1. Get your Groq API key from: https://console.groq.com")
console.log("2. Edit .env.local and add your API key")
console.log("3. Run: npm run start-all")
console.log("\n✨ Your LegalMitra AI app will be ready!")
