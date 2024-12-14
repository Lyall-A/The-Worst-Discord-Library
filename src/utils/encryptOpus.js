const imports = require("../imports");

function encryptOpus(opusData, mode, rtpHeader, secretKey, nonce = 0) {
    if (mode === "aead_aes256_gcm_rtpsize") {
        const nonceBuffer = Buffer.alloc(12);
        nonceBuffer.writeUInt32BE(nonce);

        const noncePadding = nonceBuffer.subarray(0, 4);

        const cipher = imports.crypto.createCipheriv("aes-256-gcm", secretKey, nonceBuffer);
        cipher.setAAD(rtpHeader);

        const encrypted = Buffer.concat([
            cipher.update(opusData),
            cipher.final(),
            cipher.getAuthTag()
        ]);
    
        return Buffer.concat([encrypted, noncePadding]);
    } else
    if (mode === "aead_xchacha20_poly1305_rtpsize") {
        throw new Error(`${mode} not implemented yet`);
    } else throw new Error(`Unsupported encryption mode ${mode}`);
}

module.exports = encryptOpus;