import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { NumberGrid } from '../elements/SevNumberGrid';
// @ts-ignore
import ScanlinePostFX from '../effects/scanlinePostFX.js';
// @ts-ignore
import PixellateFX from '../effects/pixellate.js';
// @ts-ignore
import CRTFX from '../effects/CRT.js';

export class Severance1 extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    updateList: Phaser.GameObjects.GameObject[] = [];

    textConfig1 = {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#eeeeff',
        stroke: '#ffffffaa',
        strokeThickness: 2,
        align: 'center',
    };

    constructor() {
        super('Severance1');
    }

    create() {
        var glowPlugin: any = this.plugins.get('rexglowfilterpipelineplugin');

        this.background = this.add.image(512, 384, 'severance-background1');
        this.background.scale = 2.0;

        let logo = this.add.image(900, 40, 'lumon-logo');
        logo.scale = 0.2;
        glowPlugin!.add(logo, {
            intensity: 0.04,
        });

        let pipeline = this.cameras.main.setPostPipeline([
            ScanlinePostFX,
            CRTFX,
        ]);

        let numbers = Phaser.Display.Align.In.Center(
            new NumberGrid(this, 15, 9),
            this.background
        );

        this.updateList.push(numbers);

        EventBus.emit('current-scene-ready', this);

        this.add.text(60, 30, `Lumon CactusLane`, this.textConfig1);
    }

    override update() {
        this.updateList.forEach((thing) => {
            thing.update();
        });
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback) {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}
