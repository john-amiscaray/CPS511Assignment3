import * as THREE from 'three';
import { getGlowShaderUniforms } from './util.js';
import { getGlowVertexShader, getGlowFragmentShader } from './shaders.js';
import { globals } from './globals.js'

const bulletDelZ = 5;

class Bullet{

    static instances = [];
    static speed = 0.5;
    static texture = new THREE.TextureLoader().load( '../assets/bulletTexture.png' );
    static player_health = 100;

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
        const uniforms = getGlowShaderUniforms(Bullet.texture);
        const bulletMat = new THREE.ShaderMaterial({ 
            uniforms: uniforms,
            vertexShader: getGlowVertexShader(),
            fragmentShader: getGlowFragmentShader(),
            lights: true
        });
        this.mesh = new THREE.Mesh(bulletGeo, bulletMat);
        Bullet.instances.push(this);
        this.mesh.position.set(this.x, this.y, this.z);
        this.scene.add(this.mesh);
        this.pathAxis = new THREE.Vector3(0, 1, 0);
        this.pathAxis = this.pathAxis.applyEuler(new THREE.Euler(0, 0, this.angle)).normalize();
        this.pathAxis.multiplyScalar(Bullet.speed);
        this.mesh.layers.enable(globals.BLOOM_SCENE);
    }

    animate(){
        this.mesh.position.x += this.angle.x;
        this.mesh.position.y += this.angle.y;
        this.mesh.position.z += this.angle.z;
        if (Math.abs(this.mesh.position.x - 0) < 1 && Math.abs(this.mesh.position.y - 0) < 1 && Math.abs(this.mesh.position.z - 0) < 1) {
            Bullet.player_health -= 5;
            console.log("Ow");
        }
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