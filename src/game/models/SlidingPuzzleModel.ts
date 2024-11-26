import { shuffle, toGridCoord } from './ArrayUtils';

export enum TileMoveDirection {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export interface GridPuzzleMove {
    fromIndex: number;
    toIndex: number;
    direction: TileMoveDirection;
    state: string;
    nextState: string;
}

export interface IPuzzleDisplay {
    onMove(move: GridPuzzleMove): any;
}

export class SlidingPuzzleModel {
    state: number[] = [];
    targetState: string;
    stateHistory: string[] = [];
    moveCount: number = 0;

    constructor(public size: number, private display: IPuzzleDisplay) {
        const sortedNumbers = [...Array(size * size).keys()];
        this.targetState = sortedNumbers.toString();
        this.state = shuffle(sortedNumbers);
    }

    solve() {
        const moves = this.possibleMoves();
        const firstMove = moves[0];

        this.display.onMove(firstMove);
        this.swap(firstMove.fromIndex, firstMove.toIndex);

        if (this.moveCount++ < 10) {
            this.log();
            this.solve();
        }
    }

    possibleMoves() {
        var moves: GridPuzzleMove[] = [];
        const index = this.blankIndex();
        let { x, y } = toGridCoord(index, this.size);

        x > 0 &&
            moves.push({
                fromIndex: index - 1,
                toIndex: index,
                direction: TileMoveDirection.RIGHT,
                nextState: this.nextState(index - 1, index),
            });
        x < this.size - 1 &&
            moves.push({
                fromIndex: index + 1,
                toIndex: index,
                direction: TileMoveDirection.LEFT,
                nextState: this.nextState(index + 1, index),
            });
        y > 0 &&
            moves.push({
                fromIndex: index - this.size,
                toIndex: index,
                direction: TileMoveDirection.DOWN,
                nextState: this.nextState(index - this.size, index),
            });
        y < this.size - 1 &&
            moves.push({
                fromIndex: index + this.size,
                toIndex: index,
                direction: TileMoveDirection.UP,
                nextState: this.nextState(index + this.size, index),
            });

        return moves;
    }

    log() {
        let tmp = [];
        for (let i = 0; i < this.state.length; i++) {
            tmp.push(this.state[i]);
            if (i > 0 && (i + 1) % this.size === 0) {
                console.log(tmp.toString());
                tmp = [];
            }
        }
        console.log('\n');
    }

    blankIndex(): number {
        return this.state.indexOf(0);
    }

    canMove(index: number) {
        return (
            this.possibleMoves().findIndex((m) => m.fromIndex === index) >= 0
        );
    }

    asComparable() {
        return this.state.toString();
    }

    equals(other: SlidingPuzzleModel) {
        return this.asComparable() === other.asComparable();
    }

    isSolved() {
        return this.asComparable() === this.targetState;
    }

    swap(aIndex: number, bIndex: number) {
        this.stateHistory.push(this.state.toString());
        const tmp = this.state[bIndex];
        this.state[bIndex] = this.state[aIndex];
        this.state[aIndex] = tmp;
    }

    nextState(aIndex: number, bIndex: number) {
        var copy = [...this.state];
        const tmp = copy[bIndex];
        copy[bIndex] = this.state[aIndex];
        copy[aIndex] = tmp;

        return copy.toString();
    }

    fromString(stateString: string): number[] {
        return stateString.split(',').map(Number);
    }

    undo() {
        if (this.stateHistory.length) {
            this.state = this.fromString(this.stateHistory.pop()!);
        }
    }
}
