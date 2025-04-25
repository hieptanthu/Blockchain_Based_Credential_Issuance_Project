import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { checkAdmin } from "../../check/CheckAdmin";
import { Outlet } from "react-router-dom";
import { path } from "../../routers";
import { Link } from "react-router-dom";
function Layout() {
  const account = useCurrentAccount();
  const [role, setRole] = useState("");

  // const { data } = useSuiClientQuery("getObject", {
  //   id: import.meta.env.VITE_ADDRESS_ADMIN,
  //   options: {
  //     showContent: true,
  //   },
  // }) as any;

  // if (!data) {
  //   return;
  // }

  // if (data && account && role === "") {
  //   const superAdmin = data.data?.content?.fields?.super_admin;
  //   const admins = data.data?.content?.fields?.admins?.fields?.contents;
  //   setRole(checkAdmin(account?.address, superAdmin, admins));
  // }

  return (
    <>
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
          <Heading>Hello {role}</Heading>
        </Box>
        {role === "Admin" && (
          <Box className="flex items-center h-auto m-auto content-center">
            <Link to={path.SchoolManager}>School Manager</Link>
          </Box>
        )}

        <Box className="flex items-center h-auto m-auto content-center">
          <Link
            to={`${path.ListMySchool.replace(":_id", account?.address || "")}`}
          >
            My School Manager
          </Link>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>{" "}
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <Outlet />
        </Container>
      </Container>
    </>
  );
}

export default Layout;
