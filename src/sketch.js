import p5, { prototype } from "p5";
import * as muse from "./muse/all";

let x;
let y;
let i;
let radii = [];
let radii2 = [];
i = 0;

const coeffForStartingPoint = 201;
let yodaSensorValue = 0;

export const sketch = (p5) => {
  p5.setup = () => {
    //circumference / seconds = number we have to devide the circumfrance to get the appropriate framerate
    //our circle's radius is on average 390
    //390/420=0.9
    //This speed is for 60fps for other framerates do speed * 60/targetFramerate
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

    grad.addColorStop(0, "white");
    grad.addColorStop(0.4, "#6099A6");
    grad.addColorStop(0.5, "#D98236");
    grad.addColorStop(0.55, "#D98236");
    grad.addColorStop(0.6, "#D98236");
    grad.addColorStop(1, "violet");

    p5.drawingContext.strokeStyle = grad;
    let grad2 = p5.drawingContext.createRadialGradient(0, 0, 50, 0, 0, 700);
    grad2.addColorStop(0, "white");
    grad2.addColorStop(0.5, "#ffaacc");
    grad2.addColorStop(0.55, "cyan");
    grad2.addColorStop(1, "white");
    p5.translate(p5.width / 2, p5.height / 2);
    let alpha = 0;
    let sumOfOthers = 0;
    if (values.delta) {
      alpha = Math.floor(values.alpha);
      sumOfOthers =
        (Math.floor(values.delta) +
          Math.floor(values.theta) +
          Math.floor(values.beta) +
          Math.floor(values.gamma)) /
        4;

      // if (p5.frameCount % 10 === 0) {
      // console.log(alpha);
      // console.log(sumOfOthers);
      // }
    }

    // console.log(p5.int(1224 / 2.9));
    // if (p5.frameCount % p5.int(750 / 10) === 0) {

    if (counter === 5) {
      if (port) {
        port.write("val");
      }
      if (port) yodaSensorValue = parseInt(port.readUntil("\n"));
      console.log(yodaSensorValue);
    }
    // radii.push(x / 1.7 + 50 - 20);
    // radii2.push(x / 1.6 + 40 + 20);

    if (true) {
      if (counter === 29 || counter === 13 || counter === 19) {
        // radii.push(x / 1.7 + random(0, 50) - 20);
        // radii2.push(x / 1.6 + random(0, 40) + 20);

        p5.drawingContext.shadowColor = p5.color(255, 255, 255, 100);
        p5.background(0);
        p5.fill("black");
        p5.noStroke();
        p5.circle(0, 0, 1000);

        radii.push(x / 2 + p5.constrain(alpha, 0, 70) - 20);

        sumOfOthers = p5.constrain(sumOfOthers, 0, 50) + 20;
        radii2.push(x / 1.6 + sumOfOthers);

        let valueToBeSent =
          Math.floor(sumOfOthers).toString() +
          "," +
          Math.floor(alpha).toString() +
          "\n";
        if (port) {
          port.write(valueToBeSent);
        }

        p5.drawingContext.shadowBlur = 12;
        p5.drawingContext.shadowColor = p5.color(200, 200, 200, 150);
        p5.strokeWeight(1.2);
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
        p5.drawingContext.shadowColor = p5.color(255, 255);

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
        if (port) {
          // port.write(p5.int(p5.random(20, 255)) + "," + p5.int(100));
          port.write(
            p5.int(p5.floor(p5.random(0, 70))) + "," + p5.int(sumOfOthers)
          );
        }
      }
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

    if (radii.length === 370) {
      p5.noLoop();
    }
  };
};
