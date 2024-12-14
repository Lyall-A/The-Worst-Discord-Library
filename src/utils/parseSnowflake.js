const discordEpoch = 1420070400000;

function parseSnowflake(snowflakeString) {
    const snowflakeBigInt = BigInt(snowflakeString);
    const snowflakeBits = snowflakeBigInt.toString(2).padStart(64, "0");

    const timestampBits = snowflakeBits.slice(0, 42);
    const timestamp = parseInt(timestampBits, 2) + discordEpoch;

    const internalWorkerIdBits = snowflakeBits.slice(42, 47);
    const internalWorkerId = parseInt(internalWorkerIdBits, 2);

    const internalProcessIdBits = snowflakeBits.slice(47, 52);
    const internalProcessId = parseInt(internalProcessIdBits, 2);

    const incrementBits = snowflakeBits.slice(52, 64);
    const increment = parseInt(incrementBits, 2);

    return {
        snowflakeString,
        snowflakeBigInt,
        snowflakeBits,
        timestampBits,
        timestamp,
        internalWorkerIdBits,
        internalWorkerId,
        internalProcessIdBits,
        internalProcessId,
        incrementBits,
        increment
    }
}

module.exports = parseSnowflake;