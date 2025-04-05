import Phaser from 'phaser';
import { NumberGrid } from './SevNumberGrid';

export class ScreenNumber extends Phaser.GameObjects.Container {
    text: Phaser.GameObjects.Text;
    isMouseOver: boolean = false;
    minFontSize = 24;
    maxFontSize = 64;
    textSizeTarget = this.minFontSize;

    textConfig = {
        fontFamily: 'Arial',
        fontSize: this.minFontSize,
        color: '#88ddff',
        stroke: '#ffffff66',
        strokeThickness: 2,
        align: 'center',
    };
    glowPlugin: any;
    isDragging: any;
    originalPos: Phaser.Math.Vector2;

    constructor(
        private parentGrid: NumberGrid,
        public displayText: string,
        x: number,
        y: number,
        size: number = 50
    ) {
        let scene = parentGrid.scene;
        super(scene, parentGrid.x + x, parentGrid.y + y);
        this.glowPlugin = scene.plugins.get('rexglowfilterpipelineplugin');

        let formatRect = scene.add.rectangle(0, 0, size, size);
        formatRect.visible = false;

        this.text = scene.add.text(0, 0, displayText, this.textConfig);
        this.add([this.text]);
        this.text.setToTop();

        var effect = this.text.preFX!.addPixelate(0.5);

        Phaser.Display.Align.In.Center(this.text, formatRect);

        this.setTween();
        this.originalPos = this.getWorldPoint();
        scene.add.existing(this);
    }

    override update(time: number, delta: number) {
        const mx = this.parentGrid.scene.input.mousePointer.x;
        const my = this.parentGrid.scene.input.mousePointer.y;

        var d = Phaser.Math.Distance.BetweenPoints(
            { x: mx + this.parentGrid.x, y: my + this.parentGrid.y },
            { x: this.parentGrid.x + this.x, y: this.parentGrid.y + this.y }
        );

        if (d < 100 || (this.isDragging && this.parentGrid.isDragging)) {
            this.textSizeTarget = 100 - d;
            this.isDragging = true;

            if (this.scene.input.activePointer.isDown) {
                this.x += (mx - this.x) / 20;
                this.y += (my - this.y) / 20;
            }
        }

        // back to normal gradually
        if (!this.isMouseOver) {
            this.isDragging = false;
            if (this.textSizeTarget > this.minFontSize) {
                this.textSizeTarget -= 2;
                this.text.setFontSize(this.textSizeTarget);
            }

            if (this.textSizeTarget < this.minFontSize) {
                this.textSizeTarget += 2;
                this.text.setFontSize(this.textSizeTarget);
            }

            this.x += (this.originalPos.x - this.x) / 20;
            this.y += (this.originalPos.y - this.y) / 20;
        }

        var sqd = Phaser.Math.Distance.BetweenPointsSquared(
            { x: mx, y: my },
            { x: this.parentGrid.x + this.x, y: this.parentGrid.y + this.y }
        );
    }

    setTween() {
        let self = this;
        const Between = Phaser.Math.Between;
        let gameObject = this.text as any;

        gameObject
            .setInteractive()
            .on('pointerover', function (pointer: Phaser.Input.Pointer) {
                // Add postfx pipeline
                var pipeline = self.glowPlugin!.add(gameObject);

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
                self.glowPlugin.remove(gameObject);
                gameObject.glowTask.stop();
                gameObject.glowTask = null;

                self.isMouseOver = false;
            });
    }
}
