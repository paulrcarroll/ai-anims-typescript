import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

import { NumberTile } from '../elements/NumberTile';

export class NumberTileScene extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    things: Phaser.GameObjects.GameObject[] = [];

    constructor() {
        super('NumberTileScene');
    }

    create() {
        this.background = this.add.image(512, 384, 'paper-background');

        this.title = this.add
            .text(512, 460, 'Number Tiles', {
                fontFamily: 'Arial Black',
                fontSize: 38,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
            })
            .setOrigin(0.5)
            .setDepth(100);

        let rowCount = 4;
        for (let i = 0; i < rowCount; i++) {
            this.things.push(
                new NumberTile(this, i.toString(), 100 + i * 65, 100)
            );
        }

        EventBus.emit('current-scene-ready', this);
    }

    override update() {
        this.things.forEach((thing) => {
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
