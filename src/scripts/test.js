			// Get the WebGL context.
			var canvas = document.getElementById('canvas');
			var gl = canvas.getContext('experimental-webgl');

			// Pipeline setup.
			gl.clearColor(.95, .95, .95, 1);
			// Backface culling.
			gl.frontFace(gl.CCW);
			gl.enable(gl.CULL_FACE);
			gl.cullFace(gl.BACK);
			// ...
			// ...
			// ...	
			// ...
			// ...
			// ...	
			
			// Compile vertex shader. 
			var vsSource = '' + 
				'attribute vec3 pos;' + 
				'attribute vec4 col;' + 
				'varying vec4 color;' + 
				'void main(){' + 'color = col;' + 
				'gl_Position = vec4(pos, 1);' +
				'}';
			var vs = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vs, vsSource);
			gl.compileShader(vs);

			// Compile fragment shader.
			fsSouce = 'precision mediump float;' + 
				'varying vec4 color;' + 
				'void main() {' + 
				'gl_FragColor = color;' + 
				'}';
			var fs = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(fs, fsSouce);
			gl.compileShader(fs);

			// Link shader together into a program.
			var prog = gl.createProgram();
			gl.attachShader(prog, vs);
			gl.attachShader(prog, fs);
			gl.bindAttribLocation(prog, 0, "pos");
			gl.linkProgram(prog);
			gl.useProgram(prog);

			// Vertex data.
			// Positions, Index data.
			var vertices, indicesLines, indicesTris;
			// Fill the data arrays.
			createVertexData();

			// Setup position vertex buffer object.
			var vboPos = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
			gl.bufferData(gl.ARRAY_BUFFER,
				vertices, gl.STATIC_DRAW);
			// Bind vertex buffer to attribute variable.
			var posAttrib = gl.getAttribLocation(prog, 'pos');
			gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT,
				false, 0, 0);
			gl.enableVertexAttribArray(posAttrib);

			// Setup constant color.
			var colAttrib = gl.getAttribLocation(prog, 'col');

			// Setup lines index buffer object.
			var iboLines = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
				indicesLines, gl.STATIC_DRAW);
			iboLines.numberOfElements = indicesLines.length;
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

			// Setup tris index buffer object.
			var iboTris = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
				indicesTris, gl.STATIC_DRAW);
			iboTris.numberOfElements = indicesTris.length;
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

			// Clear framebuffer and render primitives.
			gl.clear(gl.COLOR_BUFFER_BIT);

			// Setup rendering tris.
			gl.vertexAttrib4f(colAttrib, 0, 1, 1, 1);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
			gl.drawElements(gl.TRIANGLES,
				iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);
			
			// Setup rendering lines.
			gl.vertexAttrib4f(colAttrib, 0, 0, 1, 1);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
			gl.drawElements(gl.LINES,
				iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);
								
			function createVertexData(){
				var n = 64;
				var m = 12;
				// Positions.
				vertices = new Float32Array(3 * (n+1) * (m+1));
				// Index data.
				indicesLines = new Uint16Array(2 * 2 * n * m);
				indicesTris  = new Uint16Array(3 * 2 * n * m);
				
				var dt = 2*Math.PI/n;
				var dr = 1/m;
				// Counter for entries in index array.
				var iLines = 0;
				var iTris = 0;
				
				// Loop angle t.
				for(var i=0, t=0; i <= n; i++, t += dt) {
					// Loop radius r.
					for(var j=0, r=0; j <= m; j++, r += dr) {
						
						var iVertex = i*(m+1) + j;
						
                        var x = r * Math.cos(t);
                        var z = r * Math.sin(t);
                        var y = Math.cos(r*Math.PI);
										
						// Set vertex positions.
						vertices[iVertex * 3] = x;
						vertices[iVertex * 3 + 1] = y;
						vertices[iVertex * 3 + 2] = z;
						
						// Set index.
						// Line on beam.
						if(j>0 && i>0){
							indicesLines[iLines++] = iVertex - 1;
							indicesLines[iLines++] = iVertex;
						 }
						// Line on ring.
						if(j>0 && i>0){
							indicesLines[iLines++] = iVertex - (m+1);							
							indicesLines[iLines++] = iVertex;
						}				   

						// Set index.
						// Two Triangles.
						if(j>0 && i>0){
							indicesTris[iTris++] = iVertex;
							indicesTris[iTris++] = iVertex - 1;
							indicesTris[iTris++] = iVertex - (m+1);
							//							
							indicesTris[iTris++] = iVertex - 1;
							indicesTris[iTris++] = iVertex - (m+1) - 1;							
							indicesTris[iTris++] = iVertex - (m+1);							
						 }
					}
				}
			}	
			
			// Draw Helix.
			//
			gl.lineWidth(5.0);
			
			// Vertex data.
			// Positions, index data.
			var indices;
			// Fill the data arrays.
			createVertexDataHelix();

			// Setup position vertex buffer object.
			var vboPos = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
			gl.bufferData(gl.ARRAY_BUFFER,
				vertices, gl.STATIC_DRAW);
			// Bind vertex buffer to attribute variable.
			var posAttrib = gl.getAttribLocation(prog, 'pos');
			gl.vertexAttribPointer(posAttrib, 3,
				gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(posAttrib);

			// Setup constant color.
			var colAttrib = gl.getAttribLocation(prog, 'col');
			gl.vertexAttrib4f(colAttrib, 1, 0, 0, 1);

			// Setup index buffer object.
			var ibo = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
				indices, gl.STATIC_DRAW);
			ibo.numberOfElements = indices.length;

			// Clear framebuffer and render primitives.
			//gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawElements(gl.LINE_STRIP,
				ibo.numberOfElements, gl.UNSIGNED_SHORT, 0);
				
			function createVertexDataHelix(){
				var m = 32;
				var n = m * 3;		
				// Positions.
				vertices = new Float32Array(3 * (n+1));
				// Index data for Linestip.
				indices = new Uint16Array(n+1);
				
				var tn = 3 * 2 * Math.PI;
				var dt = 2*Math.PI / m;
				var t = 0;
				var r = 0.8;
				
				for(var i = 0; i <= n; i++, t += dt) {
					
					//r = 1.0 - i/n;
					//r = 1.0 - t / (2*Math.PI);
					
					var x = r * Math.cos(t);
					var z = r * Math.sin(t);
					var y = 0.5 - t / tn;
									
					// Set vertex positions.
					vertices[i * 3] = x;
					vertices[i * 3 + 1] = y;
					vertices[i * 3 + 2] = z;
					
					// Set index.
					indices[i] = i;
				}
			}						