//Load boards fromfile or manually
//these 3 const variables are keys within arrays to populate the tiles
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

  //CREATE VARIABLES
  var timer;
  var timeRemaining;
  var lives;
  var selectedNum;
  var selectedTile;
  var disableSelect;

  window.onload = function() {
      //run startgamefunction when button is clicked
      id("start-btn").addEventListener("click", startGame);
      //add event listener to each number in number container
      for (let i = 0; i < id("number-container").children.length; i++) {
          id("number-container").children[i].addEventListener("click", function () {
            //If selecting is not disabled
            if (!disableSelect) {
                //if number is already selected
                if (this.classList.contains("selected")) {
                    //then remove selection
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    //deselect all other number
                    for (let i = 0; i < 9; i++) {
                        id("number-container").children[i].classList.remove("selected");
                    }
                    //Select it and update selectedNum Variable
                    this.classList.add("selected");
                    selectedNum =this;
                    updateMove();
            }
          }
      });
  }
}

  function startGame() {
      console.log("start!!!! ALREADY!!")
      //SET DIFFICULTY FOR BOARD
      if (id("diff-1").checked) board = easy[0];
      else if (id("diff-2").checked) board = medium[0];
      else board = hard[0];

      //set lives to 3 and enable number and tile selection with boolean
      lives = 100;
      disableSelect = false;
      id("lives").textContent = "Lives Remaining: 100";
      //Create board based on difficulty
      generateBoard(board);
      //start the timer
      startTimer();
      //Sets theme based on input
      if (id("theme-1").checked) {
          qs("body").classList.remove("dark");
      } else {
         qs("body").classList.add("dark"); 
      }
      //show number container
      id("number-container").classList.remove("hidden");
  }

  function startTimer() {
      //set time remaining based on input
      if (id("time-1").checked) timeRemaining = 600;
      else if (id("time-2").checked) timeRemaining = 900;
      else  timeRemaining = 1200;
      //set timer for first second
      id("timer").textContent = timeConversion(timeRemaining);
      //sets timer to update every second
      timer = setInterval(function() {
        timeRemaining --;
        //if no time remiaining end game, interval length is 1000 miliseconds
        if (timeRemaining === 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
      }, 1000)
  }
  //converts seconds into string of MM:SS FORMAT
  function timeConversion(time) {
      let minutes = Math.floor(time /60);
      if (minutes < 10) minutes = "0" + minutes;
      let seconds = time % 60;
      if (seconds < 10) seconds = "0" + seconds;
      return minutes + ":" + seconds;
  }

  function generateBoard(board) {
      //clear previous board (NEW GAME)
      clearPrevious();
      //let used to increment tile ids
      let idCount = 0;
      //81 tiles
      for (let i = 0; i < 81; i++) {
          //create a new paragraph element
          let tile = document.createElement("p");
          if (board.charAt(i) != "-") {
              //set tile to correct number
              tile.textContent = board.charAt(i);
          } else {
              //add click event listener to tile
              tile.addEventListener("click", function() {
                  if (!disableSelect) {
                      //if the tile is already selected
                      if (tile.classList.contains("selected")) {
                          //then remove selection
                          tile.classList.remove("selected");
                          selectedTile = null;
                      } else {
                         //deselect all other tile
                         for (let i = 0; i < 81; i++) {
                             qsa(".tile")[i].classList.remove("selected");
                             //remember qsa for query selector all,return it all through the array
                         }
                         //add selection and update variable
                         tile.classList.add("selected");
                         selectedTile = tile;
                         updateMove();
                      }
                  }
              })
          }
          //assign tile id count
          tile.id = idCount;
          //increment to the next tile
          idCount ++;
          //add tile class to all tiles
          tile.classList.add("tile");
          if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 & tile.id < 54)) {
              tile.classList.add("bottomBorder");
          }
          if ((tile.id + 1) % 9 === 3 || (tile.id + 1) % 9 === 6) {
              tile.classList.add("rightBorder");
          }    
          //add tile to board
          id("board").appendChild(tile);
      }
  }

  function updateMove() {
      //if a tile and a number is selected
      if (selectedTile && selectedNum) {
          //set the tile to the correct number
          selectedTile.textContent = selectedNum.textContent;
          //if the number matches the corresponding number in the solution key
          if (checkCorrect(selectedTile)) {
            // deselect the tiles
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //clear the selected variables
            selectedNum = null;
            selectedTile = null;
            //check if board is completed
            if (checkDone()) {
                endGame();
            }
            //if the number does not match the solution key
            } else {
                //disable selecting new numbers
                disableSelect = true;
                //make the tile turn red
                selectedTile.classList.add("incorrect");
                //run in one second
                setTimeout(function() {
                    //subtract lives by one
                    lives --;
                    //if no lives remaining
                    if (lives === 0) {
                        endGame();
                    } else {
                        // if lives is not equal to zero
                        //updates lives text
                        id("lives").textContext = "Lives Remaining:" + lives;
                        //Renable selecting numbers and tiles
                        disableSelect = false;
                    }
                    //Restore tile color and remove selected from both
                    selectedTile.classList.remove("incorrect");
                    selectedTile.classList.remove("selected");
                    selectedNum.classList.remove("selected");
                    //clear the tiles text and clear selected variables
                    selectedTile.textContent = "";
                    selectedTile = null;
                    selectedNum = null;
                }, 1000);
          }
      }
  }

  function endGame () {
      //disable moves and stops timer
      disableSelect = true;
      clearTimeout(timer);
      //DISPLAY WIN OR LOSS MESSAGE
      if (lives === 0 || timeRemaining === 0) {
            id("lives").textContent = "Sorry You Lose!"
            id("lives").textContent = "You Won, Awesome!"
      }      
  }
 // this helps us to actually play the sudoku without it removing the marked tiles
  function checkDone() {
      let tiles = qsa(".tile");
      for (let i = 0; i < tiles.length; i++) {
          if (tiles[i].textContent === "") return false;
      }
      return true;
  }

  function checkCorrect(tile) {
      //set solution based on difficulty selection
      let solution; // same code from startGame function
      if (id("diff-1").checked) solution = easy[1];
      else if (id("diff-2").checked) solution = medium[1];
      else solution = hard[1];
      //if tile's number is equal to solution's number
      if (solution.charAt(tile.id) === tile.textContent) return true;
      else return false;
  }
 
  function clearPrevious() {
      //Access all tiles
      let tiles = qsa(".tile");
      //remove each tile
      for (let i = 0; i < tiles.length; i++) {
          tiles[i].remove();
      }
      //if there is a timer clear it
      if (timer) clearTimeout(timer);
      //Deselect any numbers
      for (let i = 0; i < id ("number-container").children.length; i++) {
          id("number-container").children[i].classList.remove("selected");
      }
      //clear selected variables
      selectedTile = null;
      selectedNum = null;
  }
  
  //helper function
  function id(id) {
      return document.getElementById(id) // use to type id names faster
  }

  function qs(selector) {
      return document.querySelector(selector);
  }

  function qsa(selector) {
    return document.querySelectorAll(selector);
}

