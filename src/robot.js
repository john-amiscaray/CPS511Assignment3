class RobotModel{

    static robotList = [];

    constructor(x, y, z, scene){
        this.robotBodyWidth = 0.75;
        this.robotBodyLength = this.robotBodyWidth; 
        this.robotBodyDepth = this.robotBodyWidth * 1.5;
        this.robotAngle = (10 * Math.PI) / 180;
        this.bodyX = x;
        this.bodyY = y;
        this.bodyZ = z;
        this.cannonBaseRad = 0.2;
        this.cannonBarrelRad = 0.1;
        this.cannonBarrelHeight = 0.2;
        this.scene = scene;
    }

    drawBody(){

        const bodyGeo = new THREE.BoxGeometry(
            this.robotBodyWidth, 
            this.robotBodyLength, 
            this.robotBodyDepth);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.x = this.bodyX;
        body.position.y = this.bodyY;
        body.position.z = this.bodyZ;
        
        body.rotateY(this.robotAngle);
        this.scene.add(body);
        this.robotBody = body;
    
    }
    
    drawHip(isLeft){
    
        this.hipWidth = this.robotBodyWidth / 2;
        this.hipLength = this.robotBodyLength / 2;
        this.hipDepth = this.robotBodyDepth / 4;
        const hipGeo = new THREE.BoxGeometry(this.hipWidth, this.hipLength, this.hipDepth);
        const hipMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
        const hip = new THREE.Mesh(hipGeo, hipMat);
    
        hip.position.x = (isLeft ? -1 : 1) * (this.robotBodyWidth / 2);
        hip.position.y = -(this.robotBodyLength / 2) - (this.hipLength / 2);
        hip.position.z = this.hipDepth / 2;
    
        this.robotBody.add(hip);
        if(isLeft){
            this.leftHip = hip;
        }else{
            this.rightHip = hip;
        }
    
    }
    
    drawLeg(isLeft){
    
        this.legWidth = this.hipWidth * 0.75;
        this.legLength = this.hipLength * 2;
        this.legDepth = this.hipDepth;
        const hipGeo = new THREE.BoxGeometry(this.legWidth, this.legLength, this.legDepth);
        const hipMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const leg = new THREE.Mesh(hipGeo, hipMat);
    
        leg.position.y = -(this.hipLength / 2) - (this.legLength / 2);
    
        if(isLeft){
            this.leftHip.add(leg);
            this.leftLeg = leg;
        }else{
            this.rightHip.add(leg);
            this.rightLeg = leg;
        }
    
    }
    
    drawFoot(isLeft){
    
        this.footWidth = this.legWidth * 2;
        this.footLength = this.legLength / 3;
        this.footDepth = this.legDepth * 1.5;
        const footGeo = new THREE.BoxGeometry(this.footWidth, this.footLength, this.footDepth);
        const footMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
        const foot = new THREE.Mesh(footGeo, footMat);
    
        foot.position.y = -(this.legLength / 2) - (this.footLength / 2);
    
        if(isLeft){
            this.leftLeg.add(foot);
            this.leftFoot = foot;
        }else{
            this.rightLeg.add(foot);
            this.rightFoot = foot;
        }
        
    }
    
    drawCannon(){
    
        const baseGeo = new THREE.SphereGeometry(this.cannonBaseRad);
        const barrelGeo = new THREE.CylinderGeometry(
            this.cannonBarrelRad, 
            this.cannonBarrelRad, 
            this.cannonBarrelHeight);
        const cannonMat = new THREE.MeshStandardMaterial({ color: 0x54fcff });
        const barrelMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
    
        this.cannonBase = new THREE.Mesh(baseGeo, cannonMat);
        this.cannonBarrel = new THREE.Mesh(barrelGeo, barrelMat);
        this.cannonBarrel.rotateX((90 * Math.PI) / 180);
    
        this.robotBody.add(this.cannonBase);
        this.cannonBase.add(this.cannonBarrel);
        this.cannonBase.position.z = (this.robotBodyDepth / 2);
        this.cannonBarrel.position.z = this.cannonBaseRad;
    
    }
    
    draw(){
    
        this.drawBody();
        this.drawHip(false);
        this.drawHip(true);
        this.drawLeg(true);
        this.drawLeg(false);
        this.drawFoot(true);
        this.drawFoot(false);
        this.drawCannon();
        RobotModel.robotList.push(this);
    
    }

}

export { RobotModel };