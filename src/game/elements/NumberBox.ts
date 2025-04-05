import Phaser from 'phaser';
import { NumberGrid } from './SevNumberGrid';

export class NumberBox extends Phaser.GameObjects.Container {
    text: Phaser.GameObjects.Text;
    isMouseOver: boolean = false;

    glowPlugin: any;
    textConfig1 = {
        fontFamily: 'Arial',
        fontSize: 18,
        color: '#88ddff',
        stroke: '#ffffff66',
        strokeThickness: 2,
        align: 'left',
    };
    graphics: Phaser.GameObjects.Graphics;
    outerRect: Phaser.GameObjects.Rectangle;
    box1: any;
    box2: any;

    constructor(
        private parentGrid: NumberGrid,
        public displayText: string,
        x: number,
        y: number
    ) {
        let scene = parentGrid.scene;
        super(scene, parentGrid.x + x, parentGrid.y + y);
        this.glowPlugin = scene.plugins.get('rexglowfilterpipelineplugin');

        const cWid = 300;
        const cHt = 300;

        this.outerRect = this.scene.add.rectangle(0, 0, cWid, cHt, 0xffffff, 0);
        this.add([this.outerRect]);

        this.graphics = this.scene.make.graphics();
        this.composeObject();
        scene.add.existing(this);

        const topX = 0 - cWid / 2;
        const topY = 0 - cHt / 2;
        this.setPosition(this.x + topX, this.y + topY);

        this.setTween();
    }

    composeObject() {
        const boxWid = 200;
        const boxHt = 30;

        this.box1 = this.drawBox(0, 0, boxWid, boxHt, this.displayText);
        this.box2 = this.drawBox(0, 40, boxWid, boxHt + 10, 'Percent:');

        this.setSize(200, 70);

        var pipeline = this.glowPlugin!.add(this);
        pipeline.intensity = 0.02;
    }

    drawBox(
        x: number,
        y: number,
        width: number,
        height: number,
        text?: string
    ) {
        const color = 0xaaccff;
        const thickness = 2;
        const alpha = 1;

        this.graphics.clear();

        this.graphics.lineStyle(thickness, color, alpha);
        this.graphics.strokeRect(x, y, width, height);

        this.graphics.generateTexture('box', width, height);

        let boxContainer = this.scene.add.container(x, y);
        boxContainer.setSize(width, height);
        this.add([boxContainer]);

        let img = this.scene.add.image(0, 0, 'box').setOrigin(0);
        boxContainer.add([img]);

        if (text) {
            const textObj = this.scene.add
                .text(0, 0, text, this.textConfig1)
                .setOrigin(0);

            Phaser.Display.Align.In.Center(textObj, img);
            boxContainer.add([textObj]);

            var effect = textObj.preFX!.addPixelate(0.5);
        }

        return boxContainer;
    }

    override update(time: number, delta: number) {
        //this.x += 1;

        if (this.isMouseOver) {
            if (this.box1.angle > -90) {
                this.box1.rotation -= 0.2;
            }
        } else {
            if (this.box1.angle <= -5) {
                this.box1.rotation += 0.2;
            }
        }

        const mx = this.parentGrid.scene.input.mousePointer.x;
        const my = this.parentGrid.scene.input.mousePointer.y;

        var sqd = Phaser.Math.Distance.BetweenPointsSquared(
            { x: mx, y: my },
            { x: this.parentGrid.x + this.x, y: this.parentGrid.y + this.y }
        );

        var d = Phaser.Math.Distance.BetweenPoints(
            { x: mx + this.parentGrid.x, y: my + this.parentGrid.y },
            { x: this.parentGrid.x + this.x, y: this.parentGrid.y + this.y }
        );
    }

    setTween() {
        let self = this;
        const Between = Phaser.Math.Between;
        let gameObject = this as any;

        gameObject
            .setInteractive()
            .on('pointerover', function (pointer: Phaser.Input.Pointer) {
                // Add postfx pipeline
                var pipeline = self.glowPlugin!.add(self);

                gameObject.glowTask = gameObject.scene.tweens.add({
                    targets: pipeline,
                    intensity: 0.06,
                    ease: 'Linear',
                    duration: Between(800, 1200),
                    repeat: -1,
                    yoyo: true,
                });

                self.isMouseOver = true;
            })
            .on('pointerout', function () {
                // Remove postfx pipeline
                self.glowPlugin.remove(self);
                gameObject.glowTask.stop();
                gameObject.glowTask = null;

                self.isMouseOver = false;
            })
            .on('pointerup', function () {
                if (self.isMouseOver) {
                    self.parentGrid.onBinDrop(self);
                }
            });
    }
}
