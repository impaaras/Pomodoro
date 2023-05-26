import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../Firebase";
import { Button } from "antd";

const Chat = () => {
  const [users, setUsers] = useState([]);

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
        <div style={{ width: "85%", backgroundColor: "rgba(0,0,0,0.7)" }}></div>
      </div>
    </div>
  );
};

export default Chat;
