import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../node_modules/leaflet/dist/images');
const targetDir = path.join(__dirname, '../public');

// Create public directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy marker icons
const files = ['marker-icon.png', 'marker-icon-2x.png', 'marker-shadow.png'];
files.forEach(file => {
  fs.copyFileSync(
    path.join(sourceDir, file),
    path.join(targetDir, file)
  );
});

console.log('Leaflet marker icons copied successfully!'); 