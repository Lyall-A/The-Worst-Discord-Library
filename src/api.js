const constants = require("./constants");
const imports = require("./imports");

function api(path, options = {}) {
    let body;
    if (options.json) {
        body = JSON.stringify(options.json);
    } else if (options.multipart) {
        body = new FormData();
        if (options.multipart?.json) body.append("payload_json", JSON.stringify(options.multipart?.json));
        if (options.multipart?.files) {
            for (const fileIndex in options.multipart.files) {
                const file = options.multipart.files[fileIndex];
                body.append(`files[${fileIndex}]`, new Blob([file.data], { type: file.type }), file.filename);
            }
        }
    }

    const fetchHeaders = {
        Authorization: `${options.tokenType ? `${options.tokenType} ` : (options.tokenType ?? "Bot ")}${options.token}`
    };
    if (options.json) fetchHeaders["Content-Type"] = "application/json";

    const fetchOptions = {
        method: options.method ?? "GET",
        headers: fetchHeaders,
        body,
        ...(options.fetchOptions ?? {})
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