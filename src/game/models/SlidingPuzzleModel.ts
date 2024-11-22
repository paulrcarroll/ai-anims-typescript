import { shuffle, toGridCoord } from './ArrayUtils';

export class SlidingPuzzleModel {
    values: number[] = [];

    constructor(public size: number) {
        this.values = shuffle([...Array(size * size).keys()]);
    }

    neighborIndices(index: number): number[] {
        let { x, y } = toGridCoord(index, this.size);
        let neighbors = [];

        x > 0 && neighbors.push(index - 1);
        x < this.size - 1 && neighbors.push(index + 1);
        y > 0 && neighbors.push(index - this.size);
        y < this.size - 1 && neighbors.push(index + this.size);

        return neighbors;
    }

    blankIndex(): number {
        return this.values.indexOf(0);
    }

    canMove(index: number) {
        return this.neighborIndices(index).indexOf(this.blankIndex()) >= 0;
    }

    asComparable() {
        return this.values.join(' ');
    }

    equals(other: SlidingPuzzleModel) {
        return false;
    }
}
