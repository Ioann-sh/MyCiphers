const SubstitutionBox = Array(8).fill().map(function () {
    return Array(16).fill().map(function (_, i) {
        return i;
    });
});

function generateKeys(key) {
    const subkeys = [];
    for (let i = 0; i < 8; i++) {
        subkeys[i] = new DataView(key.buffer).getUint32(4 * i, true);
    }
    return subkeys;
}

function substitution(value) {
    return Array.from({ length: 8 }, function (_, i) {
        return SubstitutionBox[i][(value >> (4 * i)) & 0x0f] << (4 * i);
    }).reduce(function (acc, curr) {
        return acc | curr;
    }, 0);
}

function addPadding(data, blockSize) {
    blockSize = blockSize || 8;
    const paddingLength = blockSize - (data.length % blockSize);
    return new Uint8Array([...data, ...new Array(paddingLength).fill(paddingLength)]);
}

function removePadding(data) {
    const paddingLength = data.at(-1);
    return data.slice(0, -paddingLength);
}

function processBlock(block, keys, getKeyIndex) {
    const view = new DataView(block.buffer);
    let N1 = view.getUint32(0, true);
    let N2 = view.getUint32(4, true);
    for (let i = 0; i < 32; i++) {
        const keyIndex = getKeyIndex(i);
        let s = (N1 + keys[keyIndex]) >>> 0;
        s = substitution(s);
        s = (s << 11) | (s >>> 21);
        s ^= N2;

        [N1, N2] = i < 31 ? [s, N1] : [N1, s];
    }
    const output = new ArrayBuffer(8);
    const outputView = new DataView(output);
    outputView.setUint32(0, N1, true);
    outputView.setUint32(4, N2, true);

    return new Uint8Array(output);
}

function encodeBlock(block, keys) {
    return processBlock(block, keys, function (i) {
        return (i < 24 ? i % 8 : 7 - (i % 8));
    });
}

function decodeBlock(block, keys) {
    return processBlock(block, keys, function (i) {
        return (i < 8 ? i : 31 - i) % 8;
    });
}

function gostEncrypt(data, key) {
    const keyBytes = new TextEncoder().encode(key);
    const subkeys = generateKeys(keyBytes);
    let dataBytes = new TextEncoder().encode(data);

    dataBytes = addPadding(dataBytes);

    const result = new Uint8Array(dataBytes.length);
    for (let i = 0; i < Math.floor(dataBytes.length / 8); i++) {
        const block = dataBytes.slice(i * 8, (i + 1) * 8);
        const encodedBlock = encodeBlock(block, subkeys);
        result.set(encodedBlock, i * 8);
    }
    return btoa(String.fromCharCode.apply(null, result));
}

function gostDecrypt(encodedData, key) {
    const keyBytes = new TextEncoder().encode(key);
    const subkeys = generateKeys(keyBytes);

    const dataBytes = new Uint8Array(atob(encodedData).split('').map(function (char) {
        return char.charCodeAt(0);
    }));

    const result = new Uint8Array(dataBytes.length);
    for (let i = 0; i < dataBytes.length; i += 8) {
        const block = dataBytes.slice(i, i + 8);
        result.set(decodeBlock(block, subkeys), i);
    }

    return new TextDecoder().decode(removePadding(result));
}

function hashing(data, key) {
    const keyBytes = new TextEncoder().encode(key);
    const subkeys = generateKeys(keyBytes);
    let dataBytes = new TextEncoder().encode(data);
    dataBytes = addPadding(dataBytes);
    let Hi = new Uint8Array(8);
    for (let i = 0; i < dataBytes.length; i += 8) {
        const Mi = dataBytes.slice(i, i + 8);
        const E_Hi = encodeBlock(Mi, subkeys);
        for (let j = 0; j < 8; j++) {
            Hi[j] ^= E_Hi[j] ^ Mi[j];
        }
    }
    return Array.from(Hi).map(function (b) {
        return b.toString(16).padStart(2, '0');
    }).join('');
}