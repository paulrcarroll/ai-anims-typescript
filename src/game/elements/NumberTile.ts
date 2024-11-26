import Phaser from 'phaser';
import { NumberTileSet } from './NumberTileSet';

export class NumberTile extends Phaser.GameObjects.Container {
    shadow: any;
    text: Phaser.GameObjects.Text;
    box: Phaser.GameObjects.Graphics;

    constructor(
        private parentSet: NumberTileSet,
        public displayText: string,
        x: number,
        y: number,
        private size: number
    ) {
        let scene = parentSet.scene;
        super(scene, x, y);

        this.drawBox(0xefefee);

        let formatRect = scene.add.rectangle(0, 0, size, size);
        formatRect.visible = false;

        var textConfig = {
            fontSize: '18px',
            color: '0x444444',
            fontFamily: 'Arial',
        };

        this.text = scene.add.text(0, 0, displayText, textConfig);
        this.add([this.box, this.text]);
        this.text.setToTop();

        Phaser.Display.Align.In.Center(this.text, formatRect);

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
    }

    private drawBox(color: number) {
        const size = this.parentSet.tileSize;
        const half = size / 2;

        this.box = this.scene.add.graphics();
        this.box.lineStyle(3, 0x444444, 0.6);
        this.box.fillStyle(color);
        this.box.fillRoundedRect(-half, -half, size, size, size / 10);
        this.box.strokeRoundedRect(-half, -half, size, size, size / 10);
    }

    setColor(color: number) {
        this.drawBox(color);

        this.add([this.box, this.text]);
        this.text.setToTop();
    }

    override update(time: number, delta: number) {
        // Add any update logic here, e.g., movement
        // this.tile.x = this.tile.x + 1;
        // this.shadow.distance += 0.01;
        //  this.tile.rotation = this.tile.rotation + 0.002;
        //this.angle = this.angle + 5;
    }
}
