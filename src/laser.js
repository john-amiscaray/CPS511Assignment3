import * as THREE from 'three';
import { Euler, Vector3 } from 'three';
import { RobotModel } from './robot';

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
        const laserSize = new THREE.Vector3(0.25, 0.25, laserHeight);
        const laserGeo = new THREE.BoxGeometry( 0.25, 0.25, laserHeight );
        //const laserMat = new THREE.MeshStandardMaterial({ color: this.color });
        const laserMat = new THREE.MeshLambertMaterial( { color: this.color, transparent: true } );
        this.mesh = new THREE.Mesh(laserGeo, laserMat);
        Laser.instances.push(this);
        this.mesh.position.x = this.angle.x;
        this.mesh.position.y = this.angle.y;
        this.mesh.position.z = this.angle.z;
        // BoxGeometry rotation
        // Requires limitation of player's cannon rotation 
        /*dsd
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
        this.ray = new THREE.Raycaster();
        this.ray.far = laserHeight / 2;
        this.ray.set(new THREE.Vector3(this.x, this.y, this.z), new THREE.Vector3(0, 0, 1).applyEuler(new Euler(this.angle.y, -this.angle.x, 0)).normalize().negate());
        //this.scene.add(new THREE.ArrowHelper( this.ray.ray.direction, this.ray.ray.origin, this.ray.far, Math.random() * 0xffffff ));
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
                laser.scene.remove(laser.boxHelper);
            }
        });

        Laser.instances.forEach(laser => {
            RobotModel.instances.forEach(robot => {
                let intersect = laser.ray.intersectObject(robot.robotBody);
                if(intersect.length !== 0){
                    robot.selfDestruct();
                }
            });
        });

        Laser.instances = Laser.instances.filter(laser => {
            return !(laser.mesh.material.opacity <= 0)
        });
    }

}

export { Laser };