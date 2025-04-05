export class OutlinePipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline
{

  // the unique id of this pipeline
  public static readonly KEY = 'Outline';

  /**
   * @param {Phaser.Game} game - the controller of the game instance
   */
  constructor(game: Phaser.Game, size: number = 10)
  {
    super({
      game: game,
      fragShader: `
      precision mediump float;

      uniform sampler2D uMainSampler;
      
      varying vec2 outTexCoord;
      varying float outTintEffect;
      varying vec4 outTint;
      
      uniform vec4 filterArea;
      uniform float size;
      
      vec2 mapCoord(vec2 coord){
          coord *= filterArea.xy;
          coord += filterArea.zw;
      
          return coord;
      }
      
      vec2 unmapCoord(vec2 coord){
          coord -= filterArea.zw;
          coord /= filterArea.xy;
      
          return coord;
      }
      
      vec2 pixelate(vec2 coord, vec2 size){
        return floor(coord / size) * size;
      }
      
      void main(void){
          vec2 coord = mapCoord(outTexCoord);
          coord = pixelate(coord, vec2(size, size));
          coord = unmapCoord(coord);
      
          vec4 texture = texture2D(uMainSampler, coord);
          vec4 tint = vec4(outTint.rgb * outTint.a, outTint.a);
      
          if(outTintEffect == 0.0){
              gl_FragColor = texture * tint;
          }else if(outTintEffect == 1.0){
              gl_FragColor.rgb = mix(texture.rgb, outTint.rgb * outTint.a, texture.a);
              gl_FragColor.a = texture.a * tint.a;
          }else{
              gl_FragColor = tint;
          }
      }
      `
    });

    //this.size = size;
  }

  set size(size){
    this.set1f("size", size);
  }

  batchSprite(sprite, camera, parent){
    const {frame} = sprite;
    this.set1f("size", 40);

    this.set4f("filterArea", frame.source.width, frame.source.height, frame.x, frame.y);

    super.batchSprite(sprite, camera, parent);
  }
}