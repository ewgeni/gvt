//require(["shader", "shader!simple.vert"], function (shader, simpleFragShader) {
var gl = null;
var prog = null;
var ibo = null;

var VERTEX_KEY = 'verticies';
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
    var verticies, indicies;

    setOptions();
    createShadersAndLinkProgram();
    setVertexData();
    createAndBindVertexBuffer();
    createAndBindIndexBuffer();
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
function createAndBindVertexBuffer() {
    //create vertex buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);

    // bind vertex buffer to attribute variable
    var vertexShaderPosAttribute = gl.getAttribLocation(prog, 'pos');
    gl.vertexAttribPointer(vertexShaderPosAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexShaderPosAttribute);
}

/**
**/
function createAndBindIndexBuffer() {
    ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicies, gl.STATIC_DRAW);
    ibo.numberOfElements = indicies.length;
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
function getVBOData() {

    var vboData = [];

    //bass guitar shape
    vboData.push({
        'verticies': new Float32Array([
                                 0.99, 0.33, // 0
                                 0.94, 0.4,
                                 0.73, 0.42,
                                 0.70, 0.37,
                                 -0.45, 0.13,
                                 -0.44, 0.16,// 5
                                 -0.28, 0.19,
                                 -0.25, 0.25,
                                 -0.11, 0.34,
                                 -0.056, 0.35,
                                 -0.09, 0.4, //10
                                 -0.15, 0.42,
                                 -0.25, 0.39,
                                 -0.33, 0.35,
                                 -0.42, 0.3,
                                 -0.5, 0.29,// 15
                                 -0.6, 0.32,
                                 -0.7, 0.35,
                                 -0.8, 0.35,
                                 -0.9, 0.29,
                                 -0.96, 0.2, // 20
                                 -0.97, 0.12,
                                 -0.96, 0.02,
                                 -0.94, -0.09,
                                 -0.9, -0.18,
                                 -0.84, -0.24,//25
                                 -0.74, -0.25,
                                 -0.65, -0.23,
                                 -0.59, -0.17,
                                 -0.54, -0.12,
                                 -0.47, -0.11,// 30
                                 -0.39, -0.12,
                                 -0.31, -0.12,
                                 -0.26, -0.09,
                                 -0.26, -0.04,
                                 -0.36, -0.02,// 35
                                 -0.4, 0.045,
                                 0.70, 0.3,
                                 0.73, 0.27
        ]),
        'primitive': gl.LINE_LOOP
    });

    //bass guitar footbridge
    vboData.push({
        'verticies': new Float32Array([
                                -0.9, 0.04,
                                -0.88, -0.071,
                                -0.8, -0.05,
                                -0.82, 0.06
        ]),
        'primitive': gl.LINE_LOOP
    });

    //bass guitar humbucker 1
    vboData.push({
        'verticies': new Float32Array([
                                -0.78, 0.1,
                                -0.745, -0.06,
                                -0.705, -0.049,
                                -0.74, 0.111
        ]),
        'primitive': gl.LINE_LOOP
    });

    //bass guitar humbucker 2
    vboData.push({
        'verticies': new Float32Array([
                                -0.65, 0.13,
                                -0.61, -0.04,
                                -0.56, -0.03,
                                -0.61, 0.14
        ]),
        'primitive': gl.LINE_LOOP
    });

    //bass guitar strings
    vboData.push({
        'verticies': new Float32Array([
                            -0.88, 0.02,
                             0.75, 0.368,
                            -0.865, 0.005,
                             0.9, 0.383,
                            -0.85, -0.01,
                             0.9, 0.365,
                            -0.835, -0.025,
                             0.75, 0.322
        ]),
        'primitive': gl.LINES
    });

    return vboData;
}

function getIBOData() {
    //var lineLoopIBO = new Uint16Array([]);

    // setup index buffer
    //var indexBuffer = gl.createBuffer();
    //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, lineLoopIBO, gl.STATIC_DRAW);
    //lineLoopIBO.numberOfElements = lineLoopIBO.length;

    //gl.drawElements(gl.LINE_LOOP, lineLoopIBO.numberOfElements, gl.UNSIGNED_SHORT, 0);
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
