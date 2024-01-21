import { Fields } from "@/utils";
import { Box, Container, Slide, chakra } from "@chakra-ui/react";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FaXmark as FaXmarkRaw } from "react-icons/fa6";

const FaXmark = chakra(FaXmarkRaw);

export class Notification {
  readonly id: number;
  readonly content: ReactNode;
  readonly timeout: number;

  constructor({ id, content, timeout }: Fields<Notification>) {
    this.id = id;
    this.content = content;
    this.timeout = timeout;
  }
}

const NotificationContext = createContext<{
  notifications: Notification[];
  sendNotification: (n: Notification) => void;
  removeNotification: (id: number) => void;
}>({
  notifications: [],
  sendNotification: () => {},
  removeNotification: () => {},
});

let NOTIFICATIONS = 0;

function NotificationsContainer() {
  const [status, setStatus] = useState<number>(0);
  const {
    notifications: [notification],
    removeNotification,
  } = useContext(NotificationContext);

  useEffect(() => {
    if (notification && status === 0) {
      setStatus(1);
      setTimeout(() => setStatus(2), notification.timeout);
    }
  }, [status, notification, removeNotification]);

  if (!notification) {
    return undefined;
  }

  return (
    <Slide
      direction="bottom"
      in={status === 1}
      style={{ zIndex: 99999999 }}
      onAnimationEnd={() => {
        if (status === 2) {
          removeNotification(notification.id);
          setStatus(0);
        }
      }}
      onClick={() => {
        setStatus(2);
      }}
    >
      <Box
        textAlign="center"
        cursor="pointer"
        borderTopWidth={1}
        borderColor="chakra-border-color"
        background="chakra-body-bg"
        transition="background 0.3s ease-in-out"
        _hover={{
          _dark: {
            background: "gray.700",
          },
          _light: {
            background: "gray.100",
          },
        }}
        py={5}
      >
        <Container>{notification.content}</Container>
      </Box>
      <FaXmark
        position="absolute"
        right={4}
        top="50%"
        transform="translateY(-50%)"
        fill="chakra-placeholder-color"
        aria-label="Close mark"
      />
    </Slide>
  );
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const sendNotification = useCallback(
    (n: Notification) => setNotifications((ns) => [...ns, n]),
    []
  );
  const removeNotification = useCallback(
    (id: number) => setNotifications((ns) => ns.filter((n) => n.id !== id)),
    []
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        sendNotification,
        removeNotification,
      }}
    >
      {children}
      <NotificationsContainer />
    </NotificationContext.Provider>
  );
}

export function useSendNotification() {
  const { sendNotification } = useContext(NotificationContext);

  return useCallback(
    (n: Omit<Fields<Notification>, "id" | "timeout"> & { timeout?: number }) =>
      sendNotification(
        new Notification({
          ...n,
          id: NOTIFICATIONS++,
          timeout: n.timeout ?? 10000,
        })
      ),
    [sendNotification]
  );
}
