export enum ServiceWorkerStatus {
  Unknown = 0,
  Initialized,
  Pending,
  Activated,
  Updated,
}

const STATUS_KEY = "chainIdleServiceWorkerStatus";
const PREV_STATUS = Number(localStorage.getItem(STATUS_KEY));
let STATUS = ServiceWorkerStatus.Unknown;

let LISTENERS: { handler: () => void; status: ServiceWorkerStatus }[] = [];

function statusEq(want: ServiceWorkerStatus, received: ServiceWorkerStatus) {
  return (
    (want === ServiceWorkerStatus.Updated &&
      received === ServiceWorkerStatus.Activated &&
      PREV_STATUS === ServiceWorkerStatus.Pending) ||
    want === received
  );
}

function onSW(status: ServiceWorkerStatus) {
  STATUS = status;
  localStorage.setItem(STATUS_KEY, status.toString());

  LISTENERS = LISTENERS.filter((h) => {
    if (statusEq(h.status, status)) {
      h.handler();
      return false;
    }
    return true;
  });
}

export const registrationConfig = {
  onInitialized: () => onSW(ServiceWorkerStatus.Initialized),
  onPending: () => onSW(ServiceWorkerStatus.Pending),
  onActivated: () => onSW(ServiceWorkerStatus.Activated),
};

export function onceSW(status: ServiceWorkerStatus, handler: () => void) {
  if (statusEq(status, STATUS)) {
    handler();
    return;
  }

  LISTENERS.push({ handler, status });
}
