import { RobotModel } from "./robot.js";
import { getRandomInRange } from "./util.js";
import { Bullet } from "./bullet.js";


class InputController {
    contructor() {
        this.initialize_();
    }

    initialize_(){
        this.current_ = {
            leftButton: false,
            mouseX: 0,
            mouseY: 0
        };
        this.pervious_ = null;
        document.addEventListener('mousedown', (e) => this.onMouseDown_(e), false);
        document.addEventListener('mouseup', (e) => this.onMouseDown_(e), false);
    }
    onMouseDown_(e) {
        switch(e.button) {
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
        switch(e.button) {
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
    onMouseMove_(e) {
        this.current_.mouseX = e.pageX - window.innerWidth / 2;
        this.current_.mouseY = e.pageY - window.innerWidth / 2;

        if (this.previous_ === null) {
            this.previous_ = {...this.current_};
        }

        this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
        this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
    }

    update() {
        //pass
    }
}

class FirstPersonCamera {
    constructor(camera, objects) {
        this.camera_ = camera;
        this.input_ = new InputController();
        this.rotation_ = new THREE.Quaternion();
        this.translation_ = new THREE.Vector3(0, 2, 0);
        this.phi_ = 0;
        this.phiSpeed_ = 8;
        this.theta_ = 0;
        this.thetaSpeed_ = 5;
        this.headBobActive_ = false;
        this.headBobTimer_ = 0;
        this.objects_ = objects;
    }

    update(timeElapsedS) {
        this.updateRotation_(timeElapsedS);
        this.updateCamera_(timeElapsedS);
        this.updateTranslation_(timeElapsedS);
        this.updateHeadBob_(timeElapsedS);
        this.input_.update(timeElapsedS);
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

class FirstPersonCameraDemo {
    constructor() {
      this.initialize_();
    }
  
    initialize_() {
      this.initializeRenderer_();
      this.initializeLights_();
      this.initializeScene_();
      this.initializePostFX_();
      this.initializeDemo_();
  
      this.previousRAF_ = null;
      this.raf_();
      this.onWindowResize_();
    }
  
    initializeDemo_() {
      this.fpsCamera_ = new FirstPersonCamera(this.camera_, this.objects_);
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
    renderer.render(scene, camera);
}

animate();
setInterval(robotSpawn, 1500);
robotSpawn();

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new FirstPersonCameraDemo();
});