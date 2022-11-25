import { drawRobot } from "./robot.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,7,-5);

//const ambientLight = new THREE.AmbientLight(0xffffff);
const lightHelper = new THREE.PointLightHelper(pointLight);
const sunLight = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.5);

scene.add(lightHelper);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;
camera.position.y = 1.5;
drawRobot({x: 0, y:0, z:1}, scene);
scene.add(pointLight, sunLight);

function animate(){

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();