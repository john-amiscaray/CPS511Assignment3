## CPS 511 Assignment 3

Robot Attack

A 3D “Star Wars Planet Hoth” style game of walker bots attacking an interactive defensive cannon.


## Project Screen Shot(s)

![Screenshot](/assets/gameplay_screenshot_medium.png?raw=true)

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

`npm install`  

To Start Server:

`npm run dev`  

To Visit App:

`http://localhost:5173/`  


## Controls

- Mouse to move the defensive cannon
- Spacebar to shoot the defensive cannon's laser
- 'r' to reset the level

## Game features

- 7+ texture-mapped robots that shoot bullets at the player
- Controllable Texture-mapped defensive cannon that shoots lasers to destroy said robots
- Death animations for the robots (they do backflips!)
- Damaged animation for defensive cannon when it reaches 0 health
- Defensive cannon uses a custom mesh
- Vertex and fragment shaders are implemented to render lightning effects such as the laser's glow

## Bonus marks

1. The defensive cannon fires a laser instead of a projectile.
2. Levels are added to game with a score displayed. Each level parameters are as follows:
- Level 0: Spawns 7 bots and slow walking speed
- Level 1: Spawns 10 bots and moderate walking speed
- Level 2: Spawns 20 bots and fast walking speed