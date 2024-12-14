const constants = require("../constants");
const imports = require("../imports");
const EventHandler = require("./EventHandler");

function createOpus(input = "-", extraArgs = [], ffmpegPath = constants.defaultFFmpegPath) {
    const eventHandler = { };
    new EventHandler(eventHandler);

    const ffmpegProcess = imports.child_process.spawn(ffmpegPath, [
        "-i", input,
        "-c:a", "libopus",
        "-f", "opus",
        "-ar", "48000",
        "-ac", "2",
        ...(extraArgs ?? []),
        "-"
    ]);

    ffmpegProcess.stdout.on("data", data => {
        eventHandler.call("data", data);

        // https://en.wikipedia.org/wiki/Ogg

        const pageSegments = data.readUInt8(26);
        const segmentTable = data.subarray(27, 27 + pageSegments);

        let segmentOffset = 27 + pageSegments;
        let segmentSize = 0;
        for (const segmentLength of segmentTable) {
            segmentSize += segmentLength;
            if (segmentLength >= 255) continue;
            const segment = data.subarray(segmentOffset, segmentOffset + segmentSize);
            segmentOffset += segmentSize;
            segmentSize = 0;
            eventHandler.call("segment", segment);
        }
    });

    ffmpegProcess.on("close", (code, signal) => eventHandler.call("close", code, signal));

    return {
        ffmpegProcess,
        stdin: ffmpegProcess.stdin,
        stdout: ffmpegProcess.stdout,
        stderr: ffmpegProcess.stderr,
        kill: (signal = "SIGKILL") => ffmpegProcess.kill(signal),
        ...eventHandler
    };
}

module.exports = createOpus;