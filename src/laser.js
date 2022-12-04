import * as THREE from 'three';
import { Euler } from 'three';
import { RobotModel } from './robot';

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
        let laserHeight = 100;
        const laserGeo = new THREE.BoxGeometry( 0.25, 0.25, laserHeight );
        const laserMat = new THREE.MeshLambertMaterial( { transparent: true, map: new THREE.TextureLoader().load('../assets/laserTexture.png') } );
        this.mesh = new THREE.Mesh(laserGeo, laserMat);
        Laser.instances.push(this);
        this.mesh.position.x = this.angle.x;
        this.mesh.position.y = this.angle.y;
        this.mesh.position.z = this.angle.z;

        this.mesh.rotateX(this.angle.y); 
        this.mesh.rotateY(-this.angle.x); 

        this.scene.add(this.mesh);
        // this.ray = new THREE.Raycaster();
        // this.ray.far = laserHeight / 2;
        // this.ray.set(new THREE.Vector3(this.x, this.y, this.z), new THREE.Vector3(0, 0, 1).applyEuler(new Euler(this.angle.y, -this.angle.x, 0)).normalize().negate());
        this.rays = [];
        let rayX = -laserGeo.parameters.width
        let rayY = -laserGeo.parameters.height;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                let ray = new THREE.Raycaster();
                ray.far = laserHeight / 2;
                ray.set(new THREE.Vector3(this.x + rayX, this.y + rayY, this.z), new THREE.Vector3(0, 0, 1).applyEuler(new Euler(this.angle.y, -this.angle.x, 0)).normalize().negate());
                this.rays.push(ray);
                // Uncomment the line below for ray debug info
                //this.scene.add(new THREE.ArrowHelper( ray.ray.direction, ray.ray.origin, ray.far, Math.random() * 0xffffff ));
                rayY += laserGeo.parameters.height;
            }
            rayY = -laserGeo.parameters.height;
            rayX += laserGeo.parameters.width;
        }
    }

    animate(){
        this.mesh.material.opacity -= 0.01;
    }

    static animateAll(){
        Laser.instances.forEach(laser => {
            laser.animate();
        });
        
        Laser.instances.forEach(laser => {
            if(laser.mesh.material.opacity <= 0){
                laser.scene.remove(laser.mesh);
            }
        });

        Laser.instances.forEach(laser => {
            RobotModel.instances.forEach(robot => {
                laser.rays.forEach(ray => {
                    let intersect = ray.intersectObject(robot.robotBody).concat(ray.intersectObject(robot.leftHip)).concat(ray.intersectObject(robot.rightHip));
                    if(intersect.length !== 0){
                        robot.selfDestruct();
                    }
                });
            });
        });

        Laser.instances = Laser.instances.filter(laser => {
            return !(laser.mesh.material.opacity <= 0)
        });
    }

}

export { Laser };