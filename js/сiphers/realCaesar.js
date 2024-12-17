//                                 ---Caesar's cipher---

const russianAlphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';
const alphabetLength = russianAlphabet.length;

function caesarEncrypt(text, key) {
    return text.split('').map(char => {
        const index = russianAlphabet.indexOf(char);
        if (index !== -1) {
            return russianAlphabet[(index + key) % alphabetLength];
        }
        return char;
    }).join('');
    
}

function caesarDecrypt(text, key) {
    return caesarEncrypt(text, alphabetLength - (key % alphabetLength));
}

function caesarHack(text){
    let results = '';
        for (let i = 1; i <= 32; i++) {
            results += `Ключ ${i}: ${caesarDecrypt(text, i)}\n`;
        }
    return results
}