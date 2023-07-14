const k = kaboom({
    fullscreen: true,
    width: 600,
    height: 400,
    scale: 2,
    background: [1, 1, 1, 1],
});

// loading assets for game
//loading player sprite animations.
let playerIdle = loadSprite('playerIdle', 'assets/sprites/kunoichi/kunoichi-idle.png', {
    sliceX: 9, sliceY: 1,
    anims: {'idleAnim': {from: 0, to: 8, loop: true}}
});

let playerRun = loadSprite('playerRun', 'assets/sprites/kunoichi/kunoichi-run.png', {
    sliceX: 8, sliceY: 1,
    anims: {'runAnim': {from: 0, to: 7, loop: true}}
});

let playerJump = loadSprite('playerJump', 'assets/sprites/kunoichi/kunoichi-jump.png', {
    sliceX: 10, sliceY: 1,
    anims: {'jumpAnim': {from: 1, to: 9, loop: false}}
});

//loading tile and object assets


//setting configuration for player
const player = [
    sprite(playerIdle),//default animation
    area({shape: new Rect(vec2(0), 32, 32), offset: vec2(0,32)}),//sets a rectangle to collide
    scale(0.5),
    anchor('center'),//anchors rectangle to center of sprite
    body(),// gives player physics
    pos(101, 300),// starting position
    {
        speed: 200,
    },
    "player",
]




add(player);