import lerp from "lerp";
import p5 from "p5";
import { sketch } from "./sketch";

const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const sketchParent: HTMLElement = document.querySelector("div#canvas");
document.body.style.margin = "0";
document.body.style.background = "#000";
document.body.style.height = "100vh";
document.body.style.width = "100%";
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";

document.body.append(svg);
svg.setAttribute("height", "600");
svg.setAttribute("width", "600");
svg.style.fill = "pink";
// svg.style.backgroundColor = "red";
let i = 0;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
let heights = [];
for (let i = 0; i < 900; i += 5) {
  heights[i] = Math.random() * 30;
}
let color1 = [12, 14, 25];
let color2 = [90, 20, 90];
let color3 = [200, 20, 90];
let color4 = [140, 140, 90];
setInterval(() => {
  let content = `
<circle r="40%" cx="50%" cy="50%" stroke="black" stroke-width="3" fill="black" />
<defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="50%" style="stop-color:rgb(${color1[0]},${color1[1]},${color1[2]});stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(25,90,255);stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(${color2[0]},${color2[1]},${color2[2]});stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(90,20,255);stop-opacity:1" />
    </linearGradient>
 <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="50%" style="stop-color:rgb(0,0,0);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(${color3[0]},${color3[1]},${color3[2]});stop-opacity:1" />
      
    </linearGradient>
 <linearGradient id="grad4" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="50%" style="stop-color:rgb(0,0,0);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(${color4[0]},${color4[1]},${color4[2]});stop-opacity:1" />
      
    </linearGradient>
 
    <filter id="f1" x="0" y="0" width="200%" height="200%">
      <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
      <feGaussianBlur result="blurOut" in="offOut" stdDeviation="60" />
      <feBlend in="SourceGraphic" in2="offOut" mode="normal" />
    </filter>
  </defs>
`;

  // color1[0] = lerp(color1[0], Math.random() * 255, 0.02);
  // color1[1] = lerp(color1[1], Math.random() * 255, 0.02);
  // color1[2] = lerp(color1[2], Math.random() * 255, 0.02);

  for (let i = 0; i < 900; i += 80) {
    content += `<rect style="transform-box: fill-box; transform-origin:top" y="50%" x="50%" width="1" height="${
      40
      // Math.random() * 50
    }%" fill="url(#grad2)" transform="translate(-10) rotate(${i + 10})"/>
`;
  }

  for (let i = 0; i < 900; i += 1) {
    content += `<rect style="transform-box: fill-box; transform-origin:top;filter: drop-shadow(0px 0px 4px rgb(0 0 0 / 0.4));
" y="50%" x="50%" width="1" height="${(heights[i] = lerp(
      heights[i],
      Math.random() * 50,
      0.004
    ))}%" fill="url(#grad1)" transform="translate(-10) rotate(${i + 10})"/>
  `;
  }
  for (let i = 0; i < 900; i += 20) {
    content += `<rect style="transform-box: fill-box; transform-origin:top;filter: drop-shadow(0px 0px 4px rgb(0 0 0 / 0.4));
" y="50%" x="50%" width="2" height="${(heights[i] = lerp(
      heights[i],
      Math.random() * 70,
      0.004
    ))}%" fill="url(#grad3)" transform="translate(-10) rotate(${i + 10})"/>
  `;
  }
  for (let i = 0; i < 1000; i += 13) {
    content += `<rect style="transform-box: fill-box; transform-origin:top;filter: drop-shadow(0px 0px 4px rgb(0 0 0 / 0.4));
" y="50%" x="50%" width="2" height="${(heights[i] = lerp(
      heights[i],
      Math.random() * 90,
      0.004
    ))}%" fill="url(#grad4)" transform="translate(-10) rotate(${i + 10})"/>
  `;
  }
  // for (let i = 5; i < 900; i += 50) {
  //   content += `<rect style="transform-box: fill-box; transform-origin:top" y="50%" x="50%" width="10" height="50%" stroke="red" fill="yellow" transform="translate(-5) rotate(${
  //     i + 10
  //   })"/>
  // `;
  // }

  svg.innerHTML = content;
}, 100);

new p5(sketch, sketchParent);
