var CANVAS_WIDTH = 1024;	//画布宽度
var CANVAS_HEIGHT = 768;	//画布高度
var currentTimeSeconds = 0;	//当前秒数
var MARGIN_LEFT = 30;	//左边框距离
var MARGIN_TOP = 30;	//上边框距离
var RADIUS = 8;	//小球半径
var DIGIT_COLOR = "rgb(0,102,153)";	//小球颜色
var obstruction = 0.75;	//阻力系数

const endDateTime = new Date(2017, 4, 19, 19, 0, 0);

// var ball = { x:512, y:100, r:RADIUS, g:1, vx:-4, vy:-10, color:"#005588" };

const balls = [];	//小球集合
const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];	//颜色集合


window.onload = function() {
	var canvas = document.getElementById("canvas");
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	var context = canvas.getContext("2d");

	currentTimeSeconds = getCurTimeSeconds();

	// render(context);
	// update();

	

	(function loopRender(context) {
		setTimeout(function() {
			render(context);
			update();
			loopRender(context);
		}, 20)
	})(context);
	

}

//绘画图形
function render(cxt) {
	
	var hours = parseInt(currentTimeSeconds/3600);
	var minutes = parseInt((currentTimeSeconds - hours*3600)/60);
	var seconds = currentTimeSeconds % 60;

	cxt.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);	//刷新画布指定位置
	// cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);	//刷新画布指定位置

	//时
	renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), cxt);
	renderDigit(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, hours%10, cxt);

	//冒号
	renderDigit(MARGIN_LEFT + 30*(RADIUS+1), MARGIN_TOP, 10, cxt);

	//分
	renderDigit(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), cxt);
	renderDigit(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, minutes%10, cxt);

	//冒号
	renderDigit(MARGIN_LEFT + 69*(RADIUS+1), MARGIN_TOP, 10, cxt);

	//秒
	renderDigit(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10), cxt);
	renderDigit(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, seconds%10, cxt);

	//小球运动
	renderBalls(cxt);
}

//更新
function update() {
	var nextTimeSeconds = getCurTimeSeconds();
	var nextHours = parseInt(nextTimeSeconds/3600);
	var nextMinutes = parseInt((nextTimeSeconds - nextHours*3600)/60);
	var nextSeconds = nextTimeSeconds % 60;

	var curHours = parseInt(currentTimeSeconds/3600);
	var curMinutes = parseInt((currentTimeSeconds - curHours*3600)/60);
	var curSeconds = currentTimeSeconds % 60;

	if(nextSeconds != curSeconds) {
		currentTimeSeconds = nextTimeSeconds;

		if(parseInt(nextHours/10) != parseInt(curHours/10)) {
			addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours/10));
			
		}
		if(curHours%10 != nextHours%10) {
			addBalls(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, curHours%10);
		}
		if(parseInt(nextMinutes/10) != parseInt(curMinutes/10)) {
			addBalls(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes/10));
		}
		if(curMinutes%10 != nextMinutes%10) {
			addBalls(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, curMinutes%10);
		}
		if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)) {
			addBalls(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds/10));	
		}
		if(curSeconds%10 != nextSeconds%10) {
			addBalls(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, curSeconds%10);
		}
		console.log(balls.length);

	}

	updateBalls();
	
	
}

//获取当前秒数
function getCurTimeSeconds() {
	var curDateTime = new Date();
	var dist = Math.round((endDateTime.getTime() - curDateTime.getTime())/1000);
	return dist > 0 ? dist : 0
}

//绘画数字
function renderDigit(x, y, num, cxt) {
	cxt.fillStyle = DIGIT_COLOR;
	var digitDataArray = digit[num];
	for(var i = 0; i < digitDataArray.length; i++) {
		for(var j = 0; j < digitDataArray[i].length; j++) {
			if(digitDataArray[i][j] == 1) {
				cxt.beginPath();
				cxt.arc(x + j*2*(RADIUS+1) + (RADIUS+1), y + i*2*(RADIUS+1) + (RADIUS+1), RADIUS, 0, 2*Math.PI);
				cxt.closePath();
				cxt.fill();
			}
		}
	}
}

//添加小球 
function addBalls(x, y, num) {
	for(var i = 0; i<digit[num].length; i++) {
		for(var j = 0; j<digit[num][i].length; j++) {
			if(digit[num][i][j] == 1) {
				var aBall = {
					x: x + j*2*(RADIUS+1) + (RADIUS+1),
					y: y + i*2*(RADIUS+1) + (RADIUS+1),
					vx: 4 * Math.pow(-1, Math.ceil(1000 * Math.random())),
					vy: -5,
					r: RADIUS,
					g: 1.5 * Math.random(),
					color: colors[Math.floor(Math.random() * colors.length)]
				}
				balls.push(aBall);
			}
		}
	}
}

//更新小球运动轨迹
function updateBalls(){

	for(var i = 0; i < balls.length; i++) {
		//改变小球运动轨迹
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if(balls[i].y >= CANVAS_HEIGHT + balls[i].r) {
			balls[i].y = CANVAS_HEIGHT + balls[i].r;
			balls[i].vy = -balls[i].vy * obstruction;
		}
	}

	var counts = 0;
	//将在界面内的小球推前
	for(var i = 0; i < balls.length; i++) {
		if(balls[i].x + balls[i].r > 0 && balls[i].x - balls[i].r < CANVAS_WIDTH) {
			balls[counts++] = balls[i];
		}
	}
	//移除多余的球
	// while(balls.length > counts) {
	// 	balls.pop();
	// }

	balls.splice(counts, balls.length - counts);
}

//绘画小球
function renderBalls(cxt) {
	for(var i = 0; i < balls.length; i++) {
		cxt.fillStyle = balls[i].color;
		cxt.beginPath();
		cxt.arc(balls[i].x, balls[i].y, balls[i].r, 0, 2*Math.PI);
		cxt.closePath();
		cxt.fill();
	}

}