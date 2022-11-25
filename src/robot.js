const robotBodyWidth = 0.75, robotBodyLength = robotBodyWidth, robotBodyDepth = robotBodyWidth;
const robotAngle = (10 * Math.PI) / 180;
let hipWidth, hipLength, hipDepth;
let legWidth, legLength, legDepth;
let robotBody, leftHip, rightHip, leftLeg, rightLeg;

function drawBody({x, y, z}, scene){

    const bodyGeo = new THREE.BoxGeometry(robotBodyWidth, robotBodyLength, robotBodyDepth);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.x = x;
    body.position.y = y;
    body.position.z = z;
    
    body.rotateY(robotAngle);
    scene.add(body);
    robotBody = body;

}

function drawRightHip(){

    hipWidth = robotBodyWidth / 2;
    hipLength = robotBodyLength / 2;
    hipDepth = robotBodyDepth / 2;
    const hipGeo = new THREE.BoxGeometry(hipWidth, hipLength, hipDepth);
    const hipMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const hip = new THREE.Mesh(hipGeo, hipMat);

    hip.position.x = robotBody.position.x + (robotBodyWidth / 2);
    hip.position.y = -(robotBodyLength / 2) - (hipLength / 2);
    hip.position.z = hipDepth / 2;

    robotBody.add(hip);
    leftHip = hip;

}

function drawLeftHip(){

    hipWidth = robotBodyWidth / 2;
    hipLength = robotBodyLength / 2;
    hipDepth = robotBodyDepth / 2;
    const hipGeo = new THREE.BoxGeometry(hipWidth, hipLength, hipDepth);
    const hipMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const hip = new THREE.Mesh(hipGeo, hipMat);

    hip.position.x = -robotBody.position.x - (robotBodyWidth / 2);
    hip.position.y = -(robotBodyLength / 2) - (hipLength / 2);
    hip.position.z = hipDepth / 2;

    robotBody.add(hip);
    rightHip = hip;

}

function drawLeftLeg(){

    legWidth = hipWidth * 0.75;
    legLength = hipLength * 2;
    legDepth = hipDepth;
    const hipGeo = new THREE.BoxGeometry(legWidth, legLength, legDepth);
    const hipMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const leg = new THREE.Mesh(hipGeo, hipMat);

    leg.position.y = -(hipLength / 2) - (legLength / 2);

    leftHip.add(leg);
    leftLeg = leg;

}

function drawRightLeg(){

    legWidth = hipWidth * 0.75;
    legLength = hipLength * 2;
    legDepth = hipDepth;
    const hipGeo = new THREE.BoxGeometry(legWidth, legLength, legDepth);
    const hipMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const leg = new THREE.Mesh(hipGeo, hipMat);

    leg.position.y = -(hipLength / 2) - (legLength / 2);

    rightHip.add(leg);
    rightLeg = leg;

}

function drawRobot({x, y, z}, scene){

    drawBody({x, y, z}, scene);
    drawLeftHip();
    drawRightHip();
    drawLeftLeg();
    drawRightLeg();

}

export { drawRobot };