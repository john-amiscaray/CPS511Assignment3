const laserDelZ = -100;

class Laser{

    static instances = [];
    static speed = 0.5;

    constructor({radius, scene, color, x, y, z, angle}){
        this.radius = radius;
        this.scene = scene;
        this.color = color;
        this.x = x;
        this.y = y;
        this.z = z;
        this.angle = angle;
    }

    draw(){
        //const laserGeo = new THREE.SphereGeometry(this.radius);
        let laserHeight = 100;
        //const laserGeo = new THREE.CylinderGeometry( 1, 1, laserHeight, 6 );
        const laserGeo = new THREE.BoxGeometry( 0.25, 0.25, laserHeight );
        //const laserMat = new THREE.MeshStandardMaterial({ color: this.color });
        const laserMat = new THREE.MeshLambertMaterial( { color: this.color, transparent: true } );
        this.mesh = new THREE.Mesh(laserGeo, laserMat);
        Laser.instances.push(this);
        this.mesh.position.set(this.x, this.y, this.z);

        // BoxGeometry rotation
        // Requires limitation of player's cannon rotation 
        /*
        console.log("rotateX: " + (this.angle.y * (180/Math.PI)));
        let rotateX = this.angle.y;
        if (this.angle.y > (15*Math.PI/180) && this.angle.y < (30*Math.PI/180)) {
            rotateX = rotateX*1.05;
        } else if (this.angle.y >= (30*Math.PI/180)) {
            rotateX = rotateX*1.075;
        }*/

        this.mesh.rotateX(this.angle.y); //up down ; this.angle.y * 1.05
        this.mesh.rotateY(-this.angle.x); // left right ; -this.angle.x * 1.055
        //this.mesh.rotateZ(this.angle.z); //yaw

        this.scene.add(this.mesh);
        //this.pathAxis = new THREE.Vector3(0, 1, 0);
        //this.pathAxis = this.pathAxis.applyEuler(new THREE.Euler(0, 0, this.angle)).normalize();
        //this.pathAxis.multiplyScalar(Laser.speed);
    }

    animate(){
        this.mesh.position.x = this.angle.x;
        this.mesh.position.y = this.angle.y;
        this.mesh.position.z = this.angle.z;
        this.mesh.material.opacity -= 0.01;
    }

    static animateAll(){
        Laser.instances.forEach(laser => {
            laser.animate();
        });
        
        Laser.instances.forEach(laser => {
            if(laser.mesh.position.z < laserDelZ){
                laser.scene.remove(laser.mesh);
            }
        });
        Laser.instances = Laser.instances.filter(laser => {
            return !(laser.mesh.position.z < laserDelZ)
        });
    }

}

export { Laser };