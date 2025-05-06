// userchat.jsx (Beginner-Friendly Version)

// Import necessary tools from React
// - useState: To manage component data that changes (like input fields, message lists)
// - useEffect: To handle "side effects" like connecting to servers, setting up listeners
// - useRef: To hold a value (like our socket connection) that persists even when the component re-renders
// - useCallback: To optimize functions that are passed to other hooks (like useEffect)
import React, { useEffect, useState, useRef, useCallback } from "react";

// Import the Socket.IO client library to connect to our server
import { io } from "socket.io-client";

// Import the JWT decoder to read our user ID from the token
import { jwtDecode } from "jwt-decode";

// Import styles (assuming you have UserChat.module.css)
import styles from "./UserChat.module.css";

// Define the address of your Socket.IO server
const SERVER_URL = "http://localhost:5000"; // Make sure this matches your server!

// --- The Chat Component ---
// This is the main function defining our User Chat component
const Chat = () => {
  // --- State Variables ---
  // State holds data that can change and cause the component to re-render.
  // We use useState to create state variables.

  // Holds the text currently typed in the message input field
  const [input, setInput] = useState("");
  // Holds the list of messages displayed in the chat window (an array)
  const [messages, setMessages] = useState([]);
  // Tracks if the socket is currently connected to the server (true/false)
  const [isConnected, setIsConnected] = useState(false);
  // Holds the user ID extracted from the JWT token (null initially)
  const [extractedUserId, setExtractedUserId] = useState(null);
  // Holds any error message we want to display to the user
  const [error, setError] = useState(null);

  // --- Socket Reference ---
  // useRef creates a "box" to hold a value that *doesn't* change on re-renders.
  // We use it to store our single socket connection object.
  const socketRef = useRef(null); // Starts as null (no connection yet)

  // --- Function to Add Messages ---
  // useCallback memoizes the function (makes React remember it) so it doesn't
  // get recreated on every render unless its dependencies change.
  // This helps optimize the useEffect hook that uses it later.
  const addMessage = useCallback((msgData) => {
    // Create a new message object with a unique ID (for React's list rendering)
    // and ensure the timestamp is a Date object.
    const message = {
      ...msgData, // Copy properties from incoming data (like senderType, message)
      id: Date.now() + Math.random(), // Simple unique key
      timestamp: new Date(msgData.timestamp || Date.now()) // Use provided time or now
    };
    // Update the 'messages' state array.
    // It takes the previous array (prev) and returns a *new* array
    // containing all previous messages plus the new one.
    // React requires returning new arrays/objects for state updates.
    setMessages((prev) => [...prev, message]);
  }, []); // Empty dependency array [] means this function is created once

  // --- Effect 1: Decode Token to Get User ID ---
  // useEffect runs code after the component renders.
  // This effect runs only once when the component first mounts (due to empty dependency array []).
  useEffect(() => {
    console.log("Effect 1: Trying to decode token...");

    // 1. Get the token from browser's local storage
    const token = localStorage.getItem("token");

    // 2. Check if token exists
    if (token) {
      try {
        // 3. Decode the token using jwtDecode
        const decoded = jwtDecode(token);

        // 4. Check if decoding worked and if the 'id' field exists in the token's data
        //    (Make sure your token *actually* has an 'id' field!)
        if (decoded && decoded.id) {
          // 5. Success! Store the extracted user ID in our state
          setExtractedUserId(decoded.id);
          setError(null); // Clear any previous errors
          console.log("Effect 1: User ID extracted successfully:", decoded.id);
        } else {
          // Token exists but doesn't contain the 'id' we need
          console.error("Effect 1: Token decoded, but 'id' claim missing.");
          setError("Invalid token structure.");
          setExtractedUserId(null); // Ensure userId is null if token is bad
        }
        // Optional: You could also check token expiry here: decoded.exp
      } catch (e) {
        // Handle cases where the token is malformed or invalid
        console.error("Effect 1: Error decoding token:", e);
        setError("Invalid token.");
        setExtractedUserId(null);
      }
    } else {
      // Token was not found in local storage
      console.error("Effect 1: No auth token found in localStorage.");
      setError("Authentication token not found. Please login again.");
      setExtractedUserId(null);
    }
  }, []); // Empty array [] means run only once after initial render

  // --- Effect 2: Connect Socket and Setup Listeners ---
  // This effect runs when extractedUserId or error changes.
  // It handles the actual connection and communication setup.
  useEffect(() => {
    console.log("Effect 2: Checking if ready to connect...");

    // 1. Pre-connection Checks:
    //    - Don't connect if we couldn't get a user ID.
    //    - Don't connect if there was an error decoding the token.
    if (!extractedUserId || error) {
      console.log("Effect 2: Not connecting. Need valid User ID and no errors.", { extractedUserId, error });
      // If there was an error, ensure any previous connection is closed.
      if (error && socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return; // Stop this effect here if checks fail
    }

    //    - Avoid creating multiple connections if one already exists in our ref.
    if (socketRef.current) {
      console.log("Effect 2: Socket connection already exists.");
      return; // Stop if already connected
    }

    // 2. Get Token (again, needed for connection auth)
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token missing when trying to connect.");
      return; // Should have been caught earlier, but safety first
    }

    // 3. Create the Socket Connection!
    console.log(`Effect 2: Attempting to connect socket for user: ${extractedUserId}`);
    // We pass the server URL and authentication token.
    // The 'auth' object is how we send data upon connection (like our token).
    socketRef.current = io(SERVER_URL, {
      auth: {
        token: token,
      },
      reconnectionAttempts: 3, // Optional: Try to reconnect 3 times if disconnected
    });

    // Store the current socket connection in a local variable for easier use
    const socket = socketRef.current;

    // --- 4. Setup Socket Event Listeners ---
    // These functions will run when specific events happen on the socket connection.

    // 'connect': Runs when the connection is successfully established.
    socket.on("connect", () => {
      console.log("Effect 2: ✅ Chat Socket connected! ID:", socket.id);
      setIsConnected(true); // Update state to show we're connected
      setError(null); // Clear connection errors on successful connect
      // *** Tell the server who we are by sending our user ID ***
      // We emit a 'joinUser' event with our extracted ID.
      socket.emit("joinUser", extractedUserId);
      addMessage({ senderType: 'System', message: 'Connected to chat.' });
    });

    // 'disconnect': Runs when the connection is lost.
    socket.on("disconnect", (reason) => {
      console.log("Effect 2: ❌ Chat Socket disconnected:", reason);
      setIsConnected(false); // Update state
      addMessage({ senderType: 'System', message: `Disconnected: ${reason}.` });
    });

    // 'connect_error': Runs if the initial connection attempt fails.
    socket.on("connect_error", (err) => {
      console.error("Effect 2: Chat Socket Connection Error:", err.message);
      setIsConnected(false); // Update state
      addMessage({ senderType: 'System', message: `Connection Error: ${err.message}.` });
      setError(`Connection Failed: ${err.message}`); // Show error
    });

    // 'receiveAdminMessage': Runs when the *server* sends us a message (from the admin).
    socket.on("receiveAdminMessage", (data) => { // 'data' contains { senderType: "Admin", message, timestamp }
      console.log("Effect 2: Received admin message:", data);
      addMessage(data); // Add the received message to our chat display
    });

    // 'authError': Custom event we defined on the server for token issues.
    socket.on("authError", (data) => {
      console.error("Effect 2: Chat Auth Error from server:", data.message);
      addMessage({ senderType: 'System', message: `Auth Error: ${data.message}` });
      setError(`Auth Error: ${data.message}`);
      socket.disconnect(); // Disconnect if the server says our token is bad
    });

    // --- 5. Cleanup Logic ---
    // This 'return' function inside useEffect runs when:
    //  - The component is unmounted (removed from the page)
    //  - The effect is about to re-run because its dependencies (extractedUserId, error) changed.
    // Its job is to clean up anything the effect set up (like listeners or connections).
    return () => {
      console.log("Effect 2: Cleaning up socket connection effect...");
      if (socketRef.current) {
        console.log("Effect 2: Disconnecting socket and removing listeners.");
        // Remove all the listeners we added to avoid memory leaks
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("connect_error");
        socketRef.current.off("receiveAdminMessage");
        socketRef.current.off("authError");
        // Disconnect the socket
        socketRef.current.disconnect();
        // Reset our ref variable
        socketRef.current = null;
      }
      setIsConnected(false); // Ensure connection status is false after cleanup
    };
    // Dependencies: This effect re-runs if `extractedUserId`, `error`, or `addMessage` changes.
    // `addMessage` is included because it's used inside the effect (best practice).
  }, [extractedUserId, error, addMessage]);

  // --- Function to Send a Message ---
  const sendMessage = () => {
    // Basic checks: message isn't empty, socket exists, we are connected, and we have a userId.
    if (input.trim() && socketRef.current && isConnected && extractedUserId) {

      // 1. Prepare the message data to send to the server
      const messageData = {
        message: input.trim(), // Send the trimmed message text
        // Note: We don't need to send userId here, the server gets it from the token in socket.handshake.auth
      };

      // 2. Emit the 'userMessage' event to the server with the data
      console.log("Sending user message:", messageData);
      socketRef.current.emit("userMessage", messageData);

      // 3. Add the message locally *immediately* so the user sees it sent.
      addMessage({
        senderType: "You", // Mark it as from "You"
        message: input.trim(),
        timestamp: new Date() // Use current time
      });

      // 4. Clear the input field
      setInput("");
    } else {
      // Log a warning if we can't send
      console.warn("Cannot send message. Check connection, input, or userId extraction.");
      if (!isConnected) addMessage({ senderType: 'System', message: 'Cannot send: Not connected.' });
      else if (!extractedUserId) addMessage({ senderType: 'System', message: 'Cannot send: User ID not available.' });
    }
  };

  // --- Input Change Handler ---
  // Updates the 'input' state whenever the user types in the input field.
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // --- Send on Enter Key ---
  // If the user presses Enter (and not Shift+Enter), send the message.
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a newline in the input
      sendMessage();
    }
  };

  // --- Render Logic ---
  // This part decides what HTML to show on the page.

  // Show error message if something went wrong (e.g., bad token)
  if (error) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.errorBox}>Error: {error} Please re-login or contact support.</div>
      </div>
    );
  }

  // Show loading message while waiting for user ID
  if (!extractedUserId && !error) {
     return <div className={styles.chatContainer}><div className={styles.loadingBox}>Initializing chat...</div></div>;
  }

  // --- Main Chat Interface ---
  return (
    <div className={styles.chatContainer}>
      {/* Header showing connection status */}
      <h3 className={styles.header}>Chat with Admin ({isConnected ? "Connected" : "Disconnected"})</h3>

      {/* Area where messages are displayed */}
      <div className={styles.messageBox}>
        {/* Loop through the 'messages' array and display each one */}
        {messages.map((msg) => (
          // Each message needs a unique 'key' prop for React
          <div key={msg.id} className={styles.message}>
             {/* Display the sender (Admin, You, or System) */}
            <strong style={{ color: msg.senderType === 'Admin' ? 'blue' : (msg.senderType === 'You' ? 'green' : 'gray')}}>
                 {msg.senderType === 'Admin' ? 'Admin' : (msg.senderType === 'You' ? 'You' : msg.senderType || 'System')}
             :</strong>
            {' '} {/* Add a space */}
             {/* Display the message text */}
            {msg.message}{" "}
            {/* Display the time the message was sent/received */}
            <span className={styles.time}>
                 {msg.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {/* Input area with text field and send button */}
      <div className={styles.inputContainer}>
        <input
          type="text" // Ensure it's a text input
          className={styles.input}
          value={input} // Controlled input: value comes from state
          onChange={handleInputChange} // Update state on change
          onKeyDown={handleKeyDown} // Handle Enter key press
          placeholder={isConnected ? "Type your message..." : "Connecting..."} // Placeholder text
          disabled={!isConnected || !extractedUserId} // Disable if not connected or no user ID
        />
        <button
            className={styles.sendButton}
            onClick={sendMessage} // Call sendMessage function on click
            disabled={!isConnected || !input.trim() || !extractedUserId} // Disable if needed
         >
          Send
        </button>
      </div>
    </div>
  );
};

// Export the component so it can be used in other parts of your application
export default Chat;