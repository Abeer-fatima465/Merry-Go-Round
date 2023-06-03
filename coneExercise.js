
// Initialization function runs whenever the page is loaded
class Axes {
    constructor( gl, program ) {
	
        // Establish arrays to hold vertex data
        var points = [ ];	// Vertex location data
        var colors = [ ];	// Vertex color data
        this.aspectRatio;	// Aspect ratio of viewport

        this.gl = gl;
        this.program = program;
        // Set up the canvas, viewport, and clear color

        var canvas = document.getElementById( "gl-canvas" );
        gl=WebGLUtils.setupWebGL( canvas );
        if( !gl ) {
            alert( "No WebGL" );
        }
	
        gl.viewport( 0, 0, canvas.width, canvas.height );
        aspectRatio = canvas.width / canvas.height;


	
        // Generate Points
	    
        // TODO 1
        // INSERT CODE HERE to fill points[ ] and colors[ ] with vec3s, for 
        // 3D position and RGB colors respectively of vertices, and set nPoints.
        // First point is red at the origin
        points.push(vec3( 0, 0, 0 ));
        colors.push(vec3(1, 0, 0));
        points.push(vec3(1, 0, 0));
        colors.push(vec3(1, 0, 0));

        points.push(vec3(0, 0, 0));
        colors.push(vec3(0, 1, 0));
        points.push(vec3(0, 1, 0));
        colors.push(vec3(0, 1, 0));

        points.push(vec3(0, 0, 0));
        colors.push(vec3(0, 0, 1));
        points.push(vec3(0, 0, 1));
        colors.push(vec3(0, 0, 1));
        
        this.nPoints = 6; // Change this as points are added
	
        // Push Vertex Location Data to GPU
	
        this.vbufferID = gl.createBuffer( );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.vbufferID );
        gl.bufferData( gl.ARRAY_BUFFER, flatten( points ), gl.STATIC_DRAW );
	
	
        // Push Vertex Color Data to GPU
	
        this.cbufferID = gl.createBuffer( );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.cbufferID );
        gl.bufferData( gl.ARRAY_BUFFER, flatten( colors ), gl.STATIC_DRAW );
	
	
        // Unbind the buffer, for safety sake.
	
        gl.bindBuffer( gl.ARRAY_BUFFER, null );
	
        // Initialization is done.  Now initiate first rendering
        return;
    }

    render( ) {
	
        var gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufferID);
        var vPosition = gl.getAttribLocation(this.program, "vPosition");
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cbufferID);
        var vColor = gl.getAttribLocation(this.program, "vColor");
        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        // Do the drawing
        gl.drawArrays( gl.LINES, 0, this.nPoints );	// Or gl.TRIANGLES, or . . .
        return;
    }
}