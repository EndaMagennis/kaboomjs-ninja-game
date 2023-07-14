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
let grass1 = loadSprite('grass1', 'assets/sprites/objects/grass/grass-1.png');
let grass2 = loadSprite('grass2', 'assets/sprites/objects/grass/grass-2.png');
let grass3 = loadSprite('grass3', 'assets/sprites/objects/grass/grass-3.png');

let box1 = loadSprite('box1', 'assets/sprites/objects/boxes/box-1.png');
let box2 = loadSprite('box2', 'assets/sprites/objects/boxes/box-2.png');
let box3 = loadSprite('box3', 'assets/sprites/objects/boxes/box-3.png');

//setting configuration for player
const player = [
    sprite(playerIdle),//default animation
    area({shape: new Rect(vec2(0), 32, 32), offset: vec2(0,32)}),//sets a rectangle to collide
    scale(0.5),//sets sprite scale
    anchor('center'),//anchors rectangle to center of sprite
    body(),// gives player physics
    pos(101, 300),// starting position
    {
        speed: 200,//movement speed
    },
    "player",//tag which can be referenced for collision detection
]

//setting the level configurations
const levelConfig = {
    tileWidth:16,//pixel width of each tile
    tileHeight:16,//pixel height of each tile
    //the tiles object uses key/value pairs of a string and an array
    //to instantiate objects on the map
    tiles: {
        "=": () => [//setting the '=' symbol to represent the ground
            sprite(grass1),
            area(),
            body({isStatic: true}),//gives physics but holds in place
            scale(1),
            "ground",//tag which can be referenced for collision detection
        ],
        "-": () => [
            sprite(grass2),
            scale(1),
            area(),
            body({isStatic: true}),
            "ground"
        ],
        "~": () => [
            sprite(grass3),
            scale(0.5),
            area(),
            body({isStatic: true}),
            "ground"
        ],
        "#": () =>[
            sprite(box1),
            scale(1),
            area(),
            body({isStatic: true}),
            "obstacle"
        ]
    }
};

//the map is an array of strings, which holds the tile objects and renders
//their sprites
const map = [
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                             |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|                                                                                                       |",
    "|=-~=-~~=-~---===-=-===-=-=~~~~~=-==-=-=-~~~=-=-=-=-~=~=~==-=-=-~~~~~-----=====-=-~~~===-=-=-=-~~~~~~=---",

];

//adding level to the scene
addLevel(map, levelConfig);
//adding player to the scene
add(player);