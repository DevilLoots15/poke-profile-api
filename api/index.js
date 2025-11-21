import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas';

export default async function handler(req, res) {
  try {
    // 1. Security Check (API Key)
    // You can change this key to whatever you want
    const API_KEY = process.env.API_KEY || 'ITPAMPW01939KDM2MZL01'; 
    const { key } = req.query;

    if (key !== API_KEY) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Key' });
    }

    // 2. Get Parameters from URL (e.g. ?wins=5&loss=2)
    const {
      id = '0000000000',
      dex = '0',
      caught = '0',
      region = 'UNKNOWN',
      wins = '0',
      loss = '0'
    } = req.query;

    // 3. Load the Template Image from URL
    // IMPORTANT: Replace the URL below with your direct image link (must end in .jpg/.png)
    const imageUrl = 'https://i.postimg.cc/g2gJBgm9/IMG-20251121-142105-076.jpg'; 
    
    const image = await loadImage(imageUrl);

    // 4. Create Canvas matching the image size
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw the base template image
    ctx.drawImage(image, 0, 0);

    // --- CONFIGURATION: Text Styles ---
    // You can adjust x (horizontal) and y (vertical) to move text
    const textStyles = {
      id:     { x: 180, y: 50,  size: 40, color: '#000000', align: 'left' },
      dex:    { x: 650, y: 205, size: 35, color: '#000000', align: 'center' },
      caught: { x: 650, y: 295, size: 35, color: '#000000', align: 'center' },
      region: { x: 650, y: 385, size: 35, color: '#000000', align: 'center' },
      wins:   { x: 200, y: 800, size: 90, color: '#FFFFFF', align: 'center' },
      loss:   { x: 460, y: 800, size: 90, color: '#FFFFFF', align: 'center' }
    };

    // --- CLEANING OLD TEXT (The "Eraser") ---
    // This is NECESSARY to hide the old "0" or text before writing new text.
    // If the boxes don't match the background color perfectly, change the Hex codes below.
    
    // ID Box Eraser (Top Left - Beige)
    ctx.fillStyle = '#F2EFE9'; 
    ctx.fillRect(100, 15, 300, 50);

    // Stats Eraser (The 3 white rows)
    ctx.fillStyle = '#FFFFFF'; 
    ctx.fillRect(500, 170, 300, 45); // Dex Row
    ctx.fillRect(500, 260, 300, 45); // Caught Row
    ctx.fillRect(500, 350, 300, 45); // Region Row

    // Wins Eraser (Yellow Box)
    ctx.fillStyle = '#FFD900'; 
    ctx.fillRect(85, 720, 230, 120);

    // Loss Eraser (Grey Box)
    ctx.fillStyle = '#6B6B6B'; 
    ctx.fillRect(345, 720, 230, 120);


    // --- DRAWING NEW TEXT ---
    const drawText = (text, config) => {
      // Using standard Arial font. You can register custom fonts if needed.
      ctx.font = `bold ${config.size}px Arial`;
      ctx.fillStyle = config.color;
      ctx.textAlign = config.align;
      ctx.fillText(text, config.x, config.y);
    };

    // Drawing the values from the URL parameters
    drawText(id, textStyles.id);
    drawText(`${dex}/1025`, textStyles.dex);
    drawText(caught, textStyles.caught);
    drawText(region, textStyles.region);
    drawText(wins, textStyles.wins);
    drawText(loss, textStyles.loss);

    // 6. Return the Final Image
    const buffer = await canvas.encode('jpeg');
    
    res.setHeader('Content-Type', 'image/jpeg');
    // Cache settings: Cache for 60 seconds
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=30');
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating image');
  }
}    // Draw the base template
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
