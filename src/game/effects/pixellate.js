const fragShader = `
#define SHADER_NAME SCALINE_FS

precision mediump float;

uniform float     uTime;
uniform vec2      uResolution;
uniform sampler2D uMainSampler;
uniform sampler2D uMainSampler2;
uniform vec2      uMouse;
varying vec2 outTexCoord;

float noise(vec2 pos) {
    return fract(sin(dot(pos, vec2(12.9898 - uTime,78.233 + uTime))) * 43758.5453);
}

#define PIXELSIZE 0.15

void main( void ) {

    vec4 fragCoord = gl_FragCoord;
    vec4 fragColor = gl_FragColor;

	vec2 cor;
	
	cor.x =  fragCoord.x/PIXELSIZE;
	cor.y = (fragCoord.y+PIXELSIZE*1.5*mod(floor(cor.x),2.0))/(PIXELSIZE*3.0);
	
	vec2 ico = floor( cor );
	vec2 fco = fract( cor );
	
	vec3 pix = step( 1.5, mod( vec3(0.0,1.0,2.0) + ico.x, 3.0 ) );
	vec3 ima = texture2D( uMainSampler,PIXELSIZE*ico*vec2(1.0,3.0)/uResolution.xy ).xyz;
	
	vec3 col = pix*dot( pix, ima );

    col *= step( abs(fco.x-0.5), 0.4 );
    col *= step( abs(fco.y-0.5), 0.4 );
	
	col *= 1.2;
	fragColor = vec4( col, 1.0 );

    gl_FragColor = fragColor;
}
`;

export default class PixellateFX extends Phaser.Renderer.WebGL.Pipelines
    .PostFXPipeline {
    constructor(game) {
        super({
            game,
            renderTarget: true,
            fragShader,
            uniforms: [
                "uProjectionMatrix",
                "uMainSampler",
                "uMainSampler2",
                "uTime",
                "uResolution",
                "uMouse",
            ],
        });
    }

    onBoot() {
        this.set2f(
            "uResolution",
            this.renderer.width / 4,
            this.renderer.height / 4
        );
    }

    onPreRender() {
        this.set1f("uTime", this.game.loop.time / 1000);
        this.set2f("uMouse", this.mouseX, this.mouseY);
    }

    onDraw(renderTarget) {
        this.bindAndDraw(renderTarget);
    }
}
