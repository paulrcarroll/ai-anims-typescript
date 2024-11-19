import Phaser from 'phaser';

export class NumberTile extends Phaser.GameObjects.Container {
    shadow: any;
    heightTween: Phaser.Tweens.Tween | null;

    constructor(
        scene: Phaser.Scene,
        displayText: string,
        x: number,
        y: number
    ) {
        super(scene, x, y);

        let graphics = scene.add.graphics();

        graphics.lineStyle(3, 0x444444, 0.6);
        graphics.fillStyle(0xeeeedd);
        graphics.fillRoundedRect(-30, -30, 60, 60, 8);
        graphics.strokeRoundedRect(-30, -30, 60, 60, 8);

        let box = scene.add.rectangle(0, 0, 50, 50, 0xdddd99);
        box.visible = false;
        // box.lineWidth = 2;

        var textConfig = {
            fontSize: '18px',
            color: '0x444444',
            fontFamily: 'Arial',
        };
        let text = scene.add.text(0, 0, displayText, textConfig);

        this.add([graphics, text]);

        text.setToTop();

        Phaser.Display.Align.In.Center(text, box);

        // (this.tile as Phaser.GameObjects.GameObject).setOrigin(0.5);

        if (scene.plugins != null) {
            var postFx = scene.plugins.get('rexdropshadowpipelineplugin');

            this.shadow = (postFx as any).add(this, {
                distance: 8,
                angle: 320,
                shadowColor: 0x000000,
                alpha: 0.5,
            });
        }

        scene.add.existing(this);

        this.heightTween = scene.tweens.add({
            targets: this.shadow,
            distance: { value: 40, duration: 300, ease: 'Back.easeInOut' },
            yoyo: true,
            repeat: -1,
        });

        this.heightTween.pause();
    }

    override update(time: number, delta: number) {
        // Add any update logic here, e.g., movement
        // this.tile.x = this.tile.x + 1;
        // this.shadow.distance += 0.01;
        //  this.tile.rotation = this.tile.rotation + 0.002;
        //this.angle = this.angle + 5;
    }
}
