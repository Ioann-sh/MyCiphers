function gostEncrypt(data, key) {
    //  превращаем ключ в массив байтов
    const keyBytes = new TextEncoder().encode(key);
    const subkeys = [];
    // Разбиваем ключ на 8 кусочков по 4 байта
    for (let i = 0; i < 8; i++) {
        subkeys[i] = new DataView(keyBytes.buffer).getUint32(4 * i, true);
    }

    // превращаем данные в байты
    let dataBytes = new TextEncoder().encode(data);
    const blockSize = 8;
    const paddingLength = blockSize - (dataBytes.length % blockSize);
    // Добавляем паддинг(чтобы длина делилась на 8)
    dataBytes = new Uint8Array([...dataBytes, ...new Array(paddingLength).fill(paddingLength)]);

    const result = new Uint8Array(dataBytes.length);
    // Обрабатываем эти данные по кусочкам (блокам) по 8 байт
    for (let i = 0; i < dataBytes.length / 8; i++) {
        const block = dataBytes.slice(i * 8, (i + 1) * 8);

        const view = new DataView(block.buffer);
        let N1 = view.getUint32(0, true); // Левая половина блока
        let N2 = view.getUint32(4, true); // Правая половина

        // 32 раунда шифрования
        for (let j = 0; j < 32; j++) {
            // вычисляем индекс подключа
            const keyIndex = j < 24 ? j % 8 : 7 - (j % 8);
            let s = (N1 + subkeys[keyIndex]) >>> 0; // Суммируем с подключом

            // применение S-блоков
            s = Array.from({ length: 8 }, (_, k) => {
                const substitutionBox = Array(8).fill().map(() =>
                    Array(16).fill().map((_, m) => m)
                );
                return substitutionBox[k][(s >> (4 * k)) & 0x0f] << (4 * k);
            }).reduce((acc, curr) => acc | curr, 0);

            // сдвиг влево на 11 бит
            s = (s << 11) | (s >>> 21);
            // XOR с правой половиной блока
            s ^= N2;
            // меняем местами, если это не последний раунд
            [N1, N2] = j < 31 ? [s, N1] : [N1, s];
        }

        // Создаем выходной блок, потому что 32 раунда недостаточно
        const output = new ArrayBuffer(8);
        const outputView = new DataView(output);
        outputView.setUint32(0, N1, true);
        outputView.setUint32(4, N2, true);
        result.set(new Uint8Array(output), i * 8);
    }

    //возвращаем это в виде Base64, чтобы никому не понял что там
    return btoa(String.fromCharCode.apply(null, result));
}

function gostDecrypt(encodedData, key) {
    // превращаем ключ в байты
    const keyBytes = new TextEncoder().encode(key);
    const subkeys = [];
    // на 8 частей
    for (let i = 0; i < 8; i++) {
        subkeys[i] = new DataView(keyBytes.buffer).getUint32(4 * i, true);
    }

    // Расшифровываем Base64 в байты
    const dataBytes = new Uint8Array(atob(encodedData).split('').map((char) => char.charCodeAt(0)));
    const result = new Uint8Array(dataBytes.length);

    //обрабатываем блоки по 8 байт
    for (let i = 0; i < dataBytes.length; i += 8) {
        const block = dataBytes.slice(i, i + 8);

        const view = new DataView(block.buffer);
        let N1 = view.getUint32(0, true); // Левая часть
        let N2 = view.getUint32(4, true); // Правая часть

        for (let j = 0; j < 32; j++) {
            // индекс подключа делаем
            const keyIndex = (j < 8 ? j : 31 - j) % 8;
            // S-блоки плюс делаем
            let s = (N1 + subkeys[keyIndex]) >>> 0;

            // S-блоки делаем
            s = Array.from({ length: 8 }, (_, k) => {
                const substitutionBox = Array(8).fill().map(() =>
                    Array(16).fill().map((_, m) => m)
                );
                return substitutionBox[k][(s >> (4 * k)) & 0x0f] << (4 * k);
            }).reduce((acc, curr) => acc | curr, 0);

            // Сдвиг влево делаем
            s = (s << 11) | (s >>> 21);
            // xor с правой частью делаем
            s ^= N2;
            // менять местами, если не последний делаем
            [N1, N2] = j < 31 ? [s, N1] : [N1, s];
        }

        // выходной блок делаем
        const output = new ArrayBuffer(8);
        const outputView = new DataView(output);
        outputView.setUint32(0, N1, true);
        outputView.setUint32(4, N2, true);
        result.set(new Uint8Array(output), i);
    }

    // убрать паддинг делаем 
    const paddingLength = result.at(-1);
    // возвращать декодированный результат делаем
    return new TextDecoder().decode(result.slice(0, -paddingLength));
}