function randomLetters(maxLength) {
    const r = (Math.random() + 1).toString(36).substring(2)
    if (maxLength) {
        return r.substring(r.length - maxLength)
    }
    return r
}


function randomNumber(length) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
}

/**
 * generates a random school id that hasn't been generated yet by this test run
 * @param {"INST" | "STUD"} instructorOrStudent 
 */
function generateSchoolID(instructorOrStudent) {
    return instructorOrStudent + uniqueRandomNumber(4)
}

function generateEmail() {
    return `some.email.${uniqueRandomNumber(5)}@gmail.com`
}

/**
 * @type {Map<number, Set<number>>}
 * a map of already used random numbers that are categorized by length
 */
const alreadyUsedRandoms = new Map();

/**
 * creates a random number that hasn't been created by this function
 * @param {number} length the length of the random number
 * @returns a random number that hasn't been used by this function
 */
function uniqueRandomNumber(length) {
    let generated = randomNumber(length);
    if (alreadyUsedRandoms.has(length)) {
        const set = alreadyUsedRandoms.get(length);
        while (set.has(generated)) {
            generated = randomNumber(length);
        }
        set.add(generated);
    } else {
        alreadyUsedRandoms.set(length, new Set([generated]));
    }
    return generated;
}

export { randomLetters, randomNumber, uniqueRandomNumber, generateSchoolID, generateEmail }