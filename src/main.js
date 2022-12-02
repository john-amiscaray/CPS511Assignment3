import { RobotModel } from "./robot.js";
import { getRandomInRange } from "./util.js";
import { Bullet } from "./bullet.js";
import { Laser } from "./laser.js";
//import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import * as THREE from 'three';

const KEYS = {
  'a': 65,
  's': 83,
  'w': 87,
  'd': 68,
};
  
function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b);
}

/*
function throwBall() {
  const sphere = spheres[ sphereIdx ];

  camera.getWorldDirection( playerDirection );
  sphere.collider.center.copy( playerCollider.end ).addScaledVector( playerDirection, playerCollider.radius * 1.5 );

  // throw the ball with more force if we hold the button longer, and if we move forward
  const impulse = 15 + 30 * ( 1 - Math.exp( ( mouseTime - performance.now() ) * 0.001 ) );
  sphere.velocity.copy( playerDirection ).multiplyScalar( impulse );
  sphere.velocity.addScaledVector( playerVelocity, 2 );
  sphereIdx = ( sphereIdx + 1 ) % spheres.length;


  shootAnimation(){
      this.bulletFiringControl += 1;
      if(this.bulletFiringControl % 50 === 0){
          let self = this;
          let Euler = this.robotBody.rotation;
          let bullet = new Bullet({ 
              radius: self.cannonBarrelRad, Laser
              scene: self.scene, 
              color: 0xFF0000, 
              x: this.robotBody.position.x, 
              y: this.robotBody.position.y,
              z: this.robotBody.position.z,
              angle: Euler.y
          });
          bullet.draw();
      }
  }
}*/

function shootLaser() {
  let playerDirection = new THREE.Vector3();
  camera.getWorldDirection( playerDirection );
  let Euler_ = new THREE.Euler( 0, 0, 0, 'XYZ' );
  Euler_.setFromVector3(playerDirection);
  let laser = new Laser({ 
    radius: 0.25, 
    scene: scene, 
    color: 0x00FF00, 
    x: camera.position.x, 
    y: camera.position.y,
    z: camera.position.z,
    angle: Euler_
  });
  laser.draw();
  console.log("LASER");
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
          console.log("leftButton down");
          shootLaser();

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
  
        //console.log("this.current_.mouseX: " + this.current_.mouseX)
        //console.log("this.current_.mouseY: " + this.current_.mouseY)
  
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
      //this.camera_.position.y += Math.sin(this.headBobTimer_ * 10) * 1.5;
  
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
      const forwardVelocity = (this.input_.key(KEYS.w) ? 1 : 0) + (this.input_.key(KEYS.s) ? -1 : 0)
      const strafeVelocity = (this.input_.key(KEYS.a) ? 1 : 0) + (this.input_.key(KEYS.d) ? -1 : 0)
  
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

const renderer = new THREE.WebGLRenderer();

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,7,-5);

const lightHelper = new THREE.PointLightHelper(pointLight);
const sunLight = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.5);

scene.add(lightHelper);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;
camera.position.y = 1.5;

scene.add(pointLight, sunLight);

function robotSpawn(){
    let rand = getRandomInRange(-10, 10);
    let robot = new RobotModel(rand, 0, -50, scene);
    robot.draw();
}

function animate(){
    requestAnimationFrame(animate);
    RobotModel.animateAll(scene);
    Bullet.animateAll();
    Laser.animateAll();
    renderer.render(scene, camera);
}

animate();
setInterval(robotSpawn, 1500);
robotSpawn();

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new FirstPersonCameraController();
});