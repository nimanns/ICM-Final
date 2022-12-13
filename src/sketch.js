import p5, { prototype } from "p5";
import * as muse from "./muse/all";

let x;
let y;
let i;
i = 0;
let resetCanvas = false;

const coeffForStartingPoint = 201;
let yodaSensorValue = 0;
const chakras = document.querySelector("audio#chakras");
const loop = document.querySelector("audio#loop");
document.querySelector("button");
loop.play();

document.querySelector("button#reset").addEventListener("click", () => {
  radii = [];
  radii2 = [];
  chakras.currentTime = 0;
  resetCanvas = true;
});

export const sketch = (p5) => {
  p5.setup = () => {
    let serialBtn = document.querySelector("Button#serial");
    p5.frameRate(10);
    serialBtn.onclick = () => {
      port = createSerial();
      if (port) {
        port.open(9600);
      }
    };
    p5.createCanvas(1050, 1050);
    muse.setupMuse();
    p5.angleMode(p5.DEGREES);
    p5.drawingContext.shadowOffsetX = 0;
    p5.drawingContext.shadowOffsetY = 0;
    p5.drawingContext.shadowBlur = 12;
    x = 250;
    y = 200;
  };
  let graddd = 30;
  let a = 90;
  let counter = 0;
  p5.draw = () => {
    values = muse.eeg;
    // var grad = p5.drawingContext.createLinearGradient(0, 0, -20, 30, 30, 40);

    let grad = p5.drawingContext.createRadialGradient(0, 0, 100, 0, 0, 500);

    grad.addColorStop(0, colorPalette[0]);
    grad.addColorStop(0.4, colorPalette[0]);
    grad.addColorStop(0.5, colorPalette[0]);
    grad.addColorStop(0.55, colorPalette[0]);
    grad.addColorStop(0.6, colorPalette[0]);
    grad.addColorStop(1, colorPalette[0]);

    p5.drawingContext.strokeStyle = grad;
    let grad2 = p5.drawingContext.createRadialGradient(0, 0, 50, 0, 0, 700);
    grad2.addColorStop(0, colorPalette[1]);
    grad2.addColorStop(0.5, colorPalette[1]);
    grad2.addColorStop(0.55, colorPalette[1]);
    grad2.addColorStop(1, colorPalette[1]);
    p5.translate(p5.width / 2, p5.height / 2);

    // console.log(p5.int(1224 / 2.9));
    // if (p5.frameCount % p5.int(750 / 10) === 0) {

    if (counter === 5) {
      if (port) {
        port.write("val");
      }
      if (port) yodaSensorValue = parseInt(port.readUntil("\n"));
      // console.log(yodaSensorValue);
    }
    // radii.push(x / 1.7 + 50 - 20);
    // radii2.push(x / 1.6 + 40 + 20);

    if (yodaSensorValue > 400 && radii.length < 371) {
      yodaTouched = true;
      loop.pause();
      chakras.play();
      if (values.delta) {
        alpha = Math.floor(values.alpha);
        others =
          (Math.floor(values.delta) +
            Math.floor(values.theta) +
            Math.floor(values.beta) +
            Math.floor(values.gamma)) /
          4;

        // if (p5.frameCount % 10 === 0) {
        // console.log(alpha);
        // console.log(others);
        // }
      } else {
        // alpha = p5.random(0, 70);
        // others = p5.random(0, 50);
      }

      if (counter === 29 || counter === 13 || counter === 19) {
        p5.drawingContext.shadowColor = p5.color(255, 255, 255, 70);
        p5.background(0);
        p5.fill("black");
        p5.noStroke();
        p5.circle(0, 0, 1000);

        radii.push(x / 2 + p5.constrain(alpha, 0, 70));

        others = p5.constrain(others, 0, 50) + 20;
        radii2.push(x / 1.6 + others);

        let valueToBeSent =
          Math.floor(others).toString() +
          "," +
          Math.floor(alpha).toString() +
          "\n";
        if (port) {
          port.write(valueToBeSent);
        }

        p5.drawingContext.shadowBlur = 18;
        p5.drawingContext.shadowColor = p5.color(200, 100);

        p5.strokeWeight(1.6);
        p5.noFill();
        p5.stroke(255);

        p5.beginShape();
        for (let j = 0; j < radii.length; j++) {
          p5.curveVertex(
            p5.cos(j + coeffForStartingPoint * p5.PI) * 2 * radii[j],
            p5.sin(j + coeffForStartingPoint * p5.PI) * 2 * radii[j]
          );
        }
        p5.endShape();

        p5.beginShape();
        for (let j = 0; j < radii.length; j++) {
          p5.curveVertex(
            p5.cos(j + coeffForStartingPoint * p5.PI) *
              2 *
              radii[j] *
              map(sin(i), -1, 1, 1.03, 1.05),
            p5.sin(j + coeffForStartingPoint * p5.PI) *
              2 *
              radii[j] *
              map(sin(i), -1, 1, 1.03, 1.05)
          );
        }
        p5.endShape();

        p5.beginShape();
        for (let j = 0; j < radii.length; j++) {
          p5.curveVertex(
            p5.cos(j + coeffForStartingPoint * p5.PI) *
              2 *
              radii[j] *
              map(sin(i), -1, 1, 1.05, 1.07),
            p5.sin(j + coeffForStartingPoint * p5.PI) *
              2 *
              radii[j] *
              map(sin(i), -1, 1, 1.05, 1.07)
          );
        }
        p5.endShape();

        p5.beginShape();
        for (let j = 0; j < radii.length; j++) {
          p5.curveVertex(
            p5.cos(j + coeffForStartingPoint * p5.PI) *
              2 *
              radii[j] *
              map(sin(i), -1, 1, 1.07, 1.08),
            p5.sin(j + coeffForStartingPoint * p5.PI) *
              2 *
              radii[j] *
              map(sin(i), -1, 1, 1.1, 1.13)
          );
        }
        p5.endShape();

        p5.drawingContext.strokeStyle = grad2;
        // p5.drawingContext.shadowColor = p5.color(255, 90);

        p5.noFill();
        p5.stroke(255);

        p5.beginShape();
        for (let j = 0; j < radii2.length; j++) {
          p5.curveVertex(
            p5.cos(j + coeffForStartingPoint * p5.PI) * 2 * radii2[j],
            p5.sin(j + coeffForStartingPoint * p5.PI) * 2 * radii2[j]
          );
        }
        p5.endShape();
        p5.beginShape();
        for (let j = 0; j < radii2.length; j++) {
          p5.curveVertex(
            p5.cos(j + coeffForStartingPoint * p5.PI) *
              2 *
              radii2[j] *
              map(sin(i), -1, 1, 1.03, 1.05),
            p5.sin(j + coeffForStartingPoint * p5.PI) *
              2 *
              radii2[j] *
              map(sin(i), -1, 1, 1.03, 1.05)
          );
        }
        p5.endShape();
        p5.beginShape();
        for (let j = 0; j < radii2.length; j++) {
          p5.curveVertex(
            p5.cos(j + coeffForStartingPoint * p5.PI) *
              2 *
              radii2[j] *
              map(sin(i), -1, 1, 1.05, 1.07),
            p5.sin(j + coeffForStartingPoint * p5.PI) *
              2 *
              radii2[j] *
              map(sin(i), -1, 1, 1.05, 1.07)
          );
        }
        p5.endShape();
        p5.beginShape();
        for (let j = 0; j < radii2.length; j++) {
          p5.curveVertex(
            p5.cos(j + coeffForStartingPoint * p5.PI) *
              2 *
              radii2[j] *
              map(sin(i), -1, 1, 1.1, 1.13),
            p5.sin(j + coeffForStartingPoint * p5.PI) *
              2 *
              radii2[j] *
              map(sin(i), -1, 1, 1.1, 1.13)
          );
        }
        p5.endShape();

        // x += 0.2;
        // y += 0.5;
      }
      if (counter === 20) {
        // if (port) {
        //   port.write(p5.int(p5.floor(p5.random(0, 70))) + "," + p5.int(others));
        // }
      }
    } else if (yodaSensorValue < 400 && yodaSensorValue > 100) {
      chakras.pause();
      loop.play();
      yodaTouched = false;
    }
    if (yodaTouched) {
      document.querySelector("div#canvas2").classList.add("invisible");
    } else {
      document.querySelector("div#canvas2").classList.remove("invisible");
    }

    // p5.drawingContext.shadowBlur = 12;

    // i += 0.009;

    // if (counter === 10) {
    //   console.log("hey");
    //   if (port)
    //     port.write(
    //       p5.int(p5.random(20, 255)) + "," + p5.int(p5.random(50, 255))
    //     );
    // }
    // if(counter === 20){

    // }

    counter === 30 ? (counter = 0) : counter++;
  };
  if (resetCanvas) {
    background(0);
  }
};

export const sketch2 = (p5) => {
  let imgs = [];
  let img;
  let img2;
  let img3;
  let circle = 0;
  let circle2 = 0;
  let circle3 = 0;
  p5.preload = () => {
    img = p5.loadImage("closed1.png");
    img2 = p5.loadImage("s.png");
    img3 = p5.loadImage("eyeclosed.png");
  };
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
  };
  p5.draw = () => {
    p5.push();
    p5.angleMode(DEGREES);
    p5.imageMode(CENTER);
    p5.fill(0);
    p5.ellipse(476, 277, 390, 390);
    p5.translate(p5.width / 2, p5.height / 2);
    circle = circle + 0.2;
    p5.rotate(circle);
    p5.image(
      img2,
      0,
      3,
      p5.width,
      p5.height,
      0,
      0,
      img.width,
      img.height,
      p5.CONTAIN,
      p5.CENTER
    );
    circle2 = circle - 0.2;
    p5.push();
    p5.rotate(circle2);
    p5.scale(2);
    p5.image(
      img2,
      0,
      3,
      p5.width,
      p5.height,
      0,
      0,
      img.width * 2,
      img.height,
      p5.CONTAIN,
      p5.CENTER
    );
    p5.pop();
    p5.push();
    circle3 = circle - 0.3;
    p5.rotate(circle3);
    p5.scale(4);
    p5.image(
      img2,
      0,
      3,
      p5.width,
      p5.height,
      0,
      0,
      img.width * 2,
      img.height,
      p5.CONTAIN,
      p5.CENTER
    );
    p5.pop();
    p5.pop();

    if (yodaTouched) {
      p5.image(
        img3,
        0,
        0,
        p5.width,
        p5.height,
        0,
        0,
        img.width,
        img.height,
        p5.CONTAIN,
        p5.CENTER
      );
    } else {
      p5.image(
        img,
        0,
        0,
        p5.width,
        p5.height,
        0,
        0,
        img.width,
        img.height,
        p5.CONTAIN,
        p5.CENTER
      );
    }
  };

  // function pupil() {
  //   push();
  //   scale(mouseY / 1000);
  //   let d1 = dist(mouseX, mouseY, 473, 275);
  //   if (d1 < 50) {
  //     noFill();
  //     strokeWeight(10);
  //     stroke(200, 230, 0);
  //     ellipse(473, 283, 10);
  //     pop();
  //   }
  // }
  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };
};
