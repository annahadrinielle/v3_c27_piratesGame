class Boat {
  constructor(x, y, width, height, boatPos,boatAnimation) {
    var options = {
      restitution: 0.8,
      friction: 1.0,
      density: 1.0,
    };

    //
    this.animation = boatAnimation;
    this.animationNum = 0.05;
    
    //this.speed = 0.05;
    
    this.body = Bodies.rectangle(x, y, width, height, options);
    this.width = width;
    this.height = height;

    this.boatPosition = boatPos;
    this.image = loadImage("assets/boat.png");
    World.add(world, this.body);
  }

//to remove ships from the world
  remove(index) {
    Matter.World.remove(world, boats[index].body);
    boats.splice(index, 1);

  }
  /*
  remove(index) {
    this.animation = brokenBoatAnimation;
    this.animationNum = 0.05;
    this.width = 300;
    this.height = 300;
    setTimeout(() => {
      Matter.World.remove(world, boats[index].body);
      boats.splice(index, 1);
    }, 2000);
  }
  */

  animate() {
    this.animationNum += 0.05  
    
    //this.speed += 0.05 % 1.1;
  }

  display() {
    var angle = this.body.angle;
    var pos = this.body.position;
    
    //console.log('animation: '+ this.animationNum)
    var index = floor(this.animationNum % this.animation.length);
    //console.log('index: '+ index)

    //var index = floor(this.speed % this.animation.length);
    

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.animation[index], 0, this.boatPosition, this.width, this.height);
    noTint();
    pop();
  }
}
