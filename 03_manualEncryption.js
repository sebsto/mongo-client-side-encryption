#!/usr/local/bin/node

const { MongoClient } = require('mongodb');
const { ClientEncryption } = require("mongodb-client-encryption");
const { connectionString, keyVaultNamespace, getKMSProviders, altKeyName, keyVaultDb } = require('./00_sharedconst.js');

async function insertPersonManual(collection, name, credit_card) {

    console.log('----------------------------------------------')
    console.log('     Test : Insert w/ manual encryption       ')
    console.log('----------------------------------------------')
    
    console.log('Getting AWS  credentials ')
    const kmsProvider = await getKMSProviders()
    
    console.log('Connecting to database')
    const csfleDatabaseConnection = new MongoClient(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        monitorCommands: true,
        autoEncryption: {
            keyVaultNamespace: keyVaultNamespace,
            kmsProviders: kmsProvider,
            bypassAutoEncryption: true,
        }
    });
    await csfleDatabaseConnection.connect()

    console.log('Creating encryption client')
    const encryption = new ClientEncryption(csfleDatabaseConnection, {
        keyVaultNamespace: keyVaultNamespace,
        kmsProviders: kmsProvider,
    });

    console.log('Encrypting credit card')
    const encryptedCreditCard = await encryption.encrypt(
        credit_card,
        {
            keyAltName: altKeyName,
            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
        }
    )
    console.log(encryptedCreditCard)

    const person = {
        name: name,
        credit_card: encryptedCreditCard
    }
    console.log('Inserting data', person)
    const result = await csfleDatabaseConnection.db(keyVaultDb).collection(collection).insertOne(person)
    console.log(result)

    console.log('Closing database connection')
    await csfleDatabaseConnection.close()
}

async function readPersonByNameManuel(collection, name) {

    console.log('---------------------------------------------')
    console.log('    Test : reading data w/ CSFLE client      ')
    console.log('---------------------------------------------')
    
    console.log('Getting AWS  credentials ')
    const kmsProvider = await getKMSProviders()

    console.log('Connecting to csfle database')
    const csfleDatabaseConnection = new MongoClient(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        monitorCommands: true,
        autoEncryption: {
            keyVaultNamespace: keyVaultNamespace,
            kmsProviders: kmsProvider,
            bypassAutoEncryption: true,
        }
    });
    await csfleDatabaseConnection.connect()

    console.log('Creating encryption client')
    const encryption = new ClientEncryption(csfleDatabaseConnection, {
        keyVaultNamespace: keyVaultNamespace,
        kmsProviders: kmsProvider,
    });

    const person = { name: name }
    console.log('Searching by person name', person)
    const result = await csfleDatabaseConnection.db(keyVaultDb).collection(collection).findOne(person)
    console.log(result)

    console.log('Closing csfle database connection')
    await csfleDatabaseConnection.close()

    console.log('-----------------------------------------------')
    console.log('    Test : reading data w/ regular client      ')
    console.log('-----------------------------------------------')

    console.log('Connecting to database')
    const dbConnection = new MongoClient(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        monitorCommands: true,
    });
    await dbConnection.connect()

    console.log('Searching by person name', person)
    const encryptedResult = await dbConnection.db(keyVaultDb).collection(collection).findOne(person)
    console.log(encryptedResult)

    console.log('Closing database connection')
    await dbConnection.close()    
}

async function readPersonByCreditCardManuel(collection, creditCard) {

    console.log('--------------------------------------------')
    console.log('     Test : Search by encrypted field       ')
    console.log('--------------------------------------------')

    const kmsProvider = await getKMSProviders()

    console.log('Connecting to database')
    const csfleDatabaseConnection = new MongoClient(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        monitorCommands: true,
        autoEncryption: {
            keyVaultNamespace: keyVaultNamespace,
            kmsProviders: kmsProvider,
            bypassAutoEncryption: true,
        }
    });
    await csfleDatabaseConnection.connect()

    console.log('Creating encryption client')
    const encryption = new ClientEncryption(csfleDatabaseConnection, {
        keyVaultNamespace: keyVaultNamespace,
        kmsProviders: kmsProvider,
    });

    console.log('Encrypting credit card')
    const encryptedCreditCard = await encryption.encrypt(
        creditCard,
        {
            keyAltName: altKeyName,
            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
        }
    )
    console.log(encryptedCreditCard)

    const person = {
        credit_card: encryptedCreditCard
    }
    console.log('Searching by credit card', person)
    const result = await csfleDatabaseConnection.db(keyVaultDb).collection(collection).findOne(person)
    console.log(result)

    console.log('Closing database connection')
    await csfleDatabaseConnection.close()

}

async function test() {

    const collectionName = 'person'
    const personName = 'Seb'
    const personCreditCard = '1234-5678-8765-4321'
    await insertPersonManual(collectionName, personName, personCreditCard);
    await readPersonByNameManuel(collectionName, personName);
    await readPersonByCreditCardManuel(collectionName, personCreditCard);
}

test()


