import { useState } from 'react';
import ColorPicker from '@rc-component/color-picker';
import '@rc-component/color-picker/assets/index.css';

interface ColorRGB {
    r: number, 
    g: number, 
    b: number
}

function floatToHexColor({r, g, b}: ColorRGB) {
    // Ensure RGB values are within the valid range [0, 255]
    r = Math.min(255, Math.max(0, Math.round(r)));
    g = Math.min(255, Math.max(0, Math.round(g)));
    b = Math.min(255, Math.max(0, Math.round(b)));
  
    // Convert to hexadecimal and format as a CSS color string
    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
  
    return `#${hexR}${hexG}${hexB}`;
}

function ColoredText({ text, color }: {
    text: string;
    color: string;
}) {
    const textStyle = {
      color: color,
    };
  
    return <div style={textStyle}>{text}</div>;
}

function TestPage() {
    const [color, setColor] = useState("#ffffff");
    return <>
        <ColorPicker 
            defaultValue={color}
            value={color}
            onChange={(c) => {
                setColor(floatToHexColor({r: c.r, g: c.g, b: c.b}))
            }}
        />
        <ColoredText 
            text={"TEST"}
            color={color}
        />
    </>
}

export default TestPage;