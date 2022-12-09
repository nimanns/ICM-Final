// @ts-nocheck
import p5, { prototype } from "p5";
import * as muse from "./muse/all";

let x;
let y;
let i;
let radii = [];
let radii2 = [];
i = 0;

export const sketch = (p5: p5) => {
  p5.setup = () => {
    //portstuff
    // p5.createButton("Serial");
    port = createSerial();
    port.open(9600);
    let usedPorts = usedSerialPorts();
    if (usedPorts.length > 0) {
      port.open(usedPorts[0], 9600);
    }
    //portstuff

    p5.createCanvas(1050, 1050);
    muse.setupMuse();
    // p5.frameRate(20);
    // p5.background(20);

    // p5.angleMode(p5.)
    p5.drawingContext.shadowOffsetX = 0;
    p5.drawingContext.shadowOffsetY = 0;
    p5.drawingContext.shadowBlur = 12;
  };

  let graddd = 30;
  let a = 90;
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
    x = 250;
    y = 200;

    if (values.delta) {
      let alpha = Math.floor(values.alpha);
      let sumOfOthers =
        (Math.floor(values.delta) +
          Math.floor(values.theta) +
          Math.floor(values.beta) +
          Math.floor(values.gamma)) /
        4;

      if (p5.frameCount % 10 === 0) {
        radii.push(x / 2 + p5.constrain(alpha, 0, 70));

        sumOfOthers = p5.constrain(sumOfOthers, 0, 50);
        radii2.push(x / 1.6 + sumOfOthers);

        let valueToBeSent =
          Math.floor(sumOfOthers).toString() +
          "," +
          Math.floor(alpha).toString() +
          "\n";
        port.write(valueToBeSent);
        console.log(alpha);
        console.log(sumOfOthers);
      }
      // console.log(p5.constrain(sumOfOthers, 20, 40));
      // console.log(x / 2.5 + p5.constrain(alpha, 0, 50));
      // console.log("average of others: " + sumOfOthers);
    }

    radii.push(x / 1.7 + 0);
    radii2.push(x / 1.6 + 50);

    // p5.drawingContext.shadowBlur = 12;
    p5.drawingContext.shadowColor = p5.color(255, 255, 255, 100);
    p5.background(0);
    p5.fill("black");
    p5.noStroke();
    p5.circle(0, 0, 1000);
    // p5.clear(0, 0, 0, 20);

    p5.drawingContext.shadowBlur = 12;
    p5.drawingContext.shadowColor = p5.color(200, 200, 40, 200);
    p5.strokeWeight(2);
    p5.noFill();
    p5.stroke(255);

    p5.beginShape();
    for (let j = 0; j < radii.length; j++) {
      p5.curveVertex(
        p5.cos(p5.radians(j * p5.PI)) * 2 * radii[j],
        p5.sin(p5.radians(j * p5.PI)) * 2 * radii[j]
      );
    }
    p5.endShape();

    p5.beginShape();
    for (let j = 0; j < radii.length; j++) {
      p5.curveVertex(
        p5.cos(p5.radians(j * p5.PI)) *
          2 *
          radii[j] *
          map(sin(i), -1, 1, 1.03, 1.05),
        p5.sin(p5.radians(j * p5.PI)) *
          2 *
          radii[j] *
          map(sin(i), -1, 1, 1.03, 1.05)
      );
    }
    p5.endShape();

    p5.beginShape();
    for (let j = 0; j < radii.length; j++) {
      p5.curveVertex(
        p5.cos(p5.radians(j * p5.PI)) *
          2 *
          radii[j] *
          map(sin(i), -1, 1, 1.05, 1.07),
        p5.sin(p5.radians(j * p5.PI)) *
          2 *
          radii[j] *
          map(sin(i), -1, 1, 1.05, 1.07)
      );
    }
    p5.endShape();

    p5.beginShape();
    for (let j = 0; j < radii.length; j++) {
      p5.curveVertex(
        p5.cos(p5.radians(j * p5.PI)) *
          2 *
          radii[j] *
          map(sin(i), -1, 1, 1.07, 1.08),
        p5.sin(p5.radians(j * p5.PI)) *
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
        p5.cos(p5.radians(j * p5.PI)) * 2 * radii2[j],
        p5.sin(p5.radians(j * p5.PI)) * 2 * radii2[j]
      );
    }
    p5.endShape();
    p5.beginShape();
    for (let j = 0; j < radii2.length; j++) {
      p5.curveVertex(
        p5.cos(p5.radians(j * p5.PI)) *
          2 *
          radii2[j] *
          map(sin(i), -1, 1, 1.03, 1.05),
        p5.sin(p5.radians(j * p5.PI)) *
          2 *
          radii2[j] *
          map(sin(i), -1, 1, 1.03, 1.05)
      );
    }
    p5.endShape();
    p5.beginShape();
    for (let j = 0; j < radii2.length; j++) {
      p5.curveVertex(
        p5.cos(p5.radians(j * p5.PI)) *
          2 *
          radii2[j] *
          map(sin(i), -1, 1, 1.05, 1.07),
        p5.sin(p5.radians(j * p5.PI)) *
          2 *
          radii2[j] *
          map(sin(i), -1, 1, 1.05, 1.07)
      );
    }
    p5.endShape();
    p5.beginShape();
    for (let j = 0; j < radii2.length; j++) {
      p5.curveVertex(
        p5.cos(p5.radians(j * p5.PI)) *
          2 *
          radii2[j] *
          map(sin(i), -1, 1, 1.1, 1.13),
        p5.sin(p5.radians(j * p5.PI)) *
          2 *
          radii2[j] *
          map(sin(i), -1, 1, 1.1, 1.13)
      );
    }
    p5.endShape();

    // let image = p5.get();

    // p5.drawingContext.shadowColor = p5.color(100, 0);
    // p5.image(
    //   image,
    //   -p5.width / 2 + p5.random(-2, 1),
    //   -p5.height / 2 + p5.random(-2, 1),
    //   image.width,
    //   image.height
    // );
    // // p5.filter(p5.POSTERIZE, 2);

    // p5.background(20, 70);
    // p5.push();
    // translate(-10, -10);

    // p5.beginShape();

    // for (let j = 0; j < i; j++) {
    //   p5.curveVertex(
    //     p5.cos(p5.radians(j * p5.PI)) * 2.4 * radii[j],
    //     p5.sin(p5.radians(j * p5.PI)) * 2.4 * radii[j]
    //   );
    //   // point(cos(radians(j * PI)) * 2 * radius, sin(radians(j * PI)) * 2 * radius);
    // }

    // p5.endShape();
    // p5.pop();
    // p5.drawingContext.fillStyle = grad;

    // p5.rect(0, 0, 700);

    x += 0.2;
    y += 0.5;
    i += 0.09;
  };
};
