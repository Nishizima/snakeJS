    const board_border = 'white';
    const board_background = "black";
    const snake_col = 'lightblue';
    const snake_border = 'darkblue';

    const board = document.getElementById("snakeGame");
    const ctx = board.getContext("2d");


    let centerW = board.width / 2;
    let centerH = board.height / 2;
    let gameSize = 10;
    let tickRate = 100;
    let counterTick = 0;
    let gameTime = 0;
    let changing_direction = false;

    let snake = [{x:centerW, y: centerH},{x:centerW-gameSize, y: centerH},{x:centerW-(gameSize*2), y: centerH},{x:centerW-(gameSize*3), y: centerH},{x:centerW-(gameSize*4), y: centerH}];

    let dx = gameSize;
    let dy = 0;
    let xfood = 0;
    let yfood = 0;
    let score = 0;
    let maxLenght = (board.width * board.height) / gameSize;

    let gameEnded = false;
    let win = false;

    makeFood();

    main();
    document.addEventListener("keydown", changeDirection);

    function initGame()
    {
         counterTick = 0;
         gameTime = 0;
         changing_direction = false;

         snake = [{x:centerW, y: 200},{x:centerW-gameSize, y: 200},{x:centerW-(gameSize*2), y: 200},{x:centerW-(gameSize*3), y: 200},{x:centerW-(gameSize*4), y: 200}];

         dx = gameSize;
         dy = 0;
         
         score = 0;
         makeFood();
         $("#score").html(score);
    }


    function main()
    {
        setTimeout(function onTick(){
            
            counterTick++;
            if(counterTick * tickRate >= 1000)
            {
                gameTime++;
                counterTick = 0;
            }

            $("#gameTime").html(integerToMinSec(gameTime));



            if (gameOver())
            {
                gameEnded = true;
                endGame(false);
                return;
            }


            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();

            if(maxLenght <= snake.length)
            {
                gameEnded = true;
                endGame(true);
            }


            main();
        }, tickRate);

    }

    function endGame(win)
    {
        if(win)
        {
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillText("YOU WIN!!", centerW, centerH);
            ctx.font = "15px Arial";
            ctx.textAlign = "center";
            ctx.fillText("press any button to restart...", centerW, centerH+30);
        }
        else
        {
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER!!", centerW, centerH);
            ctx.font = "15px Arial";
            ctx.textAlign = "center";
            ctx.fillText("press any button to restart...", centerW, centerH+30);
        }

    }

    function integerToMinSec(time)
    {
        min = 0;
        sec = time;
        if(time >= 60)
        {
            min = Math.trunc(time/60);
            sec = time%60;
        }

        return (min < 10 ? "0"+min : min)+":"+(sec < 10 ? "0"+sec : sec);
    }


    function clearCanvas() {
      //  Select the colour to fill the drawing
      ctx.fillStyle = board_background;
      //  Select the colour for the border of the canvas
      ctx.strokestyle = board_border;
      // Draw a "filled" rectangle to cover the entire canvas
      ctx.fillRect(0, 0, board.width, board.height);
      // Draw a "border" around the entire canvas
      ctx.strokeRect(0, 0, board.width, board.height);
    }


    function drawSnakePart(snakePart)
    {
        ctx.fillStyle = 'lightblue';
        ctx.strokestyle = 'darkblue';
        ctx.fillRect(snakePart.x, snakePart.y, gameSize, gameSize);
        ctx.strokeRect(snakePart.x, snakePart.y, gameSize, gameSize);

    }

    function drawSnake()
    {
        snake.forEach(drawSnakePart);
    }

    function moveSnake()
    {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);

        const has_eaten_food = snake[0].x === xfood && snake[0].y === yfood;
        if (has_eaten_food) {

            score += 10;

            $('#score').html(score);

            makeFood();
        } else {
            snake.pop();
        }

    }

    function changeDirection(event)
    {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
        
        const keyPressed = event.keyCode;
        const goingUp = dy === -gameSize;
        const goingDown = dy === gameSize;
        const goingRight = dx === gameSize;  
        const goingLeft = dx === -gameSize;

        if (keyPressed === LEFT_KEY && !goingRight)
        {    
            dx = -gameSize;
            dy = 0;  
        }
    
        if (keyPressed === UP_KEY && !goingDown)
        {    
            dx = 0;
            dy = -gameSize;
        }
    
        if (keyPressed === RIGHT_KEY && !goingLeft)
        {    
            dx = gameSize;
            dy = 0;
        }
    
        if (keyPressed === DOWN_KEY && !goingUp)
        {    
            dx = 0;
            dy = gameSize;
        }
        if(gameEnded)
        {
            gameEnded = false;
            initGame();
            main();

        }
    }

    function gameOver()
    {  
        for (let i = 4; i < snake.length; i++)
        {    
            const has_collided = snake[i].x === snake[0].x && snake[i].y === snake[0].y
            if (has_collided) 
            return true
        }
    const hitLeftWall = snake[0].x < 0;  
    const hitRightWall = snake[0].x > board.width - gameSize;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > board.height - gameSize;
    
    return hitLeftWall ||  hitRightWall || hitToptWall || hitBottomWall
    }

    function makeRandom(min, max)
    {
        return Math.round((Math.random() * (max-min) + min) / gameSize) * gameSize;
    }

    function makeFood()
    {
        xfood = makeRandom(0, board.width - gameSize);
        yfood = makeRandom(0, board.height - gameSize);
        snake.forEach(function has_snake_eaten_food(part) {
            const has_eaten = part.x == xfood && part.y == yfood;
            if (has_eaten) makeFood();
        });
    }

    function drawFood()
    {
        ctx.fillStyle = 'lightgreen';
        ctx.strokestyle = 'darkgreen';
        ctx.fillRect(xfood, yfood, gameSize, gameSize);
        ctx.strokeRect(xfood, yfood, gameSize, gameSize);
    }



