# Blockchain_Based_Credential_Issuance_Project

sui move build
sui client publish

node address packet and address admin
0x955cb620f5aa605501e02b0f1a5fcad9d42e8c3be44db7c235f39f5c8c3d4742

sui client call \
 --package <PACKAGE_ID> \
 --module <MODULE_NAME> \
 --function create_admin \
 --args <ADMIN_MANAGER_ID> <NEW_ADMIN_ADDRESS> <CLOCK_OBJECT_ID> \
 --gas-budget 100000000

sui client call \
 --package 0xc8af585b37853e5131658729fafe52e43cc48a1006a6fc62e2e10723b2897a17 \
 --module SchoolManager \
 --function create_admin \
 --args 0x2ceeaaa5ae7e4adc215a265b92badea58db649b9d808cfc3ac37e80759934295 0x7f336f529db9d040e6f74c89671c25eec920fb39c9b50dbc71a5e35bc63d489d 0x6 \
 --gas-budget 100000000
