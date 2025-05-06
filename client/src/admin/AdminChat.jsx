// admin.jsx (Beginner-Friendly Version)

// Import necessary tools from React
import React, { useEffect, useState, useRef, useCallback } from "react";

// Import the Socket.IO client library
import { io } from "socket.io-client";

// Import styles (assuming you have AdminChat.module.css)
import styles from "./AdminChat.module.css";

// Define the address of your Socket.IO server
const SERVER_URL = "http://localhost:5000"; // Make sure this matches your server!

// --- The AdminChat Component ---
const AdminChat = () => {
  // --- State Variables ---

  // Holds all the chat conversations, grouped by user ID.
  // Structure: {
  //   'userId123': { name: 'John Doe', messages: [ {id: 1, senderType: 'User', ...}, ... ] },
  //   'userId456': { name: 'Jane Smith', messages: [ ... ] }
  // }
  const [chats, setChats] = useState({});

  // Holds the ID of the user the admin is currently viewing/chatting with
  const [selectedUserId, setSelectedUserId] = useState(null); // null means no user selected

  // Holds the text typed in the admin's reply input field
  const [input, setInput] = useState("");

  // Tracks if the admin's socket is connected to the server
  const [isConnected, setIsConnected] = useState(false);

  // --- Socket Reference ---
  // Use useRef to keep track of the single socket connection object
  const socketRef = useRef(null);

  // --- Function to Add a Message to a Specific User's Chat ---
  // useCallback memoizes this function for optimization (used in useEffect).
  const addMessageToChat = useCallback((userId, userName, messageData) => {
    // Use the functional update form of setChats to ensure we work with the latest state
    setChats(prevChats => {
      // Get the current chat data for this specific user, or create a default entry if it's a new user
      const currentUserChat = prevChats[userId] || {
        name: userName || `User ${userId.substring(0, 6)}`, // Use provided name or a default
        messages: [] // Start with an empty message list if new
      };

      // Create the new message object with a unique ID and proper timestamp
      const newMessage = {
        ...messageData,
        id: Date.now() + Math.random(),
        timestamp: new Date(messageData.timestamp || Date.now())
      };

      // Create the updated chat data for this user
      const updatedUserChat = {
        ...currentUserChat, // Keep existing properties (like name, unless updated)
        // Update name if a new one was provided and it's different
        name: (userName && currentUserChat.name !== userName) ? userName : currentUserChat.name,
        // Create a *new* messages array with the new message added
        messages: [...currentUserChat.messages, newMessage]
      };

      // Return the *new* overall chats state object
      return {
        ...prevChats, // Copy all other user chats from the previous state
        [userId]: updatedUserChat // Overwrite the entry for the current user with the updated data
      };
    });
  }, []); // Empty array [] means this function is created once

  // --- Effect: Connect Socket and Setup Listeners ---
  // Runs once after the initial render to set up the admin's connection.
  useEffect(() => {
    console.log("Admin Effect: Setting up socket connection...");

    // 1. Avoid multiple connections
    if (socketRef.current) {
      console.log("Admin Effect: Socket connection already exists.");
      return;
    }

    // 2. Create the Socket Connection
    // Admin connects (usually doesn't need a token *to connect*, maybe for specific actions later)
    console.log("Admin Effect: Attempting to connect admin socket...");
    socketRef.current = io(SERVER_URL, {
      reconnectionAttempts: 3,
    });

    const socket = socketRef.current; // Local variable for easier access

    // --- 3. Setup Socket Event Listeners ---

    // 'connect': Runs when successfully connected.
    socket.on("connect", () => {
      console.log("Admin Effect: ✅ Admin Socket connected! ID:", socket.id);
      setIsConnected(true); // Update state
      // *** IMPORTANT: Tell the server this connection is the Admin ***
      socket.emit("joinAdmin"); // Server will put this socket in 'admin_room'
    });

    // 'disconnect': Runs when connection is lost.
    socket.on("disconnect", (reason) => {
      console.log("Admin Effect: ❌ Admin Socket disconnected:", reason);
      setIsConnected(false); // Update state
      setSelectedUserId(null); // Deselect user if disconnected
      // Maybe show a message in the UI indicating disconnection
    });

    // 'connect_error': Runs if connection fails.
    socket.on("connect_error", (err) => {
      console.error("Admin Effect: Admin Socket Connection Error:", err.message);
      setIsConnected(false); // Update state
      // Maybe show a persistent error in the UI
    });

    // 'receiveUserMessage': Runs when the server forwards a message *from* a user.
    // 'data' contains { senderId, senderName, message, timestamp }
    socket.on("receiveUserMessage", (data) => {
      console.log("Admin Effect: Received user message:", data);
      // Ensure the message has the necessary sender ID
      if (data.senderId) {
        // Add the message to the correct user's chat history in our state
        addMessageToChat(data.senderId, data.senderName, {
          senderType: 'User', // Mark that this message came from a user
          message: data.message,
          timestamp: data.timestamp
        });
        // Optional: Add a notification for new messages here
      } else {
        console.warn("Admin Effect: Received user message without senderId:", data);
      }
    });

    // --- 4. Cleanup Logic ---
    // Runs when the component unmounts or the effect re-runs (though this one runs only once).
    return () => {
      console.log("Admin Effect: Cleaning up admin socket effect...");
      if (socketRef.current) {
        console.log("Admin Effect: Disconnecting admin socket and removing listeners.");
        // Remove listeners
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("connect_error");
        socketRef.current.off("receiveUserMessage");
        // Disconnect
        socketRef.current.disconnect();
        socketRef.current = null; // Reset ref
      }
      setIsConnected(false); // Reset state
    };
  // `addMessageToChat` is included as a dependency because it's used inside the effect.
  }, [addMessageToChat]);

  // --- Function to Send Admin's Reply ---
  const sendMessage = () => {
    console.log("ADMIN SEND: sendMessage function called");
    // Checks: A user must be selected, input not empty, socket exists, connected.
    if (selectedUserId && input.trim() && socketRef.current && isConnected) {

      // 1. Prepare data to send to server
      const messageData = {
        toUserId: selectedUserId, // Tell server *which* user to send to
        message: input.trim(),   // The message text
      };

      // 2. Emit 'adminMessage' event to server
      console.log("ADMIN SEND: Emitting 'adminMessage' to server:", messageData);
      socketRef.current.emit("adminMessage", messageData);

      // 3. Add admin's message locally *immediately* for quick UI feedback
      console.log("ADMIN SEND: Calling addMessageToChat locally for admin's own message");
      // We use the currently selected user ID and the known name from our 'chats' state
      addMessageToChat(selectedUserId, chats[selectedUserId]?.name || 'Unknown User', {
        senderType: 'Admin', // Mark message as from Admin
        message: input.trim(),
        timestamp: new Date()
      });

      // 4. Clear the input field
      setInput("");
    } else {
      console.warn("Admin cannot send message. Check selection, input, or connection.");
      if (!isConnected) alert("Cannot send: Admin not connected.");
      else if (!selectedUserId) alert("Please select a user to reply to.");
    }
  };

  // --- Input Change Handler ---
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // --- Send on Enter Key ---
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --- Select User Function ---
  // Updates the 'selectedUserId' state when admin clicks a user in the list.
  const selectUser = (userId) => {
    console.log("Selecting user:", userId);
    setSelectedUserId(userId);
    setInput(''); // Clear input field when switching conversations
  }

  // --- Render Logic ---
  // Decides what HTML to display.

  return (
    // Main container for the admin chat interface
    <div className={styles.container}>

      {/* Sidebar: List of users who have sent messages */}
      <div className={styles.sidebar}>
        <h3 className={styles.heading}>
          Users ({Object.keys(chats).length}) {/* Show number of users */}
          {isConnected ? '🟢' : '🔴'} {/* Show connection status indicator */}
        </h3>
        <ul className={styles.userList}>
          {/* Get the list of user IDs from the 'chats' state object */}
          {Object.keys(chats).map((userId) => (
            // For each userId, create a list item
            <li
              key={userId} // Unique key for React
              // Apply CSS classes: 'userItem' always, 'active' if this user is selected
              className={`${styles.userItem} ${
                userId === selectedUserId ? styles.active : ""
              }`}
              // When clicked, call selectUser with this userId
              onClick={() => selectUser(userId)}
            >
              {/* Display the user's name (or a default if name missing) */}
              {chats[userId]?.name || `User ${userId.substring(0, 6)}`}
              {/* TODO: Add visual indicator for unread messages here? */}
            </li>
          ))}
          {/* Show a message if no users have chatted yet */}
          {Object.keys(chats).length === 0 && <li className={styles.noUsers}>No active user chats</li>}
        </ul>
      </div>

      {/* Main Chat Area: Displays messages for the selected user */}
      <div className={styles.chatBox}>
        {/* Header showing who the admin is chatting with */}
        <h3 className={styles.heading}>
          Chat with: {selectedUserId ? (chats[selectedUserId]?.name || `User ${selectedUserId.substring(0, 6)}`) : "Select a user"}
        </h3>

        {/* Message display area */}
        <div className={styles.messages}>
          {/* Get the messages array for the selected user. Use empty array [] if no user selected or no messages yet. */}
          {(chats[selectedUserId]?.messages || []).map((msg) => (
            // Display each message for the selected user
            <div key={msg.id} className={styles.message}>
              {/* Show sender (Admin or User's name) */}
               <strong style={{ color: msg.senderType === 'Admin' ? 'darkblue' : 'black' }}>
                 {msg.senderType === 'Admin' ? 'Admin' : (chats[selectedUserId]?.name || 'User')}:
               </strong>
               {' '} {/* Space */}
               {/* Show message text */}
               {msg.message}{" "}
               {/* Show timestamp */}
               <span className={styles.time}>
                 {msg.timestamp.toLocaleTimeString()}
               </span>
            </div>
          ))}
          {/* Show placeholder text if no user is selected */}
          {!selectedUserId && <div className={styles.noSelection}>Please select a user from the left to view chat.</div>}
          {/* Show placeholder text if user selected but no messages */}
          {selectedUserId && (!chats[selectedUserId] || chats[selectedUserId].messages.length === 0) && <div className={styles.noSelection}>No messages yet for this user.</div>}
        </div>

        {/* Input Area: Only show if a user is selected and admin is connected */}
        {selectedUserId && isConnected && (
          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.input}
              value={input} // Controlled input
              onChange={handleInputChange} // Update state on typing
              onKeyDown={handleKeyDown} // Handle Enter key
              placeholder="Type message..."
              disabled={!isConnected} // Disable if not connected
            />
            <button
                className={styles.sendButton}
                onClick={sendMessage} // Send message on click
                disabled={!isConnected || !input.trim()} // Disable if needed
             >
              Send Reply
            </button>
          </div>
        )}
        {/* Show a warning if the admin socket is disconnected */}
         {!isConnected && <div className={styles.disconnectedWarning}>Admin chat disconnected. Please refresh or check server.</div>}
      </div>
    </div>
  );
};

// Export the component
export default AdminChat;