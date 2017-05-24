
var gl, canvas, hud, ctx;
function initGL(){
	canvas = document.getElementById('webgl');
	gl     = canvas.getContext("experimental-webgl");
	hud    = document.getElementById('hud');
	ctx    = hud.getContext("2d");

}
function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    var shaderProgram;

    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
       
        
        gl.attachShader(shaderProgram, fragmentShader);
         gl.attachShader(shaderProgram, vertexShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);
        shaderProgram.aPosition     = gl.getAttribLocation(shaderProgram, 'aPosition');
	shaderProgram.aTextureCoord = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
	gl.enableVertexAttribArray(shaderProgram.aPosition);
	gl.enableVertexAttribArray(shaderProgram.aTextureCoord);

	shaderProgram.uPMatrix = gl.getUniformLocation(shaderProgram, 'uPMatrix');
	shaderProgram.uMMatrix = gl.getUniformLocation(shaderProgram, 'uMMatrix');
	shaderProgram.uVMatrix = gl.getUniformLocation(shaderProgram, 'uVMatrix');
	shaderProgram.uSampler = gl.getUniformLocation(shaderProgram, 'uSampler');
	shaderProgram.uColor = gl.getUniformLocation(shaderProgram, 'uColor');
       
    }



var groundVertexPositionBuffer;
var groundVertexTextureCoordBuffer;
var cauVertexPositionBuffer;
var cauVertexTextureCoordBuffer;
var cauVertexIndexBuffer;
var goVertexPositionBuffer;
var goVertexTextureCoordBuffer;
var goVertexIndexBuffer;
function initBuffers(){
	var vertices = [
		-10.0, -1.0, -10.0,
		-10.0, -1.0, +10.0,
		+10.0, -1.0, -10.0,
		+10.0, -1.0, +10.0
	];
	groundVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	groundVertexPositionBuffer.itemSize = 3;
	groundVertexPositionBuffer.numItems = 4;

	vertices = [
		0.0, 1.0, 
		0.0, 0.0, 
		1.0, 1.0, 
		1.0, 0.0
	];
	groundVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	groundVertexTextureCoordBuffer.itemSize = 2;
	groundVertexTextureCoordBuffer.numItems = 4;

	   
    var latitudeBands = 30;
    var longitudeBands = 30;
    var radius = 1;

    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];
    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);
            
            textureCoordData.push(u);
            textureCoordData.push(v);
            vertexPositionData.push(radius * x);
            vertexPositionData.push(radius * y);
            vertexPositionData.push(radius * z);
        }
    }

    var indexData = [];
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }    

    cauVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cauVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
    cauVertexTextureCoordBuffer.itemSize = 2;
    cauVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

    cauVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cauVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
    cauVertexPositionBuffer.itemSize = 3;
    cauVertexPositionBuffer.numItems = vertexPositionData.length / 3;

    cauVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cauVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STREAM_DRAW);
    cauVertexIndexBuffer.itemSize = 1;
    cauVertexIndexBuffer.numItems = indexData.length;


	goVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, goVertexPositionBuffer);
    vertices = [
     
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

     
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,

    
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,

       
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

       
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,

  
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];
    for (var i=0; i<vertices.length; i++)
    	vertices[i] /= 2.0;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    goVertexPositionBuffer.itemSize = 3;
    goVertexPositionBuffer.numItems = 24;

    goVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, goVertexTextureCoordBuffer);
    var textureCoords = [
      
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

       
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

       
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
      
      
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    goVertexTextureCoordBuffer.itemSize = 2;
    goVertexTextureCoordBuffer.numItems = 24;

    goVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, goVertexIndexBuffer);
    var goVertexIndices = [
        0, 1, 2,      0, 2, 3,   
        4, 5, 6,      4, 6, 7,   
        8, 9, 10,     8, 10, 11, 
        12, 13, 14,   12, 14, 15, 
        16, 17, 18,   16, 18, 19, 
        20, 21, 22,   20, 22, 23  
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(goVertexIndices), gl.STATIC_DRAW);
    goVertexIndexBuffer.itemSize = 1;
    goVertexIndexBuffer.numItems = 36;

   
}

function handleLoadedTexture(texture){  
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

var groundTexture;
var cauTexture;
var goTexture;

function initTextures(){
	groundTexture = gl.createTexture();
	groundTexture.image = new Image();
	groundTexture.image.onload = function (){
		handleLoadedTexture(groundTexture);
	}
	groundTexture.image.src = "src/cau.png";

	

	cauTexture = gl.createTexture();
	cauTexture.image = new Image();
	cauTexture.image.onload = function(){
		handleLoadedTexture(cauTexture);
	}
	cauTexture.image.src = "src/f.jpg";

	goTexture = gl.createTexture();
	goTexture.image = new Image();
	goTexture.image.onload = function(){
		handleLoadedTexture(goTexture);
	}
	goTexture.image.src = "src/nehe.gif";

}	

function setMatrixUniforms(){
	gl.uniformMatrix4fv(shaderProgram.uMMatrix, false, mMatrix.elements);
	gl.uniformMatrix4fv(shaderProgram.uPMatrix, false, pMatrix.elements);
	gl.uniformMatrix4fv(shaderProgram.uVMatrix, false, vMatrix.elements);
}

var pMatrix = new Matrix4();
var mMatrix = new Matrix4();
var vMatrix = new Matrix4();



function drawgos(){
	for (var i=0; i<numgos; i++) gos[i].draw();
}
function drawcaus(){		
		
		caus.draw();		
	
}
function drawGround(){	
	mMatrix.setTranslate(0, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.aPosition, groundVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.aTextureCoord, groundVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();

	

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, groundTexture);
	gl.uniform1i(shaderProgram.uSampler, 0);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, groundVertexPositionBuffer.numItems);
}
var xEye = 0, yEye = 10, zEye = 5;
function drawScene(){

	gl.useProgram(shaderProgram);
	pMatrix.setPerspective(90, canvas.width/canvas.height, 1, 10000);
	vMatrix.setLookAt(xEye, yEye, zEye, caus.x, caus.y, caus.z, 0, 1, 0);		
	drawcaus();
	drawGround();		
	drawgos();	
	
}
 var rTri = 0;
 var rSquare = 0;
var wingame = false;
var v = 0.001, a = 0.0005;
 var lastTime = 0;
function animate(){

	decise(caus.direct, v);
	caus.x += deciseVector[0];
	caus.y += deciseVector[1];
	caus.z += deciseVector[2];
	if (caus.checkInteract()){
		caus.x -= deciseVector[0];
		caus.y -= deciseVector[1];
		caus.z -= deciseVector[2];
	}
	else{
		xEye += deciseVector[0];
		yEye += deciseVector[1];
		zEye += deciseVector[2];
	}
	

			
		
	var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

            rTri += (90 * elapsed) / 10.0;
            rSquare += (75 * elapsed) / 10.0;
        }
        lastTime = timeNow;
        
}
function handleKeyDown(ev){
	
	if (ev.keyCode == 37){
		caus.rotate(caus.direct, -1);
		if (caus.direct == -1){			
			caus.testAndMove();
		}
		caus.direct = -1;		
		v = 0.3;
	}
	if (ev.keyCode == 38){
		caus.rotate(caus.direct, -2);
		if (caus.direct == -2){
			caus.testAndMove();
		}
		caus.direct = -2;
		v = 0.3;
	}
	if (ev.keyCode == 39){
		caus.rotate(caus.direct, 1);
		if (caus.direct == 1){
			caus.testAndMove();
		}
		caus.direct = 1;
		v = 0.3;
	}
	if (ev.keyCode == 40){
		caus.rotate(caus.direct, 2);
		if (caus.direct == 2){
			caus.testAndMove();
		}
		caus.direct = 2;
		v = 0.3;
	}
	if (ev.keyCode == 65){
		yEye += 1;		
	}
	if (ev.keyCode == 66){
		yEye -= 1;
	}
}
var score = 0;
function drawCtx(){
	ctx.clearRect(0, 0, 500, 500);
	ctx.font = '20px "Times New Roman"';    
	ctx.fillStyle = 'rgba(200, 100, 0, 1)';
        ctx.fillText('Your score: ' + score.toString(), canvas.width / 2 - 150, 20);
	 if (wingame){
    	ctx.fillStyle = 'rgba(0, 25, 255, 1)';
    	ctx.font = '40px "Times New Roman"';    
    	ctx.fillText('win !!! roi', canvas.width / 2 - 90, canvas.height / 2);
    	cancelAnimationFrame(id);	
    }

    
}
 var id;
function main(){
	initGL();
	initShaders();
	initBuffers();
	initTextures();
	initgos();
        initcaus();
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
        tick = function(){
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		id = requestAnimationFrame(tick);		
		animate();				
		drawScene();
		drawCtx();		
	}
	tick();
        document.onkeydown = function (ev){
		handleKeyDown(ev);
	}
}
function interact(x1, y1, z1, x2, y2, z2, d){
	var distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
	return (distance < d);
}
function cau(startX, startY, startZ){
	this.x = startX;
	this.y = startY;
	this.z = startZ;	
	this.id = id;
	
	this.lock = false;
	this.angleRotate = 0;
}
cau.prototype.move = function() {
	
	this.x += deciseVector[0];			
	this.y += deciseVector[1];
	this.z += deciseVector[2];
};
cau.prototype.testAndMove = function(){
	var x, y, z;
	x = this.x; 
	y = this.y; 
	z = this.z; 			
	this.move();
	if (this.checkInteract()){
		this.set(x, y, z);			
		return true;
	}
	
		xEye += deciseVector[0];
		yEye += deciseVector[1];
		zEye += deciseVector[2];
	
	return false;
}
cau.prototype.rotate = function()
cau.prototype.set = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};


cau.prototype.checkInteract = function() {
	for (var i=0; i<numgos; i++) 
		if (!gos[i].lock)
			if (interact(this.x, this.y, this.z, gos[i].x, gos[i].y, gos[i].z, 1.5))
			{
			
			score++;
			gos[i].lock = true;
			if(score ==10)
			 wingame= true;
			 if(wingame) return;
			 return true;
			 
			}
	
          
	if (this.x < -10 + 1 || this.x > 10 - 1 || this.z < -10 + 1 || this.z > 10 - 1) return true;
};
cau.prototype.draw = function(){
	if (this.lock) return;
	
        
	mMatrix.setTranslate(this.x, this.y, this.z);
	
	mMatrix.rotate(degToRad(rTri), 0, 1, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cauVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.aPosition, cauVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, cauVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.aTextureCoord, cauVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();

	gl.uniform3fv(shaderProgram.uColor, [1.0, 1.0, 1.0]);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, cauTexture);
	gl.uniform1i(shaderProgram.uSampler, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cauVertexIndexBuffer);	
	gl.drawElements(gl.TRIANGLES, cauVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

var caus ;
function initcaus(){
	
	caus = new cau(0, 0, 0);

	
}


var deciseVector = [0, 0, 0];
function decise(direct, distace){
	var x = 0, y = 0, z = 0;
	if (direct == 1) x = distace;
	if (direct == -1) x = -distace;
	if (direct == 2) z = distace;
	if (direct == -2) z = -distace;	
	deciseVector[0] = x;
	deciseVector[1] = y;
	deciseVector[2] = z;
}

function go(startX, startY, startZ){
	this.x = startX;
	this.y = startY;
	this.z = startZ;
	this.lock = false;
}

go.prototype.draw = function(){
	if (this.lock) return;
	mMatrix.setTranslate(this.x, this.y, this.z);
	mMatrix.rotate(degToRad(rTri), 0, 1, 0);
	mMatrix.rotate(degToRad(rTri), 1, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, goVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.aPosition, goVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, goVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.aTextureCoord, goVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, goTexture);
	gl.uniform1i(shaderProgram.uSampler, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, goVertexIndexBuffer);	
	gl.drawElements(gl.TRIANGLES, goVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
};
var numgos;
var gos = [];
function initgos(){
	numgos = 10;
	gos[0] = new go(0, 0, 8);
	gos[1] = new go(0, 0, -8);
	gos[2] = new go(4, 0, 6);
	gos[3] = new go(4, 0, -6);
	gos[4] = new go(-4, 0, 6);
	gos[5] = new go(-4, 0, -6);
	gos[6] = new go(6, 0, 2);
	gos[7] = new go(-6, 0, -2);
	gos[8] = new go(6, 0, -2);
	gos[9] = new go(-6, 0, 2);
	
}
function degToRad(angle){
	return (angle * Math.PI) / 180.0;
}


