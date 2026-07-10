import { Client } from "@stomp/stompjs";
import { WEBSOCKET_URL } from "../config/environment";

export function createChatClient({
  onMessage,
  onConnect,
  onError,
}) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token is missing");
  }

  const client = new Client({
    brokerURL: WEBSOCKET_URL,

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    debug: () => {},
  });

  client.onConnect = () => {
    client.subscribe(
      "/user/queue/private-messages",
      (stompMessage) => {
        const message = JSON.parse(stompMessage.body);
        onMessage?.(message);
      }
    );

    onConnect?.(client);
  };

  client.onStompError = (frame) => {
    console.error("STOMP error:", frame);
    onError?.(frame);
  };

  client.onWebSocketError = (error) => {
    console.error("WebSocket error:", error);
    onError?.(error);
  };

  client.activate();

  return client;
}

export function sendPrivateMessage(
  client,
  mentorshipId,
  content
) {
  if (!client?.connected) {
    throw new Error("WebSocket is not connected");
  }

  client.publish({
    destination: "/app/messages.send",
    body: JSON.stringify({
      mentorshipId,
      content,
    }),
  });
}