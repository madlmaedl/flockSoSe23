class Boid { 
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(0.5, 2));
        this.acceleration = createVector();
        this.maxLengthCohesion = 2;
        this.limitCohesion = 0.2;
        this.maxLengthAlgSep = 2.5;
        this.limitAlgSep = 0.25;
    }

    edges(){ 
        if (this.position.x > width+5){
            this.velocity.mult(-1);

        } else if (this.position.x < -5){
            this.velocity.mult(-1);

        }
        if (this.position.y > height+5){
            this.velocity.mult(-1);

        } else if (this.position.y < -5){
            this.velocity.mult(-1);

        }
    }

    avoidEdge(){
        let distanceXRight = width - this.position.x;
        let distanceXLeft = this.position.x;

        let distanceYDown = height - this.position.y;
        let distanceYUp = this.position.y;

        let minimalDistance = min(distanceXRight, distanceXLeft, distanceYDown, distanceYUp);
        let pRadius = 80;

        let change = 15;

        if (minimalDistance < pRadius){
            let corr = createVector();
            if (minimalDistance == distanceXRight){
                corr = createVector(-change, 0);

            } else if (minimalDistance == distanceXLeft){
                corr = createVector(change, 0);

            } else if (minimalDistance == distanceYDown){
                corr = createVector(0, -change);

            } else if (minimalDistance == distanceYUp){
                corr = createVector(0, change);

            }
            corr.div(minimalDistance**1.5);
            corr.limit(2);
            this.acceleration.add(corr);
        }
    }

    avoidPred(){
        if (mouseIsPressed){
            let pRadius = 100;
            stroke(255,0,0); //red stroke
            //stroke(253); white stroke
            push();
            noFill();
            pop();
            circle(mouseX, mouseY, pRadius);
            let pred = createVector(mouseX, mouseY);
            let d = dist(this.position.x, this.position.y, mouseX, mouseY);
            if (d <= pRadius){
                let esc = p5.Vector.sub(this.position, pred);
                esc.div(d);
                esc.limit(0.2);
                esc.mult(3);
                this.acceleration.add(esc);
            }
        }
    }

    align(boids) { //steer towards the average heading of local flockmates
        let pRadius = 80;
        let total = 0;
        let avg = createVector();
        for (let other of boids){
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if ( other != this && d <= pRadius){
                avg.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            avg.div(total);
            avg.setMag(this.maxLengthAlgSep);
            avg.sub(this.velocity);
            avg.limit(this.limitAlgSep);
        }
        return avg;
    }

    separation(boids) { //steer to avoid crowding local flockmates
        let pRadius = 80;
        let total = 0;
        let avg = createVector();
        for (let other of boids){
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if ( other != this && d <= pRadius){
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d**2);
                avg.add(diff);
                total++;
            }
        }
        if (total > 0) {
            avg.setMag(this.maxLengthAlgSep);
            avg.sub(this.velocity);
            avg.limit(this.limitAlgSep);
        }
        return avg;
    }

    cohesion(boids) { //steer to move toward the average position of local flockmates
        let pRadius = 80;
        let total = 0;
        let avg = createVector(); 
        for (let other of boids){
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if ( other != this && d <= pRadius){
                avg.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            avg.div(total);
            avg.sub(this.position);
            avg.setMag(this.maxLengthCohesion);
            avg.sub(this.velocity);
            avg.limit(this.limitCohesion);
        }
        return avg;
    }

    chaos(boids) {
        let factor = 100/boids.length;

        this.maxLengthCohesion = factor*3 - 1;

        this.maxLengthAlgSep = factor*4 - 2;
    }

    flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
        this.acceleration.add(separation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
    }

    show(boids) {
        //random fill, white fill, black fill
            //fill(random(0,140),0,random(40,255));
            //fill(253);
            //fill(3);

        //no stroke, red stroke
            //noStroke();
            //stroke(255,0,0);

        //original colours
        fill(254);
        stroke(60, 64, 189);
        //stroke(2, 0, b);

        //blue, white colours switched
            //fill(60, 64, 189);
            //stroke(254)

        //different radius
        let amount = boids.length/2;
        //circle(this.position.x, this.position.y, 15);
        circle(this.position.x, this.position.y, amount);

        // if (shape == 'circle') {
        //     circle(this.position.x, this.position.y, amount);
        // } else if (shape == 'rect') {
        //     rect(this.position.x, this.position.y, amount, amount);
        // }
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.acceleration.mult(0);
    }
}