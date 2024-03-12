const GAME_ADDRESS: `0x${string}` = "0x52F2db2D0fe58559F185B883cfF668039b057035";
const APP_NAME = "Chain Idle";
const APP_DESCRIPTION = "An on-chain game about the chain";
const APP_URL = "https://chain-idle.vercel.app/";
const APP_ICONS: string[] = [];
const WALLET_CONNECT_PROJECT_ID = "b6f6753d232556c819d9508e540f471e";

export function gameAddress(): `0x${string}` {
  return GAME_ADDRESS;
}
export function appName() {
  return APP_NAME;
}
export function appDescription() {
  return APP_DESCRIPTION;
}
export function appURL() {
  return APP_URL;
}
export function appIcons() {
  return APP_ICONS;
}
export function walletConnectProjectId() {
  return WALLET_CONNECT_PROJECT_ID;
}
