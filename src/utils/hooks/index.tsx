import { HugeNum } from "@/utils";
import { useEffect, useMemo, useState } from "react";

export function useChangingNum(num: HugeNum) {
  const [showing, setShowing] = useState<HugeNum | undefined>();

  useEffect(() => {
    const interval = setInterval(
      () =>
        setShowing((showing) => {
          if (!showing) {
            return num;
          }

          return showing
            .mul(HugeNum.fromInt(9))
            .add(num)
            .div(HugeNum.fromInt(10));
        }),
      100
    );

    return () => clearInterval(interval);
  }, [num]);

  return useMemo(() => showing?.ceil() ?? HugeNum.ZERO, [showing]);
}
