import lerp from "lerp";
import p5 from "p5";
import { sketch } from "./sketch";

const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const sketchParent = document.querySelector("div#canvas");
document.body.style.margin = "0";
document.body.style.background = "#000";
document.body.style.height = "100vh";
document.body.style.width = "100%";
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";

document.body.append(svg);
svg.setAttribute("height", "900");
svg.setAttribute("width", "900");
svg.style.fill = "pink";
// svg.style.backgroundColor = "red";
let i = 0;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
let heights = [];
let heights2 = [];
let heights3 = [];
for (let i = 0; i < 900; i += 5) {
  heights[i] = Math.random() * 26;
  heights2[i] = Math.random() * 20;
  heights3[i] = Math.random() * 35;
}

let color1 = [12, 14, 25];
let color2 = [90, 20, 90];
let color3 = [200, 20, 90];
let color4 = [140, 140, 90];
let junk = `<circle r="35%" cx="50%" cy="50%" stroke="black" stroke-width="3" fill="black" filter="url(#f1)"/>`;
setInterval(() => {
  let content = `

<defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="50%" style="stop-color:#000");stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6099A6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="60%" style="stop-color:#000");stop-opacity:1" />
      <stop offset="100%" style="stop-color:#BF472C;stop-opacity:1" />
    </linearGradient>
 <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="50%" style="stop-color:rgb(0,0,0);stop-opacity:1" />
      <stop offset="100%" style="stop-color:#D98236;stop-opacity:1" />
    </linearGradient>
 <linearGradient id="grad4" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="60%" style="stop-color:rgb(0,0,0);stop-opacity:1" />
      <stop offset="90%" style="stop-color:#444;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#000;stop-opacity:1" />
    </linearGradient>
<linearGradient id="grad5" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="60%" style="stop-color:rgb(0,0,0);stop-opacity:1" />
      <stop offset="70%" style="stop-color:#BF472C;stop-opacity:1" />
      <stop offset="90%" style="stop-color:#000;stop-opacity:1" />
    </linearGradient>
  
<filter id="f1" x="-100%" y="-100%" width="400%" height="400%">
      <feDropShadow dx="0" dy="0" stdDeviation="25" flood-color="#444"/> 
    </filter>
    <filter id="f2" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="40" flood-color="black"/> 
    </filter>
  </defs>
`;
  for (let i = 0; i < 900; i += 10) {
    content += `<rect style="transform-box: fill-box; transform-origin:top;filter: drop-shadow(0px 0px 4px rgb(0 0 0 / 0.4));
  " y="50%" x="50%" width="2" height="30%" fill="url(#grad4)" transform="translate(-2) rotate(${
    i + 15
  })"/>
    `;
  }
  for (let i = 0; i < 900; i += 5) {
    content += `<rect style="transform-box: fill-box; transform-origin:top;filter: drop-shadow(0px 0px 4px rgb(0 0 0 / 0.4));
  " y="50%" x="50%" width="1" height="${
    heights[i]
  }%" fill="url(#grad3)" transform="translate(0) rotate(${i + 10})"/>
    `;
  }

  for (let i = 0; i < 900; i += 5) {
    content += `<rect style="transform-box: fill-box; transform-origin:top;filter: drop-shadow(0px 0px 4px rgb(0 0 0 / 0.4));
  " y="50%" x="50%" width="2" height="${
    heights2[i]
  }%" fill="url(#grad1)" transform="translate(-1) rotate(${i + 15})"/>
    `;
  }

  // for (let i = 0; i < 900; i += 13) {
  //   content += `<rect style="transform-box: fill-box; transform-origin:top;filter: drop-shadow(0px 0px 4px rgb(0 0 0 / 0.4));
  // " y="50%" x="50%" width="2" height="50%" fill="url(#grad1)" transform="translate(-10) rotate(${
  //   i + 10
  // })"/>
  //   `;
  // }

  content += `
  <circle r="10%" cx="50%" cy="50%" stroke="black" fill="black" filter="url(#f2)" />`;
  // for (let i = 5; i < 900; i += 50) {
  //   content += `<rect style="transform-box: fill-box; transform-origin:top" y="50%" x="50%" width="10" height="50%" stroke="red" fill="yellow" transform="translate(-5) rotate(${
  //     i + 10
  //   })"/>
  // `;
  // }

  svg.innerHTML = content;
}, 1000);

new p5(sketch, sketchParent);

// document.body.append(btn);
