const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const planets = [];
const velocity = 3;
const gravityFactor = 0.1;


class Planet {
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = Math.random() * velocity - velocity / 2;
        this.velocityY = Math.random() * velocity - velocity / 2;
        this.lineWidth = this.radius / 5;
        this.color = '#' + Math.floor(Math.random()*16777215).toString(16);
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.stroke();
    }

    move(){
        this.x += this.velocityX;
        this.y += this.velocityY;
        if (this.x <= this.radius + this.lineWidth || this.x >= canvas.width - this.radius + this.lineWidth){
            this.velocityX *= -1;
        }
        if (this.y <= this.radius + this.lineWidth || this.y >= canvas.height - this.radius + this.lineWidth){
            this.velocityY *= -1;
        }
    }
    
    updateVelocity(xComponent, yComponent){
        this.velocityX += xComponent;
        this.velocityY += yComponent;
    }
    
    setRadius(radius){
        this.radius = radius;
    }

    setVelocity(velocityX, velocityY){
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

}

for (let i = 0; i < 15; i++) {
    planets.push(
        new Planet(Math.random() * canvas.width, 
        Math.random() * canvas.height,
        Math.random() * 20 + 1
     ));
}


let planetMass = (planet) => {
    return planet.radius * planet.radius * Math.PI; 
}

let addRadius = (radius1, radius2) => {
   return Math.sqrt(radius1 * radius1 + radius2 * radius2);
}


let gravityForce = (planet1, planet2, i, j) => {
    let xComponent = planet1.x - planet2.x;
    let yComponent = planet1.y - planet2.y;
    let distance = Math.sqrt(xComponent * xComponent + yComponent * yComponent);

    if(!(distance <= planet1.radius + planet1.lineWidth + planet2.radius + planet2.lineWidth)){
    let force = planetMass(planet1) * planetMass(planet2) / (distance * distance) * gravityFactor;
    let forceX = force * xComponent / distance;
    let forceY = force * yComponent / distance;
    return [forceX, forceY];
    } else {
        let newVelocityX = (planetMass(planet1) * planet1.velocityX + planetMass(planet2) * planet2.velocityX) / 
        (planetMass(planet1) + planetMass(planet2));
        let newVelocityY = (planetMass(planet1) * planet1.velocityY + planetMass(planet2) * planet2.velocityY) / 
        (planetMass(planet1) + planetMass(planet2));
        const newRadius = addRadius(planet1.radius, planet2.radius);
        if (planetMass(planet1) > planetMass(planet2)){
            planet1.setRadius(newRadius);
            planet1.setVelocity(newVelocityX, newVelocityY);
            planets.splice(j, 1);
        } else {
            planet2.setRadius(newRadius);
            planet2.setVelocity(newVelocityX, newVelocityY);
            planets.splice(i, 1);
        }

    } 
    return [0, 0];
} 


let calculateAdditionalForces = () => {
    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            let firstPlanet = planets[i];
            let secondPlanet = planets[j];
            let forces = gravityForce(firstPlanet, secondPlanet, i, j);
            firstPlanet.updateVelocity((forces[0] * -1) / planetMass(firstPlanet), (forces[1] * -1) / planetMass(firstPlanet));
            secondPlanet.updateVelocity(forces[0] / planetMass(secondPlanet), forces[1] / planetMass(secondPlanet));
            
        }
        
    }
}

let explode = () => {
    if (planets.length == 1){
        //TODO
    }
}


const animate = () => {
    explode();
    calculateAdditionalForces();
    planets.forEach(planet => {
        planet.draw();
        planet.move();
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.restore();
    });
    requestAnimationFrame(animate);
}

animate();
