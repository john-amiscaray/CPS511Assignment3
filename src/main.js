import { RobotModel } from "./robot.js";
import { getRandomInRange } from "./util.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,7,-5);

const lightHelper = new THREE.PointLightHelper(pointLight);
const sunLight = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.5);
const robotDelZ = 5;

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

function robotStepAnimate(){
    RobotModel.robotList.forEach(robot => {
        robot.stepAnimation();
    });
}

function moveRobotsForward(){
    RobotModel.robotList.forEach(robot => {
        if(robot.robotBody.position.z > robotDelZ){
            scene.remove(robot.robotBody);
        }
    });
    RobotModel.robotList = RobotModel.robotList
    .filter(robot => { 
        return !(robot.robotBody.position.z > robotDelZ) 
    });

    RobotModel.robotList.forEach(robot => {
        robot.robotBody.position.z += 0.1;
    });
}

function animate(){
    requestAnimationFrame(animate);
    moveRobotsForward();
    robotStepAnimate();
    renderer.render(scene, camera);
}

animate();
setInterval(robotSpawn, 1500);
//robotSpawn();