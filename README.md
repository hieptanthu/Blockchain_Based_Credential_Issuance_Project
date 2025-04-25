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
 --package 0x5a0cce620a35810ceece5029ab5b0af7d1699d27cb7767f0a6556ce340f3b866 \
 --module SchoolManager \
 --function create_admin \
 --args 0xb382e4f8b79d3bd8ed31aa765197f21bf7cf677484d9c11340ef4cec50527b00 0x7f336f529db9d040e6f74c89671c25eec920fb39c9b50dbc71a5e35bc63d489d 0x6 \
 --gas-budget 100000000
