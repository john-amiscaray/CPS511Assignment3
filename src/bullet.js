class Bullet{

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
        Bullet.instances.push(this);
        this.mesh.position.set(this.x, this.y, this.z);
        this.scene.add(this.mesh);
        this.pathAxis = new THREE.Vector3(0, 1, 0);
        this.pathAxis = this.pathAxis.applyEuler(new THREE.Euler(0, 0, this.angle)).normalize();
        this.pathAxis.multiplyScalar(Bullet.speed);
    }

    animate(){
        this.mesh.position.x += this.pathAxis.x;
        this.mesh.position.z += Bullet.speed;
    }

    static animateAll(){
        Bullet.instances.forEach(bullet => {
            bullet.animate();
        });
    }

}

export { Bullet };