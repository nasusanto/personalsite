#!/usr/bin/env python3
"""
Create a favicon with circular white background and memoji
Requires: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw
    import os
    
    # Load memoji image
    memoji_path = 'images/memoji.png'
    if not os.path.exists(memoji_path):
        print(f"Error: {memoji_path} not found")
        exit(1)
    
    memoji = Image.open(memoji_path)
    
    # Create 64x64 favicon
    size = 64
    favicon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(favicon)
    
    # Draw white circle
    margin = 2
    draw.ellipse([margin, margin, size-margin, size-margin], fill='white', outline='#e0e0e0', width=1)
    
    # Resize memoji to fit inside circle
    memoji_size = int(size * 0.875)  # 87.5% of circle
    memoji_resized = memoji.resize((memoji_size, memoji_size), Image.Resampling.LANCZOS)
    
    # Create circular mask
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_margin = margin + 2
    mask_draw.ellipse([mask_margin, mask_margin, size-mask_margin, size-mask_margin], fill=255)
    
    # Paste memoji centered with mask
    paste_x = (size - memoji_size) // 2
    paste_y = (size - memoji_size) // 2
    favicon.paste(memoji_resized, (paste_x, paste_y), mask.resize((memoji_size, memoji_size), Image.Resampling.LANCZOS))
    
    # Save favicon
    favicon.save('favicon.png', 'PNG')
    print("✅ Favicon created successfully: favicon.png")
    
except ImportError:
    print("Pillow not installed. Install it with: pip install Pillow")
    print("Or use the generate-favicon.html file in your browser")
except Exception as e:
    print(f"Error: {e}")
    print("Try using generate-favicon.html in your browser instead")

