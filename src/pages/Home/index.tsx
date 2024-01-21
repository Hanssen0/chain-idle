import { ColorModeSwitcher } from "@/components/ColorModeSwitcher";
import { Latex } from "@/components/Latex";
import { Fields, HugeNum } from "@/utils";
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
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Background } from "./Background";
import { Popup } from "@/components/Popup";
import { Progress } from "./Progress";

enum Stages {
  Introduction,
  Adder,
  StackOverflow,
  Register,
}

function Status(props: { blocks: HugeNum } & FlexProps) {
  const { blocks } = props;
  return (
    <Flex p={4} {...{ ...props, blocks: undefined }}>
      <Center flexGrow={1}>
        <Latex>{`B(t) = ${blocks.toString()}`}</Latex>
      </Center>
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
      return "B(t + dt) = B(t) + x";
  }
}

class VariableExpression {
  readonly key: string;
  readonly expression: string;
  readonly cost: string;
  readonly level: number;
  readonly available: boolean;

  constructor({
    key,
    expression,
    cost,
    level,
    available,
  }: Fields<VariableExpression>) {
    this.key = key;
    this.expression = expression;
    this.cost = cost;
    this.level = level;
    this.available = available;
  }

  static from(data: Fields<VariableExpression>) {
    return new VariableExpression(data);
  }
}

function getVariableExps(
  stage: Stages,
  blocks: HugeNum,
  levels: Map<string, number>
): VariableExpression[] {
  const expressions = [];

  const x = levels.get("x") ?? 0;
  expressions.push(
    VariableExpression.from({
      key: "x",
      expression: `x = ${x > 0 ? x * 50 : 1}`,
      cost: "Free",
      level: levels.get("x") ?? 0,
      available: stage > Stages.Adder,
    })
  );

  return expressions;
}

function nextBlocks(
  stage: Stages,
  blocks: HugeNum,
  levels: Map<string, number>
) {
  if (stage === Stages.Introduction) {
    return blocks;
  }

  const xLevel = levels.get("x") ?? 0;
  const x = xLevel > 0 ? 50 * xLevel : 1;

  return blocks.add(HugeNum.fromInt(x));
}

export function Home() {
  const [stage, setStage] = useState(Stages.Introduction);
  const [popupType, setPopupType] = useState("");
  const [levels, setLevels] = useState(new Map());
  const [blocks, updateBlocks] = useReducer(
    (
      blocks: HugeNum,
      { stage, levels }: { stage: Stages; levels: Map<string, number> }
    ) => nextBlocks(stage, blocks, levels),
    HugeNum.ZERO
  );
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => !t), 1000);
    return () => clearInterval(interval);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateBlocks({ stage, levels }), [tick]);

  useEffect(() => {
    switch (stage) {
      case Stages.Introduction:
        setPopupType("Introduction");
        break;
      case Stages.Adder:
        if (popupType === "" && blocks.gt(HugeNum.fromInt(19))) {
          setPopupType("BuyAvailable");
          setStage(Stages.StackOverflow);
        }
        break;
    }
  }, [stage, blocks, popupType]);

  const onClose = useCallback(() => {
    if (popupType === "Introduction" && stage === Stages.Introduction) {
      setStage(Stages.Adder);
    }
    setPopupType("");
  }, [popupType, stage]);

  const onPurchase = useCallback(
    (key: string) => {
      setLevels((levels) =>
        new Map(levels).set(key, (levels.get(key) ?? 0) + 1)
      );
      if (stage === Stages.StackOverflow) {
        setPopupType("FirstBuy");
        setStage(Stages.Register);
      }
    },
    [stage]
  );

  const variableExps = useMemo(
    () =>
      getVariableExps(stage, blocks, levels).map(
        ({ expression, available, cost, level, key }) => (
          <Container key={key}>
            <Button
              width="100%"
              isDisabled={!available}
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
                  <Text>{cost}</Text>
                  <Text color="gray">Level: {level}</Text>
                </Flex>
              </Flex>
            </Button>
          </Container>
        )
      ),
    [stage, blocks, levels, onPurchase]
  );

  return (
    <Flex minHeight="100vh" direction="column">
      <Popup type={popupType} onClose={onClose} />
      <Flex wrap="wrap" grow={1} borderBottomWidth="1px" borderColor="inherit">
        <Flex
          basis={{ base: "100%", xl: "50%" }}
          direction="column"
          borderBottomWidth={{ base: "1px", xl: "0" }}
          borderRightWidth={{ xl: "1px" }}
          borderColor="inherit"
        >
          <Status
            blocks={blocks}
            borderBottom="1px solid"
            borderColor="inherit"
          />
          <Center flexGrow={1} position="relative">
            <Latex zIndex={1} fontSize={{ base: "2xl", md: "3xl", xl: "4xl" }}>
              {getPrimaryExp(stage)}
            </Latex>
            <Progress progress={blocks} />
            <Background isActive={stage !== Stages.Introduction} />
          </Center>
        </Flex>
        <Tabs flexBasis={{ base: "100%", xl: "50%" }}>
          <TabList display="flex">
            <Tab py={4} flexGrow={1}>
              Variables
            </Tab>
          </TabList>
          <TabPanels py={3}>
            <TabPanel p={0}>
              <Flex direction="column">{variableExps}</Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <Flex justifyContent="center" py={2}>
        <ColorModeSwitcher />
      </Flex>
    </Flex>
  );
}
