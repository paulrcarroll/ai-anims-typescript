export function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

export function toGridCoord(index: number, gridSize: number) {
    if (!gridSize || index > gridSize * gridSize) {
        return {
            x: -1,
            y: -1,
        };
    }
    return { x: index % gridSize, y: Math.floor(index / gridSize) };
}
