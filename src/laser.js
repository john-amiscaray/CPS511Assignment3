const bulletDelZ = 5;

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
        const bulletGeo = new THREE.SphereGeometry(this.radius);
        const bulletMat = new THREE.MeshStandardMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(bulletGeo, bulletMat);
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
        Laser.instances.forEach(bullet => {
            bullet.animate();
        });
        Laser.instances.forEach(bullet => {
            if(bullet.mesh.position.z > bulletDelZ){
                bullet.scene.remove(bullet.mesh);
            }
        });
        Laser.instances = Laser.instances.filter(bullet => {
            return !(bullet.mesh.position.z > bulletDelZ)
        });
    }

}

export { Laser };