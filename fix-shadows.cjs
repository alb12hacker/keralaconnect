const fs = require('fs');
const files = [
  'src/screens/ProfileScreen.tsx',
  'src/screens/DriverLoginScreen.tsx',
  'src/screens/LoginScreen.tsx',
  'src/screens/SavedScreen.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/rgba\(0\,240\,255/g, 'rgba(37,99,235');
    fs.writeFileSync(f, c, 'utf8');
  }
});
