var ground = (function () {

    function createVertexData() {

        var n = 100,
            m = 100,
            du = 20 / n,
            dv = 20 / m;

        var dimensionOffset = 3;

        this.vertices = new Float32Array(dimensionOffset * (n + 1) * (m + 1));
        this.normals = new Float32Array(3 * (n + 1) * (m + 1));
        this.indicesLines = new Uint16Array(2 * 2 * n * m);
        this.indicesTris = new Uint16Array();

        var iLines = 0;

        // Loop angle u.
        for (var i = 0, u = -10; i <= n; i++, u += du) {
            // Loop angle v.
            for (var j = 0, v = -10; j <= m; j++, v += dv) {

                var iVertex = i * (m + 1) + j;

                var x = u;
                var y = 0;
                var z = v;

                // Set vertex positions.
                this.vertices[iVertex * dimensionOffset] = x;
                this.vertices[iVertex * dimensionOffset + 1] = y;
                this.vertices[iVertex * dimensionOffset + 2] = z;

                // Calc and set normals.
                this.normals[iVertex * dimensionOffset] = 0;
                this.normals[iVertex * dimensionOffset + 1] = 1;
                this.normals[iVertex * dimensionOffset + 2] = 0;


                // Set index.
                
                if (j > 0 && i > 0) {
                    // Line on beam.
                    this.indicesLines[iLines++] = iVertex - 1;
                    this.indicesLines[iLines++] = iVertex;

                    // Line on ring.
                    this.indicesLines[iLines++] = iVertex - (m + 1);
                    this.indicesLines[iLines++] = iVertex;
                }
            }
        }
    }

    return {
        createVertexData: createVertexData
    }
})();