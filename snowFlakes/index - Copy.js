window.onload = function (argument) {
	imageObj= new Image()
imageObj.src = 'snow1.png';
      imageObj.onload = function() {
//get the canvas and context and store in vars
var canvas = document.getElementById("sky");
var ctx = canvas.getContext("2d");

//set cancas dims to windows height and width
var W = window.innerWidth
var H = window.innerHeight
canvas.width= W
canvas.height= H

//generate the snowflakes and apply attributes
var mf=200 //max Flakes
var flakes = []



 
    // rest of code here

//loop through the empty flakes and apply attributes
for(var i=0; i<mf; i++)
{
	flakes.push({
		x: Math.random()*W,
		y: Math.random()*H,
		r: (Math.random()*5+7)/Math.sqrt(2)*2,
		d: Math.random()+1


     })
}
function drawSnowFlakes() {
ctx.clearRect(0,0,W,H)

      
        for(var i=0; i<mf; i++)
	{
		var f = flakes[i]
ctx.drawImage(imageObj, f.x,f.y,f.r,f.r );

		

	}
        
      
requestAnimationFrame(drawSnowFlakes)
	moveSnowFlakes()

}

//draw flakes onto canvas

//animate the flags
var angle = 0

function moveSnowFlakes(){
	angle += 0.01   

	for (var i =0 ; i <mf; i++) {

		//store current flake
		var f = flakes[i]	

		//Update X and Y coordinates of each snowflake through loop
		f.y+= Math.pow(f.d, 2)+1
		f.x+= Math.sin(angle)*2

		//if a snowflake reaches the bottom, send a new one to the top
		if (f.y>H){
			flakes[i] = {x:Math.random()*W, y:0, r:f.r, d:f.d}
		}	

		//if a snowflake reaches the right side, send a new one to the left
		if (f.x>W){
			flakes[i] = {x:f.x-W, y:f.y, r:f.r, d:f.d}

		//if a snowflake reaches the left side, send a new one to the right	
		}
		if (f.x<0){
			flakes[i] = {x:f.x+W, y:f.y, r:f.r, d:f.d}
		
		}		
	}
}      //  setInterval(drawSnowFlakes, 25)




drawSnowFlakes()
// window.onbeforeunload = function() {
//    return "Do you really want to leave our brilliant application?";
//    //if we returns nothing here (just calling return;) then there will be no pop-up question at all
//    //return;
// };
};

}




