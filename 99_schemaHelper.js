const { Binary, UUID } = require("mongodb");

function JSONSchemaCreator(keyId) {
    return {
        "demo.person": {
            bsonType: 'object',
            encryptMetadata: {
                keyId: [new Binary(Buffer.from(keyId, "base64"), 4)],
            },
            properties: {
                credit_card: {
                    encrypt: {
                        bsonType: 'string',
                        algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random'
                    }
                }
            }
        }
    }
}

module.exports = { JSONSchemaCreator }