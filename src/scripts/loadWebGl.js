//require(["shader", "shader!simple.vert"], function (shader, simpleFragShader) {
var gl = null;
var prog = null;

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

    setOptions();
    createShadersAndLinkProgram();
    createAndBindVertexBuffer();

    var vbos = getVBOData();
    var ibos = getIBOData();

    for (var i = 0; i < vbos.length; i++) {
        
        var vertexData = vbos[i][self.VERTEX_KEY];
        var primetiveData = vbos[i][self.PRIMITIVE_KEY];

        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        gl.drawArrays(primetiveData, 0, vertexData.length / 2);
    }
}

/**
set color and culling options
**/
function setOptions() {

    //pipline setup
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.lineWidth(10); //windows bug. since windows is rendering via the ANGLE library. 

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
            "attribute vec2 pos;",
            "void main() {",
                "gl_Position = vec4( pos.x, pos.y, 0, 1);",
	            "gl_PointSize = 10.0;",
            "}"
    ].join("\n");

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    var fragmentShaderSource = [
        "void main() {",
            "gl_FragColor = vec4(0, 0, 0, 1);",
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

    // bind vertex buffer to attribute variable
    var vertexShaderPosAttribute = gl.getAttribLocation(prog, 'pos');
    gl.vertexAttribPointer(vertexShaderPosAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexShaderPosAttribute);
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
//});
