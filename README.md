# Jump Ninja Jump

Jump Ninja Jump is a simple, interactive 2D platformer 

The site can be accessed [here](https://endamagennis.github.io/kaboomjs-ninja-game/)

---
## Background to Jump Ninja Jump

I have loved playing games for most of my life and in recent years have begun learning game development as a hobby. Jump Ninja Jump, or JNJ, is an opportunity to merge my passion for game development with my course through a JavaScript library called [Kaboomjs](https://kaboomjs.com/). The original concept for JNJ was to scale a map and collect a maguffin, but as I grew more familiar with the [Kaboomjs](https://kaboomjs.com/) library, the scope and complexity increased. It is still, by all accounts, a simple game, but the game now encorporates enemys and combat.

---
## User Stories

* As a user, I want to understand the control scheme
* As a user, I want to have an accesible control scheme
* As a user, I want to be able to play on desktop and mobile
* As a user, I want to enjoy the game, free of glitches and bugs
* As a user, I want to have an enjoyable experience and have clear progression in the game
* As a user, I want to have a reason to play multiple times

## Features

+ ### Main Menu
    ![Main Menu](documentation/images/readme-main-menu.jpg)
 --- 
+ ### Pause Menu
    ![Pause Menu](documentation/images/readme-pause-menu.jpg)
--- 
+ ### Controls Menu
    ![Controls Menu](documentation/images/readme-controls-menu.jpg)
---
+ ### Game Over Screen
    ![Game Over](documentation/images/readme-game-over-screen.jpg)
--- 
+ ### Sprite Animations
    The player and enemies each have various animations which will play when triggered through user input, or determined by other game logic.
---
+ ### Audio
    The player and the enemies make sounds when attacking or being hit. There is also music which the user can choose whether to play or not.
--- 
+ ### Fully Interactive Gamplay
    You can view a video of the gameplay [here](https://youtu.be/vprUPLwJVJE) 
---
    
+ ### Enemy AI System
    Using the Kaboomjs built-in finite state machine, enemies are able to move autonomously and decide to attack the player. When the player is out of reach, the enemy will then either ilde for a short period or continue their short patrol. 
---
+ ### Footer
    The footer contains a link to my gitHub homepage, should the user decide to follow other projects or work.
 
--- 
## Technologies Used
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) was the foundation of the site architecture.
- [CSS](https://developer.mozilla.org/en-US/docs/Web/css) was used for styling the HTML elements.
- [CSS Flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox) was used for responsive design on each page.
- [JavaScript](https://www.w3schools.com/js/) was used to create the logic basis for the game.
- [Kaboomjs](https://kaboomjs.com/) tutorials and playgrounds wer used to understand the funtionality and implementation of kaboom methods and components. 
- [Balsamiq](https://balsamiq.com/) was used to make wireframes.
- [VSCode](https://code.visualstudio.com/) was used as the primary code editor.
- [Git](https://git-scm.com/) was used for the version control of the website.
- [GitHub](https://github.com/) was used to host the code and deploy the site.
- [GIMP](https://www.gimp.org/) was used to create and edit assets for the game.
- [Stack Overflow](https://stackoverflow.com/) was used for some troubleshooting and implementation.
- [Craftpix](https://craftpix.net/) was used to source the player and enemy sprites.
- [Google Images](https://www.google.com/imghp?hl=EN) was used to source some of the images.
- [Discord](https://discord.com/) was used for kaboom specific troubleshooting.
- [Microsoft Clipchamp](https://app.clipchamp.com/login) was used to create GIFs and edit videos.
--- 
## Design

### Colour Scheme

---
### Wireframes

#### Mobile devices

#### Tablets

#### Desktop

--- 
## Testing
+ ### Responsive Design

### Edge

### Firefox


+ ### Manual Testing

| Feature | Action | Expectation | Pass | Comment |
| --- | --- | --- | --- | --- |
| Menu Navigation|
|| Click Start Game button on main menu| Initialises MainGame| Yes||
|| Press "P" during game| Runs Pause Scene | Yes ||
|| Press "Esc" during game | Runs MainMenu Scene| Yes||
|| Click Continue during pause| Returns to MainGame scene| Yes ||
|| Click Main Menu during pause| Goes to Main Menu| Yes ||
|| Click Controls button on main menu| Runs Controls scene| Yes||
|| Click Back to Menu button in controls| Returns to Main Menu| Yes||
|| Press "R" during Death scene| Reinitialises MainGame Scene| Yes ||
| Movement|
|        | Press and hold "D" | Player moves right while button is pressed| Yes |  |
|| Press and hold "A" | Player moves left while button is pressed| Yes||
|| Press "E" | Player attacks | Yes ||
|||Player attack sound plays| Yes ||
|| Press "Space" bar | Player jumps"| Yes ||
|| Release "D" | Player returns to idle state | Yes | |
|| Release "A" | Player returns to idle state | Yes | |
|| Press "Space" while holding "A" or "D"| Player jumps while moving in relavant direction| Yes||
---
+ ### Bugs And Fixes
    - #### Player would phase trough the ground unexpectedly (fixed)
        
        In the earlier stages of development, I had many more ground tiles as part of the map. Each of these sprites needed to be renderered during play and would cause frequent stuttering, breaking the collision between player and ground. Removing the large number of tiles, removed the most violent stuttering and allowed for smoother collisions.
    - #### When pausing during an action the game would not unpause and would crash (fixed)
    
        When performing an animation, the agent must be using the correct sprite. Because the player was already using a sprit during an action, reinitialising the scene contained the line
        ````js
        player.play("idleAnim");
        ````
        which the player would not have access to.

    - #### After this solution, a new bug was created. Now after pressing continue during pause, the player would still be in the correct state but all enemies would be reinitialised, and uable to be killed (fixed)

        This time a check was introduced to see is the player was going to the game scene from the Main Menu or the pause menu. A variable pauseCount was created and initialised to 0.
        ````js
        let pauseCount =0;
        //Later in the code
        scene("PauseMenu", () =>{
            //entering the scene increments pauseCount
            pauseCount ++;
            //more code
        })

        //later in code

        scene("MainGame", () =>{

        //checking if the game has been paused
            if(pauseCount === 0){
                //if not, initialising player and enemies
                player = createPlayer(64, 64, 100, 1620, "player");
                enemy1 = createEnemy(64, 64, 600, 1630, "enemy1");
                enemy2 = createEnemy(64,64, 461, 931, "enemy2");
                enemy3 = createEnemy(64,64, 1661, 294, "enemy3");
            }
            //more code
        })
        ````
        This means that the enemies and players will only be initialised if the game has not been paused. Otherwise they will remain in statis, with all of their settings intact. Returning to MainMenu also resets pauseCount to 0.
    
    - #### Killing one enemy took three times as many hits and also killed all other enemies (fixed)
    
        In order to reference the enemy I was hitting I had tried to make a for loop and cylce through objects labelled "enemy".
        While this worked to register the hit, each hit was cylcing through the enemies, meaning each enemy was taking damage, starting with the enemy at the 0th position in the array. Refactoring how the enemy was intantiated and updating the parameters of the onCollide() function fixed this.

    -  #### [Glitcy AI](https://youtu.be/3-czWisVgto) (fixed)
    
        Though careful reading of the documentation around kaboom's [finite state machine](https://kaboomjs.com/#state) and refactoring of enemyAI() function, the AI is much better

    - #### [Jumping animation bug](https://youtu.be/QOo6-xfK1dk) ([fixed](https://youtu.be/AnJSKXlirOY))
        
        This was a case of implementing extra checks to make sure the player was finished jumping before returning to an idle state.
---
## Validator testing
+ ### [HTML Validator](https://validator.w3.org/)

    ![Valid HTML](documentation/valid-html.png)
            
+ ### [CSS Validator](https://jigsaw.w3.org/css-validator/)

    ![Valid CSS](documentation/vaild-css.png)

+ ### [JSHint](https://jshint.com/)

    ![Valid JavaScript](documentation/valid-js-hint.png)
    
    For this vaildation I configured the validator to ignore undefined variables as each one was part of the kaboom library and was often a function. The unused variables listed are intended for future implementation.
      
+ ### Accessibility and performance 

---
## Deployment
- This site was deployed using Github Pages
- A repository was created on Github from the [Code Institute Full Template](https://github.com/Code-Institute-Org/ci-full-template)
    ![Create a Repo](documentation/create-a-repo.png)
- The repository url was copied and input as a workspace in [Codeanywhere](https://app.codeanywhere.com/)
    ![Clone a repo](documentation/clone-repo.png)
    ![Link to Github](documentation/link-to-git.png)
    ![Create a workspace](documentation/create-workspace.png)
- The HTML and CSS were edited in the workspace
- Using the built-in terminal, changes were git added, git committed, and git pushed to the main branch of the Github repository
    ![Workspace and Terminal](documentation/workspace-and-terminal.png)
- From the main branch of the [Github Repository](https://endamagennis.github.io/tuatha_transport/index.html), settings was selected
    ![Navigate to settings](documentation/navigate-to-settings.png)
- From there I navigated to the Pages tab
    ![Navigate to pages](documentation/navigate-to-pages.png)
- Under Build and Deployment, I navigated to Branch, selected main, selected root, and clicked save
    ![Select and save](documentation/save-page.png)
- Github then built and deployed the site in a matter of minutes

---

## Future improvements

---
## Credits

+ #### Content
        
+ #### Media
    
+ #### Tools

---

## Acknowledgments

---

