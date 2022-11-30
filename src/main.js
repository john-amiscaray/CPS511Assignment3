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
    }

    update() {
        //pass
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