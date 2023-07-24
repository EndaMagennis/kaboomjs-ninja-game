
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

//loading background image for controlScreen
const controlBg = loadSprite("controls", "assets/images/controls.png");

//loading button assets for menu navigation
const backToMenuButton = loadSprite("backToMenu", "assets/images/back-to-menu.png");
const startGameButton = loadSprite("startGame", "assets/images/start-game.png");
const controlsButton = loadSprite("controlsButton", "assets/images/controls-button.png");
const continueButton = loadSprite("continue", "assets/images/continue-button.png")

//creating player idle animation
loadSprite("playerIdle", "assets/sprites/kunoichi/kunoichi-idle.png", {
    sliceX: 9, sliceY: 1,
    anims: {"idleAnim": {from: 0, to: 8, loop: true}}
});

//creating player run animation
loadSprite("playerRun", "assets/sprites/kunoichi/kunoichi-run.png", {
    sliceX: 8, sliceY: 1,
    anims: {"runAnim": {from: 0, to: 7, loop: true}}
});

//creating player jump animation
loadSprite("playerJump", "assets/sprites/kunoichi/kunoichi-jump.png", {
    sliceX: 10, sliceY: 1,
    anims: {"jumpAnim": {from: 0, to: 9, loop: false}}
});

//creating player attack animation
loadSprite("playerAttack", "assets/sprites/kunoichi/kunoichi-attack-1.png", {
    sliceX: 6, sliceY: 1,
    anims: {"attackAnim": {from: 0, to: 5, loop: false}}
});

//creating player death animation
loadSprite("playerDeath", "assets/sprites/kunoichi/kunoichi-dead.png", {
    sliceX: 5, sliceY: 1,
    anims: {"deathAnim": {from: 0, to: 4, loop: false}}
});

//creating enemy idle animation
loadSprite("enemyIdle", "assets/sprites/samurai/samurai-idle.png", {
    sliceX: 6, sliceY: 1,
    anims: {"enemyIdleAnim": {from: 0, to: 5, loop: true}}
});

//creating enemy walkanimation
loadSprite("enemyWalk", "assets/sprites/samurai/samurai-walk.png", {
    sliceX: 9, sliceY: 1,
    anims: {"enemyWalkAnim": {from: 0, to: 8, loop: true}}
});

//creating enemy attack animation
loadSprite("enemyAttack", "assets/sprites/samurai/samurai-attack_2.png", {
    sliceX: 5, sliceY: 1,
    anims: {"enemyAttackAnim":{from: 0, to: 4, loop: false}}
});

loadSprite("enemyDeath", "assets/sprites/samurai/samurai-dead.png", {
    sliceX: 6, sliceY: 1,
    anims: {"enemyDeathAnim":{from: 0, to: 5, loop: false}}
});

//creating constants for each player sprite
const playerIdleSprite = "playerIdle";
const playerAttackSprite = "playerAttack";
const playerMoveSprite = "playerRun";
const playerJumpSprite = "playerJump";
const playerDeathSprite = "playerDeath";

//creating constants for each enemy sprite
const enemyIdleSprite = "enemyIdle";
const enemyAttackSprite = "enemyAttack";
const enemyMoveSprite = "enemyWalk";
const enemyDeathSprite = "enemyDeath";

//creating constants for each player animation
const playerIdleAnim = "idleAnim";
const playerAttackAnim = "attackAnim";
const playerMoveAnim = "runAnim";
const playerJumpAnim = "jumpAnim";
const playerDeathAnim = "deathAnim";

//creating constants for each enemy animation
const enemyIdleAnim = "enemyIdleAnim";
const enemyAttackAnim = "enemyAttackAnim";
const enemyMoveAnim = "enemyWalkAnim";
const enemyDeathAnim = "enemyDeathAnim";


/*make() is a kaboom method which can take a single argument or an array and create a game object. 
It is similar to add(), but does not add the game object to the scene*/

//creating a player game object
const player = make([
    sprite(playerIdleSprite),//default animation
    area({shape: new Rect(vec2(0), 32, 32), offset: vec2(0, 42)}),//sets a rectangle to collide
    scale(1),//sets sprite scale
    anchor("center"),//anchors rectangle to center of sprite
    body({stickToPlatform: true}),// gives player physics
    pos(100, 1620),// starting position
    {
        speed: 400,//movement speed
        health: 100,//player"s base health
        damage: 25,
        isCurrentlyJumping: false,
    },
    //a string attribute acts as a tag which can be used in collision detection and other logic
    "player",
]);

/*Creating an function to instantiate separate instances of the same enemy.*/
function createEnemy(width, height, positionX, positionY, tag) {
    return add([
        sprite(enemyIdleSprite),
        scale(1),
        area({shape: new Rect(vec2(0), width, height), offset:(vec2(0, 32))}),
        anchor('center'),
        body({mass: 200}),
        pos(positionX, positionY),
        /*state() creates a finite state machine. 
        The agent can transition between states to simulate intelligent behaviour.
        "idle" will be the default state*/
        state("idle", ["idle", "move", "attack", "death"], {
            //setting predetermined transitions
            "idle" : ["attack", "move", "death", "idle"],
            "attack" : ["move", "idle", "death", "attack"],
            "move": ["idle", "attack", "death", "move"],
        }),
        {
            health: 100,
            speed: 400,
            damage: 25,
            isDead: false
        },
        tag
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
    "                            _______________ £££££££££££*£*££££££££_____      ",
    "                            # # # # # # # #~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~# # #      ",
    "                                                                             ",
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
        "_": () => [//setting the "=" symbol to represent the ground
            sprite("grassFloor"),
            area(),
            body({isStatic: true}),//gives physics but holds in place
            anchor("top"),
            scale(2),
            "ground",//tag which can be referenced for collision detection
        ],
        "+": () => [
            sprite("grassRaised"),
            scale(2),
            area({shape: new Rect(vec2(0), 72, 32), offset: vec2(0, 0)}),
            anchor("top"),
            body({isStatic: true}),
            "ground"
        ],
        "#": () =>[
            sprite("dirt"),
            scale(2),
            anchor("top"),
        ],
        "~": () => [
            sprite("walkableDirt"),
            area(),
            body({isStatic: true}),//gives physics but holds in place
            anchor("top"),
            scale(2),
            "ground"
        ],
        "|": () =>[
            sprite("caveEntrance"),
            anchor("center"),
            scale(2),
            "cave"
        ],
        "/": () =>[
            sprite("caveExit"),
            anchor("center"),
            scale(2),
        ],
        "£": () => [
            sprite("caveBack"),
            anchor("center"),
            scale(2),
        ],
        "-": () => [
            sprite("caveTop"),
            anchor("center"),
            scale(2),
        ],
        
        "^": () => [
            sprite("tree1"),
            anchor("center"),
            scale(2)
        ],
        "&": () => [
            sprite("bush"),
            anchor("top"),
            scale(2)
        ],
        "*": () => [
            sprite("mushrooms"),
            anchor("top"),
            scale(2)
        ],
    }
};


/*loadSpritAtlas() is a kaboom function which takes two parameters, a source (usually to a spritesheet) and data.
You create a dataset of objects by inputing their x,y coordinates and the pixel width and height from the source.
Each object can then be rendered individually as a static as a sprite.
Additionally, each object can be sliced and given an anims attribute to generate animations. No such sprites
were generates this way for this project.*/
loadSpriteAtlas("assets/tiles/tileset-1.png", {
    //creating a static ground tile sprite
    "grassFloor": {
        x: 32,
        y: 0,
        width: 32,
        height: 16
    },
    //creating and alternate ground tile
    "grassRaised": {
        x: 16,
        y: 0,
        width: 72,
        height: 64,
    },
    //creating a filler sprite
    "dirt": {
        x: 32,
        y: 32,
        width: 32,
        height: 32
    },
    //creating an alternate verion which can be walked on
    "walkableDirt": {
        x: 32,
        y: 32,
        width: 32,
        height: 32
    },
    //creating a sprite for cave entrances
    "caveEntrance": {
        x: 16,
        y: 80,
        width: 32,
        height: 80
    },
    //creating a sprite for the background of caves
    "caveBack" : {
        x: 40,
        y: 96,
        width: 32,
        height: 32
    },
    //creating a roof for caves
    "caveTop" : {
        x: 32,
        y: 80,
        width: 48,
        height: 24,
    },
    //creating a sprite for cave exits
    "caveExit" :{
        x: 64,
        y: 80,
        width: 32,
        height: 80
    },
    //creating a tree sprite
    "tree1" :{
        x: 260,
        y: 0,
        width: 64,
        height: 32
    },
    //creating a bush sprite
    "bush": {
        x: 224,
        y: 32,
        width: 32,
        height: 16
    },
    //creating a mushroom sprite
    "mushrooms": {
        x: 270,
        y: 32,
        width: 64,
        height: 16
    }
})



/*Creating functons to handle player actions. These functions will be called when the player inputs button commands.
This should reduce repetition as both desktop and touch screen inputs should call the same functions.*/
function idle(){
    player.isAttacking = false;
    player.use(sprite(playerIdleSprite));
    player.play(playerIdleAnim);
};

function moveRight(){
    if(player.curAnim() !== playerMoveAnim && player.isGrounded() && !player.isDead){
        player.use(sprite(playerMoveSprite));
        player.play(playerMoveAnim);
    };

    if (player.direction !== "right") player.direction = "right";
    player.move(player.speed, 0);       
};

function moveLeft(){
    if(player.curAnim() !== playerMoveAnim && player.isGrounded() && !player.isDead){
        player.use(sprite(playerMoveSprite));
        player.play(playerMoveAnim);
    }

    if (player.direction !== "left") player.direction = "left";
    player.move(-player.speed, 0);
};

function playerJump(){
    if(player.curAnim() !== playerJumpAnim && player.isGrounded() && !player.isDead){
        player.use(sprite(playerJumpSprite));
        player.play(playerJumpAnim);
        player.jump(600);
        player.isCurrentlyJumping = true;
        !player.isGrounded;
    }
};

function attack(){
    //creating a variable to determine player facing
    const currentFlip = player.flipX;
    //checking if player is attacking
    if(player.curAnim() !== "attackAnim" ){
        //if not use the sprite and associated animation to attack
        player.use(sprite("playerAttack"));

        //where to create a hitbox relative to player
        const slashX = player.pos.x + 30;
        const slashXFlipped = player.pos.x - 80;
        const slashY = player.pos.y - 20;
        //onEnd registers the end of the animation
        player.play("attackAnim", {onEnd: ()=>
            add([
            rect(60, 60),
            area(),
            pos(currentFlip ? slashXFlipped: slashX, slashY),
            opacity(1),
            "hit"
        ])})         
        //checking the player facing
        player.flipX = currentFlip;
    }
};

/*Creating a function to handle enemy AI, which will give the enemy agents basic movement and attack functionality/
By using Kaboom's Finite state machine the agent is able to move between different states, update, and exit*/
function enemyAI(agent, tag){
    //creating a variable to change enemy flip state
    let flipX = 0;

    //checking if the player hits the agent
    onCollide("hit", tag, () =>{
        agent.health -= player.damage;
    })

    //onStateEnter() determines what will happen when agent enters idle state
    agent.onStateEnter("idle", () => {
        agent.use(sprite(enemyIdleSprite))
        agent.play(enemyIdleAnim);
        //waits for 3s and enters move state
        wait(3, () => {
            agent.enterState("move")
        })
    })

    agent.onStateEnter("move", () => {
        //incrementing the flip variable
        flipX++;
        agent.use(sprite(enemyMoveSprite));
        agent.play(enemyMoveAnim);
        //agent walks for 5 seconds then enters idle state
        wait(5, () => {
            agent.enterState("idle")
        })
    })
    //performs update checks and locic checks during current state
    agent.onStateUpdate("move", () => {
        //checking if the flip variable is even
        if(flipX%2 === 0){
            //if yes, flipping agent and walking left
            agent.flipX = true;
            agent.move(-45, agent.speed *dt())
        }else{
            //otherwise default and walking right
            agent.flipX = false;
            //dt() is delta time, and calculates time elapsed between frames and smooths movement betweeen frames
            agent.move(45, agent.speed *dt())
        }
        
        if(agent.pos.dist(player.pos) < 84) {
            agent.enterState("attack")
        }
        //checking if agent health is 0, or less
        if(agent.health <= 0){
            agent.enterState("death")
        }
    })

    agent.onStateUpdate("idle", () => {
        //checking if player is within range
        if(agent.pos.dist(player.pos) < 84) {
            agent.enterState("attack")
        }

        if(agent.health <= 0){
            agent.enterState("death")
        }
    })

    agent.onStateEnter("attack", () => {
        
        agent.use(sprite(enemyAttackSprite));
        let strikeZoneX = player.pos.x;
        let strikeZoneY = player.pos.y;
        //after attack animation, creating a hitbox in players position
        agent.play(enemyAttackAnim, {onEnd: () => {
                add([
                rect(60, 60),
                area(),
                pos(strikeZoneX, strikeZoneY),
                opacity(1),
                "enemyHit"
            ])
            wait(1, () => agent.enterState("idle"));
        }})        
    })

    agent.onStateUpdate("attack", () => {
        if(player.pos.x < agent.pos.x){
            agent.flipX =true
        }else{
            agent.flipX = false;
        }

        if(agent.health <= 0){
            agent.enterState("death")
        }
    })

    agent.onStateEnter("death", () => {
        agent.use(sprite(enemyDeathSprite))
            agent.play(enemyDeathAnim, {
                onEnd: () =>{
                    wait(0.5, () =>{
                        destroy(agent)
                    })
                }
            })
    })
}

/*Creating a method which will be called during the main gamea in order to register desktop button inputs.
 Inputs will correspond to player actions and will be updated each frame.*/
function handleInputs(){

    if(!player.isDead){
        onKeyDown("d",() =>{
            moveRight();
        })

        //onKeyPress is a built in method which registers an instance of a key press
        onKeyPress("e", () => {
            attack();
        })

        //onKeyRelease is a built in method which registers when a button is released
        onKeyRelease("d", () => {
            if(player.isGrounded()){
                idle();
            }
        })
        //onKeyDown is a built in method which registers continuous press
        onKeyDown("a",() =>{
            moveLeft();
        })

        onKeyRelease("a", () => {
            if(player.isGrounded()){
                idle();
            }
        })

        onKeyPress("space", () => {
            playerJump();
        })
    }

    onKeyPress("p", () => {
        go("PauseMenu");
    })

    onKeyPress("r", () => {
        restartGame();
    })
};

/*Creating a method which will be called during the onUpdate() method in order to register touch screen inputs.
 Inputs will correspond to player actions and will be updated each frame.*/
function hanldeTouchScreenInputs(){

};

function restartGame(){
    destroy(player);
    go("MainGame");
}

/*A scene is a kaboom function which takes two params; a string ID, and a function.
The scene represents a level, where the function handles all game logic intended for that particular scene.
This allows for scene flow management to transition between levels and menus and vice versa.*/
//The main menu is the first scene the user encounters
scene("MainMenu", ()=>{
    
    add([
        sprite(startGameButton),
        pos(250, 100),
        scale(0.5),
        area(),
        "startButton"
    ])
    
    add([
        sprite(controlsButton),
        pos(250, 200),
        scale(0.5),
        area(),
        "controlsButton"
    ])

    onClick("startButton", () =>{
        go("MainGame")
    })

    onClick("controlsButton", () =>{
        go("ControlsMenu")
    })
})

scene("ControlsMenu", () => {
    add([
        sprite(controlBg),
        scale(0.5),
        pos(120, 100)
    ])

    add([
        sprite(backToMenuButton),
        scale(0.5),
        area(),
        "backButton"
    ])

    onClick("backButton", () => {
        go("MainMenu")
    })
})

scene("PauseMenu", () =>{
    add([
        text("Paused"),
        pos(240, 50),
    ])
    add([
        text("Objective: Defeat all three enemies within the time limit", {
            size: 16,
        }),
        
        pos(50, 300),
    ])
    add([
        sprite(continueButton),
        scale(0.5),
        pos(250, 160),
        area(),
        "continue"
    ])

    onClick("continue", () =>{
        go("MainGame");
    })
})

//The MainGame scene holds the logic of the first, and currently, only level in the game 
scene("MainGame", () =>{
    /*addLevel is a kaboom function which uses two parameters; an array of strings, and an object to render a level.
    The characters within the strings are converted to tiles based on the configurations outlined in the object*/
    addLevel(map, levelConfig);

    /*camScale sets a virtual z axis distance from the player, simulating a camera distance */
    camScale(0.8);

    /*setGravity sets a virtual gravity which acts on objcets with a .body() attribute*/
    setGravity(1000); 

    //adding the player object to the scene
    add(player);
    
    //adding enemies to the map
    const enemy1 = createEnemy(64, 64, 600, 1630, "enemy1");
    enemyAI(enemy1, "enemy1")

    const enemy2 = createEnemy(64,64, 461, 931, "enemy2");
    enemyAI(enemy2, "enemy2")

    const enemy3 = createEnemy(64,64, 1661, 294, "enemy3");
    enemyAI(enemy3, "enemy3")
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

    //checking the update conditions of the player
    player.onUpdate(()=>{
        //moveing the camera with the player
        camPos(player.pos);
        //checking that no other animations are taking place
        if(player.curAnim() !== playerMoveAnim && player.curAnim() !== playerAttackAnim && player.curAnim() !== playerJumpAnim && player.isGrounded()){
            idle(); 
        };

        if(player.curAnim() !== playerJumpAnim && !player.isGrounded() && player.heightDelta > 0) {
            player.use(sprite(playerJumpSprite));
            player.play(playerJumpAnim);
        };

        if(player.direction === "left"){
            player.flipX = true;
        } else{
            player.flipX = false;
        };

        if(player.pos.y > 2000){
            player.health = 0;
        }

        if(player.health <= 0  && player.curAnim() !== playerDeathAnim){
            player.isDead = true;
            player.use(sprite(playerDeathSprite));
            player.play(playerDeathAnim, {onEnd: () =>
            destroy(player)})
        }
    },
    
    //check if the player is touching the ground and set isGrounded to true
    onCollide("player", "ground", () => {
        player.isGrounded;
        !player.isCurrentlyJumping;
        console.log("grounded")
    }),

    //removing the hit boxes to avoid accidental collisions
    onAdd("enemyHit", () => {
        wait(0.2, ()=> {
            destroyAll("enemyHit")
        })
    }),

    onAdd("hit", () => {
        wait(0.2, () =>{
            destroyAll("hit")
        })
    }),
    //checking if the player gets hit
    onCollide("player", "enemyHit", (enemy) =>{
        const allEnemies = get("enemy");
        for(let i = 0; i< allEnemies.length; i++){
            enemy=allEnemies[i];
        }
        player.health -= enemy.damage;
    })
)})



/*go() is a kaboom function which takes a scene ID as a parameter and goes to that scene.
Can also pass an args parameter in oreder to, for example, reset or reinitialise the scene*/
go("MainMenu");