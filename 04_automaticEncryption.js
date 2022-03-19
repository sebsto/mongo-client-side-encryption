const { JSONSchemaCreator } = require('./99_schemaHelper')
const { MongoClient } = require('mongodb');
const { ClientEncryption } = require("mongodb-client-encryption");
const { connectionString, keyVaultNamespace, keyVaultDb, getKMSProviders } = require('./00_sharedconst.js');

const personSchema = JSONSchemaCreator('O6Q+7IXxTBK8x8D9H+/ilA=='); // replace the "paste_your_key_id_here" with your data key id

console.log('Schema')
console.log(personSchema)

// I am using a SSH tunnel to an EC2 instance where the daemon runs
// const extraOptions = {
//     mongocryptdSpawnPath: '/usr/local/bin/mongocryptd', // not necessary as it is running on the EC2 instance
//     mongocryptdBypassSpawn: false
// }

// const regularClient = new MongoClient(connectionString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// await regularClient.connect();


async function insertPersonAutomatic(collection, name, credit_card) {

    console.log('----------------------------------------------')
    console.log('   Test : Insert w/ automatic encryption      ')
    console.log('----------------------------------------------')
    
    console.log('Getting AWS  credentials ')
    const kmsProvider = await getKMSProviders()
    
    console.log('Connecting to database')
    const secureClient = new MongoClient(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        monitorCommands: true,
        autoEncryption: {
            keyVaultNamespace: keyVaultNamespace,
            kmsProviders: kmsProvider,
            schemaMap: personSchema,
            //bypassAutoEncryption: false,
            //options: { logger: (level, message) => { console.log(level, message)} },
        }
    });
    await secureClient.connect();
    console.log('Connected.');

    try {
        console.log('Writing data with secure client')
        const writeResult = await secureClient.db(keyVaultDb).collection(collection).insertOne({
        // person: {
            name: name,
            credit_card: credit_card
        // }
        });
        console.log('Data written : ', writeResult)

        console.log('Querying data with secure client')
        const query = {
            _id: writeResult.insertedId,
        };
        const data = await secureClient.db('demo').collection(collection).findOne(query);
        console.log(data);

        // console.log('Deleting data')
        // const deleteResult = await regularClient.db('demo').collection(collection).deleteOne(query);
        // console.log(deleteResult);


    } catch (writeError) {
        console.error('writeError occurred:', writeError);
    } finally {
        await secureClient.close();
        // await regularClient.close();
        console.log("connection closed")
    }
}

async function main() {
    const collectionName = 'person'
    const personName = 'Seb'
    const personCreditCard = '1234-5678-8765-4321'

    await insertPersonAutomatic(collectionName, personName, personCreditCard)
}

main()


