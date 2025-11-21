import { createCanvas, loadImage } from '@napi-rs/canvas';

export default async function handler(req, res) {
  try {
    // 1. Security & Setup
    const API_KEY = process.env.API_KEY || 'ITPAMPW01939KDM2MZL01'; 
    const { key } = req.query;

    if (key !== API_KEY) return res.status(401).json({ error: 'Unauthorized' });

    // 2. Get Data
    const {
      id = '0000000000',
      dex = '0',
      caught = '0',
      region = 'UNKNOWN',
      wins = '0',
      loss = '0'
    } = req.query;

    // 3. Load the BLANK Template
    // PASTE YOUR NEW DIRECT IMAGE LINK HERE 👇
    const imageUrl = 'https://i.postimg.cc/g2gJBgm9/IMG-20251121-142105-076.jpg'; 
    const image = await loadImage(imageUrl);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw Template
    ctx.drawImage(image, 0, 0);

    // --- PRO TEXT CONFIGURATION ---
    // We add a slight shadow to make text readable on any background
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)"; // Soft shadow
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    const textStyles = {
      id:     { x: 180, y: 50,  size: 40, color: '#000000', align: 'left' },
      dex:    { x: 650, y: 205, size: 35, color: '#000000', align: 'center' },
      caught: { x: 650, y: 295, size: 35, color: '#000000', align: 'center' },
      region: { x: 650, y: 385, size: 35, color: '#000000', align: 'center' },
      wins:   { x: 200, y: 800, size: 90, color: '#FFFFFF', align: 'center' },
      loss:   { x: 460, y: 800, size: 90, color: '#FFFFFF', align: 'center' }
    };

    // --- HELPER FUNCTION ---
    const drawText = (text, config) => {
      // "bold" makes it look more like a UI element
      ctx.font = `bold ${config.size}px Arial`; 
      ctx.fillStyle = config.color;
      ctx.textAlign = config.align;
      ctx.fillText(text, config.x, config.y);
    };

    // --- WRITE TEXT (No Erasers Needed!) ---
    drawText(id, textStyles.id);
    drawText(`${dex}/1025`, textStyles.dex);
    drawText(caught, textStyles.caught);
    drawText(region, textStyles.region);
    drawText(wins, textStyles.wins);
    drawText(loss, textStyles.loss);

    // 4. Return High-Quality JPEG
    const buffer = await canvas.encode('jpeg', { quality: 90 }); // Higher quality setting
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=10, s-maxage=10, stale-while-revalidate=10');
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
}    const textStyles = {
      id:     { x: 180, y: 50,  size: 40, color: '#000000', align: 'left' },
      dex:    { x: 650, y: 205, size: 35, color: '#000000', align: 'center' },
      caught: { x: 650, y: 295, size: 35, color: '#000000', align: 'center' },
      region: { x: 650, y: 385, size: 35, color: '#000000', align: 'center' },
      wins:   { x: 200, y: 800, size: 90, color: '#FFFFFF', align: 'center' },
      loss:   { x: 460, y: 800, size: 90, color: '#FFFFFF', align: 'center' }
    };

    // --- CLEANING OLD TEXT (The Erasers) ---
    // We draw colored boxes over the old numbers to hide them
    
    // ID Box Eraser (Top Left)
    ctx.fillStyle = '#F2EFE9'; 
    ctx.fillRect(100, 15, 300, 50);

    // Stats Eraser (Dex, Caught, Region)
    ctx.fillStyle = '#FFFFFF'; 
    ctx.fillRect(500, 170, 300, 45); // Dex
    ctx.fillRect(500, 260, 300, 45); // Caught
    ctx.fillRect(500, 350, 300, 45); // Region

    // Wins Eraser (Yellow Box)
    ctx.fillStyle = '#FFD900'; 
    ctx.fillRect(85, 720, 230, 120);

    // Loss Eraser (Grey Box)
    ctx.fillStyle = '#6B6B6B'; 
    ctx.fillRect(345, 720, 230, 120);

    // --- DRAWING NEW TEXT ---
    const drawText = (text, config) => {
      ctx.font = `bold ${config.size}px Arial`;
      ctx.fillStyle = config.color;
      ctx.textAlign = config.align;
      ctx.fillText(text, config.x, config.y);
    };

    // Write the new values
    drawText(id, textStyles.id);
    drawText(`${dex}/1025`, textStyles.dex);
    drawText(caught, textStyles.caught);
    drawText(region, textStyles.region);
    drawText(wins, textStyles.wins);
    drawText(loss, textStyles.loss);

    // 6. Return the Image
    const buffer = await canvas.encode('jpeg');
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=10, s-maxage=10, stale-while-revalidate=10');
    res.send(buffer);

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).send('Error generating image: ' + error.message);
  }
}
