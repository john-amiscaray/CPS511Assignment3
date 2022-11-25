import { drawRobot } from "./robot.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(1,1,1);

const ambientLight = new THREE.AmbientLight(0xffffff);
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);

scene.add(lightHelper);
scene.add(gridHelper);


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;
drawRobot({x: 0, y:0, z:1}, scene);
scene.add(pointLight, ambientLight);

function animate(){

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();