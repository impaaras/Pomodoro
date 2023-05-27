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
import PieChart from "./Piechart";

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

  // Comment function
  const [commentInput, setCommentInput] = useState("");

  const handleCommentInput = (event) => {
    setCommentInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      makeComment();
      setCommentInput("");
    }
  };

  const makeComment = async () => {
    const commentsCollectionRef = collection(
      db,
      workspaceId,
      del,
      "cards",
      id,
      "comments"
    );

    try {
      // Add the comment to Firestore
      const docRef = await addDoc(commentsCollectionRef, {
        comment: commentInput,
        timestamp: new Date(),
        commentUser: auth.currentUser.displayName,
      });
      console.log("Comment added with ID:", docRef.id);

      // Retrieve the comments from Firestore
      const querySnapshot = await getDocs(commentsCollectionRef);
      querySnapshot.forEach((doc) => {
        console.log("Comment:", doc.data().comment);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [comments, setComments] = useState([]);
  const listenForComments = () => {
    const commentsCollectionRef = collection(
      db,
      workspaceId,
      del,
      "cards",
      id,
      "comments"
    );

    return onSnapshot(commentsCollectionRef, (querySnapshot) => {
      const commentsData = [];
      querySnapshot.forEach((doc) => {
        commentsData.push(doc.data());
      });
      setComments(commentsData);
    });
  };

  useEffect(() => {
    const unsubscribe = listenForComments();

    return () => {
      unsubscribe();
    };
  }, []);

  // label content
  const [showLabel, setShowLabel] = useState(false);

  const [selectedLabels, setSelectedLabels] = useState([]);

  const handleButtonClick = async (label) => {
    // Check if the label already exists in the selectedLabels array
    if (selectedLabels.includes(label)) {
      return; // Skip adding the label if it already exists
    }

    // Add the label to the selectedLabels array (maximum 3 labels)
    if (selectedLabels.length >= 3) {
      return;
    }
    setSelectedLabels((prevLabels) => {
      if (prevLabels.length < 3) {
        return [...prevLabels, label];
      } else {
        return prevLabels;
      }
    });

    // Store the selected labels in the Firestore database
    try {
      const labelsCollectionRef = collection(
        db,
        workspaceId,
        del,
        "cards",
        id,
        "labels"
      );

      await addDoc(labelsCollectionRef, { label });
      console.log("Label added to Firestore:", label);
    } catch (error) {
      console.error("Error adding label to Firestore:", error);
    }
  };

  const [labels, setLabels] = useState([]);

  useEffect(() => {
    // Create a reference to the "labels" collection in Firestore
    const labelsCollectionRef = collection(
      db,
      workspaceId,
      del,
      "cards",
      id,
      "labels"
    );

    // Subscribe to the collection updates using onSnapshot
    const unsubscribe = onSnapshot(labelsCollectionRef, (querySnapshot) => {
      // Create an empty array to store the labels
      const labelsData = [];

      // Iterate through the documents in the query snapshot
      querySnapshot.forEach((doc) => {
        // Get the label data from each document and add it to the labelsData array
        labelsData.push(doc.data().label);
      });

      // Update the labels state with the retrieved labelsData
      setLabels(labelsData);
      console.log(labelsData);
    });

    // Cleanup the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  // Calculate piechart
  // useEffect(() => {
  //   // Specify the path to fetch card documents
  //   const cardsCollectionRef = collection(db, workspaceId, del, "cards");

  //   // Subscribe to the changes in card documents using onSnapshot
  //   const unsubscribe = onSnapshot(cardsCollectionRef, (cardsSnapshot) => {
  //     cardsSnapshot.forEach((cardDoc) => {
  //       const cardId = cardDoc.id;

  //       // Specify the path to fetch tasks under each card
  //       const tasksCollectionRef = collection(
  //         db,
  //         workspaceId,
  //         del,
  //         "cards",
  //         id,
  //         "tasks"
  //       );

  //       // Subscribe to the changes in tasks using onSnapshot
  //       const tasksUnsubscribe = onSnapshot(
  //         tasksCollectionRef,
  //         (tasksSnapshot) => {
  //           const tasksArray = [];
  //           const userTasksCount = {};

  //           tasksSnapshot.forEach((taskDoc) => {
  //             const taskData = taskDoc.data();
  //             tasksArray.push(taskData);

  //             const taskEditor = taskData.taskEditor;

  //             // Count the occurrences of the user's name in the taskEditor
  //             const count = (taskEditor.match(/\b\w+\b/g) || []).length;

  //             if (!userTasksCount[taskEditor]) {
  //               userTasksCount[taskEditor] = count;
  //             } else {
  //               userTasksCount[taskEditor] += count;
  //             }
  //           });

  //           // Create an array with name-count pairs
  //           const userTasksArray = Object.entries(userTasksCount).map(
  //             ([name, count]) => ({
  //               name,
  //               count,
  //             })
  //           );

  //           // Log the tasks array and the userTasksArray for the current card
  //           console.log(`Tasks Array for Card ${cardId}:`, tasksArray);
  //           console.log(`User Tasks Array for Card ${cardId}:`, userTasksArray);
  //         }
  //       );

  //       // Unsubscribe from the tasks collection snapshot listener
  //       return () => {
  //         tasksUnsubscribe();
  //       };
  //     });
  //   });

  //   // Unsubscribe from the card collection snapshot listener when component unmounts
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    // Specify the path
    const tasksCollectionRef = collection(
      db,
      workspaceId,
      del,
      "cards",
      id,
      "tasks"
    );

    // Subscribe to the changes using onSnapshot
    const unsubscribe = onSnapshot(tasksCollectionRef, (snapshot) => {
      const tasksArray = [];
      const userTasksCount = {};

      snapshot.forEach((doc) => {
        const taskData = doc.data();
        tasksArray.push(taskData);

        const taskEditor = taskData.taskEditor;

        // Count the occurrences of the user's name in the taskEditor
        const count = (taskEditor.match(/\b\w+\b/g) || []).length;

        if (!userTasksCount[taskEditor]) {
          userTasksCount[taskEditor] = count;
        } else {
          userTasksCount[taskEditor] += count;
        }
      });

      // Create an array with name-count pairs
      const userTasksArray = Object.entries(userTasksCount).map(
        ([name, count]) => ({
          name,
          count,
        })
      );

      // Log the tasks array and the userTasksArray
      console.log("Tasks Array:", tasksArray);
      console.log("User Tasks Array:", userTasksArray);
      setTaskData(userTasksArray);
    });

    // Unsubscribe from the snapshot listener when component unmounts
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
            {labels.slice(0, 3).map((label) => (
              <p
                key={label}
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
                {label}
              </p>
            ))}
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
            <PieChart userTasksArray={taskData} />
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
                value={commentInput}
                onChange={handleCommentInput}
                onKeyPress={handleKeyPress}
                style={{
                  backgroundColor: "#DDD",
                  height: "50px",
                  color: "#000",
                }}
              />
            </div>
            {comments.map((comment) => (
              <>
                <div
                  style={{
                    backgroundColor: "#EEE",
                    marginBottom: "5px",
                    padding: "5px",
                  }}
                >
                  <div style={{}}>
                    <span
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
                      {comment.commentUser.charAt(0).toUpperCase()}
                    </span>
                    <span style={{ fontSize: "14px", fontFamily: "Poppins" }}>
                      {comment.commentUser}
                    </span>
                  </div>
                  <span
                    key={comment.timestamp}
                    style={{ fontSize: "12px", fontFamily: "Poppins" }}
                  >
                    {comment.comment}
                  </span>
                </div>
              </>
            ))}
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
              {/* <Button
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
              </Button> */}
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
                onClick={() => setShowLabel(true)}
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
      <Modal
        title={`Select label`}
        width="400px"
        open={showLabel}
        footer={null}
        onCancel={() => setShowLabel(false)}
      >
        <p>Note: Select only three labels</p>
        <Button
          style={{ marginRight: "5px", marginBottom: "5px" }}
          onClick={() => handleButtonClick("Github")}
        >
          Github
        </Button>
        <Button
          onClick={() => handleButtonClick("Frontend")}
          style={{ marginRight: "5px", marginBottom: "5px" }}
        >
          Frontend
        </Button>
        <Button
          onClick={() => handleButtonClick("Backend")}
          style={{ marginRight: "5px", marginBottom: "5px" }}
        >
          Backend
        </Button>
        <Button
          onClick={() => handleButtonClick("Figma")}
          style={{ marginRight: "5px", marginBottom: "5px" }}
        >
          Figma
        </Button>
        <Button
          onClick={() => handleButtonClick("Designing")}
          style={{ marginRight: "5px", marginBottom: "5px" }}
        >
          Designing
        </Button>
        <Button
          onClick={() => handleButtonClick("Planing")}
          style={{ marginRight: "5px", marginBottom: "5px" }}
        >
          Planing
        </Button>
        <Button
          onClick={() => handleButtonClick("API")}
          style={{ marginRight: "5px", marginBottom: "5px" }}
        >
          API
        </Button>
        <Button
          onClick={() => handleButtonClick("Databse")}
          style={{ marginRight: "5px", marginBottom: "5px" }}
        >
          Databse
        </Button>
        <Button
          onClick={() => handleButtonClick("Bugs")}
          style={{ marginRight: "5px", marginBottom: "5px" }}
        >
          Bugs
        </Button>
        <Button
          onClick={() => handleButtonClick("Report")}
          style={{ marginRight: "5px", marginBottom: "5px" }}
        >
          Report
        </Button>
        <Button
          onClick={() => handleButtonClick("Documentation")}
          style={{ marginRight: "5px", marginBottom: "5px" }}
        >
          Documentation
        </Button>
      </Modal>
    </>
  );
};

export default Card;
