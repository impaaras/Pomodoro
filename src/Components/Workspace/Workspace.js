import React, { useContext, useEffect, useState } from "react";
import Header from "../Home/Header";
import "./Workspace.css";
import { BiGroup } from "react-icons/bi";
import { Modal, Button, Input } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../../Firebase";
import { BsFillHouseCheckFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { Navigate } from "react-router-dom";
import { GlobalStateContext } from "../Hooks/GlobalStateContext";

const Workspace = () => {
  const [visible, setVisible] = useState(false);

  const [title, setTitle] = useState("");

  const [workspaces, setWorkspaces] = useState([]);

  // useEffect(() => {
  //   const workspaceRef = collection(db, "workspaces");

  //   const unsubscribe = onSnapshot(workspaceRef, (snapshot) => {
  //     const updatedWorkspaces = snapshot.docs
  //       .map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }))
  //       .filter((workspace) => workspace.owner === auth.currentUser.uid);

  //     setWorkspaces(updatedWorkspaces);
  //   });

  //   // Cleanup function to unsubscribe from the snapshot listener
  //   return () => unsubscribe();
  // }, []);

  const [members, setmembers] = useState([]);

  useEffect(() => {
    const workspaceRef = collection(db, "workspaces");
    const currentUserUid = auth.currentUser.uid;

    const unsubscribe = onSnapshot(workspaceRef, async (snapshot) => {
      const updatedWorkspaces = [];
      const membersArray = [];

      for (const doc of snapshot.docs) {
        const workspaceData = {
          id: doc.id,
          ...doc.data(),
        };

        // Check if the workspace owner matches the current user or any member matches the current user
        if (workspaceData.owner === currentUserUid) {
          updatedWorkspaces.push(workspaceData);
        } else {
          const membersSnapshot = await getDocs(collection(doc.ref, "members"));
          const membersData = membersSnapshot.docs
            .map((memberDoc) => memberDoc.data())
            .filter((member) => member.id === currentUserUid);

          if (membersData.length > 0) {
            membersArray.push(membersData);
            updatedWorkspaces.push(workspaceData);
          }
        }
      }

      // set the array of membersData
      setmembers(membersArray);
      setWorkspaces(updatedWorkspaces);
    });

    // Cleanup function to unsubscribe from the snapshot listener
    return () => unsubscribe();
  }, []);

  const handleCreateWorkspace = async () => {
    if (title.trim() === "") {
      alert("Please enter a title for the workspace.");
      return;
    }

    try {
      const workspaceRef = collection(db, "workspaces");
      const newWorkspace = await addDoc(workspaceRef, {
        name: title.trim(),
        createdAt: new Date(),
        owner: auth.currentUser.uid,
      });

      console.log("New workspace created with ID:", newWorkspace.id);

      setTitle("");
      // Additional actions after creating the workspace
      // ...

      setVisible(false); // Close the modal
    } catch (error) {
      console.error("Error creating workspace:", error);
      alert("Failed to create the workspace. Please try again.");
    }
  };

  //   Delete
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);

  const handleDeleteWorkspace = async (workspaceId) => {
    setWorkspaceToDelete(workspaceId);
  };

  const confirmDelete = async () => {
    try {
      const workspaceRef = doc(db, "workspaces", workspaceToDelete);
      await deleteDoc(workspaceRef);
      console.log("Workspace deleted successfully!");

      // Fetch the updated list of workspaces
    } catch (error) {
      console.error("Error deleting workspace:", error);
      alert("Failed to delete the workspace. Please try again.");
    }

    setWorkspaceToDelete(null);
  };

  const cancelDelete = () => {
    setWorkspaceToDelete(null);
  };

  const { docId, setDocId } = useContext(GlobalStateContext);

  const navigateToWorkspace = (workspaceId) => {
    window.location.href = `/workspace/${workspaceId}`;
  };

  return (
    <div style={{}}>
      <Header />
      <div>
        <div className="group__title">
          <BiGroup className="group" />
          <h2 className="business_title">Business workspace</h2>
        </div>
        <Modal
          title="Create Workspace"
          width="400px"
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <form className={`w-full`}>
            <h2 className="title__text">{title}</h2>
            <Input
              className={`mb-3`}
              placeholder="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <Button type="primary" onClick={handleCreateWorkspace}>
              Create
            </Button>
          </form>
        </Modal>
        <div className="workspaces">
          <div className="addNewWorkspace" onClick={() => setVisible(true)}>
            <h2>Add New Workspace</h2>
          </div>
          <div className="workspace">
            {workspaces.map((workspace) => (
              <div
                style={{
                  backgroundImage: `url(${workspace.background})`,
                }}
                className="addNewWorkspace2"
                key={workspace.id}
                onClick={() => navigateToWorkspace(workspace.id)}
              >
                <div className="title__workspace">
                  {/* <BsFillHouseCheckFill className="title_icon" /> */}
                  <p className="workspace__title">{workspace.name}</p>
                </div>
                {/* <div>
                  <Button
                    type="transparent"
                    onClick={() => handleDeleteWorkspace(workspace.id)}
                  >
                    <AiFillDelete className="deleteButton" />
                  </Button>
                </div> */}
              </div>
            ))}
          </div>
          {/* Delete Confirmation Modal */}
          <Modal
            title="Confirm Delete"
            visible={!!workspaceToDelete}
            onOk={confirmDelete}
            onCancel={cancelDelete}
          >
            <p>Are you sure you want to delete this workspace?</p>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
