import { Fields } from "./types";

export class HugeNum {
  /** Decimals */
  static readonly DECS = 18;
  /** Readable decimals */
  static readonly READ_DECS = 4;

  /** 1 with decimals */
  static readonly ONE_N = 10n ** BigInt(HugeNum.DECS);
  /** 1 with decimals */
  static readonly NEG_ONE_N = -HugeNum.ONE_N;
  /** Decimals with decimals */
  static readonly DECS_N = HugeNum.inDecs(HugeNum.DECS);

  static inDecs(value: bigint | number): bigint {
    return BigInt(value) * HugeNum.ONE_N;
  }
  static decInDecs(value: bigint, decimals: number): bigint {
    return value * 10n ** BigInt(HugeNum.DECS - decimals);
  }
  /** 10 with decimals */
  static readonly TEN_N = HugeNum.inDecs(10n);
  /** ln(10) with decimals */
  static readonly LN_TEN_N = HugeNum.decInDecs(2302585092994045684n, 18);
  /** 1.2 with decimals */
  static readonly ONE_P_TWO_N = HugeNum.decInDecs(12n, 1);
  /** ln(1.2) with decimals */
  static readonly LN_ONE_P_TWO_N = HugeNum.decInDecs(182321556793954600n, 18);
  /** Max exponent with decimals */
  static readonly MAX_EXP = 10 ** 5;
  /** Max exponent with decimals */
  static readonly MAX_EXP_N = HugeNum.inDecs(HugeNum.MAX_EXP);
  /** Exponent of max exponent with decimals */
  static readonly MAX_EXP_EXP_N = HugeNum.inDecs(5n);
  /** Precise decimals, b >> a if b >= a * 10 ** PRECISE_EXPONENT */
  static readonly PREC_EXP_N = HugeNum.inDecs(18n);
  static readonly NEG_PREC_EXP_N = -HugeNum.PREC_EXP_N;
  /** Max exponent for meaningful calculation with decimals */
  static readonly MAX_PREC_EXP_N = HugeNum.MAX_EXP_EXP_N + HugeNum.PREC_EXP_N;
  static readonly LOG_10S = [
    HugeNum.log10Int(HugeNum.inDecs(2n)),
    HugeNum.log10Int(HugeNum.inDecs(3n)),
    HugeNum.log10Int(HugeNum.inDecs(4n)),
    HugeNum.log10Int(HugeNum.inDecs(5n)),
    HugeNum.log10Int(HugeNum.inDecs(6n)),
    HugeNum.log10Int(HugeNum.inDecs(7n)),
    HugeNum.log10Int(HugeNum.inDecs(8n)),
    HugeNum.log10Int(HugeNum.inDecs(9n)),
  ];

  static readonly ZERO = new HugeNum({
    mantissa: 0n,
    depth: 1n,
    exponent: 0n,
  });
  static readonly ONE = new HugeNum({
    mantissa: HugeNum.ONE_N,
    depth: 1n,
    exponent: 0n,
  });

  /** With decimals */
  mantissa: bigint;
  /** Always non-negative, no decimals, greater than 0 */
  depth: bigint;
  /** Always non-negative, with decimals */
  exponent: bigint;

  constructor(value: Fields<HugeNum>) {
    this.mantissa = value.mantissa;
    this.depth = value.depth;
    this.exponent = value.exponent;
  }

  static toSci(value: bigint): [bigint, bigint] {
    if (value === 0n) {
      return [0n, 0n];
    }

    let sign = value < 0n ? -1n : 1n;
    value *= sign;
    let exp = 0n;
    while (value >= HugeNum.TEN_N) {
      value /= 10n;
      exp += HugeNum.ONE_N;
    }
    while (value < HugeNum.ONE_N) {
      value *= 10n;
      exp -= HugeNum.ONE_N;
    }

    return [value * sign, exp];
  }

  static lnInt(x: bigint): bigint {
    let sign = x < 0n ? -1n : 1n;
    x *= sign;

    let log = 0n;
    while (x >= HugeNum.TEN_N) {
      log = log + HugeNum.LN_TEN_N;
      x = x / 10n;
    }
    while (x >= HugeNum.ONE_P_TWO_N) {
      log = log + HugeNum.LN_ONE_P_TWO_N;
      x = (x * 5n) / 6n;
    }
    x = x - HugeNum.ONE_N;
    let y = x;
    let i = 1n;
    // More iteration for higher accuracy
    while (i < 13n) {
      log = log + y / i;
      i = i + 1n;
      y = (y * x) / HugeNum.ONE_N;
      log = log - y / i;
      i = i + 1n;
      y = (y * x) / HugeNum.ONE_N;
    }

    return log * sign;
  }

  static log10Int(x: bigint): bigint {
    return (HugeNum.lnInt(x) * HugeNum.ONE_N) / HugeNum.LN_TEN_N;
  }

  static _tenPow(x: bigint): bigint {
    const l = x / HugeNum.ONE_N;
    const r = x - l * HugeNum.ONE_N;
    for (let i = 0; i < 8; i += 1) {
      if (r < HugeNum.LOG_10S[i]) {
        return 10n ** l * BigInt(i + 1);
      }
    }
    return 10n ** l * 9n;
  }

  static tenPow(x: bigint): bigint {
    if (x === 0n) {
      return HugeNum.ONE_N;
    }

    if (x < 0n) {
      return HugeNum.ONE_N / HugeNum._tenPow(-x);
    }

    return HugeNum.ONE_N * HugeNum._tenPow(x);
  }

  /** Get the exponent of self subtract the exponent of value
   * in range [-PREC_EXP_N, PREC_EXP_N]
   */
  static expSub(
    a: Pick<HugeNum, "depth" | "exponent">,
    b: Pick<HugeNum, "depth" | "exponent">
  ): bigint {
    const depthDiff = a.depth - b.depth;
    if (depthDiff <= -2n) {
      return HugeNum.NEG_PREC_EXP_N;
    }
    if (depthDiff >= 2n) {
      return HugeNum.PREC_EXP_N;
    }
    let aExp = a.exponent;
    let bExp = b.exponent;
    if (depthDiff === -1n) {
      if (bExp > HugeNum.MAX_PREC_EXP_N) {
        return HugeNum.NEG_PREC_EXP_N;
      }
      bExp = HugeNum.tenPow(bExp);
    }
    if (depthDiff === 1n) {
      if (aExp > HugeNum.MAX_PREC_EXP_N) {
        return HugeNum.PREC_EXP_N;
      }
      aExp = HugeNum.tenPow(aExp);
    }
    const expDiff = aExp - bExp;
    if (expDiff >= HugeNum.PREC_EXP_N) {
      return HugeNum.PREC_EXP_N;
    }
    if (expDiff <= HugeNum.NEG_PREC_EXP_N) {
      return HugeNum.NEG_PREC_EXP_N;
    }
    return expDiff;
  }

  private static addExp(
    value: Pick<HugeNum, "depth" | "exponent">,
    exp: bigint
  ): void {
    if (exp === 0n) {
      return;
    }

    if (value.depth === 1n) {
      value.exponent += exp;
    } else if (value.depth === 2n) {
      if (value.exponent <= HugeNum.MAX_PREC_EXP_N) {
        value.depth = 1n;
        value.exponent = HugeNum.tenPow(value.exponent) + exp;
      }
    }

    if (value.exponent >= HugeNum.MAX_EXP_N) {
      value.depth += 1n;
      value.exponent = HugeNum.log10Int(value.exponent);
    }
  }

  /** Normalize the value */
  static norm(value: Fields<HugeNum>): void {
    const [mantissa, exp] = HugeNum.toSci(value.mantissa);
    value.mantissa = mantissa;

    HugeNum.addExp(value, exp);
  }

  /** Normalize the value, move mantissa to exp */
  static normNoM(value: Fields<HugeNum>): void {
    HugeNum.addExp(value, HugeNum.log10Int(value.mantissa));
    value.mantissa = 1n;
  }

  static exp(value: Fields<HugeNum>): HugeNum {
    if (value.depth === 1n) {
      const exp = new HugeNum({
        mantissa: value.exponent,
        depth: 1n,
        exponent: 0n,
      });
      HugeNum.norm(exp);
      return exp;
    }

    return new HugeNum({
      mantissa: HugeNum.ONE_N,
      depth: value.depth - 1n,
      exponent: value.exponent,
    });
  }

  static log10(value: Fields<HugeNum>): HugeNum {
    if (value.depth === 1n) {
      const exp = new HugeNum({
        mantissa: value.exponent + HugeNum.log10Int(value.mantissa),
        depth: 1n,
        exponent: 0n,
      });
      HugeNum.norm(exp);
      return exp;
    }
    if (value.depth === 2n && value.exponent <= HugeNum.PREC_EXP_N) {
      const exp = new HugeNum({
        mantissa:
          HugeNum.tenPow(value.exponent) + HugeNum.log10Int(value.mantissa),
        depth: 1n,
        exponent: 0n,
      });
      HugeNum.norm(exp);
      return exp;
    }

    return new HugeNum({
      mantissa: HugeNum.ONE_N,
      depth: value.depth - 1n,
      exponent: value.exponent,
    });
  }

  static gt(a: Fields<HugeNum>, b: Fields<HugeNum>): boolean {
    if (a.mantissa <= 0n) {
      if (b.mantissa >= 0n) {
        return false;
      }
    } else if (b.mantissa <= 0n) {
      return true;
    }

    const depthDiff = a.depth - b.depth;
    if (depthDiff >= 2n) {
      return a.mantissa > 0n;
    }
    if (depthDiff <= -2n) {
      return a.mantissa <= 0n;
    }

    let aExp = a.exponent;
    let bExp = b.exponent;
    if (depthDiff === 1n) {
      if (aExp > HugeNum.MAX_PREC_EXP_N) {
        return a.mantissa > 0n;
      }
      aExp = HugeNum.tenPow(aExp);
    } else if (depthDiff === -1n) {
      if (bExp > HugeNum.MAX_PREC_EXP_N) {
        return a.mantissa <= 0n;
      }
      bExp = HugeNum.tenPow(bExp);
    }

    if (aExp === bExp) {
      return a.mantissa > b.mantissa;
    }
    if (a.mantissa > 0n) {
      return aExp > bExp;
    }
    return aExp < bExp;
  }

  private _inc(value: Fields<HugeNum>): void {
    const expSub = HugeNum.expSub(this, value);
    if (expSub === HugeNum.PREC_EXP_N) {
      return;
    }
    if (expSub === HugeNum.NEG_PREC_EXP_N) {
      this.mantissa = value.mantissa;
      this.depth = value.depth;
      this.exponent = value.exponent;
      return;
    }

    if (expSub > 0n) {
      this.mantissa +=
        (value.mantissa * HugeNum.ONE_N) / HugeNum.tenPow(expSub);
    } else if (expSub < 0n) {
      this.mantissa =
        (this.mantissa * HugeNum.ONE_N) / HugeNum.tenPow(-expSub) +
        value.mantissa;
      this.depth = value.depth;
      this.exponent = value.exponent;
    } else {
      this.mantissa += value.mantissa;
    }
  }

  inc(value: Fields<HugeNum>): void {
    this._inc(value);
    HugeNum.norm(this);
  }

  _dec(value: Fields<HugeNum>): void {
    this._inc({ ...value, mantissa: -value.mantissa });
  }

  dec(value: Fields<HugeNum>): void {
    this.inc({ ...value, mantissa: -value.mantissa });
  }

  multiply(value: Fields<HugeNum>): void {
    const [mantissa, mExp] = HugeNum.toSci(
      (this.mantissa * value.mantissa) / HugeNum.ONE_N
    );
    this.mantissa = mantissa;

    const exp = HugeNum.exp(this);
    exp._inc(HugeNum.exp(value));
    if (mExp === HugeNum.ONE_N) {
      exp._inc(HugeNum.ONE);
    }

    if (exp.depth === 1n && exp.exponent < HugeNum.MAX_EXP_EXP_N) {
      this.depth = 1n;
      this.exponent =
        (exp.mantissa * HugeNum.tenPow(exp.exponent)) / HugeNum.ONE_N;
    } else {
      HugeNum.normNoM(exp);
      this.depth = exp.depth + 1n;
      this.exponent = exp.exponent;
    }

    HugeNum.norm(this);
  }

  divide(value: Fields<HugeNum>): void {
    const [mantissa, mExp] = HugeNum.toSci(
      (this.mantissa * HugeNum.ONE_N) / value.mantissa
    );
    this.mantissa = mantissa;

    const exp = HugeNum.exp(this);
    exp._dec(HugeNum.exp(value));
    if (mExp === HugeNum.NEG_ONE_N) {
      exp._dec(HugeNum.ONE);
    }

    if (exp.depth === 1n && exp.exponent < HugeNum.MAX_EXP_EXP_N) {
      this.depth = 1n;
      this.exponent =
        (exp.mantissa * HugeNum.tenPow(exp.exponent)) / HugeNum.ONE_N;
    } else {
      HugeNum.normNoM(exp);
      this.depth = exp.depth + 1n;
      this.exponent = exp.exponent;
    }

    HugeNum.norm(this);
  }

  static from(value: Fields<HugeNum>): HugeNum {
    return new HugeNum(value);
  }

  clone(): HugeNum {
    return HugeNum.from(this);
  }

  norm(): HugeNum {
    const c = this.clone();
    HugeNum.norm(c);
    return c;
  }

  static fromInt(value: bigint | number): HugeNum {
    return new HugeNum({
      mantissa: HugeNum.inDecs(value),
      depth: 1n,
      exponent: 0n,
    }).norm();
  }

  log10(): HugeNum {
    return HugeNum.log10(this);
  }

  gt(value: Fields<HugeNum>): boolean {
    return HugeNum.gt(this, value);
  }

  add(value: Fields<HugeNum>): HugeNum {
    const c = this.clone();
    c.inc(value);
    return c;
  }

  sub(value: Fields<HugeNum>): HugeNum {
    const c = this.clone();
    c.dec(value);
    return c;
  }

  mul(value: Fields<HugeNum>): HugeNum {
    const c = this.clone();
    c.multiply(value);
    return c;
  }

  div(value: Fields<HugeNum>): HugeNum {
    const c = this.clone();
    c.divide(value);
    return c;
  }

  ceil(): HugeNum {
    const c = this.clone();
    if (c.depth !== 1n || c.exponent > HugeNum.DECS_N) {
      return this;
    }

    c.mantissa =
      ((c.mantissa * HugeNum.tenPow(c.exponent)) /
        HugeNum.ONE_N /
        HugeNum.ONE_N) *
      HugeNum.ONE_N;
    c.exponent = 0n;
    return c.norm();
  }

  withMantissa(mantissa: bigint | number): HugeNum {
    const c = this.clone();
    c.mantissa = BigInt(mantissa);
    return c.norm();
  }

  withDepth(depth: bigint | number): HugeNum {
    const c = this.clone();
    c.depth = BigInt(depth);
    return c.norm();
  }

  withExponent(exponent: bigint | number): HugeNum {
    const c = this.clone();
    c.exponent = BigInt(exponent);
    return c.norm();
  }

  static decToNum(x: bigint): number {
    return (
      Number(x / 10n ** BigInt(HugeNum.DECS - HugeNum.READ_DECS)) /
      10 ** HugeNum.READ_DECS
    );
  }

  toNumber(max = 10000) {
    if (this.depth !== 1n) {
      return max;
    }
    const exp = HugeNum.decToNum(this.exponent);
    if (exp > Math.log10(max)) {
      return max;
    }

    return Math.min(HugeNum.decToNum(this.mantissa) * 10 ** exp, max);
  }

  static encodeDecimal(val: bigint, decsLess = 0, placeHold = false): string {
    const bDecimals = BigInt(this.DECS);
    const decimalRaw = (val % 10n ** bDecimals)
      .toString()
      .padStart(this.DECS, "0")
      .slice(0, Math.max(this.READ_DECS - decsLess, 0))
      .replace(/0*$/i, "");
    const decimal = placeHold
      ? decimalRaw.padEnd(Math.max(this.READ_DECS - decsLess, 0), "0")
      : decimalRaw;

    if (decimal === "") {
      return (val / 10n ** bDecimals).toString();
    }

    return `${val / 10n ** bDecimals}.${decimal}`;
  }

  toString(): string {
    if (this.depth === 1n) {
      if (this.exponent < HugeNum.MAX_EXP_EXP_N) {
        return HugeNum.encodeDecimal(
          (this.mantissa * HugeNum.tenPow(this.exponent)) / HugeNum.ONE_N
        );
      }
      const exp = HugeNum.encodeDecimal(this.exponent);
      return `${HugeNum.encodeDecimal(this.mantissa, exp.length, true)}e${exp}`;
    }

    return `${Array.from(new Array(Number(this.depth)), () => "e").join(
      ""
    )}${HugeNum.encodeDecimal(this.exponent)}`;
  }

  visualScale(): { depth: number; n: number } {
    if (this.depth === 1n) {
      if (this.exponent < HugeNum.MAX_EXP_EXP_N) {
        return {
          depth: 0,
          n: HugeNum.decToNum(
            (this.mantissa * HugeNum.tenPow(this.exponent)) / HugeNum.ONE_N
          ),
        };
      }
      return {
        depth: 1,
        n: HugeNum.decToNum(this.exponent + HugeNum.log10Int(this.mantissa)),
      };
    }

    return { depth: Number(this.depth), n: HugeNum.decToNum(this.exponent) };
  }
}
