import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { checkAdmin } from "./check/CheckAdmin";
import School from "./Pages/School";

function App() {
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
  console.log(role);

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
        <Box>
          <Heading>Hello {role}</Heading>
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
          <School />
        </Container>
      </Container>
    </>
  );
}

export default App;
