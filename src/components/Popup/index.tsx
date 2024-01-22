import { STORIES } from "@/utils";
import {
  Box,
  Container,
  Divider,
  Fade,
  Heading,
  Portal,
  Text,
} from "@chakra-ui/react";
import {
  useEffect,
  useMemo,
  useState,
  createContext,
  ReactNode,
  useContext,
  useCallback,
} from "react";

function getContent(type: string) {
  return STORIES.find((c) => c.type === type);
}

const PopupContext = createContext<[string, (t: string) => void]>([
  "",
  () => {},
]);

export function PopupProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState("");

  return (
    <PopupContext.Provider value={[type, setType]}>
      {children}
    </PopupContext.Provider>
  );
}

export function PopupContent({
  beforeClose,
  onClose,
}: {
  beforeClose?: (type: string) => void;
  onClose?: (type: string) => void;
}) {
  const { popupType, setPopup } = usePopup();
  const [part, setPart] = useState(0);
  const content = useMemo(() => getContent(popupType), [popupType]);
  const { header, body } = content ?? { header: "", body: [] };
  const next = () => setPart((p) => p + 1);

  useEffect(() => setPart(0), [popupType]);

  useEffect(() => {
    if (part >= body.length) {
      beforeClose?.(popupType);
      return;
    }

    const timeout = setTimeout(next, 4000);

    return () => clearTimeout(timeout);
  }, [part, body, beforeClose, popupType]);

  const contentElements = useMemo(
    () =>
      body
        .slice(0, part)
        .map((c) => c.split("\n"))
        .flat()
        .map((c, i) =>
          c === "" ? (
            <Divider key={i} opacity={0} my={2} />
          ) : (
            <Fade key={i} in transition={{ enter: { duration: 1 } }}>
              <Text mt={2}>{c}</Text>
            </Fade>
          )
        ),
    [body, part]
  );

  if (!content) {
    return undefined;
  }

  return (
    <Portal>
      <Box
        zIndex={9999999}
        position="fixed"
        top={0}
        left={0}
        textAlign="center"
        onClick={next}
        cursor="pointer"
      >
        <Fade
          in={part <= content.body.length}
          transition={{ enter: { duration: 2 }, exit: { duration: 1 } }}
          onAnimationComplete={() => {
            if (part > body.length) {
              onClose?.(popupType);
              setPopup("");
            }
          }}
        >
          <Box
            bg="chakra-body-bg"
            width="100vw"
            height="var(--chakra-vh)"
            pt={16}
          >
            <Container>
              <Heading mb={6}>{header}</Heading>
              {contentElements}
              {part >= body.length ? (
                <Fade in transition={{ enter: { duration: 1 } }}>
                  <Text color="chakra-placeholder-color" mt={12}>
                    Click anywhere to continue...
                  </Text>
                </Fade>
              ) : undefined}
            </Container>
          </Box>
        </Fade>
      </Box>
    </Portal>
  );
}

export function usePopup() {
  const [popupType, setType] = useContext(PopupContext);

  return {
    popupType,
    setPopup: useCallback(
      (newType: string) => {
        if (popupType !== "" && newType !== "") {
          return false;
        }

        setType(newType);
        return true;
      },
      [popupType, setType]
    ),
  };
}
