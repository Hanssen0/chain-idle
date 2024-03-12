import { ColorModeSwitcher } from "@/components/ColorModeSwitcher";
import { Latex } from "@/components/Latex";
import { Fields, HugeNum, Stages } from "@/utils";
import {
  Text,
  Button,
  Center,
  Flex,
  FlexProps,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Spacer,
  Container,
  Collapse,
  Fade,
  Box,
  Grid,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo } from "react";
import { Background } from "./Background";
import { PopupContent, usePopup } from "@/components/Popup";
import { Progress } from "./Progress";
import { LibraryOpener } from "@/components/Library";
import { getVariableCost, useGame } from "@/components/Game";
import { useChangingNum } from "@/utils/hooks";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useAccount } from "wagmi";
import { FaArrowDown } from "react-icons/fa6";
import { ProfileActivator } from "@/components/ProfileActivator";

function Status(
  props: { stage: Stages; blocks: HugeNum; ideas: HugeNum } & FlexProps
) {
  const { stage, blocks, ideas } = props;

  const changingBlocks = useChangingNum(blocks);
  const changingIdeas = useChangingNum(ideas);
  const elements = [
    <Latex key="B">{`B(t) = ${changingBlocks.toString()}`}</Latex>,
  ];

  if (stage >= Stages.CarryLookaheadAdder) {
    elements.push(
      <Latex
        key="B_new"
        ml={4}
      >{`B_{new}(t) = ${changingIdeas.toString()}`}</Latex>
    );
  }

  return (
    <Flex p={4} {...{ ...props, blocks: undefined }}>
      <Center flexGrow={1}>{elements}</Center>
    </Flex>
  );
}

function getPrimaryExp(stage: Stages): string {
  if (stage < Stages.Multiplier) {
    return "B(t + dt) = B(t) + pdt";
  }
  return "B(t + dt) = B(t) \\times pdt";
}

class VariableExpression {
  readonly key: string;
  readonly expression: string;
  readonly cost: HugeNum;
  readonly level: number;
  readonly isHidden: boolean;
  readonly isAvailable: boolean;
  readonly isPurchasable: boolean;
  readonly unavailableMsg: string;

  constructor({
    key,
    expression,
    cost,
    level,
    isHidden,
    isAvailable,
    isPurchasable,
    unavailableMsg,
  }: Fields<VariableExpression>) {
    this.key = key;
    this.expression = expression;
    this.cost = cost;
    this.level = level;
    this.isHidden = isHidden;
    this.isAvailable = isAvailable;
    this.isPurchasable = isPurchasable;
    this.unavailableMsg = unavailableMsg;
  }

  static from(data: Fields<VariableExpression>) {
    return new VariableExpression(data);
  }
}

function getVariableExps(
  stage: Stages,
  ideas: HugeNum,
  levels: Map<string, number>
): VariableExpression[] {
  const expressions = [];

  const p = levels.get("p") ?? 0;
  const cost = getVariableCost("p", levels);
  expressions.push(
    VariableExpression.from({
      key: "p",
      expression: `p = ${p > 0 ? p * 50 : 1}`,
      cost,
      level: levels.get("p") ?? 0,
      isHidden: stage < Stages.Adder,
      isAvailable: stage >= Stages.StackOverflow,
      isPurchasable: !cost.gt(ideas),
      unavailableMsg: "B(t) \\ge 20",
    })
  );

  return expressions;
}

export function Home() {
  const { isConnected } = useAccount();
  const { stage, setStage, levels, purchaseLevel, blocks, ideas } = useGame();
  const { setPopup } = usePopup();

  useEffect(() => {
    switch (stage) {
      case Stages.Introduction:
        setPopup("Introduction");
        break;
      case Stages.Adder:
        if (ideas.gt(HugeNum.fromInt(19))) {
          setPopup("BuyAvailable");
        }
        break;
      case Stages.StackOverflow:
        if ((levels.get("p") ?? 0) === 0) {
          break;
        }
        setPopup("FirstBuy");
        break;
      case Stages.Register:
        if (ideas.gt(HugeNum.fromInt(999n))) {
          setPopup("NewBlocks");
        }
        break;
      case Stages.CarryLookaheadAdder:
        if ((levels.get("p") ?? 0) < 10) {
          break;
        }
        setPopup("ConnectWalletNeeded");
        break;
      case Stages.FirstRegistered:
        setPopup("Registered");
        break;
    }
  }, [stage, ideas, levels, setPopup]);

  const beforeClose = useCallback(
    (type: string) => {
      if (type === "NewBlocks" && stage === Stages.Register) {
        setStage(Stages.CarryLookaheadAdder);
      } else if (type === "FirstBuy" && stage === Stages.StackOverflow) {
        setStage(Stages.Register);
      } else if (
        type === "ConnectWalletNeeded" &&
        stage === Stages.CarryLookaheadAdder
      ) {
        setStage(Stages.TwosComplement);
      } else if (
        type === "Registered" &&
        stage === Stages.FirstRegistered
      ) {
        setStage(Stages.Multiplier);
      }
    },
    [stage, setStage]
  );

  const onClose = useCallback(
    (type: string) => {
      if (type === "Introduction" && stage === Stages.Introduction) {
        setStage(Stages.Adder);
      } else if (type === "BuyAvailable" && stage === Stages.Adder) {
        setStage(Stages.StackOverflow);
      }
    },
    [stage, setStage]
  );

  const variableExps = useMemo(
    () => getVariableExps(stage, ideas, levels),
    [stage, ideas, levels]
  );

  const costUnit = useMemo(
    () => (stage >= Stages.CarryLookaheadAdder ? "B_{new}(t)" : "B(t)"),
    [stage]
  );

  const variableExpElements = useMemo(
    () =>
      variableExps.map(
        ({
          expression,
          isHidden,
          isAvailable,
          isPurchasable,
          unavailableMsg,
          cost,
          level,
          key,
        }) => (
          <Collapse
            key={key}
            in={!isHidden}
            transition={{ enter: { duration: 1 } }}
          >
            <Container>
              <Box position="relative">
                <Button
                  width="100%"
                  isDisabled={!isAvailable || !isPurchasable}
                  borderRadius={0}
                  height=""
                  onClick={() => purchaseLevel(key)}
                >
                  <Flex
                    width="100%"
                    fontWeight="normal"
                    alignItems="center"
                    px={4}
                    py={2}
                  >
                    <Latex>{expression}</Latex>
                    <Spacer />
                    <Flex direction="column" alignItems="end">
                      {cost.mantissa === 0n ? (
                        <Text>Free</Text>
                      ) : (
                        <Latex children={`${cost.toString()}~${costUnit}`} />
                      )}
                      <Text color="gray">Level: {level}</Text>
                    </Flex>
                  </Flex>
                </Button>
                <Fade
                  in={!isAvailable}
                  transition={{ exit: { duration: 1 } }}
                  unmountOnExit
                >
                  <Center
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    color="chakra-placeholder-color"
                    bg="chakra-subtle-bg"
                  >
                    Available after <Latex ml={1}>{unavailableMsg}</Latex>
                  </Center>
                </Fade>
              </Box>
            </Container>
          </Collapse>
        )
      ),
    [variableExps, costUnit, purchaseLevel]
  );

  return (
    <Flex minHeight="100vh" direction="column">
      <Grid
        templateColumns={{ base: "1fr", xl: "1fr 1fr" }}
        templateRows={{ base: "1fr 1fr", xl: "1fr" }}
        flexGrow={1}
        borderBottomWidth="1px"
        borderColor="inherit"
      >
        <Flex
          direction="column"
          borderBottomWidth={{ base: "1px", xl: "0" }}
          borderRightWidth={{ xl: "1px" }}
          borderColor="inherit"
        >
          <Status
            stage={stage}
            blocks={blocks}
            ideas={ideas}
            borderBottom="1px solid"
            borderColor="inherit"
          />
          <Center flexGrow={1} position="relative">
            <Latex zIndex={1} fontSize={{ base: "2xl", md: "3xl", xl: "4xl" }}>
              {getPrimaryExp(stage)}
            </Latex>
            <Progress progress={ideas} />
            <Background isActive={stage !== Stages.Introduction} />
          </Center>
        </Flex>
        <Box position="relative">
          <Tabs display="flex" flexDirection="column">
            <TabList display="flex">
              <Tab py={4} flexGrow={1}>
                Tools
              </Tab>
            </TabList>
            <TabPanels py={3} flexGrow={1} position="relative">
              <TabPanel p={0}>
                <Flex direction="column">{variableExpElements}</Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Fade
            in={stage === Stages.TwosComplement}
            transition={{ exit: { duration: 1 } }}
            unmountOnExit
          >
            <Center
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              bg="chakra-body-bg"
            >
              <Flex direction="column" alignItems="center">
                <ConnectWallet />
                {isConnected ? "Connected" : "Click to connect"}
                <Collapse
                  transition={{ enter: { duration: 1 }, exit: { duration: 1 } }}
                  in={isConnected}
                >
                  <Flex direction="column" alignItems="center">
                    <Box mt={4} mb={3}>
                      <FaArrowDown />
                    </Box>
                    <ProfileActivator blocks={blocks} />
                    Activate your profile
                  </Flex>
                </Collapse>
              </Flex>
            </Center>
          </Fade>
        </Box>
      </Grid>
      <Flex justifyContent="center" py={2} gap={4}>
        <ColorModeSwitcher />
        <ConnectWallet />
        <LibraryOpener />
      </Flex>
      <PopupContent beforeClose={beforeClose} onClose={onClose} />
    </Flex>
  );
}
