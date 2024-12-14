const encryptOpus = require("./encryptOpus");

function createVoicePacket(opusData, mode, secretKey, nonce = 0, sequence = 0, timestamp = 0, ssrc) {
    const rtpHeader = Buffer.alloc(12);
    rtpHeader[0] = 0x80;
    rtpHeader[1] = 0x78;
    rtpHeader.writeUInt16BE(sequence, 2);
    rtpHeader.writeUInt32BE(timestamp, 4);
    rtpHeader.writeUInt32BE(ssrc, 8);
    
    const encryptedOpusData = encryptOpus(opusData, mode, rtpHeader, secretKey, nonce);

    return Buffer.concat([
        rtpHeader,
        encryptedOpusData
    ]);
}

module.exports = createVoicePacket;