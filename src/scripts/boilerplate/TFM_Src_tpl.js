var app = ( function() {

	var gl;

	// The shader program object is also used to
	// store attribute and uniform locations.
	var prog;

	// Array of model objects.
	var models = [];

	// Model that is target for user input.
	var interactiveModel;
	var interactiveSpheres = {};
	interactiveSpheres.identity = 42;
	interactiveSpheres.in = function (id) {

	    for (var i = 0; i < interactiveSpheres.geo.length; i++) {
	        if (id == interactiveSpheres.geo[i].identity) {
	            return true;
	        }
	    }

	    return false;
	}

	var camera = {
		// Initial position of the camera.
		eye : [0, 1, 4],
		// Point to look at.
		center : [0, 0, 0],
		// Roll and pitch of the camera.
		up : [0, 1, 0],
		// Opening angle given in radian.
		// radian = degree*2*PI/360.
		fovy : 60.0 * Math.PI / 180,
		// Camera near plane dimensions:
		// value for left right top bottom in projection.
		lrtb : 2.0,
		// View matrix.
		vMatrix : mat4.create(),
		// Projection matrix.
		pMatrix : mat4.create(),
		// Projection types: ortho, perspective, frustum.
		projectionType : "perspective",
		// Angle to Z-Axis for camera when orbiting the center
		// given in radian.
		zAngle : 0,
		// Distance in XZ-Plane from center when orbiting.
		distance : 4,
	};

	function start() {
		init();
		render();
	}

	function init() {
		initWebGL();
		initShaderProgram();
		initUniforms()
		initModels();
		initEventHandler();
		initPipline();
	}

	function initWebGL() {
		// Get canvas and WebGL context.
		canvas = document.getElementById('canvas');
		gl = canvas.getContext('experimental-webgl');
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	}

	/**
	 * Init pipeline parameters that will not change again. 
	 * If projection or viewport change, their setup must
	 * be in render function.
	 */
	function initPipline() {
		gl.clearColor(.95, .95, .95, 1);

		// Backface culling.
		gl.frontFace(gl.CCW);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		// Depth(Z)-Buffer.
		gl.enable(gl.DEPTH_TEST);

		// Polygon offset of rastered Fragments.
		gl.enable(gl.POLYGON_OFFSET_FILL);
		gl.polygonOffset(0.5, 0);

		// Set viewport.
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

		// Init camera.
		// Set projection aspect ratio.
		camera.aspect = gl.viewportWidth / gl.viewportHeight;
	}

	function initShaderProgram() {
		// Init vertex shader.
		var vs = initShader(gl.VERTEX_SHADER, "vertexshader");
		// Init fragment shader.
		var fs = initShader(gl.FRAGMENT_SHADER, "fragmentshader");
		// Link shader into a shader program.
		prog = gl.createProgram();
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.bindAttribLocation(prog, 0, "aPosition");
		gl.linkProgram(prog);
		gl.useProgram(prog);
	}

	/**
	 * Create and init shader from source.
	 * 
	 * @parameter shaderType: openGL shader type.
	 * @parameter SourceTagId: Id of HTML Tag with shader source.
	 * @returns shader object.
	 */
	function initShader(shaderType, SourceTagId) {
		var shader = gl.createShader(shaderType);
		var shaderSource = document.getElementById(SourceTagId).text;
		gl.shaderSource(shader, shaderSource);
		gl.compileShader(shader);
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.log(SourceTagId + ": " + gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}

	function initUniforms() {
		// Projection Matrix.
		prog.pMatrixUniform = gl.getUniformLocation(prog, "uPMatrix");

		// Model-View-Matrix.
		prog.mvMatrixUniform = gl.getUniformLocation(prog, "uMVMatrix");

	    //Model Color.
		prog.colorUniform = gl.getUniformLocation(prog, "uColor");

	    //Normal transformation Matrix.
		prog.nMatrixUniform = gl.getUniformLocation(prog, "uNMatrix");
	}

	function initModels() {
	    // fillstyle
	    var fsFillWireframe = "fillwireframe";
	    var fsFill = 'fill';
	    var fsWireframe = 'wireframe';

	    createModel("ground", fsWireframe, [0, 0, 0, 1], [0, 0, 0], [0, 0, 0], [1, 1, 1]);
	    createModel("torus", fsFill, [1, 1, 1, 1], [1, 0.5, 0], [0, 0, 0], [0.5, 0.5, 0.5]);

        //place 4 spheres
	    createModel("sphere", fsFill, [1, 0, 0, 1], [1, 0.5, 0], [0, 0, 0], [0.1, 0.1, 0.1]);
	    createModel("sphere", fsFill, [0, 1, 0, 1], [-1, 0.5, 0], [0, 0, 0], [0.1, 0.1, 0.1]);
	    createModel("sphere", fsFill, [0, 0, 1, 1], [0, 0.5, 1], [0, 0, 0], [0.1, 0.1, 0.1]);
	    createModel("sphere", fsFill, [1, 1, 0, 1], [0, 0.5, -1], [0, 0, 0], [0.1, 0.1, 0.1]);

	    createModel("torus", fsFill, [0, 0, 0, 1], [-1, 0.5, 0], [0, 0, 0], [0.5, 0.5, 0.5]);
		
	
		// Select one model that can be manipulated interactively by user.
	    interactiveModel = models[1];
	    interactiveModel.cutPointTranslate = [0,0,0];

	    interactiveSpheres.rotate = 0;
	    interactiveSpheres.geo = new Array();
	    interactiveSpheres.geo.push(models[2]);
	    interactiveSpheres.geo.push(models[3]);
	    interactiveSpheres.geo.push(models[4]);
	    interactiveSpheres.geo.push(models[5]);
	}

	/**
	 * Create model object, fill it and push it in models array.
	 * 
	 * @parameter geometryname: string with name of geometry.
	 * @parameter fillstyle: wireframe, fill, fillwireframe.
	 */
	function createModel(geometryname, fillstyle,color, translate, rotate, scale) {
	    var model = {};
        
	    model.identity = Math.random();
	    model.color = color;
	    model.fillstyle = fillstyle;
	    model.invertVec3 = function (vec3) {
	        var invertedVec3 = [];
	        for (var i = 0; i < vec3.length; i++) {
	            invertedVec3[i] = vec3[i] * -1;
	        }

	        return invertedVec3;
	    };

		initDataAndBuffers(model, geometryname);
		initTransformations(model, translate, rotate, scale);

		models.push(model);
	}

	/**
	 * Set scale, rotation and transformation for model.
	 */
	function initTransformations(model, translate, rotate, scale) {
		// Store transformation vectors.
		model.translate = translate;
		model.rotate = rotate;
		model.scale = scale;

		// Create and initialize Model-Matrix.
		model.mMatrix = mat4.create();

		// Create and initialize Model-View-Matrix.
		model.mvMatrix = mat4.create();

	    // Create and initialize Normal-Matrix
		model.nMatrix = mat3.create();
	}

	/**
	 * Init data and buffers for model object.
	 * 
	 * @parameter model: a model object to augment with data.
	 * @parameter geometryname: string with name of geometry.
	 */
	function initDataAndBuffers(model, geometryname) {
		// Provide model object with vertex data arrays.
		// Fill data arrays for Vertex-Positions, Normals, Index data:
		// vertices, normals, indicesLines, indicesTris;
		// Pointer this refers to the window.
		this[geometryname]['createVertexData'].apply(model);

		// Setup position vertex buffer object.
		model.vboPos = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
		gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);
		// Bind vertex buffer to attribute variable.
		prog.positionAttrib = gl.getAttribLocation(prog, 'aPosition');
		gl.enableVertexAttribArray(prog.positionAttrib);

		// Setup normal vertex buffer object.
		model.vboNormal = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
		gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW);
		// Bind buffer to attribute variable.
		prog.normalAttrib = gl.getAttribLocation(prog, 'aNormal');
		gl.enableVertexAttribArray(prog.normalAttrib);

		// Setup lines index buffer object.
		model.iboLines = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesLines, 
			gl.STATIC_DRAW);
		model.iboLines.numberOfElements = model.indicesLines.length;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		// Setup triangle index buffer object.
		model.iboTris = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesTris, 
			gl.STATIC_DRAW);
		model.iboTris.numberOfElements = model.indicesTris.length;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}

	function initEventHandler() {
		// Rotation step.
	    var deltaRotate = Math.PI / 16;
	    var deltaTorusRotate = Math.PI / 4;
		var deltaTranslate = 0.05;
		var cutPoint = Math.PI / 2;
		var torusMoveDirection = 1;

		window.onkeydown = function(evt) {
			var key = evt.which ? evt.which : evt.keyCode;
			var c = String.fromCharCode(key);
			// console.log(evt);
			// Use shift key to change sign.
			var sign = evt.shiftKey ? -1 : 1;

			// Change projection of scene.
			switch(c) {
				case('O'):
					camera.projectionType = "ortho";
					camera.lrtb = 2;
					break;
				case('F'):
					camera.projectionType = "frustum";
					camera.lrtb = 1.2;
					break;
				case('P'):
					camera.projectionType = "perspective";
					break;
			}

			// Camera move and orbit.
			switch(c) {
				case('C'):
					// Orbit camera.
					camera.zAngle += sign * deltaRotate;
					break;
				case('H'):
					// Move camera up and down.
					camera.eye[1] += sign * deltaTranslate;
					break;
				case('D'):
					// Camera distance to center.
					camera.distance += sign * deltaTranslate;
					break;
				case('V'):
					// Camera fovy in radian.
					camera.fovy += sign * 5 * Math.PI / 180;
					break;
				case('B'):
					// Camera near plane dimensions.
					camera.lrtb += sign * 0.1;
					break;
			    case('X'):
			        // rotate torus around x axis
			        interactiveModel.rotate[0] += sign * deltaRotate;
			        break;
			    case ('Y'):
			        // rotate torus around y axis
			        interactiveModel.rotate[1] += sign * deltaRotate;
			        break;
			    case ('Z'):
			        // rotate torus around z axis
			        interactiveModel.rotate[2] += sign * deltaRotate;
			        break;
			    case ('K'):
			        interactiveSpheres.rotate += sign * deltaRotate;
			        interactiveModel.rotate[1] += sign * deltaTorusRotate;
			        
			        //if (cutPoint == interactiveModel.rotate) {
			        //    torusMoveDirection *= -1;
			        //    interactiveSpheres.rotate = 0;
			        //}

			        //interactiveModel.cutPointTranslate[0] += torusMoveDirection * 2/9;
			        //interactiveModel.cutPointTranslate[1] = 0;
			        //interactiveModel.cutPointTranslate[2] = 0;
			        break;
			}


			// Render the scene again on any key pressed.
			render();
		};
	}

	/**
	 * Run the rendering pipeline.
	 */
	function render() {
		// Clear framebuffer and depth-/z-buffer.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		setProjection();

		calculateCameraOrbit();

		// Set view matrix depending on camera.
		mat4.lookAt(camera.vMatrix, camera.eye, camera.center, camera.up);

		// Loop over models.
		for(var i = 0; i < models.length; i++) {
			// Update modelview for model.
			updateTransformations(models[i]);

			// Set uniforms for model.
			gl.uniformMatrix4fv(prog.mvMatrixUniform, false, 
				models[i].mvMatrix);

			gl.uniform4fv(prog.colorUniform, models[i].color);
			gl.uniformMatrix3fv(prog.nMatrixUniform, false, models[i].nMatrix);
			
			draw(models[i]);
		}
	}

	function calculateCameraOrbit() {
		// Calculate x,z position/eye of camera orbiting the center.
		var x = 0, z = 2;
		camera.eye[x] = camera.center[x];
		camera.eye[z] = camera.center[z];
		camera.eye[x] += camera.distance * Math.sin(camera.zAngle);
		camera.eye[z] += camera.distance * Math.cos(camera.zAngle);
	}

	function setProjection() {
		// Set projection Matrix.
		switch(camera.projectionType) {
			case("ortho"):
				var v = camera.lrtb;
				mat4.ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
				break;
			case("frustum"):
				var v = camera.lrtb;
				mat4.frustum(camera.pMatrix, -v/2, v/2, -v/2, v/2, 1, 10);
				break;
			case("perspective"):
				mat4.perspective(camera.pMatrix, camera.fovy, 
					camera.aspect, 1, 10);
				break;
		}
		// Set projection uniform.
		gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
	}

	/**
	 * Update model-view matrix for model.
	 */
	function updateTransformations(model) {
	    
	    mat4.identity(model.mMatrix);
	    mat4.identity(model.mvMatrix);

	    mat4.translate(model.mMatrix, model.mMatrix, model.translate);
	    
	    if (interactiveSpheres.in(model.identity)) {
	        var invertedTranslateVec3 = model.invertVec3(model.translate);
	        
	        mat4.translate(model.mMatrix, model.mMatrix, invertedTranslateVec3);
	        mat4.rotateY(model.mMatrix, model.mMatrix, interactiveSpheres.rotate);
	        mat4.translate(model.mMatrix, model.mMatrix, model.translate);
	    }

	    if (model.identity == interactiveModel.identity) {
	        //console.log(interactiveModel.cutPointTranslate);
	        mat4.translate(model.mMatrix, model.mMatrix, interactiveModel.cutPointTranslate);

	        mat4.rotateX(model.mMatrix, model.mMatrix, interactiveModel.rotate[0]);
	        mat4.rotateY(model.mMatrix, model.mMatrix, interactiveModel.rotate[1]);
	        mat4.rotateZ(model.mMatrix, model.mMatrix, interactiveModel.rotate[2]);
	    }

	    mat4.scale(model.mMatrix, model.mMatrix, model.scale);

	    mat4.multiply(model.mvMatrix, camera.vMatrix, model.mMatrix);

	    mat3.normalFromMat4(model.nMatrix, model.mvMatrix);
	}

	function draw(model) {
		// Setup position VBO.
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
		gl.vertexAttribPointer(prog.positionAttrib, 3, gl.FLOAT, false, 
			0, 0);

		// Setup normal VBO.
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
		gl.vertexAttribPointer(prog.normalAttrib, 3, gl.FLOAT, false, 0, 0);

		// Setup rendering tris.
		var fill = (model.fillstyle.search(/fill/) != -1);
		if(fill) {
			gl.enableVertexAttribArray(prog.normalAttrib);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
			gl.drawElements(gl.TRIANGLES, model.iboTris.numberOfElements, 
				gl.UNSIGNED_SHORT, 0);
		}

		// Setup rendering lines.
		var wireframe = (model.fillstyle.search(/wireframe/) != -1);
		if(wireframe) {
			gl.disableVertexAttribArray(prog.normalAttrib);
			gl.vertexAttrib3f(prog.normalAttrib, 0, 0, 0);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
			gl.drawElements(gl.LINES, model.iboLines.numberOfElements, 
				gl.UNSIGNED_SHORT, 0);
		}
	}

	// App interface.
	return {
		start : start
	}

}());