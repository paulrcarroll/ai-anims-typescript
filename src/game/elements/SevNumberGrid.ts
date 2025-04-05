import Phaser, { GameObjects, Scale, Tilemaps } from 'phaser';
import { toGridCoord } from '../models/ArrayUtils';
// @ts-ignore
import PixellateFX from '../effects/pixellate.js';
import { ScreenNumber } from './ScreenNumber';
import { NumberBox } from './NumberBox';

export class NumberGrid extends Phaser.GameObjects.Container {
    moveTween: Phaser.Tweens.Tween | undefined;
    numbers: ScreenNumber[] = [];
    glowPlugin: any;

    minFontSize = 28;
    maxFontSize = 64;

    textConfig1 = {
        fontFamily: 'Arial',
        fontSize: this.minFontSize,
        color: '#88ddff',
        stroke: '#ffffff66',
        strokeThickness: 2,
        align: 'center',
    };
    graphics: GameObjects.Graphics;
    boxes: NumberBox[] = [];

    isDragging = false;

    constructor(
        scene: Phaser.Scene,
        private xSize: number,
        private ySize: number,
        public numberSize: number = 60
    ) {
        super(scene, 100, 100);

        this.glowPlugin = scene.plugins.get('rexglowfilterpipelineplugin');

        for (let x = 0; x < xSize; x++) {
            for (let y = 0; y < ySize; y++) {
                let randomNumber = Math.floor(Math.random() * 10);

                this.numbers.push(
                    new ScreenNumber(
                        this,
                        randomNumber.toString(),
                        numberSize * x + 0,
                        numberSize * y + 20
                    )
                );
            }
        }

        this.drawLines();

        scene.add.existing(this);
    }

    drawLines() {
        const lineGap = 10;
        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(2, 0x88eeff, 0.2);

        this.graphics.beginPath();

        const topLineY = 75;
        const bottomLineY = this.numberSize * (this.ySize + 1) + 40;

        this.graphics.moveTo(20, topLineY);
        this.graphics.lineTo(1000, topLineY);

        this.graphics.moveTo(20, topLineY + lineGap);
        this.graphics.lineTo(1000, topLineY + lineGap);

        this.graphics.moveTo(20, bottomLineY);
        this.graphics.lineTo(1000, bottomLineY);

        this.graphics.moveTo(20, bottomLineY + lineGap);
        this.graphics.lineTo(1000, bottomLineY + lineGap);

        this.graphics.closePath();
        this.graphics.strokePath();

        this.glowPlugin!.add(this.graphics);

        const boxY = bottomLineY + 70;
        const boxX = 120;
        const boxWid = 220;

        this.boxes.push(new NumberBox(this, '01', boxX + boxWid * 0, boxY));
        this.boxes.push(new NumberBox(this, '02', boxX + boxWid * 1, boxY));
        this.boxes.push(new NumberBox(this, '03', boxX + boxWid * 2, boxY));
        this.boxes.push(new NumberBox(this, '04', boxX + boxWid * 3, boxY));
    }

    override update(time: number, delta: number) {
        this.isDragging = this.scene.input.activePointer.isDown;

        for (let num of this.numbers) {
            num.update(time, delta);
        }

        for (let box of this.boxes) {
            box.update(time, delta);
        }
    }

    onBinDrop(bin: NumberBox) {
        console.log(`Drop in bin ${bin}`);
        for (let num of this.numbers) {
            if (num.isDragging) {
                num.visible = false;
            }
        }
    }
}
