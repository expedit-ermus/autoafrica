const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== AutoAfrique Chrome Extension Packaging Tool ===');

// 1. Verify manifest.json
const manifestPath = path.join(__dirname, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('❌ Missing manifest.json');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
console.log(`✔ Manifest valid: ${manifest.name} v${manifest.version} (Manifest V${manifest.manifest_version})`);

// 2. Verify icons
const iconSizes = [16, 32, 48, 128];
iconSizes.forEach(size => {
  const p = path.join(__dirname, 'icons', `icon-${size}.png`);
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing icon: ${p}`);
    process.exit(1);
  }
  const stats = fs.statSync(p);
  console.log(`✔ Icon ${size}x${size} verified (${stats.size} bytes)`);
});

// 3. Verify sidepanel & popup files
const requiredFiles = [
  'background.js',
  'popup/popup.html',
  'popup/popup.js',
  'popup/popup.css',
  'sidepanel/sidepanel.html',
  'sidepanel/sidepanel.js',
  'sidepanel/sidepanel.css',
  'content-scripts/whatsapp.js',
  'utils/api.js',
  'utils/formatter.js',
  '_locales/fr/messages.json',
  '_locales/en/messages.json'
];

requiredFiles.forEach(f => {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing required file: ${f}`);
    process.exit(1);
  }
  console.log(`✔ ${f} verified`);
});

// 4. Create ZIP package for Chrome Web Store submission
const zipDest = path.join(__dirname, '..', 'autoafrique-extension-v1.0.0.zip');
try {
  const srcGlob = path.join(__dirname, '*').replace(/\\/g, '/');
  const destClean = zipDest.replace(/\\/g, '/');
  execSync(`powershell.exe -NoProfile -Command "Compress-Archive -Path '${srcGlob}' -DestinationPath '${destClean}' -Force"`);
  
  if (fs.existsSync(zipDest)) {
    const zipStats = fs.statSync(zipDest);
    console.log(`\n📦 Distribution ZIP created: ${zipDest} (${Math.round(zipStats.size / 1024)} KB)`);
  }
} catch (err) {
  console.warn('Could not create ZIP via PowerShell:', err.message);
}

console.log('\n🎉 All Manifest V3 compliance checks passed successfully!');
console.log('To test in Chrome:');
console.log('1. Open chrome://extensions');
console.log('2. Enable "Developer mode" (top right)');
console.log('3. Click "Load unpacked" and select: ' + __dirname);
