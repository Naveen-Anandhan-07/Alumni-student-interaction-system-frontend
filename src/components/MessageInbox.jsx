import { useEffect, useRef, useState } from "react";
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
  const bottomRef = useRef(null);

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );
  const isAlumni = currentUser?.role === "ALUMNI";

  const selectedConversation = conversations.find(
    (conversation) =>
      conversation.mentorshipId === selectedId
  );

  const selectedMessages =
    messages[selectedId] || [];

  const selectConversation = async (mentorshipId) => {
    setSelectedId(mentorshipId);

    try {
      await openConversation(mentorshipId);
    } catch (error) {
      console.error("Failed to open conversation", error);
    }
  };

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      selectConversation(conversations[0].mentorshipId);
    }
  }, [conversations, selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [selectedMessages]);

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
      sendMessage(selectedId, message);
      setContent("");
    } catch (error) {
      alert("Unable to send message");
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

        <div className="message-list">
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

          <div ref={bottomRef} />
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
