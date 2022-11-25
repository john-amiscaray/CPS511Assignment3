const robotBodyWidth = 0.75, robotBodyLength = robotBodyWidth, robotBodyDepth = robotBodyWidth;
const robotAngle = (45 * Math.PI) / 180;
let robotBody, leftHip, rightHip;

function drawBody({x, y, z}, scene){

    const bodyGeo = new THREE.BoxGeometry(robotBodyWidth, robotBodyLength, robotBodyDepth);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.x = x;
    body.position.y = y;
    body.position.z = z;
    
    //body.rotateY(robotAngle);
    scene.add(body);
    robotBody = body;

}

function drawRightHip(scene){

    const legWidth = robotBodyWidth / 2, legLength = robotBodyLength / 2, legDepth = robotBodyDepth / 2;
    const legGeo = new THREE.BoxGeometry(legWidth, legLength, legDepth);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const leg = new THREE.Mesh(legGeo, legMat);

    leg.position.x = robotBody.position.x + (robotBodyWidth / 2);
    leg.position.y = -(robotBodyLength / 2) - (legLength / 2);
    leg.position.z = legDepth / 2;

    robotBody.add(leg);
    leftHip = leg;

}

function drawLeftHip(scene){

    const legWidth = robotBodyWidth / 2, legLength = robotBodyLength / 2, legDepth = robotBodyDepth / 2;
    const legGeo = new THREE.BoxGeometry(legWidth, legLength, legDepth);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const leg = new THREE.Mesh(legGeo, legMat);

    leg.position.x = -robotBody.position.x - (robotBodyWidth / 2);
    leg.position.y = -(robotBodyLength / 2) - (legLength / 2);
    leg.position.z = legDepth / 2;

    robotBody.add(leg);
    rightHip = leg;

}

function drawRobot({x, y, z}, scene){

    drawBody({x, y, z}, scene);
    drawLeftHip(scene);
    drawRightHip(scene);

}

export { drawRobot };