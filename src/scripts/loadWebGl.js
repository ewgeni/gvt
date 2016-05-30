//require(["shader", "shader!simple.vert"], function (shader, simpleFragShader) {
var prog = null;
var vbo = null;
var ibo = null;
var geometryBuffer = {};
var vertexDataPool = [];

function load() {
    var canvas = document.getElementById('canvas');
    try {
        gl = canvas.getContext('webgl');
        init();
    } catch (e) {
        console.log(e);
        console.log('Es ist ein Fehler aufgetreten.');
    }
}

function init() {
    bindEvents();
    setOptions();
    createShadersAndLinkProgram();

    var seedGeo = getSeedGeometryData();
    for (var i = 0; i < seedGeo.length; i++) {
        geometryBuffer[seedGeo[i].primitive] = seedGeo[i];
    }
   
    run();
}

function run() {
    

    //create and bind buffer
    for (var key in geometryBuffer) {
        var geo = geometryBuffer[key];

        createAndBindVertexBuffer(geo.verticies);
        createAndBindFragmentBuffer(); /** @TODO Wrong Fnc. name **/
        createAndBindIndexBuffer(geo.indicies);
        setColor(geo.color);
        drawElements(geo.primitive);
    }
}

function bindEvents() {

    document.getElementById("showWireframe")
            .addEventListener("click", function () {
                var geo = geometryBuffer[1];
                clearScreen();
                createAndBindIndexBuffer(geo.indicies);
                drawElements(geo.primitive);
            });

    document.getElementById("showFaces")
            .addEventListener("click", function() {
                run();
            });

    document.getElementById("morphToSphere")
           .addEventListener("click", function () {
               clearScreen();
               morphToSphere(geometryBuffer[4]);
               console.log(geometryBuffer[4]);
               run();
               //drawElements(geometryBuffer.seedGeometry.primitive);
           });
}

/**
**/
function clearScreen() {
    //pipline setup
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

/**
set color and culling options
**/
function setOptions() {

    clearScreen();
    //gl.lineWidth(10); //windows bug. since windows is rendering via the ANGLE library. 

    //culling options
    gl.frontFace(gl.CCW); // default CCW, therefore optional
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // Depth(Z)-Buffer.
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);    

    // Polygon offset of rastered Fragments.
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0.5, 0);        
}

/**
**/
function drawElements(enumMode) {
    //console.log(ibo.numberOfElements);
    gl.drawElements(enumMode, ibo.numberOfElements, gl.UNSIGNED_SHORT, 0);
}

/**
creates the vertex and fragment shader and links all to a compiled program
**/
function createShadersAndLinkProgram() {

    var vertexShaderSource = [
            "attribute vec3 pos;",
            "attribute vec4 col;",
            "varying vec4 color;",

            "void main() {",
                "color = col;",
                "gl_Position = vec4( pos, 1);",
	            "gl_PointSize = 10.0;",
            "}"
    ].join("\n");

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    var fragmentShaderSource = [
        "precision mediump float;",
        "varying vec4 color;",

        "void main() {",
            "gl_FragColor = color;",
        "}"
    ].join("\n");

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);


    // link together into a programm
    try {
        prog = gl.createProgram();
        gl.attachShader(prog, vertexShader);
        gl.attachShader(prog, fragmentShader);
        gl.bindAttribLocation(prog, 0, "pos");
        gl.linkProgram(prog);
        gl.useProgram(prog);
    } catch (e) {
        console.log(e);
    }
}

/**
create and bind vertex shader, also bind vertex buffer to pos
attribute from vertex shader
**/
function createAndBindVertexBuffer(bufferData) {
    gl.deleteBuffer(vbo);
    vbo = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
}

/**
**/
function createAndBindFragmentBuffer() {
    // bind vertex buffer to attribute variable
    var vertexShaderPosAttribute = gl.getAttribLocation(prog, 'pos');
    gl.vertexAttribPointer(vertexShaderPosAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexShaderPosAttribute);

    return vertexShaderPosAttribute;
}

/**
**/
function createAndBindIndexBuffer(bufferData) {
    gl.deleteBuffer(ibo);
    ibo = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
    ibo.numberOfElements = bufferData.length;
}

/**
**/
function setColor(color) {
    var col = color || {r:0, g:0, b:0, a:1};
    var colAttrib = gl.getAttribLocation(prog, 'col');
    gl.vertexAttrib4f(colAttrib, col.r, col.g, col.b, col.a);
}

/**
get verticies data for all shapes

return array
**/
function getSeedGeometryData(drawMode) {

    var mode = drawMode || gl.TRIANGLES;
    var seedGeoData = [];
    vertexDataPool.push(new Float32Array([
                                0, 0.5, 0,
                               -0.5, 0, 0,
                                0.2, 0, 0,
                               -0.1, 0.1, -0.5,
                                0.5, 0.1, 0.05,
                                0, -0.5, 0
    ]));

    //var geo = new Geometry();
    //geo.setColor({r:1, g:1, b:1, a:1});
    //geo.setVerticies(vertexDataPool[0]);
    //geo.setIndicies(new Uint16Array([0, 1, 1, 2, 2, 0, 2, 4, 4, 0,
    //                                         4, 3, 0, 3, 3, 1, 1, 5, 5, 2,
    //                                         5, 4, 5, 3
    //]));

   // seedGeoData.push(geo);

    switch (mode) {
        case gl.TRIANGLES:
                geo2 = new Geometry(gl.TRIANGLES);
                geo2.setVerticies(vertexDataPool[0]);
                geo2.indicies = new Uint16Array([0, 1, 2, 0, 3, 1, 0, 4, 3, 0, 2, 4, 1, 5, 2, 3, 1, 5, 4, 3, 5, 2, 5, 4]);

                seedGeoData.push(geo2);
                seedGeoData.reverse();
            break;
    }

    return seedGeoData;
}

/**
**/
function morphToSphere(geometryBufferData) {

    var dimensionOffset = 3;
    var vecMath = new VecMath();

    var oldVerticiesCount = geometryBufferData.verticies.length;
    var oldIndiciesCount = geometryBufferData.indicies.length;

    var newVerticiesCount = oldVerticiesCount * 3;
    var newIndiciesCount = oldIndiciesCount * 4;

    var newVerticies = new Float32Array(newVerticiesCount);
    var newIndicies = new Uint16Array(newIndiciesCount);

    newVerticies.set(geometryBufferData.verticies, 0);

    var i = 0;
    var trianglePoints = [];
    for (let value of geometryBufferData.indicies) {

        trianglePoints.push( geometryBufferData.getVertexPointsAsVec3ByIndex(value) );

        if (trianglePoints.length == 3) {
            //console.log('trianglePoints');
            //console.log(trianglePoints);

            var centerPoints = vecMath.calcCenterPointsOfTriangles(trianglePoints);

            //console.log('centerPoints');
            //console.log(centerPoints);
            //add new vertex points
            for (var j = 0; j < centerPoints.length; j++) {

                var newVertexOffset = oldVerticiesCount + (i * dimensionOffset) + (j * dimensionOffset);
                var newIndiciesIndex = oldIndiciesCount + j;
                var point = centerPoints[j];

                newVerticies[newVertexOffset] = point.x;
                newVerticies[newVertexOffset + 1] = point.y;
                newVerticies[newVertexOffset + 2] = point.z;

                //console.log(point);
                //console.log(newVerticies);
                

                newIndicies[newIndiciesIndex] = newVertexOffset / dimensionOffset;
            }

            i++;
            triangleMod = 0;
            trianglePoints = [];
        }
    }

    geometryBuffer[4].setVerticies(newVerticies);
    geometryBuffer[4].setIndicies(newIndicies);
}
//});
