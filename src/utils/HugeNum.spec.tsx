import { HugeNum } from "./HugeNum";

describe("HugeNum", () => {
  test("toSci", () => {
    expect(HugeNum.toSci(HugeNum.inDecs(1n))[1]).toBe(HugeNum.inDecs(0n));
    expect(HugeNum.toSci(HugeNum.inDecs(10n))[1]).toBe(HugeNum.inDecs(1n));
    expect(HugeNum.toSci(HugeNum.inDecs(1000n))[1]).toBe(HugeNum.inDecs(3n));
  });

  test("logInt", () => {
    expect(
      HugeNum.lnInt(HugeNum.decInDecs(2718281828459045235n, 18)) -
        HugeNum.inDecs(1n)
    ).toBeGreaterThan(HugeNum.decInDecs(-1n, 8));
    expect(
      HugeNum.log10Int(HugeNum.inDecs(10n)) - HugeNum.inDecs(1n)
    ).toBeGreaterThan(HugeNum.decInDecs(-1n, 8));
  });

  test("expSub", () => {
    expect(
      HugeNum.expSub(
        { depth: 1n, exponent: HugeNum.inDecs(20n) },
        { depth: 1n, exponent: HugeNum.inDecs(20n) }
      )
    ).toBe(HugeNum.inDecs(0n));
    expect(
      HugeNum.expSub(
        { depth: 1n, exponent: HugeNum.inDecs(20n) },
        { depth: 1n, exponent: HugeNum.inDecs(22n) }
      )
    ).toBe(HugeNum.inDecs(-2n));
    expect(
      HugeNum.expSub(
        { depth: 1n, exponent: HugeNum.inDecs(20n) },
        { depth: 1n, exponent: HugeNum.inDecs(18n) }
      )
    ).toBe(HugeNum.inDecs(2n));
    expect(
      HugeNum.expSub(
        { depth: 2n, exponent: HugeNum.inDecs(20n) },
        { depth: 1n, exponent: HugeNum.inDecs(20n) }
      )
    ).toBe(HugeNum.PREC_EXP_N);
    expect(
      HugeNum.expSub(
        { depth: 1n, exponent: HugeNum.inDecs(20n) },
        { depth: 2n, exponent: HugeNum.inDecs(20n) }
      )
    ).toBe(HugeNum.NEG_PREC_EXP_N);
    expect(
      HugeNum.expSub(
        { depth: 2n, exponent: HugeNum.inDecs(2n) },
        { depth: 1n, exponent: HugeNum.inDecs(110n) }
      )
    ).toBe(HugeNum.inDecs(-10n));
    expect(
      HugeNum.expSub(
        { depth: 1n, exponent: HugeNum.inDecs(110n) },
        { depth: 2n, exponent: HugeNum.inDecs(2n) }
      )
    ).toBe(HugeNum.inDecs(10n));
    expect(
      HugeNum.expSub(
        { depth: 3n, exponent: HugeNum.inDecs(0n) },
        { depth: 1n, exponent: HugeNum.inDecs(110n) }
      )
    ).toBe(HugeNum.PREC_EXP_N);
    expect(
      HugeNum.expSub(
        { depth: 1n, exponent: HugeNum.inDecs(110n) },
        { depth: 3n, exponent: HugeNum.inDecs(0n) }
      )
    ).toBe(HugeNum.NEG_PREC_EXP_N);
  });

  test("norm", () => {
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(10n),
        depth: 1n,
        exponent: HugeNum.inDecs(10n),
      }).norm()
    ).toMatchObject({
      mantissa: HugeNum.inDecs(1n),
      depth: 1n,
      exponent: HugeNum.inDecs(11n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1000n),
        depth: 1n,
        exponent: HugeNum.inDecs(10n),
      }).norm()
    ).toMatchObject({
      mantissa: HugeNum.inDecs(1n),
      depth: 1n,
      exponent: HugeNum.inDecs(13n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1000n),
        depth: 2n,
        exponent: HugeNum.inDecs(10n),
      }).norm()
    ).toMatchObject({
      mantissa: HugeNum.inDecs(1n),
      depth: 2n,
      exponent: HugeNum.log10Int(HugeNum.inDecs(10n ** 10n + 3n)),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1000n),
        depth: 1n,
        exponent: HugeNum.inDecs(10n),
      }).norm()
    ).toMatchObject({
      mantissa: HugeNum.inDecs(1n),
      depth: 1n,
      exponent: HugeNum.inDecs(13n),
    });
  });

  test("log10", () => {
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(9n),
        depth: 1n,
        exponent: HugeNum.inDecs(10n),
      }).log10()
    ).toMatchObject({
      mantissa: (HugeNum.inDecs(10n) + HugeNum.log10Int(HugeNum.inDecs(9n))) / 10n,
      depth: 1n,
      exponent: HugeNum.inDecs(1n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(9n),
        depth: 2n,
        exponent: HugeNum.inDecs(10n),
      }).log10()
    ).toMatchObject({
      mantissa: (HugeNum.inDecs(10n ** 10n) + HugeNum.log10Int(HugeNum.inDecs(9n))) / 10n ** 10n,
      depth: 1n,
      exponent: HugeNum.inDecs(10n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(9n),
        depth: 3n,
        exponent: HugeNum.inDecs(10n),
      }).log10()
    ).toMatchObject({
      mantissa: HugeNum.ONE_N,
      depth: 2n,
      exponent: HugeNum.inDecs(10n),
    });
  });

  test("gt", () => {
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 1n,
        exponent: HugeNum.inDecs(0n),
      }).gt(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(0n),
        })
      )
    ).toBe(false);
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(2n),
        depth: 1n,
        exponent: HugeNum.inDecs(0n),
      }).gt(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(0n),
        })
      )
    ).toBe(true);
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(2n),
        depth: 1n,
        exponent: HugeNum.inDecs(0n),
      }).gt(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 2n,
          exponent: HugeNum.inDecs(0n),
        })
      )
    ).toBe(false);
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(2n),
        depth: 1n,
        exponent: HugeNum.inDecs(0n),
      }).gt(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(1000n),
        })
      )
    ).toBe(false);
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 1n,
        exponent: HugeNum.inDecs(1000n),
      }).gt(
        new HugeNum({
          mantissa: HugeNum.inDecs(2n),
          depth: 1n,
          exponent: HugeNum.inDecs(0n),
        })
      )
    ).toBe(true);
  });

  test("add", () => {
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 1n,
        exponent: HugeNum.inDecs(0n),
      }).add(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(0n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.inDecs(2n),
      depth: 1n,
      exponent: HugeNum.inDecs(0n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 3n,
        exponent: HugeNum.inDecs(0n),
      }).add(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(0n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.inDecs(1n),
      depth: 3n,
      exponent: HugeNum.inDecs(0n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 1n,
        exponent: HugeNum.inDecs(0n),
      }).add(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 3n,
          exponent: HugeNum.inDecs(0n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.inDecs(1n),
      depth: 3n,
      exponent: HugeNum.inDecs(0n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 1n,
        exponent: HugeNum.inDecs(1n),
      }).add(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(0n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.decInDecs(11n, 1),
      depth: 1n,
      exponent: HugeNum.inDecs(1n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 1n,
        exponent: HugeNum.inDecs(0n),
      }).add(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(1n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.decInDecs(11n, 1),
      depth: 1n,
      exponent: HugeNum.inDecs(1n),
    });
  });

  test("sub", () => {
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 1n,
        exponent: HugeNum.inDecs(0n),
      }).sub(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(0n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.inDecs(0n),
      depth: 1n,
      exponent: HugeNum.inDecs(0n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 3n,
        exponent: HugeNum.inDecs(0n),
      }).sub(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(0n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.inDecs(1n),
      depth: 3n,
      exponent: HugeNum.inDecs(0n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 1n,
        exponent: HugeNum.inDecs(0n),
      }).sub(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 3n,
          exponent: HugeNum.inDecs(0n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.inDecs(-1n),
      depth: 3n,
      exponent: HugeNum.inDecs(0n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 1n,
        exponent: HugeNum.inDecs(1n),
      }).sub(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(0n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.inDecs(9n),
      depth: 1n,
      exponent: HugeNum.inDecs(0n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 1n,
        exponent: HugeNum.inDecs(0n),
      }).sub(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(1n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.inDecs(-9n),
      depth: 1n,
      exponent: HugeNum.inDecs(0n),
    });
  });

  test("mul", () => {
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 1n,
        exponent: HugeNum.inDecs(1n),
      }).mul(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(1n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.inDecs(1n),
      depth: 1n,
      exponent: HugeNum.inDecs(2n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(1n),
        depth: 2n,
        exponent: HugeNum.inDecs(1n),
      }).mul(
        new HugeNum({
          mantissa: HugeNum.inDecs(1n),
          depth: 1n,
          exponent: HugeNum.inDecs(1n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.inDecs(1n),
      depth: 1n,
      exponent: HugeNum.inDecs(11n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(9n),
        depth: 1n,
        exponent: HugeNum.inDecs(1n),
      }).mul(
        new HugeNum({
          mantissa: HugeNum.inDecs(9n),
          depth: 1n,
          exponent: HugeNum.inDecs(1n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.decInDecs(81n, 1),
      depth: 1n,
      exponent: HugeNum.inDecs(3n),
    });
    expect(
      new HugeNum({
        mantissa: HugeNum.inDecs(9n),
        depth: 3n,
        exponent: HugeNum.inDecs(1n),
      }).mul(
        new HugeNum({
          mantissa: HugeNum.inDecs(9n),
          depth: 1n,
          exponent: HugeNum.inDecs(1n),
        })
      )
    ).toMatchObject({
      mantissa: HugeNum.decInDecs(81n, 1),
      depth: 2n,
      exponent: HugeNum.log10Int(HugeNum.inDecs(10n ** 10n + 2n)),
    });
  });
});
