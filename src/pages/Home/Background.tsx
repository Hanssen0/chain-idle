import {
  Box,
  Icon,
  PositionProps,
  chakra,
  keyframes,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STAGE_CREATE = 0;
const STAGE_GENERATE = 1;
const STAGE_MOVE = 2;
const STAGE_SHRINK = 3;
const STAGE_SHRINKING = 4;
const STAGE_LINK = 5;
const STAGE_IN_QUEUE = 6;

function randomHex(length = 1) {
  return Array.from(
    Array(length),
    () => "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("");
}

function queueNo(stage: number) {
  return Math.floor((stage - STAGE_IN_QUEUE + 1) / 2);
}

function d(instructions: [string, number[]][]) {
  return instructions
    .map(([ins, points]) => `${ins}${points.join(",")}`)
    .join();
}

function Block({
  width,
  height,
  stage,
  isFirst,
  nextStage,
  onInvisible,
}: {
  width: number;
  height: number;
  stage: number;
  isFirst: boolean;
  nextStage: () => void;
  onInvisible: () => void;
}) {
  const roundSize = 20;
  const clientWidth = 200;
  const clientHeight = 150;
  const strokeWidth = 4;
  const blockGap = 10;

  const smRoundSize = roundSize * 0.4;
  const smClientWidth = clientWidth * 0.4;
  const smClientHeight = clientHeight * 0.4;

  const offsetWidth = clientWidth + strokeWidth;
  const offsetHeight = clientHeight + strokeWidth;
  const smOffsetWidth = smClientWidth + strokeWidth;
  const smOffsetHeight = smClientHeight + strokeWidth;

  const commonProps = {
    fill: "var(--chakra-colors-chakra-body-bg)",
    stroke: "currentcolor",
    strokeWidth: `${strokeWidth}px`,
  };

  const [[content, updateTimes], setContent] = useState(["", 0]);
  const [prevRight, setPrevRight] = useState(0);
  const [prevTop, setPrevTop] = useState(0);

  useEffect(() => {
    if (stage !== STAGE_GENERATE) {
      return;
    }
    if (updateTimes <= 138) {
      setTimeout(() => setContent([content + randomHex(), updateTimes + 1]), 7);
    } else if (updateTimes <= 170) {
      setTimeout(
        () =>
          setContent([`${randomHex(64)}${content.slice(64)}`, updateTimes + 1]),
        65
      );
    } else {
      nextStage();
    }
  }, [stage, content, nextStage, updateTimes]);

  const [iconWidth, iconHeight] = useMemo(() => {
    if (stage <= STAGE_SHRINKING) {
      return [offsetWidth, offsetHeight];
    }

    return [smOffsetWidth, smOffsetHeight];
  }, [stage, offsetWidth, offsetHeight, smOffsetWidth, smOffsetHeight]);

  const viewBox = useMemo(() => {
    if (stage > STAGE_SHRINKING) {
      return `${offsetWidth - smOffsetWidth} ${
        (clientHeight - smClientHeight) / 2
      } ${iconWidth} ${iconHeight}`;
    }

    return `0 0 ${iconWidth} ${iconHeight}`;
  }, [
    stage,
    offsetWidth,
    smOffsetWidth,
    clientHeight,
    smClientHeight,
    iconHeight,
    iconWidth,
  ]);

  const [right, top] = useMemo(() => {
    if (stage === STAGE_CREATE || stage === STAGE_GENERATE) {
      return [(width - iconWidth) / 2, (height - iconHeight) / 2];
    }
    if (
      stage === STAGE_MOVE ||
      stage === STAGE_SHRINK ||
      stage === STAGE_SHRINKING
    ) {
      return [blockGap, (height - iconHeight) / 2];
    }

    return [
      blockGap + queueNo(stage) * (iconWidth + blockGap),
      (height - iconHeight) / 2,
    ];
  }, [stage, width, height, iconWidth, iconHeight]);

  const animation = useMemo(() => {
    if (prevRight === right && prevTop === top) {
      return undefined;
    }

    if (stage === STAGE_MOVE || stage > STAGE_IN_QUEUE) {
      return `${keyframes({
        from: {
          right: prevRight,
          top: prevTop,
        },
        to: {
          right,
          top,
        },
      })} 2s linear`;
    }

    setPrevRight(right);
    setPrevTop(top);
    return undefined;
  }, [stage, prevRight, prevTop, right, top]);

  const boxProps: PositionProps & { animation?: string } = {
    position: "absolute",
    right: `${right}px`,
    top: `${top}px`,
    animation,
  };

  const iconProps: PositionProps & {
    viewBox: string;
    width: string;
    height: string;
  } = {
    viewBox,
    width: `${iconWidth}px`,
    height: `${iconHeight}px`,
  };

  if (stage === STAGE_CREATE) {
    const borderLength = clientWidth + clientHeight;

    const animation = keyframes({
      "0%": {
        strokeDashoffset: borderLength,
      },
      "20%": {
        strokeDashoffset: borderLength * 0.74,
      },
      "80%": {
        strokeDashoffset: borderLength * 0.26,
      },
      "100%": {
        strokeDashoffset: 0,
      },
    });

    const base = {
      ...commonProps,
      fill: "none",
      strokeDasharray: borderLength,
      animation: `${animation} 1s linear`,
      strokeDashoffset: 0,
    };

    return (
      <Box {...boxProps}>
        <Icon {...iconProps}>
          <chakra.clipPath id="clip">
            <chakra.rect
              y={clientHeight}
              width="300px"
              height="200px"
              animation={`${keyframes({
                from: {
                  y: clientHeight,
                },
                to: {
                  y: 0,
                },
              })} 0.6s linear 0.2s forwards`}
            />
          </chakra.clipPath>
          <chakra.path
            clipPath="url(#clip)"
            id="clipPath"
            fill={commonProps.fill}
            d={d([
              ["M", [iconWidth / 2, iconHeight - strokeWidth]],
              ["h", [roundSize - (clientWidth - strokeWidth) / 2]],
              ["q", [-roundSize, 0, -roundSize, -roundSize]],
              ["v", [2 * roundSize - clientHeight + strokeWidth]],
              ["q", [0, -roundSize, roundSize, -roundSize]],
              ["h", [clientWidth - 2 * roundSize - strokeWidth]],
              ["q", [roundSize, 0, roundSize, roundSize]],
              ["v", [clientHeight - 2 * roundSize - strokeWidth]],
              ["q", [0, roundSize, -roundSize, roundSize]],
              ["h", [roundSize - clientWidth / 2]],
            ])}
          />
          <chakra.path
            d={d([
              ["M", [iconWidth / 2, iconHeight - strokeWidth / 2]],
              ["h", [roundSize - clientWidth / 2]],
              ["q", [-roundSize, 0, -roundSize, -roundSize]],
              ["v", [2 * roundSize - clientHeight]],
              ["q", [0, -roundSize, roundSize, -roundSize]],
              ["h", [clientWidth / 2 - roundSize]],
            ])}
            {...base}
            onAnimationEnd={nextStage}
          />
          <chakra.path
            d={d([
              ["M", [iconWidth / 2, iconHeight - strokeWidth / 2]],
              ["h", [clientWidth / 2 - roundSize]],
              ["q", [roundSize, 0, roundSize, -roundSize]],
              ["v", [2 * roundSize - clientHeight]],
              ["q", [0, -roundSize, -roundSize, -roundSize]],
              ["h", [roundSize - clientWidth / 2]],
            ])}
            {...base}
          />
        </Icon>
      </Box>
    );
  }

  return (
    <Box
      {...boxProps}
      onAnimationEnd={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        nextStage();
        setPrevRight(right);
        setPrevTop(top);
        if (right > width) {
          onInvisible();
        }
      }}
    >
      {stage > STAGE_SHRINKING && !isFirst ? (
        <Icon
          width={`${blockGap}px`}
          height={`${strokeWidth}px`}
          viewBox={`0 0 ${blockGap} ${strokeWidth}`}
          position="absolute"
          top={`${(iconHeight - strokeWidth) / 2}px`}
          left={`${-blockGap}px`}
        >
          <chakra.path
            d={d([
              ["M", [blockGap, strokeWidth / 2]],
              ["h", [-blockGap]],
            ])}
            strokeDasharray={blockGap}
            strokeDashoffset={0}
            animation={`${keyframes({
              from: {
                strokeDashoffset: blockGap,
              },
              to: {
                strokeDashoffset: 0,
              },
            })} 0.3s linear`}
            onAnimationEnd={nextStage}
            {...commonProps}
          />
        </Icon>
      ) : undefined}
      <Text
        position="absolute"
        top={`${iconHeight / 2}px`}
        right="12px"
        transform="translateY(-50%)"
        fontFamily="monospace"
        width={`${offsetWidth - 24}px`}
        height={`${offsetHeight - 38}px`}
        overflow="hidden"
        textAlign={stage < STAGE_MOVE ? "left" : "center"}
        animation={
          stage >= STAGE_SHRINK
            ? `${keyframes({
                from: {
                  width: `${offsetWidth - 24}px`,
                  height: `${offsetHeight - 38}px`,
                },
                to: {
                  width: `${smOffsetWidth - 24}px`,
                  height: `${smOffsetHeight - 24}px`,
                },
              })} 1s linear 0.5s forwards`
            : undefined
        }
      >
        {content}
      </Text>
      <Icon {...iconProps}>
        <chakra.path
          d={d([
            ["M", [offsetWidth / 2, offsetHeight - strokeWidth / 2]],
            ["h", [roundSize - clientWidth / 2]],
            ["q", [-roundSize, 0, -roundSize, -roundSize]],
            ["v", [2 * roundSize - clientHeight]],
            ["q", [0, -roundSize, roundSize, -roundSize]],
            ["h", [clientWidth - 2 * roundSize]],
            ["q", [roundSize, 0, roundSize, roundSize]],
            ["v", [clientHeight - 2 * roundSize]],
            ["q", [0, roundSize, -roundSize, roundSize]],
            ["h", [roundSize - clientWidth / 2]],
          ])}
          {...commonProps}
        >
          <animate
            ref={(ref: any) => {
              if (!ref || stage !== STAGE_SHRINK) {
                return;
              }
              nextStage();
              setTimeout(() => ref.beginElement(), 500);
              ref.addEventListener("endEvent", nextStage);
            }}
            attributeName="d"
            from={d([
              ["M", [offsetWidth / 2, offsetHeight - strokeWidth / 2]],
              ["h", [roundSize - clientWidth / 2]],
              ["q", [-roundSize, 0, -roundSize, -roundSize]],
              ["v", [2 * roundSize - clientHeight]],
              ["q", [0, -roundSize, roundSize, -roundSize]],
              ["h", [clientWidth - 2 * roundSize]],
              ["q", [roundSize, 0, roundSize, roundSize]],
              ["v", [clientHeight - 2 * roundSize]],
              ["q", [0, roundSize, -roundSize, roundSize]],
              ["h", [roundSize - clientWidth / 2]],
            ])}
            to={d([
              [
                "M",
                [
                  offsetWidth - smOffsetWidth / 2,
                  (iconHeight + smClientHeight) / 2,
                ],
              ],
              ["h", [smRoundSize - smClientWidth / 2]],
              ["q", [-smRoundSize, 0, -smRoundSize, -smRoundSize]],
              ["v", [2 * smRoundSize - smClientHeight]],
              ["q", [0, -smRoundSize, smRoundSize, -smRoundSize]],
              ["h", [smClientWidth - 2 * smRoundSize]],
              ["q", [smRoundSize, 0, smRoundSize, smRoundSize]],
              ["v", [smClientHeight - 2 * smRoundSize]],
              ["q", [0, smRoundSize, -smRoundSize, smRoundSize]],
              ["h", [smRoundSize - smClientWidth / 2]],
            ])}
            dur="1s"
            begin="indefinite"
            fill="freeze"
          />
        </chakra.path>
      </Icon>
    </Box>
  );
}

let BLOCKS = 0;

export function Background({ isActive }: { isActive?: boolean }) {
  const IconRef = useRef<HTMLDivElement>(null);
  const { clientWidth: width, clientHeight: height } = IconRef.current ?? {
    clientWidth: 0,
    clientHeight: 0,
  };
  const [blocks, setBlocks] = useState<
    { key: number; stage: number; active: boolean; isFirst: boolean }[]
  >([]);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    setBlocks([{ key: BLOCKS++, stage: 0, active: true, isFirst: true }]);
  }, [width, height, isActive]);

  useEffect(() => {
    if (blocks.find(({ active }) => !active)) {
      setBlocks(blocks.filter(({ active }) => active));
    }
  }, [blocks]);

  const nextStage = useCallback(
    (key: number) => {
      const block = blocks.find((b) => b.key === key);
      if (!block) {
        return;
      }

      block.stage += 1;
      if (block.isFirst && block.stage === STAGE_LINK) {
        block.stage += 1;
      }

      if (block.stage === STAGE_MOVE) {
        block.stage -= 1;
        blocks.forEach((b) => (b.stage += 1));
      } else if (block.stage === STAGE_IN_QUEUE) {
        blocks.push({ key: BLOCKS++, stage: 0, active: true, isFirst: false });
      }

      setBlocks([...blocks]);
    },
    [blocks]
  );

  const elements = useMemo(() => {
    return blocks
      .filter(({ active }) => active)
      .map((b) => (
        <Block
          {...b}
          width={width}
          height={height}
          nextStage={() => nextStage(b.key)}
          onInvisible={() => {
            b.active = false;
          }}
        />
      ));
  }, [blocks, width, height, nextStage]);

  return (
    <Box
      ref={IconRef}
      zIndex={0}
      position="absolute"
      width="100%"
      height="100%"
      left={0}
      top={0}
      overflow="hidden"
      userSelect="none"
      _dark={{ color: "gray.700" }}
      _light={{ color: "gray.200" }}
    >
      {elements}
    </Box>
  );
}
