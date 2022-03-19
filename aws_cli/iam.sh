
# TODO before using this script.
# 1. update the TWO JSON files and change YOUR_ACCOUNT_ID with your actual account id
# 2. update ONE JSOn file and change YOUR_KMS_MASTER_KEY_ID with the actual KMS master key ID

## create a role
aws iam create-role \      
 --role-name mongodb-client-side-encryption \
 --assume-role-policy-document file://role-trust-policy.json

# Assuming you have priviledges to create a role, the output of this line is something like :
# Take note of Arn, you will need it in 00_sharedconst.js
# {
#     "Role": {
#         "Path": "/",
#         "RoleName": "mongodb-client-side-encryption",
#         "RoleId": "AROxxxxxxxxxOQER",
#         "Arn": "arn:aws:iam::0123456789:role/mongodb-client-side-encryption",
#         "CreateDate": "2022-03-19T12:32:43+00:00",
#         "AssumeRolePolicyDocument": {
#             "Version": "2012-10-17",
#             "Statement": [
#                 {
#                     "Effect": "Allow",
#                     "Principal": {
#                         "AWS": "arn:aws:iam::0123456789:root"
#                     },
#                     "Action": "sts:AssumeRole"
#                 }
#             ]
#         }
#     }
# }

# Actually attach permissions to the role
 aws iam put-role-policy \                                                
  --role-name mongodb-client-side-encryption \
  --policy-name mongodb-kms-role-policy \
  --policy-document file://atlas-kms-role-policy.json



