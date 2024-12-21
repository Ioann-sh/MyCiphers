const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const ENGLISH_FREQUENCIES = [
    0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015, 0.06094, 0.06966, 0.00153,
    0.00772, 0.04025, 0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987, 0.06327, 0.09056,
    0.02758, 0.00978, 0.0236, 0.0015, 0.01974, 0.00074
];

function vizenerEncrypt(plaintext, key) {
    // Убираем всё лишнее из текста и ключа
    const sanitizedText = plaintext.toLowerCase().replace(/[^a-z]/g, '');
    const sanitizedKey = key.toLowerCase().replace(/[^a-z]/g, '');

    // Сдвигаем каждую букву текста на значение буквы ключа
    return sanitizedText.split('').map((char, index) => {
        const keyShift = ALPHABET.indexOf(sanitizedKey[index % sanitizedKey.length]); // длина ключа бесконечна
        const charIndex = ALPHABET.indexOf(char); // ищем букву в алфавите
        return ALPHABET[(charIndex + keyShift + ALPHABET.length) % ALPHABET.length]; // сдвиг и циклический обход
    }).join(''); // собираем строку назад
}

function vizenerDecrypt(ciphertext, key) {
    // Убираем всё лишнее из ключа
    const sanitizedKey = key.toLowerCase().replace(/[^a-z]/g, '');

    // Обратный сдвиг каждой буквы шифротекста на значение буквы ключа
    return ciphertext.split('').map((char, index) => {
        const keyShift = ALPHABET.indexOf(sanitizedKey[index % sanitizedKey.length]); // длина ключа бесконечна
        const charIndex = ALPHABET.indexOf(char);
        return ALPHABET[(charIndex - keyShift + ALPHABET.length) % ALPHABET.length]; // обратный сдвиг, чтобы вернуть букву
    }).join(''); // собираем строку обратно
}

function vizenerHack(ciphertext) {
    // Чистим текст, чтобы убрать лишние символы
    const sanitizedText = ciphertext.toLowerCase().replace(/[^a-z]/g, '');

    // Считаем индекс совпадений (IC)
    const calculateIC = text => {
        const letterCounts = Array.from(ALPHABET).map(letter => text.split(letter).length - 1); // считаем буквы
        const numerator = letterCounts.reduce((sum, count) => sum + count * (count - 1), 0); // числитель для IC
        return numerator / (text.length * (text.length - 1)); // делим, чтобы получить IC
    };

    // Угадываем длину ключа на основе IC
    const guessKeyLength = (text, maxKeyLength = 20) => {
        const icValues = Array.from({ length: maxKeyLength }, (_, guess) => {
            const segmentLength = guess + 1; // текущая догадка длины ключа
            const avgIC = Array.from({ length: segmentLength }, (_, i) => {
                const segment = text.split('').filter((_, index) => index % segmentLength === i).join(''); // делим на куски
                return calculateIC(segment); // считаем IC для каждого куска
            }).reduce((sum, ic) => sum + ic, 0) / segmentLength; // средний IC
            return avgIC; // возвращаем, что получилось
        });
        return icValues.indexOf(Math.max(...icValues)) + 1; // берём длину с максимальным IC
    };

    // Определяем букву ключа по минимальному хи-квадрату
    const determineKeyCharacter = segment => {
        const chiSquares = Array.from(ALPHABET).map((_, shift) => {
            const shiftedSegment = segment.split('').map(
                char => ALPHABET[(ALPHABET.indexOf(char) - shift + ALPHABET.length) % ALPHABET.length] // сдвигаем назад
            );
            const observed = Array.from(ALPHABET).map(
                letter => shiftedSegment.filter(ch => ch === letter).length / segment.length // частоты букв
            );
            return observed.reduce((chiSquare, freq, idx) => {
                const expected = ENGLISH_FREQUENCIES[idx]; // частоты букв в английском
                return chiSquare + Math.pow(freq - expected, 2) / expected; // рассчитываем хи-квадрат
            }, 0);
        });
        return ALPHABET[chiSquares.indexOf(Math.min(...chiSquares))]; // буква с минимальным хи-квадрат
    };

    // Угадываем длину ключа и сам ключ
    const keyLength = guessKeyLength(sanitizedText); // угадываем длину ключа
    const key = Array.from({ length: keyLength }, (_, i) => {
        const segment = sanitizedText.split('').filter((_, index) => index % keyLength === i).join(''); // кусок текста
        return determineKeyCharacter(segment); // буква ключа для этого куска
    }).join(''); // собираем ключ

    // Дешифруем текст
    return sanitizedText.split('').map((char, index) => {
        const keyShift = ALPHABET.indexOf(key[index % key.length]); // длина ключа
        const charIndex = ALPHABET.indexOf(char);
        return ALPHABET[(charIndex - keyShift + ALPHABET.length) % ALPHABET.length]; // дешифруем каждую букву
    }).join(''); // собираем текст обратно
}
