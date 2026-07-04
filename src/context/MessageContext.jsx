import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import api from "../services/api";
import {
  createChatClient,
  sendPrivateMessage,
} from "../services/chatSocket";

const MessageContext = createContext(null);

export function MessageProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [connected, setConnected] = useState(false);
  const [authVersion, setAuthVersion] = useState(0);

  const clientRef = useRef(null);
  const activeConversationRef = useRef(null);

  const sortConversations = (items) =>
    [...items].sort((first, second) => {
      if (!first.latestMessageTime) return 1;
      if (!second.latestMessageTime) return -1;

      return (
        new Date(second.latestMessageTime) -
        new Date(first.latestMessageTime)
      );
    });

  const loadConversations = async () => {
    const response = await api.get(
      "/messages/conversations"
    );

    setConversations(
      sortConversations(response.data || [])
    );
  };

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthVersion((version) => version + 1);
    };

    window.addEventListener(
      "auth-changed",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "auth-changed",
        handleAuthChange
      );
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      setConversations([]);
      setMessages({});
      setConnected(false);
      return;
    }

    const currentUser = JSON.parse(storedUser);

    loadConversations().catch(console.error);

    const client = createChatClient({
      onConnect: () => setConnected(true),

      onMessage: (message) => {
        setMessages((previous) => {
          const conversationMessages =
            previous[message.mentorshipId] || [];

          if (
            conversationMessages.some(
              (item) => item.id === message.id
            )
          ) {
            return previous;
          }

          return {
            ...previous,
            [message.mentorshipId]: [
              ...conversationMessages,
              message,
            ],
          };
        });

        const sentByCurrentUser =
          message.senderUserId === currentUser.userId;

        const conversationIsOpen =
          activeConversationRef.current ===
          message.mentorshipId;

        setConversations((previous) =>
          sortConversations(
            previous.map((conversation) =>
              conversation.mentorshipId ===
              message.mentorshipId
                ? {
                    ...conversation,
                    latestMessage: message.content,
                    latestMessageTime: message.sentAt,
                    unreadCount:
                      !sentByCurrentUser &&
                      !conversationIsOpen
                        ? conversation.unreadCount + 1
                        : conversation.unreadCount,
                  }
                : conversation
            )
          )
        );

        if (!sentByCurrentUser && conversationIsOpen) {
          api
            .put(
              `/messages/mentorship/${message.mentorshipId}/read`
            )
            .catch(console.error);
        }
      },

      onError: () => setConnected(false),
    });

    clientRef.current = client;

    return () => {
      activeConversationRef.current = null;
      setConnected(false);
      client.deactivate();
      clientRef.current = null;
    };
  }, [authVersion]);

  const openConversation = async (mentorshipId) => {
    activeConversationRef.current = mentorshipId;

    const response = await api.get(
      `/messages/mentorship/${mentorshipId}`
    );

    setMessages((previous) => ({
      ...previous,
      [mentorshipId]: response.data || [],
    }));

    await api.put(
      `/messages/mentorship/${mentorshipId}/read`
    );

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.mentorshipId === mentorshipId
          ? { ...conversation, unreadCount: 0 }
          : conversation
      )
    );
  };

  const closeConversation = () => {
    activeConversationRef.current = null;
  };

  const sendMessage = (mentorshipId, content) => {
    sendPrivateMessage(
      clientRef.current,
      mentorshipId,
      content
    );
  };

  return (
    <MessageContext.Provider
      value={{
        conversations,
        messages,
        connected,
        openConversation,
        closeConversation,
        sendMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error(
      "useMessages must be used inside MessageProvider"
    );
  }

  return context;
}