
/**
 * Generic fetch function to fetch from any given
 * url and return a json object with the contained data
 * 
 * @param {String} url 
 */
async function fetchData(route) {
    const url = new URL(route, location.origin);
    const response = await fetch(url);
    return response;
}

/**
 * sends a post request to the server
 * @param {string} route the route for which to post to the server
 * @param {Object} body the body of the message to send
 */
async function postData(route, body) {
    return await sendJSONData(route, body, "POST");
}

async function putData(route, body) {
    return await sendJSONData(route, body, "PUT");
}

/**
 * Generic post function to post/put given data using
 * the given method (post/put)
 * @param {String} url 
 * @param {Object} body 
 * @param {string} method 
 */
async function sendJSONData(route, body, method) {
    const config = {
        method: method,
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
    }
    return await sendData(route, JSON.stringify(body), config);
}

/**
 * posts a file to the server in the specified route
 * @param {string} route the route within the server to post to
 * @param {File} file the file to post
 */
async function postFile(route, file) {
    const form = new FormData();
    form.append("document", file);
    return await sendData(route, form, { method: "POST", "Content-Type": "multipart/form-data" });
}

/**
 * sends an http request to the server
 * @param {string} route the route within the url to use
 * @param {Object} body the body of the message
 * @param {Object?} config the config params of fetch, if any
 */
async function sendData(route, body, config) {
    const url = new URL(route, location.origin);
    const response = await fetch(url, {
        body: body,
        ...config,
    });
    return response;
}

export { fetchData, postData, putData, postFile };
