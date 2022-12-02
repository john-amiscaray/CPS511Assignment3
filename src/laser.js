const laserDelZ = -50;

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
        const laserGeo = new THREE.SphereGeometry(this.radius);
        const laserMat = new THREE.MeshStandardMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(laserGeo, laserMat);
        Laser.instances.push(this);
        this.mesh.position.set(this.x, this.y, this.z);
        this.scene.add(this.mesh);
        this.pathAxis = new THREE.Vector3(0, 1, 0);
        this.pathAxis = this.pathAxis.applyEuler(new THREE.Euler(0, 0, this.angle)).normalize();
        this.pathAxis.multiplyScalar(Laser.speed);
    }

    animate(){
        this.mesh.position.x += this.angle.x;
        this.mesh.position.y += this.angle.y;
        this.mesh.position.z += this.angle.z;
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