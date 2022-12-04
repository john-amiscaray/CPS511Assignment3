import * as THREE from 'three';
import { getShaderUniforms } from './util.js';
import { getVertexShader, getFragmentShader } from './shaders.js';

const bulletDelZ = 5;

class Bullet{

    static instances = [];
    static speed = 0.5;
    static texture = new THREE.TextureLoader().load( '../assets/bulletTexture.png' );
    
    constructor({radius, scene, x, y, z, angle}){
        this.radius = radius;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.z = z;
        this.angle = angle;
    }

    draw(){
        const bulletGeo = new THREE.SphereGeometry(this.radius);
        const uniforms = getShaderUniforms(Bullet.texture);
        const bulletMat = new THREE.ShaderMaterial({ 
            uniforms: uniforms,
            vertexShader: getVertexShader(),
            fragmentShader: getFragmentShader(),
            lights: true
        });
        this.mesh = new THREE.Mesh(bulletGeo, bulletMat);
        Bullet.instances.push(this);
        this.mesh.position.set(this.x, this.y, this.z);
        this.scene.add(this.mesh);
        this.pathAxis = new THREE.Vector3(0, 1, 0);
        this.pathAxis = this.pathAxis.applyEuler(new THREE.Euler(0, 0, this.angle)).normalize();
        this.pathAxis.multiplyScalar(Bullet.speed);
    }

    animate(){
        this.mesh.position.x += this.angle.x;
        this.mesh.position.y += this.angle.y;
        this.mesh.position.z += this.angle.z;
    }

    static animateAll(){
        Bullet.instances.forEach(bullet => {
            bullet.animate();
        });
        Bullet.instances.forEach(bullet => {
            if(bullet.mesh.position.z > bulletDelZ){
                bullet.scene.remove(bullet.mesh);
            }
        });
        Bullet.instances = Bullet.instances.filter(bullet => {
            return !(bullet.mesh.position.z > bulletDelZ)
        });
    }

}

export { Bullet };