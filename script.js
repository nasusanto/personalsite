// This is where we'll add interactivity and animations
// We'll make the circular text animation work here

// Function to create curved text along a circle using SVG text paths
// This allows text to flow naturally with proper character spacing
function createCurvedText() {
    const phrases = document.querySelectorAll('.phrase');
    const orbitRadius = 90; // Radius of the circle in pixels
    const centerX = 120; // Center of the 240px container
    const centerY = 120;
    const fontSize = 16; // Font size in pixels
    
    // Starting angles for each phrase (in degrees)
    const startAngles = {
        'phrase-1': 0,      // Top
        'phrase-2': 120,    // Bottom-right
        'phrase-3': 240     // Bottom-left
    };
    
    // First pass: calculate the maximum arc span needed
    let maxArcSpan = 0;
    const phraseData = [];
    
    phrases.forEach((phrase) => {
        const text = phrase.getAttribute('data-text');
        // Estimate arc span needed: approximate character width * number of characters
        // Character width is roughly 0.6 * font size for most fonts
        const charWidth = fontSize * 0.6;
        const textLength = text.length;
        const estimatedPathLength = textLength * charWidth;
        // Convert path length to arc span: arcSpan (degrees) = (pathLength / circumference) * 360
        const circumference = 2 * Math.PI * orbitRadius;
        const estimatedArcSpan = (estimatedPathLength / circumference) * 360;
        // Add some padding (20%) to ensure text fits
        const arcSpan = estimatedArcSpan * 1.2;
        
        phraseData.push({
            phrase,
            text,
            arcSpan,
            phraseClass: phrase.className.split(' ').find(cls => cls.startsWith('phrase-'))
        });
        
        if (arcSpan > maxArcSpan) {
            maxArcSpan = arcSpan;
        }
    });
    
    // Use the maximum arc span for all phrases so they have consistent spacing
    const arcSpan = Math.max(maxArcSpan, 100); // Minimum 100 degrees
    
    // Second pass: create SVG paths with calculated arc spans
    phraseData.forEach(({ phrase, text, phraseClass }) => {
        const baseStartAngle = startAngles[phraseClass] || 0;
        
        // Clear any existing content
        phrase.innerHTML = '';
        
        // Create SVG element for text path
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'phrase-svg');
        svg.setAttribute('viewBox', '0 0 240 240');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '240px';
        svg.style.height = '240px';
        svg.style.overflow = 'visible';
        
        // Calculate arc start and end angles (centered around baseStartAngle)
        const startAngleRad = ((baseStartAngle - arcSpan / 2) * Math.PI) / 180;
        const endAngleRad = ((baseStartAngle + arcSpan / 2) * Math.PI) / 180;
        
        // Create the circular path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const largeArcFlag = arcSpan > 180 ? 1 : 0;
        
        // Calculate start and end points on the circle
        const startX = centerX + orbitRadius * Math.cos(startAngleRad);
        const startY = centerY + orbitRadius * Math.sin(startAngleRad);
        const endX = centerX + orbitRadius * Math.cos(endAngleRad);
        const endY = centerY + orbitRadius * Math.sin(endAngleRad);
        
        // Create path data for the arc
        const pathData = `M ${startX} ${startY} A ${orbitRadius} ${orbitRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
        path.setAttribute('id', `path-${phraseClass}`);
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        svg.appendChild(path);
        
        // Create text element that follows the path
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('class', `phrase-text ${phraseClass}-text`);
        
        // Create textPath element
        const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
        textPath.setAttribute('href', `#path-${phraseClass}`);
        textPath.setAttribute('startOffset', '50%'); // Center the text
        textPath.setAttribute('text-anchor', 'middle');
        textPath.setAttribute('dominant-baseline', 'middle');
        textPath.textContent = text;
        
        textElement.appendChild(textPath);
        svg.appendChild(textElement);
        
        phrase.appendChild(svg);
    });
}

// Initialize curved text when page loads
document.addEventListener('DOMContentLoaded', createCurvedText);
