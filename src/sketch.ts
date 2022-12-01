import p5 from "p5";

let x;
let y;
let i;
let radii = [];
let radii2 = [];
i = 0;

export const sketch = (p5: p5) => {
  p5.setup = () => {
    p5.createCanvas(700, 700);
    p5.background("red");

    // degrees(RADIANS);
    // p5.frameRate(10);
    p5.background(20);

    p5.drawingContext.shadowOffsetX = 0;
    p5.drawingContext.shadowOffsetY = 0;
    p5.drawingContext.shadowBlur = 12;
    p5.drawingContext.shadowColor = p5.color(255, 5, 40, 255);
  };
  let graddd = 30;
  p5.draw = () => {
    // var grad = p5.drawingContext.createLinearGradient(0, 0, -20, 30, 30, 40);
    let grad = p5.drawingContext.createRadialGradient(
      0,
      0,
      100,

      0,
      0,
      500
    );

    grad.addColorStop(0, "white");
    // grad.addColorStop(0.4, "green");
    grad.addColorStop(0.4, "yellow");
    grad.addColorStop(0.5, "orange");
    grad.addColorStop(0.55, "red");
    grad.addColorStop(0.6, "#8b0000");
    grad.addColorStop(1, "violet");

    p5.drawingContext.strokeStyle = grad;

    let grad2 = p5.drawingContext.createRadialGradient(0, 0, 50, 0, 0, 700);
    grad2.addColorStop(0, "white");
    grad2.addColorStop(0.5, "blue");
    grad2.addColorStop(0.55, "cyan");
    grad2.addColorStop(1, "white");
    p5.translate(p5.width / 2, p5.height / 2);
    x = 240;
    y = 200;
    radii.push(x / 2 + p5.random(50));
    p5.strokeWeight(2);
    p5.background(20);
    p5.beginShape();
    p5.noFill();
    p5.stroke(255);
    for (let j = 0; j < i; j++) {
      p5.curveVertex(
        p5.cos(p5.radians(j * p5.PI)) * 2 * radii[j],
        p5.sin(p5.radians(j * p5.PI)) * 2 * radii[j]
      );

      // point(
      //   cos(radians(j * PI)) * 2 * radius,
      //   sin(radians(j * PI)) * 2 * radius
      // );
    }

    p5.endShape();

    p5.drawingContext.strokeStyle = grad2;
    radii2.push(x / 2 + p5.random(50));
    // p5.strokeWeight(2);
    // p5.background(20);
    p5.beginShape();
    p5.noFill();
    p5.stroke(255);
    for (let j = 0; j < i; j++) {
      p5.curveVertex(
        p5.cos(p5.radians(j * p5.PI)) * 2 * radii2[j],
        p5.sin(p5.radians(j * p5.PI)) * 2 * radii2[j]
      );

      // point(
      //   cos(radians(j * PI)) * 2 * radius,
      //   sin(radians(j * PI)) * 2 * radius
      // );
    }

    p5.endShape();
    // p5.push();
    // translate(-10, -10);

    // p5.drawingContext.strokeStyle = grad2;
    // p5.beginShape();

    // for (let j = 0; j < i; j++) {
    //   p5.curveVertex(
    //     p5.cos(p5.radians(j * p5.PI)) * 2.4 * radii[j],
    //     p5.sin(p5.radians(j * p5.PI)) * 2.4 * radii[j]
    //   );
    //   // point(cos(radians(j * PI)) * 2 * radius, sin(radians(j * PI)) * 2 * radius);
    // }

    // p5.endShape();
    // filter(BLUR,5);
    // p5.pop();
    // p5.drawingContext.fillStyle = grad;

    // p5.rect(0, 0, 700);

    x += 0.2;
    y += 0.5;
    i += 0.09;
  };
};
