import { globals } from "./globals.js";
import * as THREE from 'three';
import { RobotModel } from "./robot.js";

const cannonTexture = new THREE.TextureLoader().load('../assets/cannonTexture.png');

function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function getShaderUniforms(texture){

    return THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], {
        Ka: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        Kd: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        Ks: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        LightIntensity: { value: new THREE.Vector4(0.5, 0.5, 0.5, 1.0) },
        LightPosition: { value: new THREE.Vector4(globals.pointLight.position.x, globals.pointLight.position.y, globals.pointLight.position.z, 1.0) },
        Shininess: { value: 200.0 },
        meshTexture: { value: texture }
      }]);

}

function getGlowShaderUniforms(texture){

    return THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], {
        meshTexture: { value: texture }
    }]);

}

function getCannonShaderUniforms(){

    return THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], {
        Ka: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        Kd: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        Ks: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        LightIntensity: { value: new THREE.Vector4(0.5, 0.5, 0.5, 1.0) },
        LightPosition: { value: new THREE.Vector4(globals.pointLight.position.x, globals.pointLight.position.y, globals.pointLight.position.z, 1.0) },
        Shininess: { value: 200.0 },
        meshTexture: { value: cannonTexture },
        isDead: { value: RobotModel.game_over },
        dt: { value: 0 }
    }]);

}

export { getRandomInRange, getShaderUniforms, getGlowShaderUniforms, getCannonShaderUniforms };