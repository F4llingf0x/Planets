
const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight - 100;

const planets = [];
const velocity = 5;
const gravityFactor = 1.1;

const numberOfPlanets = 2;

/**
 * Init Planets
 */
for (let i = 0; i < numberOfPlanets; i++) {
    const canvasX = (canvas.width / 2);
    const canvasY = (canvas.height / 2);

    const r = Math.random() * 10 + 5;
    const x = Math.round(canvasX * Math.random() + r);
    const y = Math.round(canvasY * Math.random() + r);

    const planet = new Planet(x, y, r);
    planets.push(planet);
}

/**
 * 
 * @param {Planet} planet 
 * @returns Return with the planet mass
 */
let planetMass = (planet) => {
    return Math.pow(planet.radius, 2) * Math.PI; 
}
/**
 * 
 * @param {number} radius1 
 * @param {number} radius2 
 * @returns Return a new radius based on 2 planets
 */
let addRadius = (radius1, radius2) => {
   return Math.sqrt(radius1 * radius1 + radius2 * radius2);
}

/**
 * 
 * @param {Planet} planet1 
 * @param {Planet} planet2 
 * @param {number} i 
 * @param {number} j 
 * @returns 
 */
let gravityForce = (planet1, planet2, i, j) => {
    const xComponent = planet1.x - planet2.x;
    const yComponent = planet1.y - planet2.y;
    const distance = Math.sqrt(xComponent * xComponent + yComponent * yComponent);

    if(!(distance <= planet1.radius + planet1.lineWidth + planet2.radius + planet2.lineWidth)){
    const force = planetMass(planet1) * planetMass(planet2) / (distance * distance) * gravityFactor;
    const forceX = force * xComponent / distance;
    const forceY = force * yComponent / distance;
    return [forceX, forceY];
    } else {
        const newVelocityX = (planetMass(planet1) * planet1.velocityX + planetMass(planet2) * planet2.velocityX) / 
        (planetMass(planet1) + planetMass(planet2));
        const newVelocityY = (planetMass(planet1) * planet1.velocityY + planetMass(planet2) * planet2.velocityY) / 
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


const loop = () => {
    explode();
    calculateAdditionalForces();
    planets.forEach(planet => {
        planet.draw();
        planet.move();
        // ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    });
    requestAnimationFrame(loop);
}

loop();