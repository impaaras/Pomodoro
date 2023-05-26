import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../Firebase";
import { Button, Input } from "antd";
import { useParams } from "react-router-dom";

const Chat = () => {
  const [users, setUsers] = useState([]);

  const [messages, setMessages] = useState([]);

  const workspaceId = useParams();
  const [messageInput, setMessageInput] = useState("");

  const chatsCollectionRef = collection(
    db,
    "workspaces",
    workspaceId.toString(),
    "chats"
  );

  // Function to add a new chat message
  const sendMessage = async () => {
    if (messageInput.trim() === "") return;

    try {
      // Add the new message to the Firestore collection
      await addDoc(chatsCollectionRef, {
        message: messageInput,
        sender: auth.currentUser.uid,
        timestamp: new Date(),
      });

      // Clear the message input field
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    // Retrieve and listen for new messages using onSnapshot
    const unsubscribe = onSnapshot(
      query(chatsCollectionRef, orderBy("timestamp", "asc"), limit(50)),
      (snapshot) => {
        const chatMessages = [];
        snapshot.forEach((doc) => {
          chatMessages.push(doc.data());
        });
        setMessages(chatMessages);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const usersCollectionRef = collection(db, "users");

    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => {
        usersData.push(doc.data());
      });
      setUsers(usersData);
    });

    return () => unsubscribe(); // Cleanup the listener when component unmounts
  }, []);
  return (
    <div
      style={{ marginLeft: "10px", marginRight: "10px", borderRadius: "5px" }}
    >
      <div
        style={{
          width: "98.5%",
          marginTop: "10px",
          height: "80vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "row",
          padding: "10px",
        }}
      >
        <div
          style={{
            width: "15%",
            marginRight: "10px",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <div style={{ marginTop: "15px" }}>
            {users.map((user) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    background: "#DDD",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      marginBottom: "5px",
                      marginTop: "5px",
                      marginRight: "5px",
                      width: "fit-content",
                      marginLeft: "10px",
                      fontSize: "14px",
                      fontFamily: "Poppins",
                      backgroundColor: "#000",
                      padding: "2px 8px",
                      color: "#FFF",
                      borderRadius: "50px",
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </span>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p
                        key={user.id}
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          fontFamily: "Poppins",
                        }}
                      >
                        {user.name}
                      </p>
                    </div>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50px",
                        backgroundColor: "green",
                        marginRight: "10px",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            width: "85%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "10px",
          }}
        >
          <div style={{ flex: "1", overflowY: "auto" }}>
            {messages &&
              messages.map((message, index) => (
                <p
                  key={index}
                  style={{
                    textAlign:
                      message.sender === auth.currentUser.uid
                        ? "left"
                        : "right",
                    backgroundColor:
                      message.sender === auth.currentUser.uid ? "#DDD" : "#FFF",
                    color: "#000",
                    width: "fit-content",
                    padding: "5px",
                    margin: "5px",
                    borderRadius: "5px",
                  }}
                >
                  {message.message}
                </p>
              ))}
          </div>
          <Input
            type="text"
            placeholder="Type something..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
