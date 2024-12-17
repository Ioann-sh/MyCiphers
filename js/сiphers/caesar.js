function caesarEncrypt(text, key) {
    let result = '';
    for (let i = 0; i < key; i++) {
        for (let j = i; j < text.length; j += key) {
            result += text[j]
        }
    }
    return result;
    
}

function caesarDecrypt(text, key) {
    console.log(1)
    let result = Array(text.length).fill(''); 
    let index = 0;
    for (let i = 0; i < key; i++) {
        for (let j = i; j < text.length; j += key) {
            result[j] = text[index];
            index++;
        }
    }
    return result.join(''); 
}

function caesarSimpleHack(text){
    const results = [];
    for (let key = 1; key <= text.length; key++) {
        const decryptedText = caesarDecrypt(text, key);
        results.push({ key: key, text: decryptedText });
    }
    console.log(results)
    return results;
}

function caesarHack(text) {
    
    const banSyllableList = [
        "аы", "аь", "аъ", 
        "вэ", 
        "гв", "гж", "гз", "гф", "гх", "гы", "гя", "гэ", "гё", "гю", "гъ", "гь", 
        "еы", "еь", "еъ", "еэ", 
        "ёа", "ёе", "ёё", "ёи", "ёы", "ёь", "ёъ", "ёэ", "ёя", 
        "жы", "жя", "жю", "жф", "жх", "жш", "жщ", 
        "зй", "зщ", 
        "иы", "иь", "иъ", 
        "йа", "йё", "йж", "йй", "йь", "йы", "йъ", "йэ", 
        "кы", "кя", "кё", "кю", "кй", "кщ", "кь", "къ", 
        "лй", "лъ", "лэ", 
        "мй", "мъ", 
        "нй", 
        "оы", "оь", "оъ", 
        "пв", "пг", "пж", "пз", "пй", "пъ", 
        "ръ", 
        "сй", 
        "тй", 
        "уы", "уь", "уъ", 
        "фб", "фв", "фз", "фж", "фй", "фп", "фх", "фц", "фч", "фщ", "фъ", "фэ", 
        "хы", "хя", "хё", "хю", "хж", "хй", "хщ", "хъ", "хь", 
        "цб", "цж", "цй", "цф", "цх", "цч", "цщ", "цъ", "ць", "ця", "цё", "цю", 
        "чб", "чг", "чз", "чй", "чп", "чф", "чщ", "чъ", "чы", 
        "шд", "шж", "шз", "шй", "шш", "шщ", "шъ", "шы", "шя", "шю", 
        "щб", "щг", "щд", "щж", "щз", "щй", "щп", "щт", "щф", "щх", "щц", "щч", "щш", "щщ", "щъ", "що", "щы", "щя", "щю", 
        "ъа", "ъб", "ъв", "ъг", "ъд", "ъж", "ъз", "ъи", "ъй", "ък", "ъл", "ъм", "ън", "ъо", "ъп", "ър", "ъс", "ът", "ъу", "ъф", "ъх", "ъц", "ъч", "ъш", "ъщ", "ъъ", "ъы", "ъь", "ъэ", 
        "ыа", "ыё", "ыо", "ыф", "ыь", "ыы", "ыъ", "ыэ", 
        "ьа", "ьй", "ьл", "ьу", "ьъ", "ьы", 
        "эа", "эе", "эё", "эц", "эч", "эъ", "эы", "эь", "ээ", 
        "юу", "юь", "юы", 
        "яа", "яё", "яо", "яъ", "яы", "яь", "яэ"
    ];

    const encryptList = [];
    const results = [];

    for (let i = 1; i <= text.length; i++) {
        encryptList.push(caesarDecrypt(text, i));
    }

    for (let i = 0; i < encryptList.length; i++) {
        let banSyllableContr = 0;
        for (let j = 0; j < banSyllableList.length; j++) {
            if (encryptList[i].includes(banSyllableList[j])) {
                banSyllableContr++;
            }
        }
        results.push({ key: i+1, text: encryptList[i], banSyllableCount: banSyllableContr });
    }

    const sortedResults = results.sort((a, b) => a.banSyllableCount - b.banSyllableCount);

    return sortedResults
}
