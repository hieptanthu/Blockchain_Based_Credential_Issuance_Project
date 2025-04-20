export const checkAdmin = (
  address: string,
  addressSuperAdmin: string,
  listAddressAdmin: string[],
): string => {
  if (address === addressSuperAdmin) {
    return "Super Admin";
  } else if (listAddressAdmin.includes(address)) {
    return "Admin";
  } else {
    return "User";
  }
};
