// set up canvas


const para = document.querySelector('p');   // Paragraph element for displaying ball count
let count = 0;  // Counter for ball count
const canvas = document.querySelector('canvas');  // Canvas element
const ctx = canvas.getContext('2d');  // Context for drawing on canvas
const width = canvas.width = window.innerWidth;  // Width of canvas
const height = canvas.height = window.innerHeight;    // Height of canvas

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}


// Shape class for common properties of shapes
class Shape {

   constructor(x, y, velX, velY) {
     this.x = x;
     this.y = y;
     this.velX = velX;
     this.velY = velY;
   }
 
 }
// Ball class inheriting from Shape
 class Ball extends Shape {

   constructor(x, y, velX, velY, color, size) {
     super(x, y, velX, velY);
 
     this.color = color;
     this.size = size;
     this.exists = true;  // Flag to determine if the ball exists
   }
    // Draw the ball
   draw() {
     ctx.beginPath();
     ctx.fillStyle = this.color;
     ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
     ctx.fill();
   }
   
     // Update ball's position and handle edge collisions
   update() {
     if ((this.x + this.size) >= width) {
       this.velX = -(this.velX);
     }
 
     if ((this.x - this.size) <= 0) {
       this.velX = -(this.velX);
     }
 
     if ((this.y + this.size) >= height) {
       this.velY = -(this.velY);
     }
 
     if ((this.y - this.size) <= 0) {
       this.velY = -(this.velY);
     }
 
     this.x += this.velX;
     this.y += this.velY;
   }
 
   // Detect collision with other balls and change color
   collisionDetect() {
      for (const ball of balls) {
         if (!(this === ball) && ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
 
            if (distance < this.size + ball.size) {
              ball.color = this.color = randomRGB();
            }
         }
      }
   }
 
 }


// Ball delete
class DeleteCircle extends Shape {

   constructor(x, y) {
     super(x, y, 20, 20);
 
     this.color = "white";
     this.size = 10;
 
     window.addEventListener('keydown', (e) => {
       switch(e.key) {
         case 'a':
           this.x -= this.velX;
           break;
         case 'd':
           this.x += this.velX;
           break;
         case 'w':
           this.y -= this.velY;
           break;
         case 's':
           this.y += this.velY;
           break;
       }
     });
   }
 
   draw() {
     ctx.beginPath();
     ctx.strokeStyle = this.color;
     ctx.lineWidth = 3;
     ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
     ctx.stroke();
   }
 
   checkBounds() {
     if ((this.x + this.size) >= width) {
       this.x -= this.size;
     }
 
     if ((this.x - this.size) <= 0) {
       this.x += this.size;
     }
 
     if ((this.y + this.size) >= height) {
       this.y -= this.size;
     }
 
     if ((this.y - this.size) <= 0) {
       this.y += this.size;
     }
   }
 
   collisionDetect() {
     for (const ball of balls) {
       if (ball.exists) {
         const dx = this.x - ball.x;
         const dy = this.y - ball.y;
         const distance = Math.sqrt(dx * dx + dy * dy);
 
         if (distance < this.size + ball.size) {
           ball.exists = false;
           count--;
           para.textContent = 'Ball count: ' + count;
         }
       }
     }
   }
 
 }


 // Array to hold balls
const balls = [];

while (balls.length < 25) {
   const size = random(10,20);
   const ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7,7),
      random(-7,7),
      randomRGB(),
      size
   );

  balls.push(ball);
  count++;
  para.textContent = 'Ball count: ' + count;
}

//deleteBall = deleted ball
const deleteBall = new DeleteCircle(random(0, width), random(0, height));

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }


   // Draw and handle bounds and collisions for deleteBall
  deleteBall.draw();
  deleteBall.checkBounds();
  deleteBall.collisionDetect();

  requestAnimationFrame(loop);
}

loop();