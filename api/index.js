/**
 * Dynamic Image Generation Serverless Function
 *
 * Loads template.jpg from the SAME folder and draws dynamic text.
 */
import fs from "fs";
import path from "path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

export default async function handler(req, res) {
  try {
    // 1. Security Check
    const API_KEY = process.env.API_KEY || "ITPAMPW01939KDM2MZL01";
    const { key } = req.query;

    if (key !== API_KEY) {
      return res.status(401).json({ error: "Unauthorized: Invalid API Key." });
    }

    // 2. Extract Query Parameters
    const {
      id = "N/A",
      dex = "0",
      caught = "0",
      region = "UNKNOWN",
      wins = "0",
      loss = "0"
    } = req.query;

    // 3. LOAD TEMPLATE FROM SAME FOLDER
    const imagePath = path.join(process.cwd(), "pages", "api", "template.jpg");

    const imageBuffer = fs.readFileSync(imagePath);
    const image = await loadImage(imageBuffer);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    // Draw Background Template
    ctx.drawImage(image, 0, 0);

    // 4. Text Style Configuration
    const textStyles = {
      id:     { x: 180, y: 50,  size: 40, color: "#000000", align: "left" },
      dex:    { x: 650, y: 205, size: 35, color: "#000000", align: "center" },
      caught: { x: 650, y: 295, size: 35, color: "#000000", align: "center" },
      region: { x: 650, y: 385, size: 35, color: "#000000", align: "center" },
      wins:   { x: 200, y: 800, size: 90, color: "#FFFFFF", align: "center" },
      loss:   { x: 460, y: 800, size: 90, color: "#FFFFFF", align: "center" }
    };

    // 5. Erase Old Template Text
    ctx.fillStyle = "#F2EFE9";
    ctx.fillRect(100, 15, 300, 50);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(500, 170, 300, 45);
    ctx.fillRect(500, 260, 300, 45);
    ctx.fillRect(500, 350, 300, 45);

    ctx.fillStyle = "#FFD900";
    ctx.fillRect(85, 720, 230, 120);

    ctx.fillStyle = "#6B6B6B";
    ctx.fillRect(345, 720, 230, 120);

    // Disable shadow blur because some serverless runtimes break
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    // Drawing function
    const drawText = (text, config) => {
      ctx.font = `bold ${config.size}px Arial`;
      ctx.fillStyle = config.color;
      ctx.textAlign = config.align;
      ctx.fillText(text, config.x, config.y);
    };

    // Draw new text
    drawText(id, textStyles.id);
    drawText(`${dex}/1025`, textStyles.dex);
    drawText(caught, textStyles.caught);
    drawText(region, textStyles.region);
    drawText(wins, textStyles.wins);
    drawText(loss, textStyles.loss);

    // 6. Output Final Image
    const buffer = await canvas.encode("jpeg", { quality: 90 });

    res.setHeader("Content-Type", "image/jpeg");
    res.send(buffer);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}    const ctx = canvas.getContext('2d');

    // Draw the template as the foundation
    ctx.drawImage(image, 0, 0);

    // 4. Define Text Styles and Positions
    const textStyles = {
      // Coordinates (x, y) were determined based on the template image layout
      id:     { x: 180, y: 50,  size: 40, color: '#000000', align: 'left' },
      dex:    { x: 650, y: 205, size: 35, color: '#000000', align: 'center' },
      caught: { x: 650, y: 295, size: 35, color: '#000000', align: 'center' },
      region: { x: 650, y: 385, size: 35, color: '#000000', align: 'center' },
      wins:   { x: 200, y: 800, size: 90, color: '#FFFFFF', align: 'center' }, // White text on yellow box
      loss:   { x: 460, y: 800, size: 90, color: '#FFFFFF', align: 'center' }  // White text on grey box
    };

    // 5. CLEANING OLD TEXT (The Erasers)
    // We draw colored boxes over the old numbers/text to hide them cleanly.
    
    // ID Box Eraser (Top Left - use the light background color of that section)
    ctx.fillStyle = '#F2EFE9'; 
    ctx.fillRect(100, 15, 300, 50);

    // Stats Eraser (Dex, Caught, Region - using white background)
    ctx.fillStyle = '#FFFFFF'; 
    ctx.fillRect(500, 170, 300, 45); // Dex area
    ctx.fillRect(500, 260, 300, 45); // Caught area
    ctx.fillRect(500, 350, 300, 45); // Region area

    // Wins Eraser (Yellow Box color)
    ctx.fillStyle = '#FFD900'; 
    ctx.fillRect(85, 720, 230, 120);

    // Loss Eraser (Grey Box color)
    ctx.fillStyle = '#6B6B6B'; 
    ctx.fillRect(345, 720, 230, 120);
    
    // --- DRAWING NEW TEXT ---

    // Apply a slight shadow for better readability on complex backgrounds
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)"; // Soft shadow
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    const drawText = (text, config) => {
      ctx.font = `bold ${config.size}px Arial`;
      ctx.fillStyle = config.color;
      ctx.textAlign = config.align;
      ctx.fillText(text, config.x, config.y);
    };

    // Write the new values over the erased areas
    drawText(id, textStyles.id);
    drawText(`${dex}/1025`, textStyles.dex);
    drawText(caught, textStyles.caught);
    drawText(region, textStyles.region);
    drawText(wins, textStyles.wins);
    drawText(loss, textStyles.loss);

    // 6. Return High-Quality JPEG
    const buffer = await canvas.encode('jpeg', { quality: 90 });
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=10, s-maxage=10, stale-while-revalidate=10');
    res.send(buffer);

  } catch (error) {
    console.error("API Error:", error);
    // Send a 500 status with the error message
    res.status(500).send('Error generating image: ' + error.message);
  }
}
