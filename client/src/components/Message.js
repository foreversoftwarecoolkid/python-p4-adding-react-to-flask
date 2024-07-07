import React, { useState } from "react";
import EditMessage from "./EditMessage";

function Message({ message, currentUser, onMessageDelete, onUpdateMessage }) {
  const [isEditing, setIsEditing] = useState(false);

  const { id, username, body, created_at: createdAt } = message;

  const timestamp = new Date(createdAt).toLocaleTimeString();

  const isCurrentUser = currentUser.username === username;

  function handleDeleteClick() {
    // Optimistically update the UI
    onMessageDelete(id);

    fetch(`http://127.0.0.1:5555/messages/${id}`, {
      method: "DELETE",
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to delete the message");
      }
    })
    .catch(error => {
      console.error("Error deleting message:", error);
      // Optionally revert the UI update if deletion fails
    });
  }

  function handleUpdateMessage(updatedMessage) {
    setIsEditing(false);
    onUpdateMessage(updatedMessage);
  }

  return (
    <li>
      <span className="user">{username}</span>
      <span className="time">{timestamp}</span>
      {isEditing ? (
        <EditMessage
          id={id}
          body={body}
          onUpdateMessage={handleUpdateMessage}
        />
      ) : (
        <p>{body}</p>
      )}
      {isCurrentUser && (
        <div className="actions">
          <button onClick={() => setIsEditing((isEditing) => !isEditing)}>
            <span role="img" aria-label="edit">
              ✏️
            </span>
          </button>
          <button onClick={handleDeleteClick}>
            <span role="img" aria-label="delete">
              🗑
            </span>
          </button>
        </div>
      )}
    </li>
  );
}

export default Message;
