import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'path';
import fs from 'fs';

// 1. Load a font (Optional: standard sans-serif is used by default if not loaded)
// If you have a custom Pokemon font, put it in the project and load it here.
// GlobalFonts.registerFromPath(path.join(process.cwd(), 'public', 'fonts', 'Pokemon.ttf'), 'Pokemon');

export default async function handler(req, res) {
  try {
    // 2. Security Check
    const API_KEY = process.env.API_KEY || 'ITPAMPW01939KDM2MZL01'; // Default to your example key
    const { key } = req.query;

    if (key !== API_KEY) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Key' });
    }

    // 3. Get Parameters from URL
    // URL format: /?id=...&dex=...&caught=...
    const {
      id = '0000000000',
      dex = '0',
      caught = '0',
      region = 'UNKNOWN',
      wins = '0',
      loss = '0'
    } = req.query;

    // 4. Load the Template Image
    // Ensure your image is named 'template.jpg' and inside the 'public' folder
    const imagePath = path.join(process.cwd(), 'public', 'template.jpg');
    const image = await loadImage(imagePath);

    // 5. Create Canvas
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw the base template
    ctx.drawImage(image, 0, 0);

    // --- CONFIGURATION (Adjust these X/Y values to match your image exactly) ---
    // These are estimated coordinates. You may need to tweak them slightly.
    
    const textStyles = {
      id:     { x: 180, y: 50,  size: 40, color: '#000000', align: 'left' },
      dex:    { x: 650, y: 205, size: 35, color: '#000000', align: 'center' },
      caught: { x: 650, y: 295, size: 35, color: '#000000', align: 'center' },
      region: { x: 650, y: 385, size: 35, color: '#000000', align: 'center' },
      wins:   { x: 200, y: 800, size: 90, color: '#FFFFFF', align: 'center' }, // White text for contrast
      loss:   { x: 460, y: 800, size: 90, color: '#FFFFFF', align: 'center' }
    };

    // --- CLEANING OLD TEXT (The "Eraser") ---
    // We draw small rectangles over the old text colors to hide them.
    
    // ID Box Eraser (Top Left)
    ctx.fillStyle = '#F2EFE9'; // Approximate beige color of the ID box
    ctx.fillRect(100, 15, 300, 50);

    // Stats Eraser (The 3 rows)
    ctx.fillStyle = '#FFFFFF'; // White background for stats
    ctx.fillRect(500, 170, 300, 45); // Dex
    ctx.fillRect(500, 260, 300, 45); // Caught
    ctx.fillRect(500, 350, 300, 45); // Region

    // Wins Eraser (Yellow Box)
    ctx.fillStyle = '#FFD900'; // Pokemon Yellow
    ctx.fillRect(85, 720, 230, 120);

    // Loss Eraser (Grey Box)
    ctx.fillStyle = '#6B6B6B'; // Dark Grey
    ctx.fillRect(345, 720, 230, 120);


    // --- DRAWING NEW TEXT ---

    // Helper function to draw text
    const drawText = (text, config) => {
      ctx.font = `bold ${config.size}px Arial`; // Use 'Pokemon' here if you registered a custom font
      ctx.fillStyle = config.color;
      ctx.textAlign = config.align;
      ctx.fillText(text, config.x, config.y);
    };

    // Execute Draw
    drawText(id, textStyles.id);
    drawText(`${dex}/1025`, textStyles.dex);
    drawText(caught, textStyles.caught);
    drawText(region, textStyles.region);
    drawText(wins, textStyles.wins);
    drawText(loss, textStyles.loss);

    // 6. Return the Image
    const buffer = await canvas.encode('jpeg');
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=30');
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating image');
  }
}
