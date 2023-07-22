
let gameCanvas = document.querySelector("#game-canvas");
//initialising kaboom environment
const k = kaboom({
    fullscreen: true,
    canvas: gameCanvas,
    width: 600,
    height: 400,
    scale: 2,
    debug: true,
    background: [0,0,0,0]
});

/*loadSprite() can be take two or three parameters. With two parameters; a string ID, and a filepath, a static sprite is created.
The third parameter can slice a spritesheet horizontally and vertically and create an animation.*/

//creating player idle animation
loadSprite('playerIdle', 'assets/sprites/kunoichi/kunoichi-idle.png', {
    sliceX: 9, sliceY: 1,
    anims: {'idleAnim': {from: 0, to: 8, loop: true}}
});

//creating player run animation
loadSprite('playerRun', 'assets/sprites/kunoichi/kunoichi-run.png', {
    sliceX: 8, sliceY: 1,
    anims: {'runAnim': {from: 0, to: 7, loop: true}}
});

//creating player jump animation
loadSprite('playerJump', 'assets/sprites/kunoichi/kunoichi-jump.png', {
    sliceX: 10, sliceY: 1,
    anims: {'jumpAnim': {from: 0, to: 9, loop: false}}
});

//creating player attack animation
loadSprite('playerAttack', 'assets/sprites/kunoichi/kunoichi-attack-2.png', {
    sliceX: 8, sliceY: 1,
    anims: {'attackAnim': {from: 0, to: 7, loop: false}}
});

//creating enemy idle animation
loadSprite('enemyIdle', 'assets/sprites/samurai/samurai-idle.png', {
    sliceX: 6, sliceY: 1,
    anims: {'enemyIdleAnim': {from: 0, to: 5, loop: true}}
});

//creating enemy walkanimation
loadSprite('enemyMove', 'assets/sprites/samurai/samurai-walk.png', {
    sliceX: 9, sliceY: 1,
    anims: {'enemyWalkAnim': {from: 0, to: 8, loop: true}}
});

//creating enemy attack animation
loadSprite('enemyAttack', 'assets/sprites/samurai/samurai-attack_1.png', {
    sliceX: 5, sliceY: 1,
    anims: {'enemyAttackAnim':{from: 0, to: 4, loop: false}}
});

loadSprite('enemyDeath', 'assets/sprites/samurai/samurai-dead.png', {
    sliceX: 6, sliceY: 1,
    anims: {'enemyDeathAnim':{from: 0, to: 5, loop: false}}
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
        y: 80,
        width: 32,
        height: 80
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
        width: 48,
        height: 24,
    },
    //creating a sprite for cave exits
    'caveExit' :{
        x: 64,
        y: 80,
        width: 32,
        height: 80
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
        width: 32,
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
    sprite('playerIdle'),//default animation
    area({shape: new Rect(vec2(0), 32, 32), offset: vec2(0, 42)}),//sets a rectangle to collide
    scale(1),//sets sprite scale
    anchor('center'),//anchors rectangle to center of sprite
    body({stickToPlatform: true}),// gives player physics
    pos(100, 1500),// starting position
    {
        speed: 400,//movement speed
        health: 100,//player's base health
        damage: 25,
        isCurrentlyJumping: false,

    },
    //a string attribute acts as a tag which can be used in collision detection and other logic
    "player",
]);

/*Creating an enemy class to instantiate separate instamces of the same enemy.
This also allows for methods relavant only to the Enemy to be kept within the class.
This may be a preferable idea for the Player also.*/

function createEnemy(currentSprite, scaleFactor, enemyArea, anchorPoint, positionX, positionY, tag) {
    return add([
        sprite(currentSprite),
        scale(scaleFactor),
        area(enemyArea),
        anchor(anchorPoint),
        body(),
        pos(positionX, positionY),
        state("idle", ["idle", "move", "attack"]),
        {
            health: 100,
            speed: 400,
            damage: 50,
            sprites: {
                move: "enemyMove",
                idle: "enemyIdle",
                attack: "enemyAttack",
                death: "enemyDeath"
            },
            anims: {
                move: "enemyWalkAnim",
                idle: "enemyIdleAnim",
                attack: "enemyAttackAnim",
                death: "enemyDeathAnim"
            }
        },
        "enemy"
    ])
}


/*Creating a map constant; an array of strings, to pass as the first parameter to the addLevel() method*/
const map = [
    "                                                                             ",
    "                                                                             ",
    "                                                                             ",
    "                                                                             ",
    "                                                                             ",
    "                                                           d                 ",
    "                                           #_______________________          ",
    "                                                                  #          ",
    "                                            ££££££££££££££££££££££           ",
    "                                       * * |££££££££££££££££££££££/          ",
    "                            _______________ £££££££££££*£*££££££££           ",
    "                            # # # # # # # # __________________________       ",
    "                                            # # # # # # # # # # # # #        ",
    "        ^ ^  *                                                               ",
    "     _____________                                                           ",
    "     # # # # # # #                                                           ",
    "                                                                             ",
    "                          * ^                                                ",
    "                         _________                                           ",
    "                         # # # # #                                           ",
    "                                                                             ",
    "                                            ^ &  *                           ",
    "                                         _________________                   ",
    "                                         # # # # # # # # #                   ",
    "                                                                             ",
    "          & & ^     ^ ^                                                      ",
    "       #_____________________                                                ",
    "                            #                                                ",
    "        ££££££££££££££££££££                                                 ",
    "   h   |££££££££££££££££££££/           * *                                  ",
    " _______£*£*£*££££££££££££*£_      _____________                             ",
    " # # # #~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~      # # # # # # #                             ",
    "        ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~                                                ",
    "                                   ^                       & *               ",
    "                                _____                    _________           ",
    "                                # # #                    # # # # #           ",
    "                                                                             ",
    "                                              *                              ",
    "                                          _______                            ",
    "                                          # # # #                            ",
    "                                                                             ",
    "                         ^ ^ & &                                             ",
    "                       _____________                                         ",
    "                       # # # # # # #                                         ",
    "                                                                             ",
    "     * * &                                   h                               ",
    "  ___________                              ___                               ",
    "  # # # # # #                              # #         ___                   ",
    "                                                       ###                   ",
    "             ^ & &   ^                                                *      ",
    "          #______________________                                 _______    ",
    "                                #                                 # # # #    ",
    "           £££££££££££££££££££££                                             ",
    "   * ^    |£££££££££££££££££££££/    ^   ^         & &           ^ ^         ",
    " _________ £££*££££*£££££££*££*£___________       ___________________________",
    " # # # # #~~~~~~~~~~~~~~~~~~~~~~# # # # # #       # # # # # # # # # # # # # #"
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
            anchor('top'),
            scale(2),
            "ground",//tag which can be referenced for collision detection
        ],
        "+": () => [
            sprite('grassRaised'),
            scale(2),
            area({shape: new Rect(vec2(0), 72, 32), offset: vec2(0, 0)}),
            anchor('top'),
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
            anchor('top'),
            scale(2),
            "ground"
        ],
        "|": () =>[
            sprite('caveEntrance'),
            anchor('center'),
            scale(2),
            "cave"
        ],
        "/": () =>[
            sprite('caveExit'),
            anchor('center'),
            scale(2),
        ],
        "£": () => [
            sprite('caveBack'),
            anchor('center'),
            scale(2),
        ],
        "-": () => [
            sprite('caveTop'),
            anchor('center'),
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
        ],
    }
};

/*Creating functons to handle player actions. These functions will be called when the player inputs button commands.
This should reduce repetition as both desktop and touch screen inputs should call the same functions.*/
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
        player.isCurrentlyJumping = true;
        !player.isGrounded;
    }
};

function attack(){
    //creating a variable to determine player facing
    const currentFlip = player.flipX;
    //checking if player is attacking
    if(player.curAnim() !== 'attackAnim' && player.isGrounded()){
        //if not use the sprite and associated animation to attack
        player.use(sprite('playerAttack'));
        player.play('attackAnim');
        //checking the player facing
        player.flipX = currentFlip;
        //where to create a hitbox relative to player
        const slashX = player.pos.x + 65;
        const slashXFlipped = player.pos.x - 80;
        const slashY = player.pos.y;
        //waiting before creating a hitbox(rough estimate)
        wait(0.6, ()=>{
            add([
            rect(30,30),
            area(),
            pos(currentFlip ? slashXFlipped: slashX, slashY),
            opacity(1),
            "hit"
            ])
        });
    }
};

function enemyAI(agent){
    agent.onStateEnter("attack", () =>{
        debug.log("attacking");
        agent.use(sprite("enemyAttack"))
        agent.play("enemyAttackAnim")
        wait(0.7, ()=>{
            agent.enterState("idle")

        })
    })
    agent.onStateEnter("ilde", () => {
    })
    agent.onStateUpdate("idle", () =>{
        debug.log("idling");
        agent.use(sprite("enemyIdle"));
        agent.play("enemyIdleAnim");
        wait(3, () => {agent.enterState("move")})
        
    })
    agent.onStateUpdate("move", () => {
        debug.log("moving");
        agent.use(sprite("enemyMove"));
        agent.play("enemyWalkAnim");
        if(player.pos.x < agent.pos.x){
            agent.flipX = true;
            agent.move(-player.pos.x, -agent.speed);
        }else{
            agent.move(player.pos.x, agent.speed)
        }
        if(agent.pos.dist(player.pos) < 80){
            debug.log("I see you");
            agent.enterState("attack");
        }
    })
}

/*Creating a method which will be called during the main gamea in order to register desktop button inputs.
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
        if(player.isGrounded()){
            idle();
        }
    })

    onKeyDown('a',() =>{
        moveLeft();
    })

    onKeyRelease('a', () => {
        if(player.isGrounded()){
            idle();
        }
   })

    onKeyPress('space', () => {
        playerJump();
    })

    onKeyPress('p', () => {
        go('PauseMenu');
    })

    onKeyPress('p', () => {
        restartGame();
    })
};

/*Creating a method which will be called during the onUpdate() method in order to register touch screen inputs.
 Inputs will correspond to player actions and will be updated each frame.*/
function hanldeTouchScreenInputs(){

};
/*A scene is a kaboom function which takes two params; a string ID, and a function.
The scene represents a level, where the function handles all game logic intended for that particular scene.
This allows for scene flow management to transition between levels and menus and vice versa.*/


/*Creating a function to reset the game */
function restartGame(){

}

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
    player.use(sprite('playerIdle'));
    player.play('idleAnim');
    
    //adding enemies to the map
    const enemy1 = createEnemy('enemyIdle', 1, {shape: new Rect(vec2(0), 32, 32), offset: vec2(-16, 48)}, 'center', 440, 1500, "enemy");
    //enemyAI(enemy1);
    const enemy2 = createEnemy('enemyIdle', 1, {shape: new Rect(vec2(0), 32, 32), offset: vec2(-16, 48)}, 'center', 1200, 600, "enemy");

    const enemy3 = createEnemy('enemyIdle', 1, {shape: new Rect(vec2(0), 32, 32), offset: vec2(-16, 48)}, 'center', 2000, 300, "enemy");

     //calling the handle inputs funtion
    handleInputs();

    //adding invisible walls
    add([
        rect(16, 1760),
        area(),
        body({isStatic: true}),
        opacity(0),
        pos(0, 0)
    ])
    add([
        rect(16, 1760),
        area(),
        body({isStatic: true}),
        opacity(0),
        pos(2448, 0)
    ])

    //allowing camera to follow player
    player.onUpdate(()=>{

    camPos(player.pos);
    },
    
  
    //onUpdate is a built-in function which is called each frame
    onUpdate(()=> {

        onResize(() => {
            if (window.innerWidth > gameCanvas.width && window.innerHeight > gameCanvas.height) return;
            const scale = Math.min(window.innerHeight/gameCanvas.height, window.innerWidth/gameCanvas.width);
    
            gameCanvas.style.transform = `scale(${scale})`;
        })

        //if not running, jumping, or attacking, return to idle
        if(player.curAnim() !== 'runAnim'&& player.curAnim() !== 'attackAnim' && player.curAnim() !== 'jumpAnim' && player.isGrounded() ){
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

        if(player.pos.y > 2000  || player.health <=0){
            destroy(player);
            restartGame();
        };
    }),

    //check if the player is touching the ground and set
    onCollide("player", "ground", () => {
        player.isGrounded;
        !player.isCurrentlyJumping;
    }),

    //checking if enemy is hit by player attack
    // onCollide("enemy", "hit", () => {
    //     debug.log("hit");
    //     enemy.health -= player.damage;
    // })
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