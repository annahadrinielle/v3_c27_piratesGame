const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
//need an array to store mutliple boats created
var boats = [];

//
var boatSpritedata, boatSpritesheet;
var boatFrames, boatAnimation = [];

/*
var brokenBoatSpritedata, brokenBoatSpritesheet;
var brokenBoatFrames, brokenBoatAnimation = [];
*/


//class Boat created in Boat.js 

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  //
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");

  /*
  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png");
  */
}

function setup() {
  canvas = createCanvas(windowWidth - 200, windowHeight);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(width / 2 - 550, height - 290, 250, 580);
  cannon = new Cannon(width / 2 - 500, height / 2 - 220, 120, 40, angle);

  //making single boat for trial
  // boat = new Boat(width, height - 100, 200, 200, -100);

  //
  boatFrames = boatSpritedata.frames;
  //console.log(boatFrames);
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }
//console.log(boatAnimation.length)

/*
brokenBoatFrames = brokenBoatSpritedata.frames;

for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }
*/
  
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
  ground.display();
  cannon.display();
  tower.display();
  
  /*
  Matter.Body.setVelocity( boat.body , 
      {
        x: -0.9,
        y: 0
      }
     );
     
  boat.display();
  */

  ///*
  //displaying and pushing new boats to boats array
  showBoats();

  //checking collision between each ball and boat pair
  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    
    //checking entire boats array for ball i
    for (var j = 0; j < boats.length; j++) {
      
        if (balls[i] !== undefined && boats[j] !== undefined) {
          var collision = Matter.SAT.collides(balls[i].body, boats[j].body);
          
          if (collision.collided) {
            boats[j].remove(j);

            Matter.World.remove(world, balls[i].body);
            balls.splice(i, 1);
            i--;    
          }
        } 
    }
  }
//*/
  
}


//creating the cannon ball on key press
function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

// function to show the ball.
function showCannonBalls(ball, index) {
  ball.display();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    Matter.World.remove(world, ball.body);
    balls.splice(index, 1);
  }
}


//function to show the boats and create a new boat if there are less than 4 boats on the screen
function showBoats() {
  //if there boats array is not empty
  if (boats.length > 0) 
  {  
    //create a new boat if there are less than 4 boats on the screen and the last boat has crossed a  distance of 300
    if ( boats.length < 4 
      && boats[boats.length - 1].body.position.x < width - 300)
    {
      var positions = [-130, -100, -120, -80];
      var position = random(positions);
      //
      var boat = new Boat(width,height - 100, 200, 200, position, boatAnimation);
      boats.push(boat);
    }
    
    /*for all boats in the boats array:
    1. give velocity
    2. display them on screen
    3. animate the boat by changing property a that determines the image picked from the animation array
    */
    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
      
      boats[i].animate();
    }
    //console.log(boats[0].speed)
    
  } 
  //if boats array is empty (boats array length = 0)
  else 
  {
    //create first boat when boats array is empty
    var boat = new Boat(width, height - 100, 200, 200, -100, boatAnimation);
    boats.push(boat);
  }
  
}


//releasing the cannonball on key release
function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }
}