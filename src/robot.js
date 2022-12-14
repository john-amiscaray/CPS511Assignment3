import { Bullet } from "./bullet.js";
import { getStandardVertexShader, getStandardFragmentShader } from "./shaders.js";
import { getShaderUniforms } from "./util.js";
import { globals } from "./globals.js";
import * as THREE from 'three';

const robotDelZ = 5;
const animationIncrement = (Math.PI / 32);


class RobotModel{

    static instances = [];
    static level_details = [
        { 
          'robots': 7,
          'speed': 0.1,
          'complete': false
        }, {
          'robots': 10,
          'speed': 0.125,
          'complete': false
        }, {
        'robots': 20,
        'speed': 0.15,
        'complete': false
        }
    ];

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
        this.stepAnimationPosition = 0;
        this.gunSpinAnimationPosition = 0;
        this.deathAnimationControl = 0;
        this.bulletFiringControl = 0;
        this.isLeftSideStep = true;
        this.alive = true;
    }

    drawBody(){
        const bodyGeo = new THREE.BoxGeometry(
            this.robotBodyWidth, 
            this.robotBodyLength, 
            this.robotBodyDepth);
        const uniforms = getShaderUniforms(new THREE.TextureLoader().load( '../assets/robotMainTexture.png' ));
        const bodyMat = new THREE.ShaderMaterial({ 
            uniforms: uniforms,
            vertexShader: getStandardVertexShader(),
            fragmentShader: getStandardFragmentShader(),
            lights: true
          });
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
        const uniforms = getShaderUniforms(new THREE.TextureLoader().load( '../assets/robotSecondaryTexture.png' ));
        const hipMat = new THREE.ShaderMaterial({ 
            uniforms: uniforms,
            vertexShader: getStandardVertexShader(),
            fragmentShader: getStandardFragmentShader(),
            lights: true
          });
        const hip = new THREE.Mesh(hipGeo, hipMat);
    
        hip.position.x = (isLeft ? 0 : (-this.robotBodyWidth)) + (this.robotBody.position.x + (this.robotBodyWidth / 2));
        hip.position.y = this.robotBody.position.y + -(this.robotBodyLength / 2) - (this.hipLength / 2);
        hip.position.z = this.robotBody.position.z + (this.hipDepth / 2);
    
        this.scene.add(hip);
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
        const legGeo = new THREE.BoxGeometry(this.legWidth, this.legLength, this.legDepth);
        const uniforms = getShaderUniforms(new THREE.TextureLoader().load( '../assets/robotMainTexture.png' ));
        const legMat = new THREE.ShaderMaterial({ 
            uniforms: uniforms,
            vertexShader: getStandardVertexShader(),
            fragmentShader: getStandardFragmentShader(),
            lights: true
          });
        const leg = new THREE.Mesh(legGeo, legMat);
    
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
        const uniforms = getShaderUniforms(new THREE.TextureLoader().load( '../assets/robotSecondaryTexture.png' ));
        const footMat = new THREE.ShaderMaterial({ 
            uniforms: uniforms,
            vertexShader: getStandardVertexShader(),
            fragmentShader: getStandardFragmentShader(),
            lights: true
          });
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
        const cannonUniforms = getShaderUniforms(new THREE.TextureLoader().load( '../assets/robotSecondaryTexture.png' ));
        const barrelUniforms = getShaderUniforms(new THREE.TextureLoader().load( '../assets/robotMainTexture.png' ));
        const cannonMat = new THREE.ShaderMaterial({ 
            uniforms: cannonUniforms,
            vertexShader: getStandardVertexShader(),
            fragmentShader: getStandardFragmentShader(),
            lights: true
            });
        const barrelMat = new THREE.ShaderMaterial({ 
            uniforms: barrelUniforms,
            vertexShader: getStandardVertexShader(),
            fragmentShader: getStandardFragmentShader(),
            lights: true
            });
    
        this.cannonBase = new THREE.Mesh(baseGeo, cannonMat);
        this.cannonBarrel = new THREE.Mesh(barrelGeo, barrelMat);
        this.cannonBarrel.rotateX((90 * Math.PI) / 180);
    
        this.robotBody.add(this.cannonBase);
        this.cannonBase.add(this.cannonBarrel);
        this.cannonBase.position.z = (this.robotBodyDepth / 2);
        this.cannonBarrel.position.z = this.cannonBaseRad;
    }
    
    // TODO implement spawn here
    /*
    if (current_robots == 0) {
    for (let i = 0; i < level_details[current_level].robots; i++){
        robotSpawn(); -> draw();
        current_robots += 1;
    }
    }
    */
    //

    draw(){
        this.drawBody();
        this.drawHip(false);
        this.drawHip(true);
        this.drawLeg(true);
        this.drawLeg(false);
        this.drawFoot(true);
        this.drawFoot(false);
        this.drawCannon();
        RobotModel.instances.push(this);
        if (globals.currentLevel < 3){
            globals.levelScore = RobotModel.level_details[globals.currentLevel].robots - RobotModel.instances.length;
            //console.log("RobotModel.instances.length:" + RobotModel.instances.length);
            //console.log("globals.levelScore:" + globals.levelScore);
        } 
    }

    stepAnimation(){
        this.stepAnimationPosition += animationIncrement;
        let theta = -Math.abs(Math.sin(this.stepAnimationPosition)) * (Math.PI / 2);
        let hip = this.isLeftSideStep ? this.leftHip : this.rightHip;
        hip.setRotationFromEuler(
            new THREE.Euler(theta)
        );
        let epsilon = 1e-9;
        if(theta > -epsilon && theta < epsilon){
            this.isLeftSideStep = !this.isLeftSideStep;
        }
    }

    gunSpinAnimation(){
        this.gunSpinAnimationPosition += animationIncrement;
        let theta = Math.sin(this.gunSpinAnimationPosition) * (Math.PI / 4);
        this.robotBody.setRotationFromEuler(
            new THREE.Euler(0, theta)
        );
    }

    shootAnimation(){
        this.bulletFiringControl += 1;
        if(this.bulletFiringControl % 50 === 0){
            let self = this;
            let accuracy = 7;
            let dir = new THREE.Vector3(Math.random()*accuracy-accuracy/2, 1.5 + Math.random()*accuracy-accuracy/2, Math.random()*accuracy-accuracy/2);
            let Euler = this.robotBody.position;
            dir.subVectors( dir, Euler ).normalize();
            let bullet = new Bullet({ 
                radius: self.cannonBarrelRad, 
                scene: self.scene, 
                x: this.robotBody.position.x, 
                y: this.robotBody.position.y,
                z: this.robotBody.position.z,
                angle: dir
            });
            bullet.draw();
        }
    }

    selfDestruct(){
        this.scene.remove(this.robotBody);
        this.scene.remove(this.leftHip);
        this.scene.remove(this.rightHip);
        this.scene.remove(this.leftLeg);
        this.scene.remove(this.rightLeg);
        this.scene.remove(this.rightFoot);
        this.scene.remove(this.leftFoot);
        RobotModel.instances = RobotModel.instances.filter(robot => robot !== this);
    }

    deathAnimation(){
        if (this.alive){ 
            return;
        };
        this.deathAnimationControl += animationIncrement;
        console.log(this.deathAnimationControl);
        this.robotBody.rotateX(-animationIncrement);
        this.leftHip.rotateX(-animationIncrement);
        this.rightHip.rotateX(-animationIncrement);
        this.robotBody.position.y += animationIncrement;
        this.leftHip.position.y += animationIncrement;
        this.rightHip.position.y += animationIncrement;
        if(this.deathAnimationControl >= (Math.PI / 2)){
            this.selfDestruct();
            RobotModel.checkWinCondition();
        }
    }
    
    diesFromLaser(){

        this.alive = false;

    }

    static robotAnimate(){
        RobotModel.instances.forEach(robot => {
            if (robot.alive){
                robot.stepAnimation();
                robot.gunSpinAnimation();
                robot.shootAnimation();
            }
            robot.deathAnimation();
        });
    }
    
    static moveRobotsForward(scene){
        RobotModel.instances.forEach(robot => {
            if(robot.robotBody.position.z > robotDelZ){
                
                robot.selfDestruct();
                console.log("GAME OVER: A ROBOT LEAKED THROUGH!!!");
                globals.gameOver = true;
                globals.playerHealth = 0;
            }
        });
        
        RobotModel.instances.forEach(robot => {
            if (robot.alive){
                robot.robotBody.position.z += RobotModel.level_details[globals.currentLevel].speed; //0.1;
                robot.leftHip.position.z += RobotModel.level_details[globals.currentLevel].speed; //0.1;
                robot.rightHip.position.z += RobotModel.level_details[globals.currentLevel].speed; //0.1;
            }
        });
    }

    static animateAll(scene){

        RobotModel.moveRobotsForward(scene);
        RobotModel.robotAnimate();

    }
    
    static checkWinCondition(){

        if (globals.currentLevel < 3){
            globals.levelScore = RobotModel.level_details[globals.currentLevel].robots - RobotModel.instances.length;
            console.log("Nice kill! RobotModel.level_score:" + globals.levelScore);
            // If all robots are defeated, start next level
            if (globals.levelScore == RobotModel.level_details[globals.currentLevel].robots && globals.levelComplete == false){
                console.log("robot.js Level " + globals.currentLevel + " Completed!")
                globals.currentLevel += 1;
                globals.levelComplete = true;
                globals.levelScore = 0;
            }
        }

    }

}

export { RobotModel };