// Cloud function: generateHandwriting
// Processes text input and generates handwritten text image

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * Generate handwritten image from text
 * Note: In a real implementation, this would use a specialized service or library
 * to generate the handwritten text. This is a simplified implementation.
 * 
 * @param {string} text - Input text to convert
 * @param {object} settings - Settings for handwriting style, paper, errors, etc.
 * @returns {Promise} - Promise with result containing fileID of generated image
 */
exports.main = async (event, context) => {
  const { text, settings } = event;
  const { OPENID } = cloud.getWXContext();
  
  try {
    console.log(`Processing handwriting request from ${OPENID}`);
    console.log(`Text length: ${text.length}, settings:`, JSON.stringify(settings));
    
    if (!text || text.trim().length === 0) {
      return {
        success: false,
        error: 'Text is empty'
      };
    }
    
    // Log the request for analytics and debugging
    await db.collection('handwritingRequests').add({
      data: {
        userId: OPENID,
        textLength: text.length,
        settings: settings,
        createdAt: db.serverDate(),
      }
    });
    
    // In a real implementation, this would call an API or service that generates
    // handwritten text images. For this example, we'll use a mock process that
    // simply adds a delay to simulate processing time.
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this is where you would:
    // 1. Call an API to generate the handwritten image
    // 2. Receive the image data
    // 3. Upload it to cloud storage
    
    // For demo purposes, we'll upload a placeholder SVG that indicates
    // the style and settings that would be used.
    
    // Create an SVG that shows what the real implementation would generate
    const svgContent = generatePlaceholderSVG(text, settings);
    
    // Upload the SVG to cloud storage
    const uploadResult = await cloud.uploadFile({
      cloudPath: `handwriting/${OPENID}/${Date.now()}.svg`,
      fileContent: Buffer.from(svgContent),
    });
    
    console.log('File uploaded successfully, fileID:', uploadResult.fileID);
    
    // Return the file ID for the client to use
    return {
      success: true,
      fileID: uploadResult.fileID,
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      settings: settings
    };
    
  } catch (error) {
    console.error('Error generating handwriting:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generates a placeholder SVG representing what the handwritten text would look like
 * In a real implementation, this would be replaced by actual handwriting generation
 * 
 * @param {string} text - The text to convert to handwriting
 * @param {object} settings - Handwriting and paper settings
 * @returns {string} - SVG content as a string
 */
function generatePlaceholderSVG(text, settings) {
  // Extract settings
  const { handwriting, paper, errors } = settings;
  
  // Determine font style based on handwriting style
  let fontFamily = 'cursive';
  let fontSize = '16';
  let fontWeight = 'normal';
  let fontStyle = 'normal';
  
  switch (handwriting.style) {
    case 'regular':
      fontFamily = 'cursive';
      break;
    case 'cursive':
      fontFamily = 'cursive';
      fontStyle = 'italic';
      break;
    case 'neat':
      fontFamily = 'sans-serif';
      fontWeight = 'bold';
      break;
    case 'sloppy':
      fontFamily = 'cursive';
      fontStyle = 'italic';
      break;
  }
  
  // Adjust font size based on size setting
  switch (handwriting.size) {
    case 'small':
      fontSize = '14';
      break;
    case 'medium':
      fontSize = '18';
      break;
    case 'large':
      fontSize = '22';
      break;
  }
  
  // Determine font color
  const fontColor = handwriting.color === 'blue' ? '#0055aa' : '#000000';
  
  // Determine paper background color
  const bgColor = paper.color === 'yellow' ? '#fffbeb' : '#ffffff';
  
  // Create SVG pattern based on paper type
  let patternDef = '';
  let patternUse = '';
  
  switch (paper.type) {
    case 'ruled':
      patternDef = `
        <pattern id="ruled-lines" patternUnits="userSpaceOnUse" width="400" height="30" patternTransform="scale(1)">
          <line x1="0" y1="29.5" x2="400" y2="29.5" stroke="#a0c0e0" stroke-width="0.5"/>
        </pattern>
      `;
      patternUse = '<rect width="100%" height="100%" fill="url(#ruled-lines)"/>';
      break;
    case 'grid':
      patternDef = `
        <pattern id="grid-pattern" patternUnits="userSpaceOnUse" width="30" height="30" patternTransform="scale(1)">
          <line x1="0" y1="0" x2="30" y2="0" stroke="#c0d0e0" stroke-width="0.5"/>
          <line x1="0" y1="30" x2="30" y2="30" stroke="#c0d0e0" stroke-width="0.5"/>
          <line x1="0" y1="0" x2="0" y2="30" stroke="#c0d0e0" stroke-width="0.5"/>
          <line x1="30" y1="0" x2="30" y2="30" stroke="#c0d0e0" stroke-width="0.5"/>
        </pattern>
      `;
      patternUse = '<rect width="100%" height="100%" fill="url(#grid-pattern)"/>';
      break;
    case 'letter':
      patternDef = `
        <pattern id="letter-pattern" patternUnits="userSpaceOnUse" width="400" height="600" patternTransform="scale(1)">
          <line x1="50" y1="0" x2="50" y2="600" stroke="#d0d0d0" stroke-width="0.7"/>
          <line x1="0" y1="30" x2="400" y2="30" stroke="#d0d0d0" stroke-width="0.7"/>
          <line x1="0" y1="570" x2="400" y2="570" stroke="#d0d0d0" stroke-width="0.7"/>
        </pattern>
      `;
      patternUse = '<rect width="100%" height="100%" fill="url(#letter-pattern)"/>';
      break;
    case 'plain':
      // No pattern needed for plain paper
      break;
  }
  
  // Create paper texture filter based on texture setting
  let textureFilter = '';
  let textureUse = '';
  
  switch (paper.texture) {
    case 'smooth':
      textureFilter = `
        <filter id="paper-texture-light">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 0.03 0" in="noise" result="tinted"/>
          <feBlend mode="multiply" in="SourceGraphic" in2="tinted" result="texture"/>
        </filter>
      `;
      textureUse = 'filter="url(#paper-texture-light)"';
      break;
    case 'normal':
      textureFilter = `
        <filter id="paper-texture-medium">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="noise"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 0.05 0" in="noise" result="tinted"/>
          <feBlend mode="multiply" in="SourceGraphic" in2="tinted" result="texture"/>
        </filter>
      `;
      textureUse = 'filter="url(#paper-texture-medium)"';
      break;
    case 'rough':
      textureFilter = `
        <filter id="paper-texture-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="5" result="noise"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 0.07 0" in="noise" result="tinted"/>
          <feBlend mode="multiply" in="SourceGraphic" in2="tinted" result="texture"/>
        </filter>
      `;
      textureUse = 'filter="url(#paper-texture-rough)"';
      break;
  }
  
  // Process text for SVG display
  // Break into lines and escape for XML
  const lines = text.split('\n');
  const escapedLines = lines.map(line => 
    line.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
  );
  
  // Calculate SVG dimensions based on text
  const width = 800; // Fixed width
  const lineHeight = parseInt(fontSize) * 1.5;
  const margin = 40; // Margin around text
  const height = Math.max(600, escapedLines.length * lineHeight + margin * 2); // Min height of 600px
  
  // Generate text SVG elements with proper positioning
  const textElements = escapedLines.map((line, index) => {
    // Add random rotation if angle setting is not 0
    const rotation = handwriting.angle + (Math.random() * 2 - 1);
    
    // Calculate spacing multiplier
    let spacingMult = 1;
    switch (handwriting.spacing) {
      case 'tight':
        spacingMult = 0.9;
        break;
      case 'normal':
        spacingMult = 1.0;
        break;
      case 'loose':
        spacingMult = 1.2;
        break;
    }
    
    // Apply letter spacing
    const letterSpacing = `${(spacingMult - 1) * 0.3}em`;
    
    // Position text with left margin for letter paper
    const x = paper.type === 'letter' ? 70 : margin;
    const y = margin + lineHeight * (index + 1);
    
    // Add error elements if enabled
    let errorElements = '';
    
    if (errors.enabled && errors.frequency !== 'none') {
      // Determine if this line should have errors based on frequency
      let errorChance;
      switch (errors.frequency) {
        case 'low':
          errorChance = 0.1;
          break;
        case 'medium':
          errorChance = 0.2;
          break;
        case 'high':
          errorChance = 0.4;
          break;
        default:
          errorChance = 0;
      }
      
      // Add crossout errors (strike-through line)
      if (errors.types.crossout && Math.random() < errorChance) {
        // Pick a random word to cross out
        const words = line.split(' ');
        if (words.length > 0) {
          const wordIndex = Math.floor(Math.random() * words.length);
          
          // Calculate position of the word in the text
          const beforeText = words.slice(0, wordIndex).join(' ');
          const wordWidth = words[wordIndex].length * parseInt(fontSize) * 0.6; // Estimate word width
          
          // Calculate position for the line
          const wordX = x + (beforeText ? beforeText.length * parseInt(fontSize) * 0.6 * spacingMult + parseInt(fontSize) * 0.6 : 0);
          
          errorElements += `
            <line 
              x1="${wordX}" 
              y1="${y - parseInt(fontSize) * 0.3}" 
              x2="${wordX + wordWidth}" 
              y2="${y - parseInt(fontSize) * 0.3}" 
              stroke="${fontColor}" 
              stroke-width="1.5"
              stroke-linecap="round"
            />
          `;
        }
      }
      
      // Add correction errors (white-out with correction on top)
      if (errors.types.correction && Math.random() < errorChance) {
        // Pick a random position to add a correction
        const position = Math.floor(Math.random() * Math.max(1, line.length - 1));
        const charX = x + position * parseInt(fontSize) * 0.6 * spacingMult;
        
        errorElements += `
          <rect 
            x="${charX - 2}" 
            y="${y - parseInt(fontSize)}" 
            width="${parseInt(fontSize) * 1.2}" 
            height="${parseInt(fontSize) * 1.2}" 
            fill="#ffffff" 
            opacity="0.9"
          />
          <text 
            x="${charX}" 
            y="${y}" 
            font-family="${fontFamily}" 
            font-size="${fontSize}" 
            font-weight="${fontWeight}"
            font-style="${fontStyle}"
            fill="${fontColor}"
            letter-spacing="${letterSpacing}"
            transform="rotate(${rotation}, ${charX}, ${y})"
          >${line.charAt(position) || 'x'}</text>
        `;
      }
      
      // Add annotation errors (margin notes)
      if (errors.types.annotation && Math.random() < errorChance) {
        const annotationX = width - margin - 100;
        errorElements += `
          <text 
            x="${annotationX}" 
            y="${y}" 
            font-family="${fontFamily}" 
            font-size="${(parseInt(fontSize) * 0.8).toString()}" 
            font-weight="${fontWeight}"
            font-style="italic"
            fill="#cc0000"
            transform="rotate(-5, ${annotationX}, ${y})"
          >批注!</text>
          <path 
            d="M${annotationX - 5},${y - 5} C${x + line.length * parseInt(fontSize) * 0.5},${y - 30} ${x + line.length * parseInt(fontSize) * 0.7},${y - 20} ${x + line.length * parseInt(fontSize) * 0.6},${y}" 
            fill="none" 
            stroke="#cc0000" 
            stroke-width="0.5" 
            stroke-dasharray="3,3"
          />
        `;
      }
    }
    
    // Return the complete text element with any error elements
    return `
      <text 
        x="${x}" 
        y="${y}" 
        font-family="${fontFamily}" 
        font-size="${fontSize}" 
        font-weight="${fontWeight}"
        font-style="${fontStyle}"
        fill="${fontColor}"
        letter-spacing="${letterSpacing}"
        transform="rotate(${rotation}, ${x}, ${y})"
      >${line}</text>
      ${errorElements}
    `;
  }).join('\n');
  
  // Construct the complete SVG
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    ${patternDef}
    ${textureFilter}
  </defs>
  
  <!-- Paper background -->
  <rect width="100%" height="100%" fill="${bgColor}" ${textureUse}/>
  ${patternUse}
  
  <!-- Handwritten text -->
  ${textElements}
</svg>`;
}
