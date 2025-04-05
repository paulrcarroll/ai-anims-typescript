import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { NumberTileSet } from '../elements/SlidingPuzzle/NumberTileSet';
import { SlidingPuzzleModel } from '../models/SlidingPuzzleModel';

export class NumberTileScene extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    updateList: Phaser.GameObjects.GameObject[] = [];

    constructor() {
        super('NumberTileScene');
    }

    create() {
        this.background = this.add.image(512, 384, 'paper-background');

        this.title = this.add
            .text(512, 40, 'Sliding Puzzle', {
                fontFamily: 'Arial Black',
                fontSize: 38,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
            })
            .setOrigin(0.5, 0)
            .setDepth(100);

        let puzzle = Phaser.Display.Align.In.Center(
            new NumberTileSet(this, 4),
            this.background
        );

        puzzle.x = puzzle.x - puzzle.center().x;
        puzzle.y = puzzle.y - puzzle.center().y;

        this.updateList.push(puzzle);

        EventBus.emit('current-scene-ready', this);
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
