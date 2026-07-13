import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toast } from "../utils/toast";
import { ArrowDown } from "lucide-react";
import { useMessages } from "../context/MessageContext";
import { getProfileInitial } from "../utils/profileImage";
import "../styles/MessageInbox.css";

function MessageInbox({ page = false }) {
  const {
    conversations,
    messages,
    connected,
    openConversation,
    closeConversation,
    sendMessage,
  } = useMessages();

  const [selectedId, setSelectedId] = useState(null);
  const [content, setContent] = useState("");
  const [conversationLoadVersion, setConversationLoadVersion] = useState(0);
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);
  const messagesContainerRef = useRef(null);
  const isNearBottomRef = useRef(true);
  const previousMessageCountRef = useRef(0);
  const previousConversationIdRef = useRef(null);
  const forceScrollAfterSendRef = useRef(false);

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );
  const isAlumni = currentUser?.role === "ALUMNI";

  const selectedConversation = conversations.find(
    (conversation) =>
      conversation.mentorshipId === selectedId
  );

  const selectedMessages = useMemo(
    () => messages[selectedId] || [],
    [messages, selectedId]
  );

  const selectConversation = async (mentorshipId) => {
    setSelectedId(mentorshipId);
    setShowScrollToLatest(false);
    isNearBottomRef.current = true;
    previousMessageCountRef.current = 0;
    previousConversationIdRef.current = mentorshipId;

    try {
      await openConversation(mentorshipId);
      setConversationLoadVersion((version) => version + 1);
    } catch (error) {
      console.error("Failed to open conversation", error);
    }
  };

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      selectConversation(conversations[0].mentorshipId);
    }
  }, [conversations, selectedId]);

  const scrollToLatest = (behavior = "smooth") => {
    const element = messagesContainerRef.current;

    if (!element) {
      return;
    }

    element.scrollTo({
      top: element.scrollHeight,
      behavior,
    });

    isNearBottomRef.current = true;
    setShowScrollToLatest(false);
  };

  useEffect(() => {
    const element = messagesContainerRef.current;

    if (!element) {
      return undefined;
    }

    const handleMessagesScroll = () => {
      const distanceFromBottom =
        element.scrollHeight - element.scrollTop - element.clientHeight;

      isNearBottomRef.current = distanceFromBottom < 100;

      if (isNearBottomRef.current) {
        setShowScrollToLatest(false);
      }
    };

    element.addEventListener("scroll", handleMessagesScroll, {
      passive: true,
    });

    handleMessagesScroll();

    return () => {
      element.removeEventListener("scroll", handleMessagesScroll);
    };
  }, [selectedId]);

  useLayoutEffect(() => {
    if (!selectedId) {
      return;
    }

    const conversationChanged =
      previousConversationIdRef.current !== selectedId;
    const messageCountIncreased =
      selectedMessages.length > previousMessageCountRef.current;

    if (conversationChanged) {
      previousConversationIdRef.current = selectedId;
      previousMessageCountRef.current = selectedMessages.length;
      scrollToLatest("auto");
      return;
    }

    if (!messageCountIncreased) {
      previousMessageCountRef.current = selectedMessages.length;
      return;
    }

    const latestMessage = selectedMessages[selectedMessages.length - 1];
    const sentByCurrentUser =
      latestMessage?.senderUserId === currentUser?.userId;

    if (
      forceScrollAfterSendRef.current ||
      sentByCurrentUser ||
      isNearBottomRef.current
    ) {
      scrollToLatest("smooth");
    } else {
      setShowScrollToLatest(true);
    }

    forceScrollAfterSendRef.current = false;
    previousMessageCountRef.current = selectedMessages.length;
  }, [selectedId, selectedMessages, currentUser?.userId]);

  useLayoutEffect(() => {
    if (!selectedId || conversationLoadVersion === 0) {
      return;
    }

    previousMessageCountRef.current = selectedMessages.length;
    scrollToLatest("auto");
  }, [conversationLoadVersion, selectedId]);

  useEffect(() => {
    return () => closeConversation();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const message = content.trim();

    if (!message || !selectedId || !connected) {
      return;
    }

    try {
      forceScrollAfterSendRef.current = true;
      sendMessage(selectedId, message);
      setContent("");
      scrollToLatest("smooth");
    } catch {
      forceScrollAfterSendRef.current = false;
      toast("Unable to send message");
    }
  };

  if (conversations.length === 0) {
    return (
      <section className={page ? "message-inbox empty page" : "message-inbox empty"}>
        <h2>Private Messages</h2>
        <p>
          {isAlumni
            ? "You do not have any accepted student mentees yet. Private chat will appear after you accept a mentorship request."
            : "You do not have an accepted alumni mentor yet. Private chat will appear after an alumni accepts your mentorship request."}
        </p>
      </section>
    );
  }

  return (
    <section className={page ? "message-inbox page" : "message-inbox"}>
      <aside className="message-conversations">
        <div className="message-title">
          <h2>Private Messages</h2>
          <span>
            {connected ? "Online" : "Connecting..."}
          </span>
        </div>

        {conversations.map((conversation) => (
          <button
            key={conversation.mentorshipId}
            className={
              selectedId === conversation.mentorshipId
                ? "conversation active"
                : "conversation"
            }
            onClick={() =>
              selectConversation(
                conversation.mentorshipId
              )
            }
          >
            <div className="conversation-avatar">
              {getProfileInitial(conversation.otherPersonName, "U")}
            </div>

            <div className="conversation-info">
              <strong>
                {conversation.otherPersonName}
              </strong>

              <span>
                {conversation.latestMessage ||
                  "Start a conversation"}
              </span>
            </div>

            {conversation.unreadCount > 0 && (
              <span className="unread-count">
                {conversation.unreadCount}
              </span>
            )}
          </button>
        ))}
      </aside>

      <div className="message-chat">
        <header className="message-chat-header">
          <h3>
            {selectedConversation?.otherPersonName}
          </h3>

          <span>
            {selectedConversation?.otherPersonRole}
          </span>
        </header>

        <div className="message-list-wrap">
          <div className="message-list" ref={messagesContainerRef}>
          {selectedMessages.length === 0 && (
            <p className="no-messages">
              No messages yet.
            </p>
          )}

          {selectedMessages.map((message) => {
            const mine =
              message.senderUserId ===
              currentUser?.userId;

            return (
              <div
                key={message.id}
                className={
                  mine
                    ? "message-row mine"
                    : "message-row theirs"
                }
              >
                <div className="message-bubble">
                  <p>{message.content}</p>
                  <small>
                    {new Date(
                      message.sentAt
                    ).toLocaleString()}
                  </small>
                </div>
              </div>
            );
          })}

          </div>

          {showScrollToLatest && (
            <button
              type="button"
              className="scroll-to-latest"
              onClick={() => scrollToLatest("smooth")}
              aria-label="Scroll to latest message"
            >
              <ArrowDown size={16} />
              Latest messages
            </button>
          )}
        </div>

        <form
          className="message-form"
          onSubmit={handleSubmit}
        >
          <input
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            maxLength={2000}
            placeholder="Type a private message..."
          />

          <button
            disabled={!connected || !content.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}

export default MessageInbox;
