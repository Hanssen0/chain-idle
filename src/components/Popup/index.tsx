import {
  Box,
  Container,
  Divider,
  Fade,
  Heading,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

const CONTENTS = [
  {
    type: "Introduction",
    header: "Adder",
    body: [
      "You were born with a keen nose for mathematics\n",
      "Today, you are reading a book about the hash function",
      "You suddenly think",
      '"Maybe we can divide the data into small pieces."',
      '"Each piece of data contains the hash of the previous one."',
      '"Thus concatenating all the data?"\n',
      "A chain of data comes into your mind",
    ],
  },
  {
    type: "BuyAvailable",
    header: "Stack Overflow",
    body: [
      '"This seems like it might work!"\n',
      "The chain in your mind grows longer",
      "Your genius idea needs a piece of paper",
    ],
  },
  {
    type: "FirstBuy",
    header: "Register",
    body: [
      "Papers!",
      "You can finally remember the results you just calculated\n",
      "With your efficiency significantly improved",
      "You can't wait to do the following calculation",
    ],
  },
];

function getContent(type: string) {
  return CONTENTS.find((c) => c.type === type);
}

export function Popup({
  type,
  onClose,
}: {
  type: string;
  onClose: () => void;
}) {
  const [part, setPart] = useState(0);
  const content = useMemo(() => getContent(type), [type]);
  const { header, body } = content ?? { header: "", body: [] };
  const next = () => setPart((p) => p + 1);

  useEffect(() => setPart(0), [type]);

  useEffect(() => {
    if (part >= body.length) {
      return;
    }

    const timeout = setTimeout(next, 4000);

    return () => clearTimeout(timeout);
  }, [part, body]);

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
              onClose();
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
