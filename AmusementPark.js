
var gl;				// WebGL graphics environment
var program;		// The shader program

var theAxes;
var theMerryGoRound;
var theMerryGoRound2;
var theTexture;
var ctx;
//var sphere;

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.2, 0.3, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;

var materialAmbient2 = vec4( 1.0, 0.0, 0.0, 1.0 );
var materialDiffuse2 = vec4( 1.0, 0.3, 0.8, 1.0 );
var materialSpecular2 = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess2 = 100.0;

// Initialization function runs whenever the page is loaded

window.onload = function init( ) {
	
	// Set up the canvas, viewport, and clear color

	var canvas = document.getElementById( "gl-canvas" );
	gl=WebGLUtils.setupWebGL( canvas );

	if( !gl ) {
		alert( "No WebGL" );
	}
	
	gl.viewport( 0, 0, canvas.width, canvas.height );
	aspectRatio = canvas.width / canvas.height ;
	gl.clearColor(0.529, 0.808, 0.98, 1.0);
	// Load the shaders, create a GLSL program, and use it.
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	

	var projection = perspective(60, aspectRatio, 1, 50.0);
	var vProjection = gl.getUniformLocation(program, "vProjection");
	gl.uniformMatrix4fv(vProjection, false, flatten(projection));
	theAxes = new Axes(gl, program);
	//sphere = new FerrisWheel(gl, program);

	ctx = canvas.getContext('2d');

	var bgImage = new Image();
	bgImage = document.getElementById("grass");
	bgImage.addEventListener("load", (e) =>  {
		ctx.drawImage(bgImage, 0, -50, canvas.width, canvas.height);
	});
	//bgImage.src = 'grass.jpg';
	 

	//first
    ambientLight = mult(lightAmbient, materialAmbient);
    diffuseLight = mult(lightDiffuse, materialDiffuse);
    specularLight = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(program,  "ambientLight"),flatten(ambientLight) );
	gl.uniform4fv( gl.getUniformLocation(program,  "diffuseLight"),flatten(diffuseLight) );
	gl.uniform4fv( gl.getUniformLocation(program, "specularLight"),flatten(specularLight) );	
	gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
	gl.uniform1f( gl.getUniformLocation(program,  "shininess"), flatten(materialShininess) );

	theMerryGoRound = new MerryGoRound(gl, program);

	//second
    ambientLight = mult(lightAmbient, materialAmbient2);
    diffuseLight = mult(lightDiffuse, materialDiffuse2);
    specularLight = mult(lightSpecular, materialSpecular2);

    gl.uniform4fv( gl.getUniformLocation(program, "ambientLight"),flatten(ambientLight) );
	gl.uniform4fv( gl.getUniformLocation(program, "diffuseLight"),flatten(diffuseLight) );
	gl.uniform4fv( gl.getUniformLocation(program, "specularLight"),flatten(specularLight) );	
	gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
	gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );

	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientLight));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseLight));
	gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularLight));
	gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
	gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

	theMerryGoRound2 = new MerryGoRound(gl, program);

	ctx = canvas.getContext('2d');

	var bgImage = new Image();
	bgImage = document.getElementById("grass");
	bgImage.addEventListener("load", (e) =>  {
		ctx.drawImage(bgImage, -20, -1000, canvas.width, canvas.height);
	});

	gl.enable( gl.DEPTH_TEST );	// Note:  This line had an error in the exercise template.
    // Initialization is done.  Now initiate first rendering
	render( );
}

var time = 0.0;
var x = 15;
var y = 5;
var z = 15;
var speed = 1;

function render( ) {
	
    time += speed;
	// Clear out the color buffers and the depth buffers.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Check keyboard input and do the correct actions
	window.onkeydown = function (e) {
	    var key = String.fromCharCode(e.keyCode);
	    switch (key) {
	        case 'A':
	            x -= .5;
	            z += .5;
	            break;
	        case 'S':
	            y -= .5;
	            break;
	        case 'W':
	            y += .5;
	            break;
	        case 'D':
	            x += .5;
	            z -= .5;
	            break;
	        case 'R': // Reset MGR
	            x = 15;
	            y = 5;
	            z = 15;
	            speed = 1;
	            break;
	        case 'F':// Speed up the merry go round
	            speed += 1;
	            break;
	        default:
	            console.log(key);
	            break;
	    }
	};
	var modelView = lookAt( vec3( x, y, z ), vec3( 0, 0, 0 ), vec3( 0, 1, 0 ) );
	var vModelView = gl.getUniformLocation( program, "vModelView" );
	gl.uniformMatrix4fv( vModelView, false, flatten( modelView ) );
	// Set the transformation matrix as a mat4 Identity matrix and send it to the GPU

	var transformation = mat4( );
	var vTransformation = gl.getUniformLocation( program, "vTransformation" );
    gl.uniformMatrix4fv( vTransformation, false, flatten( transformation ) );

    var normalTransformation = mat4();
    var vNormalTransformation = gl.getUniformLocation(program, "vNormalTransformation");
    gl.uniformMatrix4fv(vNormalTransformation, false, flatten(normalTransformation));

    normalTransformation = rotateY(time);
    gl.uniformMatrix4fv(vNormalTransformation, false, flatten(normalTransformation));
    theMerryGoRound.render(time, [7,-3,-3]);
    normalTransformation = rotateX(time);
    gl.uniformMatrix4fv(vNormalTransformation, false, flatten(normalTransformation));
    theMerryGoRound2.render(time, [-7,-3,3]);
	
	//sphere.render(time, [-1,3,4]);
	//theTexture.render(modelView, projection);
	requestAnimFrame( render );
}
// function drawImageActualSize() {
// 	// Use the intrinsic size of image in CSS pixels for the canvas element
// 	ctx.drawImage(gl, 0, 0,  canvas.width, canvas.height);
//   }