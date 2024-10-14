
/**
 * Generic fetch function to fetch from any given
 * url and return a json object with the contained data
 * 
 * @param {String} url 
 * @returns {JSON} data
 */
async function fetchData(route) {
    const url = new URL(route, location.origin);
    const response = await fetch(url);
    return response;
}

async function postData(route, body) {
    return await sendData(route, body, "POST");
}

async function putData(route, body) {
    return await sendData(route, body, "PUT");
}

/**
 * Generic post function to post/put given data using
 * the given method (post/put)
 * @param {String} url 
 * @param {Object} body 
 * @param {String} method 
 * @returns {Object}
 */
async function sendData(route, body, method) {
    const url = new URL(route, location.origin);
    const response = await fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
    });
    return response;
}

export { fetchData, postData, putData };
