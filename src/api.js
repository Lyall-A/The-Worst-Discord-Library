const constants = require("./constants");
const imports = require("./imports");

function api(path, options = { }) {
    let body;

    if (options.json) {
        body = JSON.stringify(options.body);
    } else if (options.multipart) {
        body = new FormData();
        for (const part of options.body) body.append(part.name, new Blob([part.data], { type: part.type }), part.filename);
    }

    const fetchOptions = {
        method: options.method ?? "GET",
        headers: {
            Authorization: `${options.tokenType ? `${options.tokenType} ` : (options.tokenType ?? "Bot ")}${options.token}`,
            "Content-Type": options.json ? "application/json" : undefined
        },
        body,
        ...(options.fetchOptions ?? { })
    };

    return imports.fetch(`${constants.apiBaseUrl}/v${constants.apiVersion}${path}`, fetchOptions).then(async res => {
        let parser = "json";
        if (options.parser) {
            if (options.parser === "json") parser = "json"; else
            if (options.parser === "text") parser = "text"; else
            if (options.parser === "arrayBuffer") parser = "arrayBuffer"; else
            parser = null;
        }
        
        const parsed = parser ? await res[parser]().catch(err => null) : null;

        return {
            parser,
            parsed,
            status: res.status,
            statusText: res.statusText,
            response: res
        }
    });
}

module.exports = api;