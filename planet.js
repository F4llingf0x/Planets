class Planet {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = Math.random() * velocity - velocity / 2;
        this.velocityY = Math.random() * velocity - velocity / 2;
        this.lineWidth = this.radius;
        this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    move() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        if (this.x <= this.radius + this.lineWidth || this.x >= canvas.width - this.radius + this.lineWidth) {
            this.velocityX *= -1;
        }
        if (this.y <= this.radius + this.lineWidth || this.y >= canvas.height - this.radius + this.lineWidth) {
            this.velocityY *= -1;
        }
    }

    updateVelocity(xComponent, yComponent) {
        this.velocityX += xComponent;
        this.velocityY += yComponent;
    }

    /** Deprecated */
    // setRadius(radius) {
    //     this.radius = radius;
    // }
    addRadius(intersect) {
        return Math.sqrt(Math.pow(this.radius, 2) + Math.pow(intersect.radius, 2));
    }

    setVelocity(velocityX, velocityY) {
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    getPlanetMass() {
        return Math.pow(this.radius, 2) * Math.PI;
    }
}