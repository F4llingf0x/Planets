const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight - 100;

const planets = [];
const velocity = 3;
const gravityFactor = 0.1;

const numberOfPlanets = 22;
const initPlanetDelay = "1000" // 1 sec
const initPlanetMovementDelay = "1250" // 1.25 sec

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
 * @param {Planet} planet1 The first selected planet
 * @param {Planet} planet2 Another selecte planet. (The next one in the Array)
 * @param {number} i The first object's index in the Array
 * @param {number} j The second object's index in the Array
 * @returns Defining the gravity and rules
 */
let gravityForce = (planet1, planet2, i, j) => {
    const xComponent = planet1.x - planet2.x;
    const yComponent = planet1.y - planet2.y;
    const distance = Math.sqrt(Math.pow(xComponent, 2) + Math.pow(yComponent,2));

    if(!(distance <= planet1.radius + planet1.lineWidth + planet2.radius + planet2.lineWidth)) {
        const force = planet1.getPlanetMass() * planet2.getPlanetMass() / (Math.pow(distance,2)) * gravityFactor;
        const forceX = force * xComponent / distance;
        const forceY = force * yComponent / distance;
        return [forceX, forceY];
    } else {
        const newVelocityX = (planet1.getPlanetMass() * planet1.velocityX + planet2.getPlanetMass() * planet2.velocityX) / (planet1.getPlanetMass() + planet2.getPlanetMass());
        const newVelocityY = (planet1.getPlanetMass() * planet1.velocityY + planet2.getPlanetMass() * planet2.velocityY) / (planet1.getPlanetMass() + planet2.getPlanetMass());
        if (planet1.getPlanetMass() > planet2.getPlanetMass()) {
            planet1.addRadius(planet2.radius);
            planet1.setVelocity(newVelocityX, newVelocityY);
            planets.splice(j, 1);
        } else {
            planet2.addRadius(planet1.radius);
            planet2.setVelocity(newVelocityX, newVelocityY);
            planets.splice(i, 1);
        }

    } 
    return [0, 0];
} 

/**
 *  Main physics calculation
 */
let calculateAdditionalForces = () => {
    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            const firstPlanet = planets[i];
            const secondPlanet = planets[j];
            const forces = gravityForce(firstPlanet, secondPlanet, i, j);
            firstPlanet.updateVelocity((forces[0] * -1) / firstPlanet.getPlanetMass(), (forces[1] * -1) / firstPlanet.getPlanetMass());
            secondPlanet.updateVelocity(forces[0] / secondPlanet.getPlanetMass(), forces[1] / secondPlanet.getPlanetMass());
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    setTimeout( () => {
        planets.forEach(planet => {
            planet.draw();
        });
    }, initPlanetDelay)  

    setTimeout(() => {
        planets.forEach(planet => {
            planet.move();
        });
    }, initPlanetMovementDelay)    
    requestAnimationFrame(loop);   
}

loop();
