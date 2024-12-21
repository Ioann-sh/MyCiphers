function hashing(data, key) {
    // превращаем ключ в байты
    const keyBytes = new TextEncoder().encode(key);
    const subkeys = [];
    // Разделяем ключ на 8 частей
    for (let i = 0; i < 8; i++) {
        subkeys[i] = new DataView(keyBytes.buffer).getUint32(4 * i, true);
    }

    // преобразуем данные и добавляем паддинг
    let dataBytes = new TextEncoder().encode(data);
    const blockSize = 8;
    const paddingLength = blockSize - (dataBytes.length % blockSize);
    dataBytes = new Uint8Array([...dataBytes, ...new Array(paddingLength).fill(paddingLength)]);

    let Hi = new Uint8Array(8); // Инициализируем для хэша
    for (let i = 0; i < dataBytes.length; i += 8) {
        const Mi = dataBytes.slice(i, i + 8);

        const view = new DataView(Mi.buffer);
        //части блока
        let N1 = view.getUint32(0, true); // лево
        let N2 = view.getUint32(4, true); // Право

        // 32 раунда шифрования
        for (let j = 0; j < 32; j++) {
            // индекс подключа
            const keyIndex = j < 24 ? j % 8 : 7 - (j % 8);
            // + подключ
            let s = (N1 + subkeys[keyIndex]) >>> 0;
            // S-блоки применяются
            s = Array.from({ length: 8 }, (_, k) => {
                const substitutionBox = Array(8).fill().map(() =>
                    Array(16).fill().map((_, m) => m)
                );
                return substitutionBox[k][(s >> (4 * k)) & 0x0f] << (4 * k);
            }).reduce((acc, curr) => acc | curr, 0);
            // циклический сдвиг влево на 11 бит
            s = (s << 11) | (s >>> 21);
            // xor
            s ^= N2;
            // меняем местами значения, кроме последнего раунда
            [N1, N2] = j < 31 ? [s, N1] : [N1, s];
        }
        //выходной блок
        const output = new ArrayBuffer(8);
        const outputView = new DataView(output);
        outputView.setUint32(0, N1, true);
        outputView.setUint32(4, N2, true);
        let E_Hi = new Uint8Array(output);
        for (let j = 0; j < 8; j++) {
            Hi[j] ^= E_Hi[j] ^ Mi[j];
        }
    }

    // возвращаем результат в виде строки хэша
    return Array.from(Hi).map(function (b) {
        return b.toString(16).padStart(2, '0');
    }).join('');
}