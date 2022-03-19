const { ClientEncryption } = require('mongodb-client-encryption');
const { MongoClient } = require('mongodb');
const base64 = require('uuid-base64');

const { connectionString, keyVaultNamespace, getKMSProviders, kmsKeyARn, altKeyName } = require('./00_sharedconst.js');

//https://docs.mongodb.com/drivers/security/client-side-field-level-encryption-local-key-to-kms/
async function main() {
  const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {

    console.log("Connecting to database");
    await client.connect();

    const kmsProvider = await getKMSProviders()

    console.log("Creating key");
    const encryption = new ClientEncryption(client, {
      keyVaultNamespace: keyVaultNamespace,
      kmsProviders: kmsProvider,
    });

    const key = await encryption.createDataKey("aws", {
      masterKey: {
        key: kmsKeyARn,
        region: kmsKeyARn.split(':')[3]
      },
      keyAltNames: [altKeyName]
    });

    const base64DataKeyId = key.toString("base64");
    const uuidDataKeyId = base64.decode(base64DataKeyId);
    console.log('DataKeyId [UUID]: ', uuidDataKeyId);
    console.log('DataKeyId [base64]: ', base64DataKeyId);

  } finally {
    await client.close();
  }
}
main();