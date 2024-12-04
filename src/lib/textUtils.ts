export const calculateWordAnimationDelay = (word: string, textSpeed: number) => {
    let specialDelay = 0;

    // Wait longer when unescaped "." or ","
    if (
        word.match(/(?<!\\)\./g) ||
        word.includes("?") ||
        word.includes("!")
    ) {
        specialDelay = 300;
    } else if (word.match(/(?<!\\),/g)) {
        specialDelay = 100;
    }
    return (word.length * 30 + 50 + specialDelay) * textSpeed;
};