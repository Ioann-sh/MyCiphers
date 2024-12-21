function selectCipher(cipher) {
    if (cipher) {
        document.getElementById('cipher-container').innerHTML = templates[cipher]
        if (cipher === 'gost'){
            generateKey(cipher)
        }
    } else {
        document.getElementById('cipher-container').innerHTML = templates['unavailable']
    }
}

function generateKey(cipher) {
    if (cipher === 'gost') {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        for (let i = 0; i < 32; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            key += characters[randomIndex];
        }
        document.getElementById('key').textContent = key;
    }
}

function encrypt(currentCipher) {
    const text = document.getElementById('message').value.trim();
    let result = '';

    if (currentCipher === 'caesar') {
        let key = document.getElementById('key').value.trim();
        result = caesarEncrypt(text, parseInt(key));
        document.getElementById('result').innerText = `Зашифрованное сообщение c ключём ${key}:\n${result}`;
    } else if (currentCipher === 'vizener') {
        let key = document.getElementById('key').value.trim();
        result = vizenerEncrypt(text, key);
        document.getElementById('result').innerText = `Зашифрованное сообщение c ключём ${key}:\n${result}`;
    } else if (currentCipher === 'gost') {
        let key = document.getElementById('key').textContent.trim();
        result = gostEncrypt(text, key) 
        let hash = hashing(text, key)
        document.getElementById('result').innerText = `Зашифрованное сообщение c ключём ${key}:\n${result}\nХэш: ${hash}`;
    }
}

function decrypt(currentCipher) {
    const text = document.getElementById('message').value.trim();
    let result = '';
    if (currentCipher === 'caesar') {
        let key = document.getElementById('key').value.trim();
        result = caesarDecrypt(text, parseInt(key));
        document.getElementById('result').innerText = `Расшифрованное сообщение c ключём ${key}:\n${result}`;
    } else if (currentCipher === 'vizener') {
        let key = document.getElementById('key').value.trim();
        result = vizenerDecrypt(text, key);
        document.getElementById('result').innerText = `Расшифрованное сообщение:\n${result}`;
    } else if (currentCipher === 'gost') {
        let key = document.getElementById('key').textContent.trim();
        result = gostDecrypt(text, key) 
        document.getElementById('result').innerText = `Расшифрованное сообщение c ключём ${key}:\n${result}`;
    }
}

function hack(currentCipher) {
    const text = document.getElementById('message').value.trim();
    let result = '';

    if (currentCipher === 'caesar') {
        result = caesarHack(text)
            .map(item => `Ключ ${item.key}: ${item.text} (бан-слоги ${item.banSyllableCount})`)
            .join('\n');
    } else if (currentCipher === 'vizener') {
        result = vizenerHack(text)
        document.getElementById('result').innerText = `Расшифровка:\n${result}`;
    }
}


