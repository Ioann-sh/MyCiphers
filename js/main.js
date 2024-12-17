function selectCipher(cipher) {

    if (cipher){ 
        document.getElementById('cipher-container').innerHTML = templates[cipher]
    } else {
        document.getElementById('cipher-container').innerHTML = templates['unavailable']
    }

}

function encrypt(currentCipher) {

    const text = document.getElementById('message').value.trim();
    let result = '';

    if (currentCipher === 'caesar') {
        
        let key = document.getElementById('key').value.trim();
        result = caesarEncrypt(text, parseInt(key));
        //
        document.getElementById('result').innerText = `Зашифрованное сообщение c ключём ${key}: ${result}`;
    } else if (currentCipher === 'enigma'){
        const rotor1 = document.getElementById('rotor1').value.trim();
        const rotor2 = document.getElementById('rotor2').value.trim();
        const rotor3 = document.getElementById('rotor3').value.trim();
        const reflector = document.getElementById('reflector').value.trim();
        const initialPositions = document.getElementById('initialPositions').value.trim();
        result = enigmaEncrypt(text, rotor1, rotor2, rotor3, reflector, initialPositions);
        //
        document.getElementById('result').innerText = `Зашифрованное сообщение: ${result}`;
    } else if (currentCipher === 'vizener'){
        let key = document.getElementById('key').value.trim(); 
        result = vizenerEncrypt(text, key);
        //
        document.getElementById('result').innerText = `Зашифрованное сообщение: ${result}`;
    }

}

function decrypt(currentCipher) {

    const text = document.getElementById('message').value.trim();
    let result = '';

    if (currentCipher === 'caesar') {
        let key = document.getElementById('key').value.trim(); 
        result = caesarDecrypt(text, parseInt(key));
        //
        document.getElementById('result').innerText = `Расшифрованное сообщение c ключём ${key}: ${result}`;
    } else if (currentCipher === 'enigma'){
        const rotor1 = document.getElementById('rotor1').value.trim();
        const rotor2 = document.getElementById('rotor2').value.trim();
        const rotor3 = document.getElementById('rotor3').value.trim();
        const reflector = document.getElementById('reflector').value.trim();
        const initialPositions = document.getElementById('initialPositions').value.trim();
        result = enigmaDecrypt(text, rotor1, rotor2, rotor3, reflector, initialPositions);
        //
        document.getElementById('result').innerText = `Расшифрованное сообщение: ${result}`;
    } else if (currentCipher === 'vizener'){
        let key = document.getElementById('key').value.trim(); 
        result = vizenerDecrypt(text, key);
        //
        document.getElementById('result').innerText = `Зашифрованное сообщение: ${result}`;
    }

}

function hack(currentCipher) {

    const text = document.getElementById('message').value.trim();
    let results = '';

    if (currentCipher === 'caesar') {
        results = caesarHack(text)
            .map(item => `Ключ ${item.key}: ${item.text} (бан-слоги ${item.banSyllableCount})`)
            .join('\n');
    } else if (currentCipher === 'enigma'){
        results = enigmaHack(text);
    } else if (currentCipher === 'vizener'){
        
        results = vizenerHack(text)

    }

    document.getElementById('result').innerText = `Возможные расшифровки:\n${results}`;

}