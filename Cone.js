/* cone.js
	
	Written by John Bell for CS 425, Fall 2020
	Last revised Spring 2023 by John Bell
    
    This file contains code to create and draw a unit cone, centered at the origin.
	
	Many steps are incomplete and/or commented out for exercise purposes.
    
*/

// Globals are evil.  We won't use any here. :-)



class Cone { 

	constructor( nSectors, gl, program, color ) {

		this.nSectors = nSectors;
		this.gl = gl;
		this.program = program;

		var points = [ ];	// Vertex location data 
		var colors = [ ];	// Vertex color data
		
		// Generate Points and Colors
		
		var validColor = false;
		
		if ( Array.isArray( color ) && color.length == 3 
			&& color[0] >= 0 && color[1] >= 0 && color[2] >=0
			&& color[0] <= 1 && color[1] <= 1 && color[2] <=1 ) {
			
			validColor = true;
																 
		}
		// Generate Points and Colors
		
		// TODO 3 - push vec3s into the colors array for each vertex.
		// If the passed color is valid, use it to make a vec3.  
		// Otherwise use calls to Math.random( ).
		// This object uses one vertex at the point and nSectors + 1 around the base.	

		for( var i = 0; i < nSectors + 2; i++ ) {
		    if( validColor )
		        colors.push(vec3(color));// Push a valid color here, as a vec3
		    else
		        colors.push(vec3(Math.random(),Math.random(),Math.random()));// Push a random color here, as a vec3 
		}
		
// Then the vertex locations, starting with the apex
		
		// TODO 3 - Uncomment and correct the following lines
		
		// push ( 0, 1, 0 ) into the points array as a vec3
		
		
		// Then the base points
		// var dTheta = 2 * Math.PI / this.nSectors; // In radians
		// for( i = 0; i < this.nSectors + 1; i++ ) { // Duplicate ( 1, 0, 0 ) to close loop.
		// 	var theta = i * dTheta;
		// 	// TODO 3 - push a vertex into positions here, 
		// 	// using 0.5 * Math.cos( theta ) for X,
		// 	// 0 for Y, and 0.5 * Math.sin( theta ) for Z
		// 	// ( Radius 0.5 ==> Diameter 1.0 )
		// 	points.push(vec3(Math.cos(theta), 0, Math.sin(theta)));

		// }	

		points.push(vec3(0,1,0));
		// Then the base points
		var dTheta = radians( 360 / this.nSectors );
		for( i = 0; i < this.nSectors + 1; i++ ) { // Duplicate ( 1, 0, 0 ) to close loop.
			var theta = i * dTheta;
			points.push(vec3(Math.cos(theta),0, Math.sin(theta)));// push a vertex here, using Math.cos( theta ) for X and Math.sin( theta ) for Y
		}	
			
		// Okay.  All data calculated.  Time to put it all in GPU buffers
		
		// Push vertex position data to GPU
		// Hold off on connecting the data to the shader variables

		// this.positionBufferID = gl.createBuffer( );
		// gl.bindBuffer( gl.ARRAY_BUFFER, this.positionBufferID );
		// gl.bufferData( gl.ARRAY_BUFFER, flatten( points ), gl.STATIC_DRAW );
		
		this.vbufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vbufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( points ), gl.STATIC_DRAW );
		
		// TODO 3 - Add calls to createBuffer, bindBuffer, and bufferData 
		//      to push the color data to the GPU
		// this.colorbufferID = . . .

		this.cbufferID = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.cbufferID);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
		// Unbind the buffer, for safety sake.
		
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
		
		return;
	
	}
	
	render() {
		var gl = this.gl;
		
		// Okay.  All transformaation matrices sent to uniform variables.
		// Time to attach vertex shader variables to the buffers created in init( )

		// Connect the vertex data to the shader variables - First positions
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vbufferID );
		var vPosition = gl.getAttribLocation( this.program, "vPosition" );
		gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition );
		
		// Then the colors
		
		// TODO 3 - - Insert the code to connect the color data 
		// to the vertex shader variable "vColor" using bindBuffer, 
		// getAttribLocation, vertexAttribPointer, and enableVertexAttribArray

		// gl.bindBuffer( . . .
		gl.bindBuffer(gl.ARRAY_BUFFER, this.cbufferID);
		var vColor = gl.getAttribLocation(this.program, "vColor");
		gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vColor);
		// Unbind the array buffer, for safety sake.
		
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	
		// And finally to draw the cone
		
		// TODO 3 - use drawArrays to draw a TRIANGLE FAN using all the data points 
		// ( nSectors + 2 points )
		
		// gl.drawArrays( . . . );	// Sides

		gl.drawArrays( gl.TRIANGLE_FAN, 0, this.nSectors + 2);	// Sides
		gl.drawArrays(gl.TRIANGLE_FAN, 1, this.nSectors + 1);
		// TODO later - Draw the bottom.  Could possibly make this controlled by an extra passed parameter.
		return;
	} // renderCone( )

} // class Cone