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
import { useCallback, useEffect, useMemo, useState } from "react";
import { Background } from "./Background";
import { PopupContent, usePopup } from "@/components/Popup";
import { Progress } from "./Progress";
import { LibraryOpener } from "@/components/Library";
import { getVariableCost, useGame } from "@/components/Game";
import { useChangingNum } from "@/utils/hooks";

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
  switch (stage) {
    default:
    case Stages.Introduction:
    case Stages.Adder:
    case Stages.StackOverflow:
    case Stages.Register:
      return "B(t + dt) = B(t) + p \\times dt";
  }
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
      case Stages.Register:
        if (ideas.gt(HugeNum.fromInt(999n))) {
          setPopup("NewBlocks");
        }
        break;
    }
  }, [stage, ideas, setPopup]);

  const beforeClose = useCallback(
    (type: string) => {
      if (type === "NewBlocks" && stage === Stages.Register) {
        setStage(Stages.CarryLookaheadAdder);
      }
    },
    [stage, setStage]
  );

  const onClose = useCallback(
    (type: string) => {
      if (type === "Introduction" && stage === Stages.Introduction) {
        setStage(Stages.Adder);
      }
      if (type === "BuyAvailable" && stage === Stages.Adder) {
        setStage(Stages.StackOverflow);
      }
    },
    [stage, setStage]
  );

  const variableExps = useMemo(
    () => getVariableExps(stage, ideas, levels),
    [stage, ideas, levels]
  );

  const onPurchase = useCallback(
    (key: string) => {
      purchaseLevel(key);
      if (stage === Stages.StackOverflow) {
        setPopup("FirstBuy");
        setStage(Stages.Register);
      }
    },
    [stage, setPopup, purchaseLevel, setStage]
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
                  onClick={() => onPurchase(key)}
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
    [variableExps, costUnit, onPurchase]
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
      </Grid>
      <Flex justifyContent="center" py={2} gap={4}>
        <ColorModeSwitcher />
        <LibraryOpener />
      </Flex>
      <PopupContent beforeClose={beforeClose} onClose={onClose} />
    </Flex>
  );
}
