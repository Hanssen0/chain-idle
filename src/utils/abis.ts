//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// game
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const gameAbi = [
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  { type: 'error', inputs: [], name: 'BadRequest' },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1967InvalidImplementation',
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'InsufficientIdeas' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'UUPSUnauthorizedCallContext' },
  {
    type: 'error',
    inputs: [{ name: 'slot', internalType: 'bytes32', type: 'bytes32' }],
    name: 'UUPSUnsupportedProxiableUUID',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'player', internalType: 'address', type: 'address' }],
    name: 'getPlayer',
    outputs: [
      {
        name: '',
        internalType: 'struct PlayerStatus',
        type: 'tuple',
        components: [
          { name: 'lastTimestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'stage', internalType: 'uint256', type: 'uint256' },
          {
            name: 'blocks',
            internalType: 'struct HugeNum',
            type: 'tuple',
            components: [
              { name: 'mantissa', internalType: 'int256', type: 'int256' },
              { name: 'depth', internalType: 'int256', type: 'int256' },
              { name: 'exponent', internalType: 'int256', type: 'int256' },
            ],
          },
          {
            name: 'ideas',
            internalType: 'struct HugeNum',
            type: 'tuple',
            components: [
              { name: 'mantissa', internalType: 'int256', type: 'int256' },
              { name: 'depth', internalType: 'int256', type: 'int256' },
              { name: 'exponent', internalType: 'int256', type: 'int256' },
            ],
          },
          { name: 'dt', internalType: 'uint256', type: 'uint256' },
          { name: 'xLevel', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'blocksReq',
        internalType: 'struct HugeNum',
        type: 'tuple',
        components: [
          { name: 'mantissa', internalType: 'int256', type: 'int256' },
          { name: 'depth', internalType: 'int256', type: 'int256' },
          { name: 'exponent', internalType: 'int256', type: 'int256' },
        ],
      },
    ],
    name: 'initPlayer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'playersStatus',
    outputs: [
      { name: 'lastTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: 'stage', internalType: 'uint256', type: 'uint256' },
      {
        name: 'blocks',
        internalType: 'struct HugeNum',
        type: 'tuple',
        components: [
          { name: 'mantissa', internalType: 'int256', type: 'int256' },
          { name: 'depth', internalType: 'int256', type: 'int256' },
          { name: 'exponent', internalType: 'int256', type: 'int256' },
        ],
      },
      {
        name: 'ideas',
        internalType: 'struct HugeNum',
        type: 'tuple',
        components: [
          { name: 'mantissa', internalType: 'int256', type: 'int256' },
          { name: 'depth', internalType: 'int256', type: 'int256' },
          { name: 'exponent', internalType: 'int256', type: 'int256' },
        ],
      },
      { name: 'dt', internalType: 'uint256', type: 'uint256' },
      { name: 'xLevel', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'purchaseX',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'updateBlocks',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const
