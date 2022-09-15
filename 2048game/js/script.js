var RN = 4, CN = 4; //定义4x4表格的列数，行数
var data; //定义变量data保存二位数组
var score = 0; //定义变量score保存得分
var status = 0; //定义变量status作为游戏状态；
const RUNNING = 1, GAMEOVER = 0; //0表示游戏结束，1表示游戏运行中

function start(){//游戏启动
	status = RUNNING;
	score = 0;
	data = [];
	for(var r=0;r<RN;r++){
		data.push([]);
		for(var c=0;c<CN;c++){
			data[r][c]=0;
		}
	}
	randomNum();
	randomNum();
	updateView();
	document.onkeydown=function (e) {
	    //判断按键号
	    switch (e.keyCode){
	        //左
	        case 37: moveLeft(); break;
	        //上
	        case 38: moveUp(); break;
	        //右
	        case 39: moveRight(); break;
	        //下
	        case 40: moveDown(); break;
	    }
	}
}

function updateView(){//更新视图
	for(var r = 0;r<RN;r++){//通过双重循环遍历二位数组data
		for(var c = 0;c<CN;c++){
			var id = "c" + r + c; //拼接id
			var div = document.getElementById(id); //通过id找到对应的div
			if(data[r][c] != 0){//如果r行c列不为0，将值保存到div的内容中，否则清空页面中div的内容
				div.innerHTML = data[r][c];
				div.className = "n" + data[r][c];
			}else{
				div.innerHTML = "";
				div.className = "";
			}
		}
	}
	var span = document.getElementById("score"); //找到得分的id
	span.innerHTML = score; //将得分显示到页面上
	var div = document.getElementById("gameover"); //找到游戏结束的div
	if(status == GAMEOVER){//如果游戏结束
		var span = document.getElementById("final");//找到id为final的得分
		span.innerHTML = score; //将最终分数显示在页面上
		div.style.display = "block"; //让gameover的div显示出来
	}else{
		div.style.display = "none"; //隐藏gameover的div
	}
}

function randomNum(){//随机生成2或4
	while(true){
		var r = parseInt(Math.random()*RN);//随机生成一个 0~RN-1 之间的整数作为行数
		var c = parseInt(Math.random()*CN);//随机生成一个 0~CN-1 之间的整数作为列数
		if(data[r][c] == 0){//如果第r行第c列的值为0
			data[r][c] = Math.random()<0.5 ? 2 : 4; //在第r行第c列随机生成2或4
			break;
		}
	}
}

function moveLeft(){//左移每一行
	var before = String(data); //移动前将data转为字符串保存到before
	for(var r=0;r<RN;r++){//遍历每一行
		moveLeftRow(r); //左移第r行
	}
	var after = String(data); //移动后将data转为字符串保存到after
	if(before != after){//如果移动前后不相等
		randomNum(); //随机在空白格处生成2或4
		if(isGameOver()) status = GAMEOVER; //如果游戏结束，修改状态为GAMEOVER
		updateView(); //更新视图
	}
}
function moveLeftRow(r){//左移第r行
	for(var c=0;c<CN-1;c++){//遍历每一列
		var nextc = getNextcInRow(r,c);//找到r行c列右侧不为0的位置
		if(nextc == -1) break; //如果没找到退出循环
		else{
			if(data[r][c] == 0){//如果r行c列的位置为0
				data[r][c] = data[r][nextc]; //把nextc位置的值赋给r行c列的位置
				data[r][nextc] = 0; //nextc的值给出后设为0
				c--; //将c-1(否则会影响相同值的合并)
			}else if(data[r][c] == data[r][nextc]){//在同一行上有相同值
				data[r][c] *= 2; //让左侧的值翻倍(相当于两个方块合并)
				score += data[r][c]; //计算得分
				data[r][nextc] = 0; //nextc的值被合并后消失，设为0
			}
		}
	}
}
function getNextcInRow(r,c){//找到r行c列右侧不为0的位置
	for(var nextc=c+1;nextc<CN;nextc++){//从r行c列位置的后一位开始遍历
		if(data[r][nextc] != 0) return nextc; //nextc不为0则返回该位置的值
	}
	return -1; //找不到则返回-1
}

function moveRight(){//右移每一行
	var before = String(data); //移动前将data的值转为字符串保存到before
	for(var r=0;r<RN;r++){//遍历每一行
		moveRightRow(r); //右移第r行
	}
	var after = String(data); //移动后将data的值转为字符串保存到after
	if(before != after){//如果移动前后不相等
		randomNum(); //随机在空白格生成2或4
		if(isGameOver()) status = GAMEOVER; //如果游戏结束修改状态为GAMEOVER
		updateView(); //更新页面
	}
}
function moveRightRow(r){//右移第r行
	for(var c=CN-1;c>0;c--){
		var prevc = getPrevcInRow(r,c); //查找r行c列左侧不为0的位置
		if(prevc == -1) break; //没找到退出循环
		else{
			if(data[r][c] == 0){//如果r行c列的位置为0
				data[r][c] = data[r][prevc]; //将prevc位置的值赋给r行c列位置
				data[r][prevc] = 0; //将prevc位置的值设为0
				c++;
			}else if(data[r][c] == data[r][prevc]){
				data[r][c] *= 2;
				score += data[r][c];
				data[r][prevc] = 0;
			}
		}
	}
}
function getPrevcInRow(r,c){//找到r行c列左侧不为0的位置
	for(var prevc = c-1;prevc>=0;prevc--){
		if(data[r][prevc] != 0) return prevc;
	}
	return -1;
}

function moveUp(){//上移每一列
	var before = String(data);
	for(var c=0;c<CN;c++){
		moveUpCol(c);
	}
	var after =String(data);
	if(before != after){
		randomNum();
		if(isGameOver()) status = GAMEOVER;
		updateView();
	}
}
function moveUpCol(c){//上移第c列
	for(var r=0;r<RN-1;r++){
		var nextr = getNextrInCol(r,c);
		if(nextr == -1) break;
		else{
			if(data[r][c] == 0){
				data[r][c] = data[nextr][c];
				data[nextr][c] = 0;
				r--;
			}else if(data[r][c] == data[nextr][c]){
				data[r][c] *= 2;
				score += data[r][c];
				data[nextr][c] = 0;
			}
		}
	}
}
function getNextrInCol(r,c){//找到r行c列下方不为0的位置
	for(var nextr=r+1;nextr<RN;nextr++){
		if(data[nextr][c] != 0) return nextr;
	}
	return -1;
}

function moveDown(){//下移每一列
	var before = String(data);
	for(var c=0;c<CN;c++){
		moveDownCol(c);
	}
	var after = String(data);
	if(before != after){
		randomNum();
		if(isGameOver()) status = GAMEOVER;
		updateView();
	}
}
function moveDownCol(c){//下移第c列
	for(var r=RN-1;r>0;r--){
		var prevr = getPrevrInCol(r,c);
		if(prevr == -1) break;
		else{
			if(data[r][c] == 0){
				data[r][c] = data[prevr][c];
				data[prevr][c] = 0;
				r++;
			}else if(data[r][c] == data[prevr][c]){
				data[r][c] *= 2;
				score += data[r][c];
				data[prevr][c] = 0;
			}
		}
	}
}
function getPrevrInCol(r,c){//找到r行c列上方不为0的位置
	for(var prevr=r-1;prevr>=0;prevr--){
		if(data[prevr][c] != 0) return prevr;
	}
	return -1;
}

function isGameOver(){//判断游戏是否结束
	for(var r=0;r<RN;r++){
		for(var c=0;c<CN;c++){
			if(data[r][c] == 0) return false;
			if(c<CN-1 && data[r][c] == data[r][c+1]) return false;
			if(r<RN-1 && data[r][c] == data[r+1][c]) return false;
		}
	}
	return true;
}

start();