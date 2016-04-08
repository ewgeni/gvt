﻿var gl = null;

function initWebGL() {

    var canvas = document.getElementById('canvas');

    try {
        gl = canvas.getContext('webgl');
        run();
    } catch (e) {
        console.log('WebGL context not found!');
    }
}

function run() {
    //pipline setup
    gl.clearColor(0, 0, 0, 1);

    // compile a vertex shader
    var vertexShaderSource = [
        'attribute vec2 pos;',
        'void main() {',
            'gl_Position = vec4(pos * 0.5, 0, 1);', 
        '}',
    ].join("\n");

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    // compile a fragment shader
    var fragmentShaderSource = [
        'void main() {',
            'gl_FragColor = vec4(1);',
        '}',
    ].join("\n");

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);


    // link together into a programm
    var prog = gl.createProgram();
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    //load vertex data into a buffer
    var vertices = new Float32Array([-1, 1, 1, 1, 1, -1, -1, -1]);
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // bind vertex buffer to attribute variable
    var vertexShaderPosAttribute = gl.getAttribLocation(prog, 'pos');
    gl.vertexAttribPointer(vertexShaderPosAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexShaderPosAttribute);

    //clear framebuffer and render primitives
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_LOOP, 0, 4);
}
