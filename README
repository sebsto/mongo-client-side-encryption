This is a sample application demonstrating MongoDB Client-Side Field Level Encryption with AWS KMS.
To get started, 

1. create an AWS KMS master key (see `aws_cli/kms.sh`)
2. create an AWS IAM role allowing this app to encrypt / decrypt data keys (see `aws_cli/iam.sh`)
3. rename `00_sharedconst.js.SECRETS` to `00_sharedconst.js`
4. update the 6 constants at the top of that file (see instructions in the file)
5. install Nodejs dependencies (`npm install`)

## Create a data key 

```sh
node 01_createkey.js
```

## Verify data keys 

Update the `02_verifykey.js` with the Base64 key id provided by the previous step 

```sh
node 02_verifykey.js
```

## Manuel field-level encryption with the data key 

Encryption is explicit in the code. CSFLE-enabled MongoDB clients automatically decrypt the data.

```sh
node 03_manualEncryption.js
```

## Automatic field-level encryption with the data key

Update the `04_automaticEncryption.js` with the Base64 key id provided by the key creation step 

Encryption and decyption are automatically performed by CSFLE-enabled MongoDB clients.

The driver relies on a data schema to describe what fields have to be encrypted and with which key (see `99_schemaHelper.js`)

The application relies on `mongocryptd` daemon to be started on the same machine as the application. Please follow [the MongoDB `mongocryptd` documentation for download and installation instructions](https://docs.mongodb.com/manual/reference/security-client-side-encryption-appendix/).

```sh
 /usr/bin/mongocryptd --fork --logpath /home/ec2-user/mongocryptd.log  --pidfilepath /home/ec2-user/mongocryptd.pid
```
```sh
node 04_automaticEncryption.js
```

## Errors or Feedback ?

Please [raise an issue](https://github.com/sebsto/momgo-client-side-encryption/issues).