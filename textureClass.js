

class texture {

    constructor(gl, program) {
        this.gl = gl;
        this.program = program;

        var points = [];
        var colors = [];
        var texCoords = [];

        points.push(vec3(1, 0, 0));	// Lower right
        colors.push(vec3(1.0, 0, 0));
        texCoords.push(vec2(2.0, 0.0));
    
        points.push(vec3(0, 0, 0));		// Lower left
        colors.push(vec3(0.0, 1, 0));
        texCoords.push(vec2(0.0, 0.0));
    
        points.push(vec3(1, 1, 0));		// Upper right
        colors.push(vec3(0.0, 0, 1));
        texCoords.push(vec2(2.0, 2.0));
    
        points.push(vec3(0, 1, 0));		// Upper left
        colors.push(vec3(1.0, 1, 1));
        texCoords.push(vec2(0.0, 2.0));
    
        this.nPoints = 4;

        this.vbufferID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufferID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

        this.cbufferID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cbufferID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

        this.tbufferID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tbufferID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);


        var image = new Image(  );
    //    //image.crossOrigin = "";
      var image = document.getElementById( "bricks" );	// File loaded in html code, accessed here.
    // const canvas = document.getElementById("gl-canvas");
    // const image = canvas.getContext('2d');
    
    // const img = new Image();
    // img.src = 'bricksSquare.jpg';
    
    // let x = 0;
    // let y = 0;
    // let dx = 1;
    // let dy = 1;
    
    // img.onload = function() {
    //   setInterval(function() {
    //     //gl.clearRect(0, 0, canvas.width, canvas.height);
    //     x += dx;
    //     y += dy;
    //     gl.drawImage(img, x, y);
    //   }, 10);
    // };
     gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
       var texture = gl.createTexture( );
       gl.activeTexture( gl.TEXTURE0 );
       gl.bindTexture( gl.TEXTURE_2D, texture );
      // gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
       gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);
       gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
       //  */
       gl.bindBuffer(gl.ARRAY_BUFFER, null);

       gl.enable(gl.DEPTH_TEST);
       
       return;
    }

    render(modelView, projection) {
        var gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufferID);
        var vPosition = gl.getAttribLocation(this.program, "vPosition");
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cbufferID);
        var vColor = gl.getAttribLocation(this.program, "vColor");
        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.tbufferID);
        var vTexCoords = gl.getAttribLocation(this.program, "vTexCoords");
        gl.vertexAttribPointer(vTexCoords, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vTexCoords);

        var vModelView = gl.getUniformLocation(this.program, "vModelView");
        gl.uniformMatrix4fv(vModelView, false, flatten(modelView));

        var vProjection = gl.getUniformLocation(this.program, "vProjection");
        gl.uniformMatrix4fv(vProjection, false, flatten(projection));

        gl.bindBuffer(gl.ARRAY_BUFFER, null);


        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.nPoints);

        return;

    }
}