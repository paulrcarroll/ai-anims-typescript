const fragShader = `
#define SHADER_NAME SCALINE_FS

precision mediump float;

uniform float     uTime;
uniform vec2      uResolution;
uniform sampler2D uMainSampler;
uniform sampler2D uMainSampler2;
uniform vec2      uMouse;
varying vec2 outTexCoord;

float warp = 0.35; // simulate curvature of CRT monitor
float scan = 0.75; // simulate darkness between scanlines

void main( void ) {


    vec4 fragCoord = gl_FragCoord;
    vec4 fragColor = gl_FragColor;

    // squared distance from center
    vec2 uv = fragCoord.xy/uResolution.xy;
    vec2 dc = abs(0.5-uv);
    dc *= dc;
    
    // warp the fragment coordinates
    uv.x -= 0.5; uv.x *= 1.0+(dc.y*(0.3*warp)); uv.x += 0.5;
    uv.y -= 0.5; uv.y *= 1.0+(dc.x*(0.4*warp)); uv.y += 0.5;

    // sample inside boundaries, otherwise set to black
    if (uv.y > 1.0 || uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0)
        gl_FragColor = vec4(0.0,0.0,0.0,1.0);
    else
    	{
        // determine if we are drawing in a scanline
        float apply = abs(sin(fragCoord.y)*0.5*scan);
        // sample the texture
    	gl_FragColor = vec4(mix(texture2D(uMainSampler,uv).rgb,vec3(0.0),apply),1.0);
        }
}
`;

export default class CRTFX extends Phaser.Renderer.WebGL.Pipelines
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
