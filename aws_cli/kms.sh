REGION=eu-west-3
aws kms --region $REGION create-key

# Assuming you have priviledges to create a key, the output of this line is something like :
# Take note of Arn, you will need it in 00_sharedconst.js

# {
#     "KeyMetadata": {
#         "AWSAccountId": "0123456789",
#         "KeyId": "5a246bd8-xxxxx-0000-0000-5bdf17551bd1",
#         "Arn": "arn:aws:kms:eu-west-3:0123456789:key/5a246bd8-xxxxx-0000-0000-5bdf17551bd1",
#         "CreationDate": "2022-03-19T13:28:40.364000+01:00",
#         "Enabled": true,
#         "Description": "",
#         "KeyUsage": "ENCRYPT_DECRYPT",
#         "KeyState": "Enabled",
#         "Origin": "AWS_KMS",
#         "KeyManager": "CUSTOMER",
#         "CustomerMasterKeySpec": "SYMMETRIC_DEFAULT",
#         "KeySpec": "SYMMETRIC_DEFAULT",
#         "EncryptionAlgorithms": [
#             "SYMMETRIC_DEFAULT"
#         ],
#         "MultiRegion": false
#     }
# }