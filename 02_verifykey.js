const mongodb = require("mongodb")
const { MongoClient, Binary } = mongodb
const { connectionString, keyVaultDb, keyVaultCollection, altKeyName } = require('./00_sharedconst.js');

const base64KeyId = 'O6Q+7IXxTBK8x8D9H+/ilA=='; // use the base64 data key id returned by createKey() in the prior step

async function main() {
  const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    console.log("connecting to database");
    await client.connect();

    const keyDB = client.db(keyVaultDb);
    const keyColl = keyDB.collection(keyVaultCollection);

    console.log("Searching key from KeyID ", base64KeyId);
    const query = {
      _id: new Binary(Buffer.from(base64KeyId, "base64"), 4),
    };
    const dataKey = await keyColl.findOne(query);
    console.log(dataKey);

    console.log("Searching key from KeyAltNames ", altKeyName);
    const query2 = {
      keyAltNames: altKeyName,
    };
    const dataKey2 = await keyColl.findOne(query2);
    console.log(dataKey2);

  } finally {
    await client.close();
  }
}
main();