let gameCanvas = document.querySelector("#game-canvas")
//initialising kaboom environment
const k = kaboom({
    fullscreen: true,
    canvas: gameCanvas,
    width: 600,
    height: 400,
    scale: 2,
    background: [0,0,0,0]
});

// loading assets for game
//loading player sprite animations.
let playerIdleAnim = loadSprite('playerIdle', 'assets/sprites/kunoichi/kunoichi-idle.png', {
    sliceX: 9, sliceY: 1,
    anims: {'idleAnim': {from: 0, to: 8, loop: true}}
});

let playerRunAnim = loadSprite('playerRun', 'assets/sprites/kunoichi/kunoichi-run.png', {
    sliceX: 8, sliceY: 1,
    anims: {'runAnim': {from: 0, to: 7, loop: true}}
});

let playerJumpAnim = loadSprite('playerJump', 'assets/sprites/kunoichi/kunoichi-jump.png', {
    sliceX: 10, sliceY: 1,
    anims: {'jumpAnim': {from: 1, to: 9, loop: false}}
});

let playerAttack = loadSprite('playerAttack', 'assets/sprites/kunoichi/kunoichi-attack-2.png', {
    sliceX: 8, sliceY: 1,
    anims: {'attackAnim': {from: 1, to: 7, loop: false}}
});

//loading enemy sprite animations
let enemyIdleAnim = loadSprite('enemyIdle', 'assets/sprites/samurai/samurai-idle.png', {
    sliceX: 6, sliceY: 1,
    anims: {'enemyIdleAnim': {from: 1, to: 5, loop: true}}
});

let enemyMoveAnim = loadSprite('enemyMove', 'assets/sprites/samurai/samurai-walk.png', {
    sliceX: 9, sliceY: 1,
    anims: {'enemyWalkAnim': {from: 1, to: 8, loop: true}}
})

let enemyAttack1 = loadSprite('enemyAttack1', 'assets/sprites/samurai/samurai-attack_1.png', {
    sliceX: 5, sliceY: 1,
    anims: {'enemyAttack1Anim':{from: 1, to: 4, loop: false}}
})

//taking coordinates from the tilesheet and creating individual tiles
loadSpriteAtlas('assets/tiles/tileset-1.png', {
    'grassFloor': {
        x: 32,
        y: 0,
        width: 32,
        height: 16
    },
    'grassRaised': {
        x: 16,
        y: 0,
        width: 72,
        height: 64,
    },
    'dirt': {
        x: 32,
        y: 32,
        width: 32,
        height: 32
    },
    'walkableDirt': {
        x: 32,
        y: 32,
        width: 32,
        height: 32
    },
    'caveEntrance': {
        x: 16,
        y: 84,
        width: 16,
        height: 64
    },
    'caveBack' : {
        x: 40,
        y: 96,
        width: 32,
        height: 32
    },
    'caveTop' : {
        x: 32,
        y: 80,
        width: 64,
        height: 16,
    },
    'caveExit' :{
        x: 72,
        y: 96,
        width: 16,
        height: 64
    },
    'tree1' :{
        x: 260,
        y: 0,
        width: 32,
        height: 32
    },
    'bush': {
        x: 224,
        y: 32,
        width: 62,
        height: 16
    },
    'mushrooms': {
        x: 270,
        y: 32,
        width: 64,
        height: 16
    }
})

//loading background image

//creating a player game object
const player = make([
    sprite(playerIdleAnim),//default animation
    area({shape: new Rect(vec2(0), 32, 32), offset: vec2(0, 42)}),//sets a rectangle to collide
    scale(1),//sets sprite scale
    anchor('center'),//anchors rectangle to center of sprite
    body(),// gives player physics
    pos(100, 600),// starting position
    {
        speed: 400,//movement speed
        isAttacking: false,
    },
    "player",//tag which can be referenced for collision detection
]);

//creating an enemy game object
const enemy = make([
    sprite('enemyIdle'),
    area({shape: new Rect(vec2(0), 32, 32), offset: vec2(0, 42)}),
    scale(1),
    anchor('center'),
    body(),
    pos(400 , 600),
    state("idle",["idle", "attack", "move"]),//states for AI to enter/exit
    {
        speed: 400,
        isAttacking: false,
    },
    "enemy"
]);


//setting the level configurations
const levelConfig = {
    tileWidth:32,//pixel width of each tile
    tileHeight:32,//pixel height of each tile
    //the tiles object uses key/value pairs of a string and an array
    //to instantiate objects on the map
    tiles: {
        "_": () => [//setting the '=' symbol to represent the ground
            sprite('grassFloor'),
            area(),
            body({isStatic: true}),//gives physics but holds in place
            scale(2),
            "ground",//tag which can be referenced for collision detection
        ],
        "+": () => [
            sprite('grassRaised'),
            scale(2),
            area({shape: new Rect(vec2(0), 72, 32), offset: vec2(0, 0)}),
            anchor('center'),
            body({isStatic: true}),
            "ground"
        ],
        "#": () =>[
            sprite('dirt'),
            scale(2),
            anchor('top'),
        ],
        "~": () => [
            sprite('walkableDirt'),
            area(),
            body({isStatic: true}),//gives physics but holds in place
            scale(2),
            "ground"
        ],
        "|": () =>[
            sprite('caveEntrance'),
            anchor('center'),
            scale(2),
        ],
        "/": () =>[
            sprite('caveExit'),
            anchor('center'),
            scale(2)
        ],
        "-": () => [
            sprite('caveTop'),
            scale(2),
        ],
        "£": () => [
            sprite('caveBack'),
            anchor('top'),
            scale(2),
        ],
        "^": () => [
            sprite('tree1'),
            anchor('center'),
            scale(2)
        ],
        "&": () => [
            sprite('bush'),
            anchor('top'),
            scale(2)
        ],
        "*": () => [
            sprite('mushrooms'),
            anchor('top'),
            scale(2)
        ]
    }
};

//the map is an array of strings, which holds the tile objects and renders
//their sprites
const map = [
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  ",
    "                                                                               ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  ",
    "                                                                               ",
    "  # # # # # # # # # # # # # # __________ # # # # # # # # # # # # # # # # # #  ",
    "                              # # # # # #         ^ & &                          ",
    "  #&#&# # # # # # # # # # # # # # # # # # # # # #____________ # # # # # # # #  ",
    " ___________                                      # # # # # #                  ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #^# # # # #  ",
    "  # # # # # #^#&#&# #^# # # # # # # # # # # # # # # # # # # # #   ________     ",
    "           _____________________                                + # # # # # #  ",
    "  # # # # #- - - - - - - - - --   # # # # # # # # # # # # # # # # # # # # # #  ",
    "            £££££££££££££££££££££                                              ",
    "  #*#^# # #|£££££££££££££££££££££ # #^# #^# # # # #&#&# # # # # # # # # # # #  ",
    " _________ #£*£££££££££££££*£££££/#___________   ____________                  ",
    "  # # # # #~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~# # # # # # # # # # # # # # # # # # # # # #  "
]

//creating funtions to handle player movement
function idle(){
    player.isAttacking = false;
    player.use(sprite('playerIdle'));
    player.play('idleAnim');
};

function moveRight(){
    if(player.curAnim() !== 'runAnim' && player.isGrounded()){
        player.use(sprite('playerRun'));
        player.play('runAnim');
    };

    if (player.direction !== 'right') player.direction = 'right';
    player.move(player.speed, 0);       
};

function moveLeft(){
    if(player.curAnim() !== 'runAnim' && player.isGrounded()){
        player.use(sprite('playerRun'));
        player.play('runAnim');
    }

    if (player.direction !== 'left') player.direction = 'left';
    player.move(-player.speed, 0);
};

function playerJump(){
    if(player.curAnim() !== 'jumpAnim' && player.isGrounded()){
        player.use(sprite('playerJump'));
        player.play('jumpAnim');
        player.jump(600);
    }
};

function attack(){
    player.isAttacking = true;
    console.log(player.isAttacking);

    if(player.curAnim() !== 'attackAnim' && player.isGrounded()){
        player.use(sprite('playerAttack'));
        player.play('attackAnim');
    }
}

//creating a function to handle inputs
function handleInputs(){
    //onKeyDown is a built in method which registers continuous press
    onKeyDown('d',() =>{
        moveRight();
    })

    //onKeyPress is a built in method which registers an instance of a key press
    onKeyPress('e', () => {
        attack();
    })
    
    //onKeyRelease is a built in method which registers when a button is released
    onKeyRelease('d', () => {
        idle();
    })

    onKeyDown('a',() =>{
        moveLeft();
    })

    onKeyRelease('a', () => {
        idle();
    })

    onKeyPress('space', () => {
        playerJump();
    })

    onKeyPress('p', () => {
        go('PauseMenu');
    })
};
 
function main(){
    addLevel(map, levelConfig);
    camScale(0.8);
    setGravity(1000); 
    add(player);
    add(enemy);

    player.play('idleAnim');
    enemy.play('enemyIdleAnim');
    //calling the handle inputs funtion
    handleInputs();
    //allowing camera to follow player
    player.onUpdate(()=>{
    camPos(player.pos);
    }
)}

scene('MainMenu', ()=>{
    const menu = add([
        text("HELLO"),
    ])
    onKeyPress('space', ()=>{
        go('MainGame');
    })
})

scene('MainGame', () =>{
    addLevel(map, levelConfig);
    camScale(0.8);
    setGravity(1000); 
    add(player);
    add(enemy);

    player.play('idleAnim');
    enemy.play('enemyIdleAnim');
    //calling the handle inputs funtion
    handleInputs();
    //allowing camera to follow player
    player.onUpdate(()=>{
    camPos(player.pos);
    },
    //onUpdate is a built-in function which is called each frame
    onUpdate(()=>{
        if(player.curAnim() !== 'runAnim' && player.curAnim() !== 'jumpAnim' && player.isGrounded() && player.curAnim() !== 'attackAnim'){
            idle();
        };

        if(player.curAnim() !== 'jumpAnim' && !player.isGrounded() && player.heightDelta > 0) {
            player.use(sprite('playerJump'));
            player.play('jumpAnim');
        };

        if(player.direction === 'left'){
            player.flipX = true;
        } else{
            player.flipX = false;
        };
    })
)})

scene('PauseMenu', () =>{
    const menu = add([
        text("Paused"),
    ])
    onKeyPress('space', ()=>{
        go('MainGame');
    })
})
//adding level to the scene
go('MainGame');