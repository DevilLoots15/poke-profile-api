import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas';

// 1. Load a font (Optional)
// Agar font file local hai toh 'path' import karke load karein, warna default Arial use hoga.

export default async function handler(req, res) {
  try {
    // 2. Security Check
    const API_KEY = process.env.API_KEY || 'ITPAMPW01939KDM2MZL01';
    const { key } = req.query;

    if (key !== API_KEY) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Key' });
    }

    // 3. Get Parameters
    const {
      id = '0000000000',
      dex = '0',
      caught = '0',
      region = 'UNKNOWN',
      wins = '0',
      loss = '0'
    } = req.query;

    // 4. Load the Template Image from URL
    // Yahan apna direct image link dalein.
    // Make sure the link ends in .jpg or .png and is publicly accessible.
    const imageUrl = 'YOUR_DIRECT_IMAGE_LINK_HERE.jpg'; 
    
    const image = await loadImage(imageUrl);

    // 5. Create Canvas
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw the base template
    ctx.drawImage(image, 0, 0);

    // --- CONFIGURATION ---
    const textStyles = {
      id:     { x: 180, y: 50,  size: 40, color: '#000000', align: 'left' },
      dex:    { x: 650, y: 205, size: 35, color: '#000000', align: 'center' },
      caught: { x: 650, y: 295, size: 35, color: '#000000', align: 'center' },
      region: { x: 650, y: 385, size: 35, color: '#000000', align: 'center' },
      wins:   { x: 200, y: 800, size: 90, color: '#FFFFFF', align: 'center' },
      loss:   { x: 460, y: 800, size: 90, color: '#FFFFFF', align: 'center' }
    };

    // --- CLEANING OLD TEXT (The "Eraser") ---
    // ID Box
    ctx.fillStyle = '#F2EFE9'; 
    ctx.fillRect(100, 15, 300, 50);

    // Stats Rows
    ctx.fillStyle = '#FFFFFF'; 
    ctx.fillRect(500, 170, 300, 45); // Dex
    ctx.fillRect(500, 260, 300, 45); // Caught
    ctx.fillRect(500, 350, 300, 45); // Region

    // Wins/Loss Boxes
    ctx.fillStyle = '#FFD900'; // Yellow
    ctx.fillRect(85, 720, 230, 120);
    ctx.fillStyle = '#6B6B6B'; // Grey
    ctx.fillRect(345, 720, 230, 120);

    // --- DRAWING NEW TEXT ---
    const drawText = (text, config) => {
      ctx.font = `bold ${config.size}px Arial`;
      ctx.fillStyle = config.color;
      ctx.textAlign = config.align;
      ctx.fillText(text, config.x, config.y);
    };

    drawText(id, textStyles.id);
    drawText(`${dex}/1025`, textStyles.dex);
    drawText(caught, textStyles.caught);
    drawText(region, textStyles.region);
    drawText(wins, textStyles.wins);
    drawText(loss, textStyles.loss);

    // 6. Return Image
    const buffer = await canvas.encode('jpeg');
    
    res.setHeader('Content-Type', 'image/jpeg');
    // Cache for 60 seconds
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=30');
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating image');
  }
}
