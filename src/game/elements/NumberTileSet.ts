import Phaser from 'phaser';
import { NumberTile } from './NumberTile';
import { SlidingPuzzleModel } from '../models/SlidingPuzzleModel';
import { toGridCoord } from '../models/ArrayUtils';

export class NumberTileSet extends Phaser.GameObjects.Container {
    moveTween: Phaser.Tweens.Tween | null;
    tiles: NumberTile[] = [];
    tileSize: number = 80;
    tileGap: number = 20;

    constructor(scene: Phaser.Scene, public model: SlidingPuzzleModel) {
        super(scene, 0, 0);

        this.model.values.forEach((value, index) => {
            let { x, y } = toGridCoord(index, model.size);

            if (value) {
                let tile = new NumberTile(
                    this,
                    value.toString(),
                    x * (this.tileSize + this.tileGap),
                    y * (this.tileSize + this.tileGap),
                    this.tileSize
                );

                if (this.model.canMove(index)) {
                    tile.setColor(0xddddcc);
                    //tile.moves.Up.play();
                }
                this.tiles.push(tile);
            }
        });

        this.add(this.tiles);
        scene.add.existing(this);
    }

    center(): { x: number; y: number } {
        return {
            x: ((this.tileSize + this.tileGap) * (this.model.size - 1)) / 2,
            y: ((this.tileSize + this.tileGap) * (this.model.size - 1)) / 2,
        };
    }

    override update(time: number, delta: number) {}
}
