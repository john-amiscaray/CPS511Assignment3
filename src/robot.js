const robotBodyWidth = 0.75, robotBodyLength = robotBodyWidth, robotBodyDepth = robotBodyWidth;

function drawBody({x, y, z}, scene){

    const bodyGeo = new THREE.BoxGeometry(robotBodyLength, robotBodyLength, robotBodyDepth);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
    bodyGeo.computeVertexNormals();
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.x = x;
    body.position.y = y;
    body.position.z = z;
    body.rotateY(0.7854);

    scene.add(body);

}

function drawRobot({x, y, z}, scene){

    drawBody({x, y, z}, scene);

}

export { drawRobot };