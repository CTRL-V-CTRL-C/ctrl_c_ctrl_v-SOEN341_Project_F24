import argon2 from 'argon2';

/**
 * generates a password hash using Argon2id
 * @param {string} password the password
 */
async function generatePasswordHash(password) {
    const argon2Options = {
        memoryCost: 19 * 2 ** 10, // 19MiB
        hashLength: 32,
        timeCost: 2,
        parallelism: 1,
        type: argon2.argon2id,
        saltLength: 16,
    }
    return await argon2.hash(password, argon2Options);
}

export { generatePasswordHash }