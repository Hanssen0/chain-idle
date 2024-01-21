import { HugeNum, d } from "@/utils";
import { Box, Icon, keyframes, chakra } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

const HISTORY_LENGTH = 24;

export function Progress({ progress }: { progress: HugeNum }) {
  const [history, setHistory] = useState(
    Array.from(Array(HISTORY_LENGTH + 1), (_, i) => ({
      x: i,
      y: { depth: -1, n: -2 },
    }))
  );

  useEffect(
    () =>
      setHistory((history) => [
        ...history,
        {
          x: history[history.length - 1].x + 1,
          y: progress.log10().visualScale(),
        },
      ]),
    [progress]
  );

  const [fromX, setFromX] = useState(HISTORY_LENGTH);
  const [toX, setToX] = useState(HISTORY_LENGTH);
  useEffect(() => {
    if (fromX === toX) {
      setToX(history[history.length - 1].x);
    }
  }, [fromX, toX, history]);

  const [nowY, setNowY] = useState([-0.1, 0.4]);
  const yRange = useMemo(() => {
    const visibleHis = history.filter(
      ({ x }) => toX - HISTORY_LENGTH < x && x <= toX
    );
    return [
      visibleHis.reduce((a, b) => (a.y.n < b.y.n ? a : b)).y.n,
      visibleHis.reduce((a, b) => (a.y.n > b.y.n ? a : b)).y.n,
    ];
  }, [history, toX]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNowY((nowY) => [
        (nowY[0] * 59 + yRange[0] - 0.1) / 60,
        (nowY[1] * 59 + yRange[1] + 0.4) / 60,
      ]);
    }, 100 / 6);

    return () => clearInterval(interval);
  }, [yRange]);

  const boxRef = useRef<HTMLDivElement>(null);
  const { clientWidth: width, clientHeight: height } = boxRef.current ?? {
    clientWidth: 0,
    clientHeight: 0,
  };
  const historyGap = width / (HISTORY_LENGTH - 1);
  const graphPath = useMemo(() => {
    const pos = history.map(({ y }, i) => [
      i * historyGap,
      ((nowY[1] - y.n) * height * 0.9) / (nowY[1] - nowY[0]) + height * 0.1,
      y.depth,
    ]);
    return d(
      pos
        .map(([x, y, depth], i): [string, number[]][] => {
          if (i === 0) {
            return [["", [x, y]]];
          }

          const [pX, pY, pD] = pos[i - 1];
          if (pD === depth || pD === -1) {
            return [["S", [0.9 * x + 0.1 * pX, 0.9 * y + 0.1 * pY, x, y]]];
          }
          return [
            ["V", [height]],
            ["S", [0.9 * x + 0.1 * pX, 0.9 * y + 0.1 * pY, x, y]],
          ];
        })
        .flat()
    );
  }, [historyGap, history, height, nowY]);
  const moveAni = useMemo(() => {
    if (fromX === toX) {
      return undefined;
    }

    return `${keyframes({
      from: { left: -historyGap },
      to: { left: (fromX - toX - 1) * historyGap },
    })} 1s linear`;
  }, [historyGap, fromX, toX]);

  return (
    <Box
      ref={boxRef}
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
      className="notranslate"
    >
      <Icon
        position="absolute"
        left={(fromX - toX - 1) * historyGap}
        top={0}
        animation={moveAni}
        width={(history.length - 1) * historyGap}
        height="100%"
        viewBox={`0 0 ${(history.length - 1) * historyGap} ${height}`}
        onAnimationEnd={() => {
          setHistory((history) =>
            history.filter(({ x }) => x >= toX - HISTORY_LENGTH)
          );
          setFromX(toX);
        }}
      >
        <chakra.path
          _dark={{ fill: "blackAlpha.300" }}
          _light={{ fill: "blackAlpha.50" }}
          d={`M0,${height}L${graphPath}V${height}Z`}
        />
        <chakra.path
          stroke="currentcolor"
          strokeWidth={2}
          fill="none"
          d={`M${graphPath}`}
        />
      </Icon>
    </Box>
  );
}
