var russianAlphabet = [
    "А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У",
    "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь", "Э", "Ю", "Я"
];

var frequencyArray = [
    { char: 'О', count: '0.1097' },
    { char: 'Е', count: '0.08450' },
    { char: 'А', count: '0.0801' },
    { char: 'И', count: '0.0735' },
    { char: 'Н', count: '0.0670' },
    { char: 'Т', count: '0.0626' },
    { char: 'С', count: '0.0547' },
    { char: 'Р', count: '0.0473' },
    { char: 'В', count: '0.0454' },
    { char: 'Л', count: '0.0440' },
    { char: 'К', count: '0.0349' },
    { char: 'М', count: '0.0321' },
    { char: 'Д', count: '0.0298' },
    { char: 'П', count: '0.0281' },
    { char: 'У', count: '0.0262' },
    { char: 'Я', count: '0.0201' },
    { char: 'Ы', count: '0.0190' },
    { char: 'Ь', count: '0.0174' },
    { char: 'Г', count: '0.0170' },
    { char: 'З', count: '0.0165' },
    { char: 'Б', count: '0.0159' },
    { char: 'Ч', count: '0.0144' },
    { char: 'Й', count: '0.0121' },
    { char: 'Х', count: '0.0097' },
    { char: 'Ж', count: '0.0094' },
    { char: 'Ш', count: '0.0073' },
    { char: 'Ю', count: '0.0064' },
    { char: 'Ц', count: '0.0048' },
    { char: 'Щ', count: '0.0036' },
    { char: 'Э', count: '0.0032' },
    { char: 'Ф', count: '0.0026' },
    { char: 'Ё', count: '0.0004' },
    { char: 'Ъ', count: '0.0003' }
];

var table = [[...russianAlphabet.slice(russianAlphabet.length - 1), ...russianAlphabet.slice(0, russianAlphabet.length - 1)]];
const length = russianAlphabet.length;
for (let i = 0; i < length; i++) {
    const row = [...russianAlphabet.slice(i), ...russianAlphabet.slice(0, i)];
    table.push(row);
}

function vizenerEncrypt(text, key) {

    const arrayOfChar = [];
    const specialCharacters = [];
    const currentText = text.toUpperCase();

    currentText.split('').forEach((char, i) => {
        const index = russianAlphabet.indexOf(char);
        if (index !== -1) {
            arrayOfChar.push(char);
        } else {
            specialCharacters.push({ char, index: i });
        }
    });

    const blocks = [];
    for (let i = 0; i < arrayOfChar.length; i += key.length) {
        blocks.push(arrayOfChar.slice(i, i + key.length));
    }

    const encryptedBlocks = blocks.map(block =>
        block.map((letter, index) => {
            const keyLetter = key[index % key.length].toUpperCase();
            const keyRow = table[0].indexOf(keyLetter);

            for (let row = 1; row < table.length; row++) {
                if (table[row][0] === letter) {
                    return table[row][keyRow];
                }
            }
            return letter;
        })
    );

    result = encryptedBlocks.map(block => block.join('')).join('');
    return result
};

function vizenerDecrypt(text, key) {
    const arrayOfChar = [];
    const specialCharacters = [];

    text.split('').forEach((char, i) => {
        const index = russianAlphabet.indexOf(char);
        if (index !== -1) {
            arrayOfChar.push(char);
        } else {
            specialCharacters.push({ char, index: i });
        }
    });

    const blocks = [];
    for (let i = 0; i < arrayOfChar.length; i += key.length) {
        blocks.push(arrayOfChar.slice(i, i + key.length));
    }

    const decryptedBlocks = blocks.map(block =>
        block.map((encryptedLetter, index) => {
            const keyLetter = key[index % key.length].toUpperCase();
            const keyRow = table[0].indexOf(keyLetter);

            for (let row = 1; row < table.length; row++) {
                if (table[row][keyRow] === encryptedLetter) {
                    return table[row][0];
                }
            }
            return encryptedLetter;
        })
    );

    result = decryptedBlocks.map(block => block.join('')).join('');
    return result
};

function vizenerHack(text, syllableLength = 2) {
    const possibleKeys = [];
    const decryptedResults = [];

    for (let i = 0; i < russianAlphabet.length; i++) {
        for (let j = 0; j < russianAlphabet.length; j++) {
            for (let k = 0; k < russianAlphabet.length; k++) {
                const key = russianAlphabet[i] + russianAlphabet[j] + russianAlphabet[k];
                possibleKeys.push(key); 
            }
        }
    }

    for (let p = 0; p < possibleKeys.length; p++) {
        const key = possibleKeys[p];
        let decryptedText = '';


        for (let i = 0; i < text.length; i++) {
            const encryptedLetter = text[i];
            const keyLetter = key[i % key.length].toUpperCase(); 
            const keyRow = table[0].indexOf(keyLetter);


            let decryptedLetter = encryptedLetter; 
            for (let row = 1; row < table.length; row++) {
                if (table[row][keyRow] === encryptedLetter) {
                    decryptedLetter = table[row][0]; 
                    break;
                }
            }
            decryptedText += decryptedLetter;
        }

        decryptedResults.push({ key: key, text: decryptedText });
    }

    console.log('All possible results:', decryptedResults);
    return decryptedResults;
}

