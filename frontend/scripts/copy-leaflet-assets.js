import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

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

// Create red marker icons
const createRedMarker = async (inputFile, outputFile) => {
  await sharp(path.join(sourceDir, inputFile))
    .tint({ r: 255, g: 0, b: 0 })
    .toFile(path.join(targetDir, outputFile));
};

createRedMarker('marker-icon.png', 'marker-icon-red.png');
createRedMarker('marker-icon-2x.png', 'marker-icon-red-2x.png');

console.log('Leaflet marker icons copied and red variants created successfully!'); 