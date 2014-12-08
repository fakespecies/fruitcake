/*
 ___            ___     __   __   ___  __     ___  __  
|__   /\  |__/ |__     /__` |__) |__  /  ` | |__  /__` 
|    /~~\ |  \ |___    .__/ |    |___ \__, | |___ .__/ 

snow.js hacked by ZVK
original source: 
http://thecodeplayer.com/walkthrough/html5-canvas-snow-effect
*/
window.onload = function(){
		window.audioIsLoaded = false;
		window.audioIsPlaying = false;
		initAudio();
		//canvas init
		var canvas = document.getElementById("canvas")
			,ghost = document.getElementById("ghost")
			,ctx = canvas.getContext("2d")
			,white = "#FFFFFF"
			,red = "#AA0014"
			,hover = false
			,logo = new Image()
			,star = new Image()
			,fruitcake = new Image()
			,bowl = new Image()
			,cherries = new Image()
			,cinnimon = new Image()
			,flour = new Image()
			,lemons = new Image()
			,nuts = new Image()
			,l = 0
			,a = 0
			,alpha = 0
			,W = window.innerWidth
			,H = window.innerHeight;

		canvas.width = W;
		canvas.height = H;

		ghost.width = W;
		ghost.height = H;

		//landing page art .png
		logo.src = './images/fruitcake_logo.png';			
		star.src = './images/star.png';
		fruitcake.src = './images/fruitcake_cartoon.png';
		fruitcake.opacity = 0.5;

		//main page art .pngvar itemsInBowl = [];
		bowl.src = './images/bowl.png';
		cherries.src = './images/cherries.png';
		cinnimon.src = './images/cinnimon.png';
		flour.src = './images/flour.png';
		lemons.src = './images/lemons.png';
		nuts.src = './images/nuts.png';
		var ingredients = [cherries, cinnimon, flour, lemons, nuts];
		var positions = [{x: W*0.15-(cherries.width), y: H*0.35}
						,{x: W*0.30-(cinnimon.width), y: H*0.2}
						,{x: W*0.45-(flour.width), y: H*0.1}
						,{x: W*0.60-(lemons.width), y: H*0.2}
						,{x: W*0.75-(nuts.width), y: H*0.35}];
		var itemsInBowl = [false, false, false, false, false];
		var ingredientsIndex;

		
		//snowflake particles
		var mp = 300; //max particles
		var particles = [];
		for(var i = 0; i < mp; i++)
		{
			particles.push({
				x: Math.random()*W, //x-coordinate
				y: Math.random()*H, //y-coordinate
				r: Math.random()*4+1, //radius
				d: Math.random()*mp//density
			});
		}
		
		//Lets draw the flakes
		function draw()
		{
			ctx.clearRect(0, 0, W, H);
			
			ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
			ctx.beginPath();
			for(var i = 0; i < mp; i++){
				var p = particles[i];
				ctx.moveTo(p.x, p.y);
				ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
			}
			ctx.fill();
			update();
			if(!window.audioIsPlaying){
				ctx.save();
				ctx.translate(x,y)
				ctx.rotate(Math.PI/a/4);
				var x = (W/2)-(star.width/2);
				var y = (H/2)-(star.height/2)+(logo.height/2);
				drawFromFile(star, x, y);
				ctx.restore();
				if (a < 80){
					a++;
					if(a > 20){
						ctx.save();
						alpha += 0.015; 
						ctx.globalAlpha = alpha;
						x = (W/2)-(fruitcake.width/2);
						y = (H/2)-(fruitcake.height)+(logo.height*.8);
						drawFromFile(fruitcake, x, y);
						x = (W/2)-(logo.width/2);
						y = (H/2)-(logo.height);
						drawFromFile(logo, x, y);
						ctx.restore();
					}
					}else{
						x = (W/2)-(fruitcake.width/2);
						y = (H/2)-(fruitcake.height)+(logo.height*.8);
						drawFromFile(fruitcake, x, y);
						x = (W/2)-(logo.width/2);
						y = (H/2)-(logo.height);
						drawFromFile(logo, x, y);
						if(audioIsLoaded){
							if(!hover){
								drawPlayButton(white, ctx);
							}
							else{
								drawPlayButton(red, ctx);
							}
						}
						else{
							ctx.save();
							ctx.font="50px Arial";
							x = (W/2)-(logo.width/3);
							y = (H/2)-(logo.height);
							if (l <= 25){
								ctx.fillText("loading .",x,y);
							}
							else if (l <= 50){
								ctx.fillText("loading . .",x,y);
							}
							else if (l <= 75){
								ctx.fillText("loading . . .",x,y);	
							}
							else{
								l = 0;
							}
							ctx.restore();
							l++;
						}
					}
				}
			else if(window.audioIsPlaying){
				ctx.save();
				drawFromFile(bowl, (W/2)-(bowl.width/2), (H/2));
				drawIngredients();
				ctx.restore();

			}
		}
		function drawIngredients(){
			ctx.save();
			for(var i = 0; i < ingredients.length; i++){
				if(itemsInBowl[i]){
					ctx.globalAlpha = 1;
					drawFromFile(ingredients[i], positions[i].x, positions[i].y);
				} else {
					ctx.globalAlpha = 0.5;
					drawFromFile(ingredients[i], positions[i].x, positions[i].y);
				}
			}
			ctx.restore();
		}
		function clearCanvas(canvas){
			canvas.width = canvas.width;
		}
		function drawPlayButton(color, context){
			context.save()
			context.beginPath();
			x = (W/2)-50;
			y = H*0.64;
			context.globalAlpha = 0.75;
			context.moveTo(x,y);
			context.lineTo(x+100,y+50);
			context.lineTo(x,y+100);
			context.lineTo(x,y);
			context.lineTo(x+100,y+50);
			context.fillStyle = color;
			if (color){
				context.fill();	
				context.strokeStyle = red;
				context.lineWidth = 7;
				context.stroke();
			}
			context.restore();
		}
		canvas.addEventListener('mousemove', mouseOver, false);
		canvas.addEventListener('touchmove', mouseOver, false);
		canvas.addEventListener('click', clickPlay, false);
		
		function drawInBowl(){

		}
		//click
		var z = [false, false, false, false, false];
		function dragIngredient(evt){
			if (hover){
				if(itemsInBowl[ingredientsIndex]){
					itemsInBowl[ingredientsIndex] = false;
					setVolume(ingredientsIndex+1, 0);//volume
				} else {
					itemsInBowl[ingredientsIndex] = true;
					setVolume(ingredientsIndex+1, 1);//vol
				}
				
			} else {
				itemsInBowl[ingredientsIndex] = false;
			}
		}
			
		function hitOrMiss(context, evt){
			//we have a hit!
			if(context.isPointInPath(evt.clientX, evt.clientY)){
				hover = true;
				document.body.style.cursor = 'pointer';
			} else {//it's a miss
				hover = false;
				document.body.style.cursor = 'crosshair';
				clearCanvas(ghost);
			}
			return hover;
		}

		function drawHoverZones(context, posIndex){
			clearCanvas(ghost);
			var tempX = positions[posIndex].x+(ingredients[posIndex].width/2);
			var tempY = positions[posIndex].y+(ingredients[posIndex].height/2);
			context.arc(tempX, tempY, 250/2, 0, 2 * Math.PI, false);//ghost button
			context.globalAlpha = .2;
			context.lineWidth = 15;
			context.stroke();
			return context;
		}

		function mouseOver(evt){
			if(audioIsPlaying){//music section has started
				var ghstCtx = ghost.getContext('2d');
				for (var i = 0; i < positions.length; i++){
					var hit = hitOrMiss(drawHoverZones(ghstCtx, i), evt);
					if(hit){
						ingredientsIndex = i;
						break;
					} else {
						ingredientsIndex = i;
					}
				}
			}
			else{//we're still loading page
				var ghstCtx = ghost.getContext('2d');
				drawPlayButton(null, ghstCtx);
				hitOrMiss(ghstCtx, evt);
			}
		}

		function clickPlay(evt){
			if (hover){
				window.audioIsPlaying = true;
				playAllSounds();
				canvas.removeEventListener('click', clickPlay, false);
				canvas.addEventListener('mousedown', dragIngredient, false);
			}
		}

		function drawFromFile(base_image, x, y){
		   	ctx.drawImage(base_image, x, y);
		}
		
		//Function to move the snowflakes
		//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
		var angle = 0;
		function update()
		{
			angle += 0.01;
			for(var i = 0; i < mp; i++)
			{
				var p = particles[i];
				//Updating X and Y coordinates
				//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
				//Every particle has its own density which can be used to make the downward movement different for each flake
				//Lets make it more random by adding in the radius
				p.y += Math.cos(angle+p.d) + 1 + p.r/2;
				p.x += Math.sin(angle) * 2;
				
				//Sending flakes back from the top when it exits
				//Lets make it a bit more organic and let flakes enter from the left and right also.
				if(p.x > W+5 || p.x < -5 || p.y > H)
				{
					if(i%3 > 0) //66.67% of the flakes
					{
						particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
					}
					else
					{
						//If the flake is exitting from the right
						if(Math.sin(angle) > 0)
						{
							//Enter from the left
							particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
						}
						else
						{
							//Enter from the right
							particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
						}
					}
				}
			}
		}
		
		//animation loop
		setInterval(draw, 33);
		console.log("###### #####  #    # # #####  ####    ##   #    # ###### ");
		console.log("#      #    # #    # #   #   #    #  #  #  #   #  #      ");
		console.log("#####  #    # #    # #   #   #      #    # ####   #####  ");
		console.log("#      #####  #    # #   #   #      ###### #  #   #      ");
		console.log("#      #   #  #    # #   #   #    # #    # #   #  #      ");
		console.log("#      #    #  ####  #   #    ####  #    # #    # ###### ");
		console.log("_________________________________________________________");
		console.log("You can get source code at the fake species github!");
		console.log("...also FREE albums at fakespecies.com");
	}