import * as THREE from 'three';
import { getGlowVertexShader, getGlowFragmentShader } from './shaders.js';
import { getGlowShaderUniforms } from './util.js';
import { globals } from './globals.js';

class Moon {

    static texture = new THREE.TextureLoader().load('../assets/moonTexture.jpg');
    static rotationTheta = Math.PI / 2048;

    constructor({x, y, z, radius, scene}){

        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.scene = scene;

    }

    draw(){

        const geo = new THREE.SphereGeometry(this.radius);
        const uniforms = getGlowShaderUniforms(Moon.texture);
        const mat = new THREE.ShaderMaterial({ 
            uniforms: uniforms,
            vertexShader: getGlowVertexShader(),
            fragmentShader: getGlowFragmentShader(),
            lights: true
          });
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.position.x = this.x;
        this.mesh.position.y = this.y;
        this.mesh.position.z = this.z;
        this.mesh.layers.enable(globals.BLOOM_SCENE);
        this.scene.add(this.mesh);

    }

    animate(){

        this.mesh.rotateY(Moon.rotationTheta);

    }

}

export { Moon };