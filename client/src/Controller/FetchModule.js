
/**
 * Generic fetch function to fetch from any given
 * url and return a json object with the contained data
 * 
 * @param {String} url 
 * @returns {JSON} data
 */
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            throw Error("Something Went wrong fetching data");
        }
    } catch {
        return undefined;
    }
}

/**
 * Generic post function to post/put given data using
 * the given method (post/put)
 * @param {String} url 
 * @param {Object} body 
 * @param {String} method 
 * @returns {Object}
 */
async function postData(route, body, method) {
    const url = new URL(route, location.origin);
    try {
        const response = await fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw Error("Something Went wrong posting data: ");
        }
    } catch {
        return undefined;
    }
}

export { fetchData, postData };
