//require(["shader", "shader!simple.vert"], function (shader, simpleFragShader) {
var gl = null;
var prog = null;
var ibo = null;

var VERTEX_KEY = 'verticies';
var INDEX_KEY = 'indicies';
var PRIMITIVE_KEY = 'primitive';

function load() {
    var canvas = document.getElementById('canvas');
    try {
        gl = canvas.getContext('webgl');
        run();
    } catch (e) {
        console.log(e);
        console.log('Es ist ein Fehler aufgetreten.');
    }
}

function run() {

    setOptions();
    createShadersAndLinkProgram();

    var seedGeometry = getSeedGeometryData();
    console.log(seedGeometry);

    //setVertexData();

    //create and bind buffer
    createAndBindVertexBuffer(seedGeometry.verticies);
    createAndBindFragmentBuffer();
    createAndBindIndexBuffer(seedGeometry.indicies);

    setColor();
    gl.drawElements(gl.LINES, ibo.numberOfElements, gl.UNSIGNED_SHORT, 0);
}

/**
set color and culling options
**/
function setOptions() {

    //pipline setup
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
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
    //create vertex buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

    return vBuffer;
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
    ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
    ibo.numberOfElements = bufferData.length;
}

/**
**/
function setColor() {
    var colAttrib = gl.getAttribLocation(prog, 'col');
    gl.vertexAttrib4f(colAttrib, 0, 0, 1, 1);
}

/**
get verticies data for all shapes

return array
**/
function getSeedGeometryData() {

    var seedGeoData = {};

    seedGeoData.primitive =  gl.TRIANGLES;
    seedGeoData.verticies = new Float32Array([
                                 0, 0.5, 0, 
                                -0.5, 0, 0,
                                 0.5, 0, 0,
                                -0.5, 0,-0.25,
                                 0.5, 0, 0.75,
                                 0,-0.5, 0
        ]);

    seedGeoData.indicies = new Uint16Array([0,1,2, 0,1,3,  1,5,2]);

    return seedGeoData;
}

function setVertexData() {

    var lines = 32;
    var rings = 5;
    var maxPoints = (lines) * (rings);
    var dimensions = 3;
    var fullCircle = 2 * Math.PI;

    verticies = new Float32Array(maxPoints * dimensions);
    indicies = new Uint16Array(2 * 2 * maxPoints); //2 lines with 2 endpoints per line

    var dR = 1 / rings;
    var dT = fullCircle / lines;
    var iIndex = 0;

    //loop rings
    for (var i = 0, r = 0; i <= rings; i++, r += dR) {
        
        //loop lines
        for (var j = 0, t = 0; j <= lines; j++, t += dT) {

            var iVertex = i * ( lines * dimensions ) + (j * dimensions);

            //calculate coordinate points
            var x = r * Math.cos(t);
            var y = r * Math.sin(t);
            var z = 0;

            //set coordinate points
            verticies[iVertex] = x;
            verticies[iVertex + 1] = y;
            verticies[iVertex + 2] = z;

            //set indicies
            if (i > 0 && j > 0) {

                indicies[iIndex++] = iVertex;
                indicies[iIndex++] = iVertex - (lines * dimensions);

                indicies[iIndex++] = iVertex;
                indicies[iIndex++] = iVertex -  dimensions;
            }
        }
    }
}
//});
