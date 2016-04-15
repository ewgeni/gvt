//require(["shader", "shader!simple.vert"], function (shader, simpleFragShader) {

function load() {
    var canvas = document.getElementById('canvas');
    try {
        var gl = canvas.getContext('webgl');
        run(gl);
    } catch (e) {
        console.log(e);
        console.log('Es ist ein Fehler aufgetreten.');
    }
}

    function run(gl) {
        //pipline setup
        gl.clearColor(1, 1, 1, 1);

        var vertexShaderSource = [
            "attribute vec2 pos;",
            "void main() {",
                "gl_Position = vec4(pos , 0, 1);",
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
        var prog = gl.createProgram();
        gl.attachShader(prog, vertexShader);
        gl.attachShader(prog, fragmentShader);
        gl.linkProgram(prog);
        gl.useProgram(prog);

        var triangleFanpVerticies = new Float32Array([-1, 0.6, -1,-1, 1, -1, 1, 0.6, 0,1]);

        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, triangleFanpVerticies, gl.STATIC_DRAW);

        // bind vertex buffer to attribute variable
        var vertexShaderPosAttribute = gl.getAttribLocation(prog, 'pos');
        gl.vertexAttribPointer(vertexShaderPosAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexShaderPosAttribute);

        //clear framebuffer and render primitives
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.lineWidth(10); //windows bug. since windows is rendering via the ANGLE library. 
        gl.drawArrays(gl.TRIANGLE_FAN, 0, (triangleFanpVerticies.length / 2));
    }
//});
