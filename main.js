let gameCanvas = document.querySelector("#game-canvas");
//initialising kaboom environment
const k = kaboom({
    fullscreen: true,
    canvas: gameCanvas,
    width: 600,
    height: 400,
    scale: 2,
    background: [0,0,0,0]
});

/*loadSprite() can be take two or three parameters. With two parameters; a string ID, and a filepath, a static sprite is created.
The third parameter can slice a spritesheet horizontally and vertically and create an animation.*/

//creating player idle animation
let playerIdleAnim = loadSprite('playerIdle', 'assets/sprites/kunoichi/kunoichi-idle.png', {
    sliceX: 9, sliceY: 1,
    anims: {'idleAnim': {from: 0, to: 8, loop: true}}
});

//creating player run animation
let playerRunAnim = loadSprite('playerRun', 'assets/sprites/kunoichi/kunoichi-run.png', {
    sliceX: 8, sliceY: 1,
    anims: {'runAnim': {from: 0, to: 7, loop: true}}
});

//creating player jump animation
let playerJumpAnim = loadSprite('playerJump', 'assets/sprites/kunoichi/kunoichi-jump.png', {
    sliceX: 10, sliceY: 1,
    anims: {'jumpAnim': {from: 0, to: 9, loop: false}}
});

//creating player attack animation
let playerAttack = loadSprite('playerAttack', 'assets/sprites/kunoichi/kunoichi-attack-2.png', {
    sliceX: 8, sliceY: 1,
    anims: {'attackAnim': {from: 0, to: 7, loop: false}}
});

//creating enemy idle animation
let enemyIdleAnim = loadSprite('enemyIdle', 'assets/sprites/samurai/samurai-idle.png', {
    sliceX: 6, sliceY: 1,
    anims: {'enemyIdleAnim': {from: 0, to: 5, loop: true}}
});

//creating enemy walkanimation
let enemyMoveAnim = loadSprite('enemyMove', 'assets/sprites/samurai/samurai-walk.png', {
    sliceX: 9, sliceY: 1,
    anims: {'enemyWalkAnim': {from: 0, to: 8, loop: true}}
});

//creating enemy attack animation
let enemyAttack1 = loadSprite('enemyAttack1', 'assets/sprites/samurai/samurai-attack_1.png', {
    sliceX: 5, sliceY: 1,
    anims: {'enemyAttack1Anim':{from: 0, to: 4, loop: false}}
});

/*loadSpritAtlas() is a kaboom function which takes two parameters, a source (usually to a spritesheet) and data.
You create a dataset of objects by inputing their x,y coordinates and the pixel width and height from the source.
Each object can then be rendered individually as a static as a sprite.
Additionally, each object can be sliced and given an anims attribute to generate animations. No such sprites
were generates this way for this project.*/
loadSpriteAtlas('assets/tiles/tileset-1.png', {
    //creating a static ground tile sprite
    'grassFloor': {
        x: 32,
        y: 0,
        width: 32,
        height: 16
    },
    //creating and alternate ground tile
    'grassRaised': {
        x: 16,
        y: 0,
        width: 72,
        height: 64,
    },
    //creating a filler sprite
    'dirt': {
        x: 32,
        y: 32,
        width: 32,
        height: 32
    },
    //creating an alternate verion which can be walked on
    'walkableDirt': {
        x: 32,
        y: 32,
        width: 32,
        height: 32
    },
    //creating a sprite for cave entrances
    'caveEntrance': {
        x: 16,
        y: 84,
        width: 16,
        height: 64
    },
    //creating a sprite for the background of caves
    'caveBack' : {
        x: 40,
        y: 96,
        width: 32,
        height: 32
    },
    //creating a roof for caves
    'caveTop' : {
        x: 32,
        y: 80,
        width: 64,
        height: 16,
    },
    //creating a sprite for cave exits
    'caveExit' :{
        x: 72,
        y: 96,
        width: 16,
        height: 64
    },
    //creating a tree sprite
    'tree1' :{
        x: 260,
        y: 0,
        width: 64,
        height: 32
    },
    //creating a bush sprite
    'bush': {
        x: 224,
        y: 32,
        width: 62,
        height: 16
    },
    //creating a mushroom sprite
    'mushrooms': {
        x: 270,
        y: 32,
        width: 64,
        height: 16
    }
})

/*make() is a kaboom method which can take a single argument or an array and create a game object. 
It is similar to add(), but does not add the game object to the scene*/
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
        health: 100,

    },
    //a string attribute acts as a tag which can be used in collision detection and other logic
    "player",
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
        damage: 50,
    },
    "enemy"
]);

/*Creating a map constant; an array of strings, to pass as the first parameter to the addLevel() method*/
const map = [
    "                                                                             ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #",
    "                                                                             ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #",
    "                                                                             ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # #d# # # # # # # # #",
    "                                            ______________________           ",
    "  # # # # # # # # # # # # # # # # # # # # #- - - - - - - - - - - - -# # # # #",
    "                                            £££££££££££££££££££££££          ",
    "  # # # # # # # # # # # # # # # # # # #*#*#|£££££££££££££££££££££££ # # # # #",
    "                           _______________ #£££££££££££*£*£££££££££/#        ",
    "  # # # # # # # # # # # # # # # # # # # # #__________________________ # # # #",
    "                                           # # # # # # # # # # # # # #       ",
    "  # # #^#^# #*# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #",
    "    _____________                                                            ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #",
    "                                                                             ",
    "  # # # # # # # # # # # # #*#^# # # # # # # # # # # # # # # # # # # # # # # #",
    "                        ________                                             ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #",
    "                                                                             ",
    "  # # # # # # # # # # # # # # # # # # # # # # # #^#&#*# # # # # # # # # # # #",
    "                                          _______________                    ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #",
    "                                                                             ",
    "  # # # # #&#&#^# # #^#^# # # # # # # # # # # # # # # # # # # # # # # # # # #",
    "        _______________________                                              ",
    "  # # # #- - - - - - - - - - -# # # # # # # # # # # # # # # # # # # # # # # #",
    "         ££££££££££££££££££££                                                ",
    "  #h# ##|££££££££££££££££££££ # # # # #*#*# # # # # # # # # # # # # # # # # #",
    " _______#£*£*£*£££££££££££££*/#    _____________                             ",
    "  # # # _____________________# # # # # # # # # # # # # # # # # # # # # # # ##",
    "        # # # # # # # # # # #                                                ",
    "  # # # # # # # # # # # # # # # # #^# # # # # # # # # # # # #&#*# # # # # # #",
    "                                _____                    __________          ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #",
    "                                                                             ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #",
    "                                          _______                            ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #",
    "                                                                             ",
    "  # # # # # # # # # # # #^#^#&#&# # # # # # # # # # # # # # # # # # # # # # #",
    "                       _____________                                         ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #",
    "                                                                             ",
    "  # #*#*#&# # # # # # # # # # # # # # # # # #h# # # # # # # # # # # # # # # #",
    "  ___________                              __                                ",
    "  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #^# # # # # #",
    "                                                               _# # #^#*# # #",
    "  # # # # # #^#&#&# #^# # # # # # # # # # # # # # # # #________   ________   ",
    "           _____________________                      # # # # # + # # # # # #",
    "  # # # # #- - - - - - - - - --   # # # # # # # # # # # # # # # # # # # # # #",
    "            £££££££££££££££££££££                                            ",
    "  #*#^# # #|£££££££££££££££££££££ # #^# #^# # # # #&#&# # # # # # # # # # # #",
    " _________ #£*£££££££££££££*£££££/#___________   ____________                ",
    "  # # # # #~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~# # # # # # # # # # # # # # # # # # # # # #"
]

/*Creating a level configuation object, to pass as a second parameter to the addLevel() method to render sprites as a level*/
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

/*Creating functons to handle player actions. These functions will be called when the player inputs button commands.
This should reduce repetition as both desktop and tablet inputs should call the same functions.*/
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

    if(player.curAnim() !== 'attackAnim'){
        player.use(sprite('playerAttack'));
        player.play('attackAnim');
    }
}

/*Creating a method which will be called during the onUpdate() method in order to register desktop button inputs.
 Inputs will correspond to player actions and will be updated each frame.*/
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

/*Creating a method which will be called during the onUpdate() method in order to register touch screen inputs.
 Inputs will correspond to player actions and will be updated each frame.*/
 function hanldeTouchScreenInputs(){

 };


/*A scene is a kaboom function which takes two params; a string ID, and a function.
The scene represents a level, where the function handles all game logic intended for that particular scene.
This allows for scene flow management to transition between levels and menus and vice versa.*/

//The main menu is the first scene the user encounters
scene('MainMenu', ()=>{
    const menu = add([
        text("HELLO"),
    ])
    onKeyPress('space', ()=>{
        go('MainGame');
    })
})

//The MainGame scene holds the logic of the first, and currently, only level in the game 
scene('MainGame', () =>{

    /*addLevel is a kaboom function which uses two parameters; an array of strings, and an object to render a level.
    The characters within the strings are converted to tiles based on the configurations outlined in the object*/
    addLevel(map, levelConfig);
    /*camScale sets a virtual z axis distance from the player, simulating a camera distance */
    camScale(0.8);
    /*setGravity sets a virtual gravity which acts on objcets with a .body() attribute*/
    setGravity(1000); 
    //adding the player object to the scene
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
    onKeyPress('p', ()=>{
        go('MainGame');
    })
})

/*go() is a kaboom function which takes a scene ID as a parameter and goes to that scene.
Can also pass an args parameter in oreder to, for example, reset or reinitialise the scene*/
go('MainGame');