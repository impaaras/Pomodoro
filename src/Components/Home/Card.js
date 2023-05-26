import React, { useEffect, useState } from "react";
import "./Card.css";
import { Draggable } from "react-beautiful-dnd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../Firebase";
import { Button, Input, Modal } from "antd";
import { HiMenuAlt2 } from "react-icons/hi";

const Card = ({
  text,
  id,
  del,
  workspaceId,
  des,
  destination,
  deleteCard,
  author,
}) => {
  function deleteCard(workspaceId, id) {
    if (destination) {
      deleteDoc(doc(db, workspaceId, del, "cards", id))
        .then(() => {
          console.log("Card deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting card:", error);
        });
    }
  }

  const [isclicked, setClicked] = useState(true);

  if (isclicked && destination) {
    console.log(destination);
    setClicked(false);
  }

  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState(false);

  const [description, setDescription] = useState("");

  const saveDescriptionToDatabase = async () => {
    const cardRef = doc(db, workspaceId, del, "cards", id);

    try {
      await updateDoc(cardRef, {
        description: description,
      }).then(() => {
        setDescription("");
      });
      console.log("Description updated in Firestore.");
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      saveDescriptionToDatabase();
    }
  };

  // Task code
  const [pendingTasks, setPendingTasks] = useState(0);

  const handleTaskChange = async (taskId, newValue) => {
    const taskRef = doc(db, workspaceId, del, "cards", id, "tasks", taskId);

    try {
      await updateDoc(taskRef, {
        status: newValue,
        taskEditor: auth.currentUser.displayName,
      });
      console.log("Task updated in Firestore.");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleAddTask = async (taskName) => {
    const taskData = {
      name: taskName,
      status: false,
      taskEditor: auth.currentUser.displayName,
    };

    try {
      const taskRef = await addDoc(
        collection(db, workspaceId, del, "cards", id, "tasks"),
        taskData
      );
      console.log("Task added to Firestore.");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const calculatePendingTasks = (tasksData) => {
    const count = tasksData.filter((task) => !task.status).length;
    setPendingTasks(count);
  };

  const calculateTaskCompletionPercentage = (tasksData) => {
    const totalTasks = tasksData.length;
    const completedTasks = tasksData.filter((task) => task.status).length;

    if (totalTasks === 0) {
      return 100; // If no tasks, consider it 100% completed
    }

    const completionPercentage = Math.round(
      (completedTasks / totalTasks) * 100
    );
    return completionPercentage;
  };

  const [taskCompletionPercentage, setTaskCompletionPercentage] = useState(0);

  useEffect(() => {
    const fetchTasks = () => {
      const tasksCollectionRef = collection(
        db,
        workspaceId,
        del,
        "cards",
        id,
        "tasks"
      );

      const unsubscribe = onSnapshot(
        tasksCollectionRef,
        (querySnapshot) => {
          const tasksData = [];
          querySnapshot.forEach((doc) => {
            tasksData.push({ id: doc.id, ...doc.data() });
          });
          setTasks(tasksData);
          const percentage = calculateTaskCompletionPercentage(tasksData);
          setTaskCompletionPercentage(percentage);
          calculatePendingTasks(tasksData);
        },
        (error) => {
          console.error("Error fetching tasks:", error);
        }
      );

      return unsubscribe;
    };

    const unsubscribe = fetchTasks();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="card" onClick={() => setShow(true)}>
        {tasks.length > 0 ? (
          <div
            style={{
              width: "25px",
              borderRadius: "5px",
              height: "5px",
              backgroundColor: `${pendingTasks > 0 ? "red" : "green"}`,
            }}
          ></div>
        ) : null}
        <div className="card__title">
          <p>{text}</p>
          <div
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            <div
              style={{
                backgroundColor: "#DDD",
                padding: "5px",
                width: "fit-content",
                borderRadius: "3px",
                marginRight: "5px",
                fontSize: "8px",
                fontFamily: "Poppins",
              }}
            >
              Github
            </div>
            <div
              style={{
                backgroundColor: "#DDD",
                padding: "5px",
                width: "fit-content",
                borderRadius: "3px",
                fontSize: "8px",
                fontFamily: "Poppins",
              }}
            >
              Database
            </div>
          </div>
          {tasks.length > 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: "5px",
                  fontSize: "12px",
                  fontFamily: "Poppins",
                  fontWeight: "400",
                }}
              >
                <HiMenuAlt2 style={{ marginRight: "5px", fontSize: "12px" }} />
                <p>
                  {pendingTasks}/{tasks.length}
                </p>
              </div>
              <div>
                <p>{taskCompletionPercentage}%</p>
              </div>
            </div>
          ) : null}
          {/* <p>Front page with all all content</p> */}
        </div>
        {/* <button onClick={() => deleteCard(workspaceId, id)}>Delete</button> */}
        <div></div>
        <div></div>
      </div>
      <Modal
        title={`${text}`}
        width="800px"
        open={show}
        footer={null}
        onCancel={() => setShow(false)}
      >
        <div
          style={{
            width: "55px",
            borderRadius: "5px",
            height: "5px",
            backgroundColor: `${pendingTasks > 0 ? "red" : "green"}`,
          }}
        ></div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "15px",
          }}
        >
          <div
            className="oneSide"
            style={{
              width: "80%",
              marginRight: "10px",
              height: "500px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <HiMenuAlt2 style={{ marginRight: "10px", fontSize: "20px" }} />
              <p
                style={{
                  marginBottom: "0px",
                  marginTop: "0px",
                  fontSize: "18px",
                  fontWeight: "400",
                  fontFamily: "Poppins",
                }}
              >
                Description
              </p>
            </div>
            <p
              style={{
                fontSize: "14px",
                marginTop: "10px",
                marginBottom: "10px",
                fontFamily: "Poppins",
              }}
            >
              {des}
            </p>
            <div>
              <Input
                placeholder="write a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleEnterKeyPress}
              />
            </div>
            <div style={{ marginTop: "50px" }}></div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <HiMenuAlt2 style={{ marginRight: "10px", fontSize: "20px" }} />
              <p
                style={{
                  marginBottom: "0px",
                  marginTop: "0px",
                  fontSize: "18px",
                  fontWeight: "400",
                  fontFamily: "Poppins",
                }}
              >
                Tasks
              </p>
            </div>

            <Input
              placeholder="task name.."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTask(e.target.value);
                  e.target.value = "";
                }
              }}
            />
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      marginBottom: "5px",
                      marginTop: "5px",
                      marginRight: "5px",
                      fontSize: "14px",
                      fontFamily: "Poppins",
                      backgroundColor: "#27374D",
                      padding: "2px 8px",
                      color: "#FFF",
                      borderRadius: "50px",
                    }}
                  >
                    {task.taskEditor.charAt(0).toUpperCase()}
                  </p>

                  <input
                    type="checkbox"
                    checked={task.status}
                    style={{ fontSize: "12px", transform: "scale(1.5)" }}
                    onChange={(e) =>
                      handleTaskChange(task.id, e.target.checked)
                    }
                  />
                  <span
                    style={{
                      marginLeft: "5px",
                      textDecoration: task.status ? "line-through" : "none",
                      fontSize: "14px",
                      fontFamily: "Poppins",
                    }}
                  >
                    {task.name}
                  </span>
                </div>
              ))
            ) : (
              <p>No tasks found.</p>
            )}
            {tasks ? <div></div> : null}
            <div style={{ marginTop: "50px" }}></div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <HiMenuAlt2 style={{ marginRight: "10px", fontSize: "20px" }} />
              <p
                style={{
                  marginBottom: "0px",
                  marginTop: "0px",
                  fontSize: "18px",
                  fontWeight: "400",
                  fontFamily: "Poppins",
                }}
              >
                Activity
              </p>
            </div>
            <div style={{ paddingBottom: "20px" }}>
              <Input
                placeholder="Write a comment"
                style={{
                  backgroundColor: "#DDD",
                  height: "50px",
                  color: "#000",
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "20%",
              height: "500px",
            }}
          >
            <div>
              <Button
                style={{
                  backgroundColor: "#DDD",
                  borderRadius: "3px",
                  fontSize: "14px",
                  width: "150px",
                  marginBottom: "10px",
                  fontFamily: "Poppins",
                }}
              >
                Members
              </Button>
              <Button
                style={{
                  backgroundColor: "#DDD",
                  borderRadius: "3px",
                  fontSize: "14px",
                  marginBottom: "10px",
                  width: "150px",
                  fontFamily: "Poppins",
                }}
              >
                Tasks
              </Button>
              <Button
                onClick={() => setTasks(!tasks)}
                style={{
                  backgroundColor: "#DDD",
                  borderRadius: "3px",
                  fontSize: "14px",
                  marginBottom: "10px",
                  width: "150px",
                  fontFamily: "Poppins",
                }}
              >
                Labels
              </Button>
              <Button
                style={{
                  backgroundColor: "#DDD",
                  borderRadius: "3px",
                  fontSize: "14px",
                  marginBottom: "10px",
                  width: "150px",
                  fontFamily: "Poppins",
                }}
              >
                Due Time
              </Button>
              {author && author === auth.currentUser.uid ? (
                <Button
                  style={{
                    backgroundColor: "#DDD",
                    borderRadius: "3px",
                    fontSize: "14px",
                    marginBottom: "10px",
                    width: "150px",
                    fontFamily: "Poppins",
                  }}
                  onClick={() => deleteCard(workspaceId, id)}
                >
                  Delete
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Card;
