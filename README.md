# Blockchain_Based_Credential_Issuance_Project

sui move build
sui client publish

node address packet and address admin
packet
0xc909a1ecb0cd27760f1f268150a063753f00f915320d96f06976cac2b4801e54
address admin
0x55e89e695f4041548f523cff1c2340709a571c2dcd94b202e3787e23753b31c2

sui client call \
 --package <PACKAGE_ID> \
 --module <MODULE_NAME> \
 --function create_admin \
 --args <ADMIN_MANAGER_ID> <NEW_ADMIN_ADDRESS> <CLOCK_OBJECT_ID> \
 --gas-budget 100000000

sui client call \
 --package 0xc909a1ecb0cd27760f1f268150a063753f00f915320d96f06976cac2b4801e54 \
 --module SchoolManager \
 --function create_admin \
 --args 0x55e89e695f4041548f523cff1c2340709a571c2dcd94b202e3787e23753b31c2 0x7f336f529db9d040e6f74c89671c25eec920fb39c9b50dbc71a5e35bc63d489d 0x6 \
 --gas-budget 100000000
