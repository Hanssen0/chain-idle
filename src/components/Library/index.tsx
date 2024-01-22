import {
  Box,
  Button,
  Flex,
  Heading,
  HeadingProps,
  IconButton,
  IconButtonProps,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode, createContext, useContext, useMemo } from "react";
import { FaBook } from "react-icons/fa6";
import { usePopup } from "../Popup";
import { KNOWLEDGES, STORIES } from "@/utils";

const LibraryContext = createContext({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
});

const TITLE_STYLES: HeadingProps = {
  as: "h1",
  fontSize: "xl",
  overflow: "hidden",
  textOverflow: "ellipsis",
  py: 2,
  position: "relative",
  display: "inline",
  _groupHover: { _after: { width: "calc(100% + 1rem)" } },
  _after: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    bg: "chakra-border-color",
    height: "2px",
    width: 0,
    transition: "width 0.3s ease-in-out",
  },
};

export function LibraryProvider({ children }: { children: ReactNode }) {
  const disclosure = useDisclosure();
  const { setPopup } = usePopup();
  const stories = useMemo(
    () =>
      STORIES.map(({ type, header }) => (
        <Button
          onClick={() => setPopup(type)}
          key={type}
          height={12}
          bg="none"
          _hover={{ bg: "none" }}
          _active={{ bg: "none" }}
          data-group
        >
          <Heading {...TITLE_STYLES}>{header}</Heading>
        </Button>
      )),
    [setPopup]
  );
  const knowledges = useMemo(
    () =>
      KNOWLEDGES.map(({ type, header, link }) => (
        <Button
          as={Link}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          key={type}
          height={12}
          bg="none"
          _hover={{ bg: "none", textDecoration: "none" }}
          _active={{ bg: "none" }}
          data-group
        >
          <Heading {...TITLE_STYLES}>{header}</Heading>
        </Button>
      )),
    []
  );

  return (
    <LibraryContext.Provider value={disclosure}>
      <Modal {...disclosure} isCentered>
        <ModalOverlay />
        <ModalContent height="80%">
          <ModalHeader>Library</ModalHeader>
          <ModalCloseButton color="chakra-placeholder-color" />
          <ModalBody pt={0} overflowY="hidden">
            <Tabs height="100%" display="flex" flexDirection="column">
              <TabList display="flex">
                <Tab py={2} flexGrow={1}>
                  Stories
                </Tab>
                <Tab py={2} flexGrow={1}>
                  Knowledges
                </Tab>
              </TabList>
              <Box py={8} flexGrow={1} overflowY="hidden">
                <TabPanels
                  height="100%"
                  overflowY="auto"
                  sx={{
                    "&::-webkit-scrollbar": {
                      width: "8px",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      borderRadius: "4px",
                    },
                  }}
                  _dark={{
                    "&::-webkit-scrollbar": {
                      backgroundColor: "whiteAlpha.200",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "whiteAlpha.300",
                    },
                  }}
                  _light={{
                    "&::-webkit-scrollbar": {
                      backgroundColor: "blackAlpha.200",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "blackAlpha.300",
                    },
                  }}
                >
                  <TabPanel py={0}>
                    <Flex direction="column">{stories}</Flex>
                  </TabPanel>
                  <TabPanel py={0}>
                    <Flex direction="column">{knowledges}</Flex>
                  </TabPanel>
                </TabPanels>
              </Box>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
      {children}
    </LibraryContext.Provider>
  );
}

export function LibraryOpener(props: Omit<IconButtonProps, "aria-label">) {
  const { onOpen } = useContext(LibraryContext);

  return (
    <IconButton
      size="lg"
      fontSize="3xl"
      variant="ghost"
      color="current"
      onClick={onOpen}
      icon={<FaBook />}
      aria-label="Open library"
      {...props}
    />
  );
}
