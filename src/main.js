import { RobotModel } from "./robot.js";
import { getRandomInRange } from "./util.js";
import { Bullet } from "./bullet.js";
import { Laser } from "./laser.js";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { getCannonFragmentShader, getCannonVertexShader } from "./shaders.js";
import { globals } from "./globals.js";
import { getCannonShaderUniforms } from "./util.js";
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { Moon } from './moon.js';

let current_robots = RobotModel.instances.length; 

const KEYS = {
  'a': 65,
  's': 83,
  'w': 87,
  'd': 68,
  'spacebar': 32,
  'r': 82
};

const bloomLayer = new THREE.Layers();
bloomLayer.set( globals.BLOOM_SCENE );

const params = {
  exposure: 1,
  bloomStrength: 5,
  bloomThreshold: 0,
  bloomRadius: 0,
  scene: 'Scene with Glow'
};
  
function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b);
}

function shootLaser() {
  let playerDirection = new THREE.Vector3();
  camera.getWorldDirection( playerDirection );
  let Euler_ = new THREE.Euler( 0, 0, 0, 'XYZ' );
  Euler_.setFromVector3(playerDirection);
  let laser = new Laser({ 
    radius: 0.25, 
    scene: scene, 
    color: 0x00FF00, 
    x: cannon.position.x, 
    y: cannon.position.y,
    z: cannon.position.z,
    angle: Euler_
  });
  laser.draw();
}

class InputController {
  constructor(target) {
    this.target_ = target || document;
    this.initialize_();    
  }
  
    initialize_() {
      this.current_ = {
        leftButton: false,
        rightButton: false,
        mouseXDelta: 0,
        mouseYDelta: 0,
        mouseX: 0,
        mouseY: 0,
      };
      this.previous_ = null;
      this.keys_ = {};
      this.previousKeys_ = {};
      this.target_.addEventListener('mousedown', (e) => this.onMouseDown_(e), false);
      this.target_.addEventListener('mousemove', (e) => this.onMouseMove_(e), false);
      this.target_.addEventListener('mouseup', (e) => this.onMouseUp_(e), false);
      this.target_.addEventListener('keydown', (e) => this.onKeyDown_(e), false);
      this.target_.addEventListener('keyup', (e) => this.onKeyUp_(e), false);
    }
  
    onMouseMove_(e) {
      this.current_.mouseX = e.pageX - window.innerWidth / 2;
      this.current_.mouseY = e.pageY - window.innerHeight / 2;
  
      if (this.previous_ === null) {
        this.previous_ = {...this.current_};
      }
  
      this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
      this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
    }
  
    onMouseDown_(e) {
      this.onMouseMove_(e);
  
      switch (e.button) {
        case 0: {
          this.current_.leftButton = true;
          break;
        }
        case 2: {
          this.current_.rightButton = true;
          break;
        }
      }
    }
  
    onMouseUp_(e) {
      this.onMouseMove_(e);
  
      switch (e.button) {
        case 0: {
          this.current_.leftButton = false;
          break;
        }
        case 2: {
          this.current_.rightButton = false;
          break;
        }
      }
    }
  
    onKeyDown_(e) {
      this.keys_[e.keyCode] = true;
      if (e.keyCode == KEYS['r']){
        console.log ("Restart level");
        restartLevel();
      }
      if (e.keyCode == KEYS['spacebar']){
        shootLaser();
      }
    }
  
    onKeyUp_(e) {
      this.keys_[e.keyCode] = false;
    }
  
    key(keyCode) {
      return !!this.keys_[keyCode];
    }
  
    isReady() {
      return this.previous_ !== null;
    }
  
    update(_) {
      if (this.previous_ !== null) {
        this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
        this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
        this.previous_ = {...this.current_};
      }
    }
};

class FirstPersonCamera {
    constructor(camera) {
      this.camera_ = camera;
      this.input_ = new InputController();
      this.rotation_ = new THREE.Quaternion();
      this.translation_ = new THREE.Vector3(0, 2, 0);
      this.phi_ = 0;
      this.phiSpeed_ = 8;
      this.theta_ = 0;
      this.thetaSpeed_ = 5;
    }
  
    update(timeElapsedS) {
      this.updateRotation_(timeElapsedS);
      this.updateCamera_(timeElapsedS);
      this.updateTranslation_(timeElapsedS);
      this.input_.update(timeElapsedS);
    }
  
    updateCamera_(_) {
      this.camera_.quaternion.copy(this.rotation_);
      this.camera_.position.copy(this.translation_);  
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(this.rotation_);
  
      const dir = forward.clone();
  
      forward.multiplyScalar(100);
      forward.add(this.translation_);
  
      let closest = forward;
      const result = new THREE.Vector3();
      const ray = new THREE.Ray(this.translation_, dir);
      this.camera_.lookAt(closest);
    }
  
    updateTranslation_(timeElapsedS) {
      const forwardVelocity = 0; //(this.input_.key(KEYS.w) ? 1 : 0) + (this.input_.key(KEYS.s) ? -1 : 0);
      const strafeVelocity = 0; //(this.input_.key(KEYS.a) ? 1 : 0) + (this.input_.key(KEYS.d) ? -1 : 0);
  
      const qx = new THREE.Quaternion();
      qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
  
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(qx);
      forward.multiplyScalar(forwardVelocity * timeElapsedS * 10);
  
      const left = new THREE.Vector3(-1, 0, 0);
      left.applyQuaternion(qx);
      left.multiplyScalar(strafeVelocity * timeElapsedS * 10);
  
      this.translation_.add(forward);
      this.translation_.add(left);
    }
  
    updateRotation_(timeElapsedS) {
      const xh = this.input_.current_.mouseXDelta / window.innerWidth;
      const yh = this.input_.current_.mouseYDelta / window.innerHeight;
  
      this.phi_ += -xh * this.phiSpeed_;
      this.theta_ = clamp(this.theta_ + -yh * this.thetaSpeed_, -Math.PI / 3, Math.PI / 3);
  
      const qx = new THREE.Quaternion();
      qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
      const qz = new THREE.Quaternion();
      qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta_);
  
      const q = new THREE.Quaternion();
      q.multiply(qx);
      q.multiply(qz);

      if(!isNaN(this.theta_) && cannon && this.theta_ != this.last_theta_){
        cannon.rotation.x = cannonRotXInit + this.theta_;
        cannon.rotation.z = this.phi_;
      }
  
      this.rotation_.copy(q);
    }
  }

class FirstPersonCameraController {
    constructor() {
      this.initialize_();
    }
  
    initialize_() {
      this.initializeRenderer_();
      this.run_();
      this.previousRAF_ = null;
      this.raf_();
      this.onWindowResize_();
    }
  
    run_() {
      this.fpsCamera_ = new FirstPersonCamera(camera, this.objects_);
    }

    initializeRenderer_() {
    
        this.threejs_ = new THREE.WebGLRenderer({
          antialias: false,
        });
        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 1000.0;
        this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera_.position.set(0, 2, 0);
        this.scene_ = new THREE.Scene();
        this.uiCamera_ = new THREE.OrthographicCamera(
            -1, 1, 1 * aspect, -1 * aspect, 1, 1000);
        this.uiScene_ = new THREE.Scene();
    }

    
  onWindowResize_() {
    this.camera_.aspect = window.innerWidth / window.innerHeight;
    this.camera_.updateProjectionMatrix();
    this.uiCamera_.left = -this.camera_.aspect;
    this.uiCamera_.right = this.camera_.aspect;
    this.uiCamera_.updateProjectionMatrix();
    this.threejs_.setSize(window.innerWidth, window.innerHeight);
  }

  raf_() {
    requestAnimationFrame((t) => {
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      }

      this.step_(t - this.previousRAF_);
      this.threejs_.autoClear = true;
      this.threejs_.render(this.scene_, this.camera_);
      this.threejs_.autoClear = false;
      this.threejs_.render(this.uiScene_, this.uiCamera_);
      this.previousRAF_ = t;
      this.raf_();
    });
  }

    step_(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;
        this.fpsCamera_.update(timeElapsedS);
      }
  }


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const clock = new THREE.Clock();
const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});

const bloomComposer = new EffectComposer( renderer );
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,7,-5);

const sunLight = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.5);
const moon = new Moon({x: pointLight.position.x, y: pointLight.position.y, z: pointLight.position.z, radius: 2, scene: scene});
moon.draw();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;
camera.position.y = 1.5;
camera.layers.set( globals.BLOOM_SCENE );
camera.layers.set( globals.ENTIRE_SCENE );
globals.playerPosition = camera.position;

scene.add(pointLight, sunLight);
globals.pointLight = pointLight;

function robotSpawn(){
    let rand = getRandomInRange(-20, 20);
    let robot = new RobotModel(rand, 0, -50, scene);
    robot.draw();
}

function animate(){
    requestAnimationFrame(animate);

    cannonUniform.dt.value = clock.getElapsedTime();
    cannonUniform.isDead.value = globals.gameOver;
    console.log(cannonUniform.isDead.value)
    renderer.autoClear = false;
    renderer.clear();

    RobotModel.animateAll(scene);
    Bullet.animateAll();
    Laser.animateAll();

    camera.layers.set(globals.BLOOM_SCENE);
    bloomComposer.render();

    camera.layers.set(globals.ENTIRE_SCENE);
    renderer.clearDepth();
    renderer.render(scene, camera);
    current_robots = RobotModel.instances.length;
    document.getElementById('level_score').innerHTML = "Level Score: " + RobotModel.level_score; 
    document.getElementById('player_health').innerHTML = "Player Health: " + globals.playerHealth; 
    if (RobotModel.current_level < 3){
      document.getElementById('current_level').innerHTML = "Current Level: " + RobotModel.current_level; 
      if (RobotModel.level_complete){
        let previous_level = (RobotModel.current_level)-1
        document.getElementById('message').innerHTML = "Level " + previous_level + " completed. Standby 5 seconds for next level."; 
        console.log("main.js LEVEL " + RobotModel.current_level + " COMPLETED");
        RobotModel.level_complete = false;
        console.log("Standby, 5 seconds out.");
        setTimeout(() => { loadLevel(); }, 5000);
      }
    }
    if (RobotModel.current_level == 3){
      console.log("GAME OVER: YOU'VE WON!!!"); 
      document.getElementById('message').innerHTML = "GAME OVER: YOU'VE WON!!! Press 'r' to restart to level 0."; 
    }
    if (globals.gameOver){
      document.getElementById('message').innerHTML = "GAME OVER: A ROBOT LEAKED THROUGH! Press 'r' to restart the level.";
    }
    if (globals.playerHealth <= 0){
      globals.gameOver = true;
      document.getElementById('message').innerHTML = "GAME OVER: YOU LOST ALL YOUR HEALTH! Press 'r' to restart the level.";
    }
}

function loadLevel(){
  console.log("Level " + RobotModel.current_level + " start.")
  document.getElementById('message').innerHTML = "Level " + RobotModel.current_level + " start."; 
  if (current_robots == 0) {
    for (let i = 0; i < RobotModel.level_details[RobotModel.current_level].robots; i++){
      robotSpawn();
    }
  }
  current_robots = RobotModel.instances.length;
}

function restartLevel(){
  if (RobotModel.current_level == 3){
    RobotModel.current_level = 0;
  }   
  console.log("Level " + RobotModel.current_level + " restart.")
  RobotModel.instances.forEach(robot => {
    robot.selfDestruct();
  });
  current_robots = RobotModel.instances.length;
  RobotModel.level_complete = false;
  globals.gameOver = false;
  globals.playerHealth = 100;
  console.log("Standby, 3 seconds out.");
  document.getElementById('message').innerHTML = "Level " + RobotModel.current_level + " restart. Standby, 3 seconds.";
  setTimeout(() => { loadLevel(); }, 3000);
}

let objLoader = new OBJLoader();
let cannon, cannonRotZ = Math.PI / 2, cannonRotXInit = -cannonRotZ;

const cannonUniform = getCannonShaderUniforms();

objLoader.load('../assets/cannon.obj', mesh => {

  mesh.position.y = 1;
  cannon = mesh;
  cannon.traverse(child => {
    if(child.isMesh){
      child.material = new THREE.ShaderMaterial({ 
        uniforms: cannonUniform,
        vertexShader: getCannonVertexShader(),
        fragmentShader: getCannonFragmentShader(),
        lights: true
      });
    }
  });
  scene.add(cannon);
  
});

console.log("Game start.")
loadLevel();
animate();


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new FirstPersonCameraController();
});