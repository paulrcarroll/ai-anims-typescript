import Phaser, { Tilemaps } from 'phaser';
import { NumberTile } from './NumberTile';
import {
    GridPuzzleMove,
    IPuzzleDisplay,
    SlidingPuzzleModel,
    TileMoveDirection,
} from '../../models/SlidingPuzzleModel';
import { toGridCoord } from '../../models/ArrayUtils';

export class NumberTileSet
    extends Phaser.GameObjects.Container
    implements IPuzzleDisplay
{
    model: SlidingPuzzleModel;
    moveTween: Phaser.Tweens.Tween | undefined;
    tiles: NumberTile[] = [];

    baseTween = {
        repeat: 0,
        onComplete: this.onTweenComplete,
    };

    tweenDefaults = {
        duration: 900,
        ease: 'Back.easeInOut',
    };

    tileGap: number = this.tileSize / 4;
    tweenDistance = this.tileSize + this.tileGap;
    moveQueue: GridPuzzleMove[] = [];

    constructor(
        scene: Phaser.Scene,
        modelSize: number,
        public tileSize: number = 80
    ) {
        super(scene, 0, 0);

        this.model = new SlidingPuzzleModel(modelSize, this);

        this.model.state.forEach((value, index) => {
            let { x, y } = toGridCoord(index, modelSize);

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
                }
                this.tiles.push(tile);
            }
        });

        this.add(this.tiles);
        scene.add.existing(this);

        this.model.solve();
    }

    onMove(move: GridPuzzleMove) {
        this.moveQueue.push(move);
        this.playNext();
    }

    onTweenComplete(anim: Phaser.Tweens.Tween, target: any) {
        target[0].parentSet.moveTween = undefined;
        target[0].parentSet.playNext();
    }

    playNext() {
        if (!this.moveTween && this.moveQueue.length) {
            this.moveTween = this.makeTween(this.moveQueue.pop()!);
            this.moveTween?.play();
        }
    }
    override update(time: number, delta: number) {
        /*
        if (!this.moveTween) {
            this.moveTween = this.makeTween(this.model.moves()[0]);
            // this.moveTween.play();
        }

        if (this.moveTween && !this.moveTween.isPlaying()) {
        }
        */
    }

    makeTween(move: GridPuzzleMove) {
        const tile = this.tiles.find(
            (t) => t.displayText === move.nextState[move.fromIndex].toString()
        );

        if (tile) {
            let tween = {
                x: {
                    value: tile.x,
                    ...this.tweenDefaults,
                },
                y: {
                    value: tile.y,
                    ...this.tweenDefaults,
                },
            };

            switch (move.direction) {
                case TileMoveDirection.UP:
                    tween.y.value = tile.y - this.tweenDistance;
                    break;
                case TileMoveDirection.DOWN:
                    tween.y.value = tile.y + this.tweenDistance;
                    break;
                case TileMoveDirection.LEFT:
                    tween.x.value = tile.x - this.tweenDistance;
                    break;
                case TileMoveDirection.RIGHT:
                    tween.x.value = tile.x + this.tweenDistance;
                    break;
            }

            return this.scene.tweens.add({
                ...this.baseTween,
                targets: tile,
                ...tween,
            });
        }

        return undefined;
    }

    center(): { x: number; y: number } {
        return {
            x: ((this.tileSize + this.tileGap) * (this.model.size - 1)) / 2,
            y: ((this.tileSize + this.tileGap) * (this.model.size - 1)) / 2,
        };
    }
}
