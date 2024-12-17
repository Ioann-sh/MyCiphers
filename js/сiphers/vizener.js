const alphabet = Array.from('abcdefghijklmnopqrstuvwxyz');
const MAX_KEY_LENGTH_GUESS = 20;
const ENGLISH_LETTER_FREQUENCIES = [
    0.08167,
    0.01492,
    0.02782,
    0.04253,
    0.12702,
    0.02228,
    0.02015,
    0.06094,
    0.06966,
    0.00153,
    0.00772,
    0.04025,
    0.02406,
    0.06749,
    0.07507,
    0.01929,
    0.00095,
    0.05987,
    0.06327,
    0.09056,
    0.02758,
    0.00978,
    0.0236,
    0.0015,
    0.01974,
    0.00074,
];

function calculateIndexOfCoincidence(text){
    const textLength = text.length;
    const frequencies = alphabet.map((letter) => text.split(letter).length - 1);
    const frequencySum = frequencies.reduce((sum, count) => sum + count * (count - 1), 0);
    return frequencySum / (textLength * (textLength - 1));
};

function estimateKeyLength(text){
    const icValues = Array.from({ length: MAX_KEY_LENGTH_GUESS }, (_, guess) => {
        const guessLength = guess + 1;
        const averageIC = Array.from({ length: guessLength }, (_, i) => {
            const sequence = Array.from(text).filter((_, index) => index % guessLength === i).join('');
            return calculateIndexOfCoincidence(sequence);
        }).reduce((sum, ic) => sum + ic, 0);

        return averageIC / guessLength;
    });

    const sortedICValues = [...icValues].sort((a, b) => b - a);
    const bestGuess = icValues.indexOf(sortedICValues[0]) + 1;
    const secondBestGuess = icValues.indexOf(sortedICValues[1]) + 1;

    return bestGuess % secondBestGuess === 0 ? secondBestGuess : bestGuess;
};

function analyzeFrequency(sequence){
    const chiSquareds = alphabet.map((_, shift) => {
        const shiftedSequence = sequence
            .split('')
            .map((char) => alphabet[(alphabet.indexOf(char) - shift + alphabet.length) % alphabet.length]);

        const observedFrequencies = alphabet.map(
            (letter) => shiftedSequence.filter((char) => char === letter).length / sequence.length
        );

        return observedFrequencies.reduce((chiSquared, observed, index) => {
            const expected = ENGLISH_LETTER_FREQUENCIES[index];
            return chiSquared + Math.pow(observed - expected, 2) / expected;
        }, 0);
    });

    return alphabet[chiSquareds.indexOf(Math.min(...chiSquareds))];
};

function extractKey(text, keyLength){
    return Array.from({ length: keyLength }, (_, i) => {
        const sequence = Array.from(text).filter((_, index) => index % keyLength === i).join('');
        return analyzeFrequency(sequence);
    }).join('');
};
//ЗАШИФРОВКА
function vizenerEncrypt(text, key) {

    const inputText = text.toLowerCase().replace(/[^a-z]/g, '');
    const encryptionKey = key.toLowerCase().replace(/[^a-z]/g, '');
    const encoded = inputText.split('').map((char, index) => {
        const keyShift = encryptionKey[index % encryptionKey.length].charCodeAt(0) - 97;
        const charShift = char.charCodeAt(0) - 97;
        return String.fromCharCode(((charShift + keyShift) % alphabet.length) + 97);
    }).join('');

    return encoded

};

function vizenerDecrypt(text, key) {
    const encodedMessage = text.toLowerCase();
    const encryptionKey = key.toLowerCase().replace(/[^a-z]/g, '');

    const decoded = encodedMessage.split('').map((char, index) => {
        const keyShift = encryptionKey[index % encryptionKey.length].charCodeAt(0) - 97;
        const charShift = char.charCodeAt(0) - 97;
        return String.fromCharCode(((charShift - keyShift + alphabet.length) % alphabet.length) + 97);
    }).join('');

    return decoded
};

function vizenerHack(text){
    const keyLength = estimateKeyLength(text);
    const derivedKey = extractKey(text, keyLength);

    const result = text
        .split('')
        .map((char, index) => {
            const charIndex = alphabet.indexOf(char);
            if (charIndex === -1) return char;

            const keyShift = alphabet.indexOf(derivedKey[index % derivedKey.length]);
            return alphabet[(charIndex - keyShift + alphabet.length) % alphabet.length];
        })
        .join('');

    return result
};