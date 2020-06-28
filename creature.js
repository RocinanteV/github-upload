//Creature Colonies
/*
We have a "particle system" that has meat (m), creature (c1), creature2 (c2), and egg (e)
*meat will be eaten by either creature, but only c1 will go towards meat if it detects it by being close enough

*c1 will "fight" another c1 or c2 if they get close enough. Who takes damage is based on the "particles" health and attack

*c1 will also try to avoid c2 if c2 gets close enough (c1 is slower than c2)

*c2 will eat meat, but not go towards it

*c2 will chase c1, and they will "fight" if they get close enough

*c2 will also fight c2 but they won't try to chase or avoid each other

*eggs are invincible but they will hatch after a set amount of frames (300) into c1
*/

//c1 is black creature
//c2 is white

var frames = 0; //used to animate creatures, counts frames. Use this instead of countFrames because it is reset after a set amount of frames


//particle constructor, has position, velocity, acceleration
//mass, health, and attack power, seed for perlin noise, level (to determine if it lays an egg or evolves, and flags to let prog know whattype of creature it is. This is a general template for all other objects in this program
var Particle = function(position) {
    this.acceleration = new PVector(0, 0);
    this.velocity = new PVector(random(-3, 3), random(-3, 3));
    this.position = position.get();
    this.health = 10;
    this.attack = 0;
    this.level = 0;
    this.fc = 0; //used for egg object. will hatch after certain # of frames
    this.isMeat = false;
    this.isEgg = false;
    this.isC1 = false;
    this.isC2 = false;
    this.xOff = random(0,10000); //perlin seeds
    this.yOff = random(0,10000);
};

//updates and displays particle
Particle.prototype.run = function() {
    this.update();
    this.display();
};

//apply whatever force acts on particle (repelling or attracting)
Particle.prototype.applyForce = function(force) {
    var f = force.get();
    this.acceleration.add(f);
};

//update all vectors
Particle.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.velocity.x = constrain(this.velocity.x,-1,1);
    this.velocity.y = constrain(this.velocity.y,-1,1);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.fc++;
};

//updates motion but uses perlin noise for c1
Particle.prototype.update1 = function() {
    var xChange = map(noise(this.xOff),0,1,-1,1);
    var yChange = map(noise(this.yOff),0,1,-1,1);
    this.acceleration.set(xChange,yChange);
    this.xOff += 0.01;
    this.yOff += 0.01;
    this.velocity.add(this.acceleration);
    this.velocity.x = constrain(this.velocity.x,-0.7,0.7);
    this.velocity.y = constrain(this.velocity.y,-0.7,0.7);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.fc++;
};

//updates motion but uses perlin noise for c2
Particle.prototype.update2 = function() {
    var xChange = map(noise(this.xOff),0,1,-1,1);
    var yChange = map(noise(this.yOff),0,1,-1,1);
    this.acceleration.set(xChange,yChange);
    this.xOff += 0.01;
    this.yOff += 0.01;
    this.velocity.add(this.acceleration);
    this.velocity.x = constrain(this.velocity.x,-0.7,0.7);
    this.velocity.y = constrain(this.velocity.y,-0.7,0.7);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.fc++;
};

//displays general particle
Particle.prototype.display = function() {
    stroke(0, 0, 0);
    strokeWeight(2);
    fill(255, 0, 0);
    ellipse(this.position.x, this.position.y, this.mass, this.mass);
};

//make particle loop around canvas when it passes an edge
Particle.prototype.checkEdges = function() {
    if(this.position.x > width) {
        this.position.x = 10;    
    } else if(this.position.x < 0) {
        this.position.x = width-10;
    } else if(this.position.y > height) {
        this.position.y = 10;    
    } else if(this.position.y < 0) {
        this.position.y = height-10;    
    }
};

//this lets the predator creature track it's prey/food
//prey should call this function
Particle.prototype.attract = function(predator) {
    var d = PVector.sub(this.position,predator.position);
    d.normalize();
    d.mult(5);
    predator.applyForce(d);
    this.acceleration.set(0,0);
};

//this lets prey creature try to avoid predator
//prey should call this function
Particle.prototype.avoid = function(predator) {
    var d = PVector.sub(this.position,predator.position);
    fill(255, 0, 0);
    d.normalize();
    d.mult(1);
    if(this.position.x > 50 && this.position.x < width-50 && this.position.y >50 && this.position.y<height-50) {
        this.applyForce(d); //added this line so prey and predator
        //don't get stuck looping around canvas
    }
};


//works
//detects if you collide with another object (food, predator, prey, etc)
//doesn't matter which object calls this function
/*
Particle.prototype.detect = function(thing,radius) {

    if(this.position.x+radius> thing.position.x-radius && this.position.x-radius < thing.position.x+radius && this.position.y+radius > thing.position.y-radius && this.position.y-radius< thing.position.y+radius) {
        //fill(255, 0, 0);   //use this rectange to test if function works
        //rect(100,100,50,50);
        return true;    
        
    }
};
*/

//detects if object is within a certain radius (r) of another object/"thing"
Particle.prototype.detect2 = function(thing,r) {

    if(this.position.x-r < thing.position.x+r && 
    this.position.x+r > thing.position.x-r &&
    this.position.y-r < thing.position.y+r &&
    this.position.y+r > thing.position.y+r
    ) {
        
        /*
        fill(255, 0, 0);   //use this rectange to test if function works
        rect(100,100,50,50);
        */
        return true;    
        
    }
};



//works
Particle.prototype.isDead = function(){
    if(this.health <=0) {
        return true;    
    }
};


//works
//actual creature constructor
//health = 40, attack = 20; level = 1
var Creature = function(position) {
    Particle.call(this,position); 
    this.health = 40;
    this.attack = 20;
    this.level = 1;
    this.isC1 = true;
};
Creature.prototype = Object.create(Particle.prototype);

//works
//displays creature level 1 (animates it)
//c1
Creature.prototype.display = function() {
    var mapHealth = map(this.health,0,100,0,12);
    var cWidth = 10;
    var cHeight = 10;
    var eHeight = 10;
    var eWidth = 10;
    rectMode(CENTER);
    
    fill(0, 0, 0); //black color
    //stroke(2);
    
    if(frames<20) {
        stroke(2);
        rect(this.position.x,this.position.y, cWidth,cHeight-1);
        rect(this.position.x-4,this.position.y-7, 1,1); //left ear
        rect(this.position.x+3,this.position.y-7, 1,1); //right ear
        rect(this.position.x,this.position.y+5,12,1); //base
        fill(255, 255, 255);    //white color
        noStroke();
        rect(this.position.x-3,this.position.y-2,2,2);//left eye
        rect(this.position.x+3,this.position.y-2,2,2);//right eye
        rect(this.position.x,this.position.y+3,5,2);//mouth
        
    }
    
    
    else if(frames <40) {
        fill(0,0,0);
        strokeWeight(2);
        rect(this.position.x,this.position.y, cWidth,cHeight-8); //middle
        rect(this.position.x,this.position.y-2,cWidth-2,cHeight-8);//top
        rect(this.position.x-3,this.position.y-5, 1,1); //left ear
        rect(this.position.x+2,this.position.y-5, 1,1); //right ear
        rect(this.position.x, this.position.y+2,14,1);
        
        //noStroke();
        fill(255, 255, 255);
        rect(this.position.x-3,this.position.y,2,2);//left eye
        rect(this.position.x+3,this.position.y-2,2,2);//right eye
    }
    
    
    else if(frames<60) {
        fill(0,0,0);
        strokeWeight(2);
        rect(this.position.x,this.position.y, cWidth,cHeight-8); //middle
        rect(this.position.x,this.position.y-2,cWidth-2,cHeight-8);//top
        rect(this.position.x-3,this.position.y-5, 1,1); //left ear
        rect(this.position.x+2,this.position.y-5, 1,1); //right ear
        rect(this.position.x, this.position.y+2,14,1);  //base
        
        //noStroke();
        fill(255, 255, 255);
        rect(this.position.x-3,this.position.y-2,2,2);//left eye
        rect(this.position.x+3,this.position.y,2,2);//right eye
        
    }
    
    else if(frames <80) {
        fill(0,0,0);
        strokeWeight(2);
        rect(this.position.x,this.position.y, cWidth,cHeight-8); //middle
        rect(this.position.x,this.position.y-2,cWidth-2,cHeight-8);//top
        rect(this.position.x-3,this.position.y-5, 1,1); //left ear
        rect(this.position.x+2,this.position.y-5, 1,1); //right ear
        rect(this.position.x, this.position.y+2,14,1);
        
        noStroke();
        fill(255, 255, 255);
        rect(this.position.x-3,this.position.y,2,2);//left eye
        rect(this.position.x+3,this.position.y-2,2,2);//right eye
        
    }
    
    else { //set frames to 0 so we can cycle through all animations again
        frames = 0;    
    }
};

//update c1 but does not use perlin noise
Creature.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.velocity.x = constrain(this.velocity.x,-0.75,0.75);
    this.velocity.y = constrain(this.velocity.y,-0.75,0.75);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.fc++;
};



//creature 2
//actual creature constructor
//health = 80; attack = 40; level = 2;
var Creature2 = function(position) {
    Particle.call(this,position); 
    this.health = 80;
    this.attack = 40;
    this.level = 2;
    this.isC2 = true;
};
Creature2.prototype = Object.create(Creature.prototype);


//displays creature level 2 (animates it)
//c2
Creature2.prototype.display = function() {
    
    var cWidth = 12;
    var cHeight = 12;
    var eHeight = 2;
    var eWidth = 2;
    rectMode(CENTER);
    
    fill(255, 255, 255); //black color
    
    
    if(frames<20) {
        stroke(0, 0, 0);
        rect(this.position.x,this.position.y, cWidth,cHeight,4);//body
        rect(this.position.x-4,this.position.y-7,2,2);//left ear
        rect(this.position.x+4,this.position.y-7,2,2);//right ear
        fill(0, 0, 0);
        noStroke();
        rect(this.position.x-3,this.position.y-2,2,2);//left eye
        rect(this.position.x+3,this.position.y-2,2,2);//right eye
        rect(this.position.x,this.position.y+1,5,2);//mouth
        
        
    }
    
    else if(frames<40) {
        fill(255, 255, 255);
        stroke(0, 0, 0);
        rect(this.position.x,this.position.y, cWidth,cHeight/2,4);//body
        rect(this.position.x-4,this.position.y-4,2,2);//left ear
        rect(this.position.x+4,this.position.y-4,2,2);//right ear
        fill(0, 0, 0);
        noStroke();
        rect(this.position.x-2,this.position.y,2,2);//left eye
        rect(this.position.x+3,this.position.y,2,2);//right eye
        rect(this.position.x,this.position.y+1,1,1);
    }
    
    else { //set frames to 0 so we can cycle through all animations again
        frames = 0;    
    }
};

//update c2 but does not use perlin noise
Creature2.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.velocity.x = constrain(this.velocity.x,-1,1);
    this.velocity.y = constrain(this.velocity.y,-1,1);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.fc++;
};

//meat constructor
var Meat = function(position) {
    Particle.call(this,position);
    this.attack = 0;
    this.health = 5;
    this.level = 0;
    this.isMeat = true;
};
Meat.prototype = Object.create(Particle.prototype);

//displays meat
Meat.prototype.display = function() {
    var cWidth = 10;
    var cHeight = 10;
    
    rectMode(CENTER);
    
    
    fill(255, 255, 255);
    stroke(3, 3, 3);
    rect(this.position.x-7,this.position.y,cWidth/2,cHeight/3);
    rect(this.position.x+7,this.position.y,cWidth/2,cHeight/3);
    fill(247, 170, 62);
    rect(this.position.x,this.position.y,cWidth,cHeight,5);
};

//egg constructor
var Egg = function(position) {
    Particle.call(this,position);
    this.attack = 0;
    this.health = 100;
    this.level = 4;
    this.isEgg = true;
    this.fc = 0; //frame count for this particular egg
};
Egg.prototype = Object.create(Particle.prototype);

//displays egg
Egg.prototype.display = function() {
    var eWidth = 8;
    var eHeight = 12;
    
    fill(255, 255, 255);
    strokeWeight(1);
    fill(18, 138, 140);
    ellipse(this.position.x,this.position.y,eWidth,eHeight);
};




/*
for particle system we want to let it hold, Meat (m), Creature (c1), Creature2 (c2), and Egg (e) as "particles". Each one interacts slightly differently depending on what it is interacting with and we must accoutn for this. 
m -> m: nothing happens
m -> c1: m chased and eaten by c1
m -> c2: c2 does NOT chase m, will eat it if close enough
m -> e: nothing happens

c1 -> m: c1 chases and eats m
c1a -> c1b: c1a and c1b fight, if one is beaten the other levels up and evolves. loser is destroyed
c1 -> c2: c1 trys to avoid c2, c2 chases c1, c1 and c2 fight if c1 caught. winner levels up and carries out correct behavior. loser loses health and carries out correct behavior
c1 -> e: nothing happens

c2 -> m: c2 does not chase m but will eat it if close enough
c2 -> c1: c2 chases c1 and if catches they fight after fight carry out correct behavior. c1 trys to avoid c2
c2 -> c2: if close enough they fight
c2 -> e: nothing happens

e: increment e.fc and hatch after set amount of frames
*/

//put all of these in ps object
//c1.evolve() 
//c1.fight() (let c2 inherit this function)
//ps.destroy() (removes dead particles)
//the aboce is for ParticleSystem.prototype.update();





//particle system
//particle system constructor
var ParticleSystem = function() {
    this.sys = [];
};

//m = # of meat in system
//c1 = # of creatures in system
//c2 = # of creature2s in system
//c3 = # of eggs in system
//this works, fills particle system with different types of objects, creatures, etc
ParticleSystem.prototype.populate = function(m,c1,c2,e) {
    
    for(var i = 0; i<c1; i++) {
        this.sys.push(new Creature(new PVector(random(0,width),random(0,height))));  
    }
    for(var i = 0; i<c2; i++) {
        this.sys.push(new Creature2(new PVector(random(0,width),random(0,height)))); 
    }
    for(var i = 0; i<e; i++) {
        this.sys.push(new Egg(new PVector(random(0,width),random(0,height))));    
    }
    
    //this.particles.push(new Meat(new PVector(200,200)));
    for(var i = 0; i<m; i++) {
        this.sys.push(new Meat(new PVector(random(0,width),random(0,height))));  
        //this.particles.push(new Meat(new PVector(200,200)));
    }
};


//when destroying things only destroy index
//this is the function that lets all creatures, eggs, and food interact
ParticleSystem.prototype.interactions = function(){
    for(var top = 0; top<this.sys.length; top++){
        for(var index = top; index<this.sys.length; index++){
            this.meatAndC1(top,index);
            this.c1AndC1(top,index);
            this.c1AndC2(top,index);
            this.c2AndC2(top,index);
            this.eatMeat(top,index); 
            this.eatMeat(index,top);
            this.evolve(top);
            this.layEgg(top);
            this.hatch(top);
            this.destroy(index);
        }
    }
};

//updates whole particle system,general movement of c1 and c2, but also all interactions with all objects with all other objects
ParticleSystem.prototype.update = function(){
        for(var i=0;i<this.sys.length;i++){
        if(this.sys[i].isC1 === true){//only move c1 and c2
            this.sys[i].update1();                      //don't move eggs or meat
        }
        else if(this.sys[i].isC2 === true){
            this.sys[i].update2();    
        }
    }
    this.interactions();
    
};

//display objects in particle system
ParticleSystem.prototype.display = function(){
    for(var i=0; i< this.sys.length; i++){
        this.sys[i].display();  
    }    
};

//let all objects in particle system (ps) loop around canvas if they leave the borders
ParticleSystem.prototype.checkEdges = function(){
    for(var i=0; i< this.sys.length; i++){
        this.sys[i].checkEdges();  
    }       
};

//actually run particle system
ParticleSystem.prototype.run = function(){
    this.update();
    this.checkEdges();
    this.display();
};


//how meat and creature (c1) interact
//c1 follows meat if w/in 50 pixels (r1)
//r2 (25 pixels) is radius where prey runs from predator 
//c1 eats meat if w/in 10 pixels (r3)

//let c1 chase meat
ParticleSystem.prototype.meatAndC1 = function(top,index){ //meat and creature
    if(this.sys[top].isMeat === true && this.sys[index].isC1 === true){
        if(this.sys[top].detect2(this.sys[index],100)){
            this.sys[top].attract(this.sys[index]);    
        }
    } else if(this.sys[top].isC1 === true &&this.sys[index].isMeat === true){
        if(this.sys[index].detect2(this.sys[top],100)){
            this.sys[index].attract(this.sys[top]);    
        }
    }
};

//c1 does not try to do anything with other c1s but they will fight if close enough
ParticleSystem.prototype.c1AndC1 = function(top,index){
    if(this.sys[top].isC1 === true && this.sys[index].isC1 === true){
        this.fight(top,index);    
    }
    
    
};

//c2 chases c1, c1 trys to avoid c2, fight if they are close enoguh
ParticleSystem.prototype.c1AndC2 = function(top,index){
    if(this.sys[top].isC1 === true && this.sys[index].isC2 === true) {
        if(this.sys[top].detect2(this.sys[index],70)){
            this.sys[top].attract(this.sys[index]);
            if(this.sys[top].detect2(this.sys[index],20)){
                this.sys[top].avoid(this.sys[index]); 
                if(this.sys[top].detect2(this.sys[index],10)){
                    this.fight(top,index);    
                }
            }
        }
    } else if(this.sys[index].isC1 === true && this.sys[top].isC2 === true) {
        if(this.sys[index].detect2(this.sys[top],70)){
            this.sys[index].attract(this.sys[top]);
            if(this.sys[index].detect2(this.sys[top],20)){
                this.sys[index].avoid(this.sys[top]);    
                if(this.sys[index].detect2(this.sys[top],10)){
                    this.fight(top,index);    
                }
            }
        }
    }
};


//c2 does not try to do anything to other c2s, but they will fight if close enough
ParticleSystem.prototype.c2AndC2 = function(top,index){
    if(this.sys[top].isC2 === true && this.sys[index].isC2 === true){
        this.fight(top,index);    
    }
    
};

//check if a particle has health below 0, if it does, remove it
ParticleSystem.prototype.destroy = function(index){
    if(this.sys[index].health <= 0){
        this.sys.splice(index,1);    
    }
};

//if c1 or c2 is close nough they will eat meat, level up
//actually how creatures eat meat
ParticleSystem.prototype.eatMeat = function(m,pred){
    if(this.sys[m].detect2(this.sys[pred],15) && this.sys[m].isMeat===true && this.sys[pred].isC1 === true){
        this.sys[pred].level++;
        this.sys[m].health = 0;
        //this.sys.splice(m,1);
    }   else if(this.sys[m].detect2(this.sys[pred],15) && this.sys[m].isMeat===true && this.sys[pred].isC2 === true){
        this.sys[pred].level++;
        this.sys[m].health = 0;
        //this.sys.splice(m,1);
    }
    
};


//if creature is level 2 and isC1 is true, then evolve into c2
ParticleSystem.prototype.evolve = function(index){
    if(this.sys[index].isC1 === true && this.sys[index].level >= 2){
        this.sys.push(new Creature2(this.sys[index].position.get()));
        this.sys.splice(index,1);    
    }
};

//if creature is c2 and at level 4, lay an egg. then reset that c2 to level 2
ParticleSystem.prototype.layEgg = function(index){
    if(this.sys[index].isC2 === true && this.sys[index].level >= 4) {
        this.sys[index].level = 2;
        this.sys.push(new Egg(this.sys[index].position.get()));
    }
};

//after 300 frames, let egg hatch into c1
ParticleSystem.prototype.hatch = function(index){
    if(this.sys[index].isEgg === true){
        this.sys[index].fc++; 
        if(this.sys[index].fc >= 300 && this.sys[index].isEgg ===true){
            this.sys.push(new Creature(this.sys[index].position.get()));
            this.sys.splice(index,1);
        }
    }
    
    
};


/*think that if top is spliced the program crashes. need to remove C1 without refrencing
the array after leaving this function. so maybe put a break to leave for loop? 
*/
//if top is c1 or c2 AND index is c1 or c2, FIGHT!!
ParticleSystem.prototype.fight = function(top,index){
    var r = random(1);//decides which creature hits wich
    //if r<0.5 top hits index
    //else index hits top
    
    if(this.sys[top].detect2(this.sys[index],10)){//if top w/in 10 pixels of index
        if(r < 0.5){
            this.sys[index].health -= this.sys[top].attack;//if index hit lose health
            if(this.sys[index].health <= 0) {//if health of index less than 0
                this.sys[top].level++;    //top levels up
                this.sys[top].health += 20;//regain health of top
            }
        } else {
            this.sys[top].health -= this.sys[index].attack;//top hit
            if(this.sys[top].health <=0) {//if health of top less than 0
                this.sys[index].level++;  //index levels up   
                this.sys[index].health += 20;//index regain health
            }
    } 
    
    
    } else if(this.sys[index].detect2(this.sys[top],10)){//same as above but swithc index
        if(random(0,1) < 0.5) {                          //and top
            this.sys[index].health -= this.sys[top].attack;
            if(this.sys[index].health <= 0) {
                this.sys[top].level++;    
            }
    } else {
        this.sys[top].health -= this.sys[index].attack;
        if(this.sys[top].health <=0) {
            this.sys[index].level++;    
        }
    }     
    }
};



var ps = new ParticleSystem(); //create particle system
ps.populate(10,5,2,1);         //populate w/ 10 m, 5 c1, 2 c2, and 1 e



draw = function() {
    background(255,255,255);
    ps.run();
    
};


