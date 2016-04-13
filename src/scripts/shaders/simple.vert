attribute vec2 pos;
void main() {
	gl_Position = vec4(pos * 0.2 - 0.3, 0, 1);
	gl_PointSize = 10.0;
}