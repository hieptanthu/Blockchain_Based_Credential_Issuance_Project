import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { checkAdmin } from "../../check/CheckAdmin";
import { Outlet } from "react-router-dom";
import { path } from "../../routers";
import { Link } from "react-router-dom";
import starImage from "../../assets/image/download.png";
function Layout() {
  const account = useCurrentAccount();
  const [role, setRole] = useState("");
  const { data } = useSuiClientQuery("getObject", {
    id: import.meta.env.VITE_ADDRESS_ADMIN,
    options: {
      showContent: true,
    },
  }) as any;

  if (!data) {
    return;
  }

  if (data && account && role === "") {
    const superAdmin = data.data?.content?.fields?.super_admin;
    const admins = data.data?.content?.fields?.admins?.fields?.contents;
    setRole(checkAdmin(account?.address, superAdmin, admins));
  }

  return (
    <>
      <div
        className={
          "fixed top-0 left-0 w-screen h-screen  bg-cover bg-repeat animate-starMove z-[-1]"
        }
        style={{
          backgroundImage: `url(${starImage})`,
        }}
      ></div>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box className="flex items-center">
          <Link to="/">
            <Heading>UTEHY {role}</Heading>
          </Link>
        </Box>
        {role === "Admin" && (
          <Box className="flex items-center h-auto m-auto content-center">
            <Link to={path.SchoolManager}>School Manager</Link>
          </Box>
        )}

        {account != null && (
          <Box className="flex items-center h-auto m-auto content-center">
            <Link
              to={`${path.ListMySchool.replace(":_id", account?.address || "")}`}
            >
              My School Manager
            </Link>
          </Box>
        )}

        <Box>
          <ConnectButton />
        </Box>
      </Flex>{" "}
      <Container className="h-auto">
        <Outlet />
      </Container>
    </>
  );
}

export default Layout;
