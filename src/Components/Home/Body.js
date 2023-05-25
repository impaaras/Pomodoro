import React, { useEffect, useState } from "react";
import List from "./List";
import "./Body.css";
import Card from "./Card";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Button, Form, Input } from "antd";
import { BsPlusLg } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Firebase";

function ShowingList({
  id,
  index,
  listName,
  lists,
  setLists,
  deleteList,
  workspaceId,
  draggedCardId,
  source,
  destination,
}) {
  const [newCardText, setNewCardText] = useState("");
  const [cards, setCards] = useState([]);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1; // Generates a random number between 1 and 100
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, workspaceId, id.toString(), "cards")),
      (snapshot) => {
        const fetchedCards = [];
        snapshot.forEach((doc) => {
          fetchedCards.push({
            id: doc.id,
            ...doc.data(),
          });
          // Add console.log statement here
        });
        setCards(fetchedCards);
      }
    );
    return unsubscribe;
  }, [workspaceId, id]);

  function addCard(workspaceId) {
    if (newCardText.trim() !== "") {
      const newCard = {
        text: newCardText,
      };

      addDoc(collection(db, workspaceId, id.toString(), "cards"), newCard)
        .then((docRef) => {
          const newCardId = docRef.id;

          // Update the card in Firestore with the doc.id
          updateDoc(doc(db, workspaceId, id.toString(), "cards", newCardId), {
            id: newCardId,
          })
            .then(() => {
              setNewCardText("");
              console.log("New card ID:", newCardId);
            })
            .catch((error) => {
              console.error("Error updating card:", error);
            });
        })
        .catch((error) => {
          console.error("Error adding card:", error);
        });
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addCard(workspaceId); // Pass the workspaceId to the addCard function
    }
  }

  // rgb(218, 222, 226);
  return (
    <Droppable droppableId={id.toString()}>
      {(provided) => (
        <div
          className="list"
          key={id}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="top__list">
            <p>{listName}</p>
            <BiDotsVerticalRounded
              className="list__icon"
              onClick={() => deleteList(id)}
            />
          </div>
          <div>
            {cards.map((card, index) => (
              <Draggable
                key={card.id.toString()}
                draggableId={card.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    className="card__box"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card
                      source={source}
                      destination={destination}
                      id={card.id}
                      text={card.text}
                      workspaceId={workspaceId}
                      draggedCardId={draggedCardId}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
          <div className="add__card">
            <input
              type="text"
              placeholder="Add a new card"
              value={newCardText}
              onChange={(e) => setNewCardText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {/* <button onClick={addCard}>Add Card</button> */}
          </div>
        </div>
      )}
    </Droppable>
  );
}

const Body = () => {
  const [clicked, setClick] = useState(true);
  const [listInput, setListInput] = useState("");

  const { workspaceId } = useParams();

  // const handleAddList = async () => {
  //   if (listInput.trim() !== "") {
  //     try {
  //       // Add the new list to Firestore
  //       const docRef = await addDoc(
  //         collection(db, "workspaces", workspaceId, "lists"),
  //         {
  //           title: listInput,

  //         }
  //       );

  //       // Clear the input field and perform any additional actions
  //       setListInput("");
  //       console.log("New list added with ID: ", docRef.id);
  //     } catch (error) {
  //       console.error("Error adding new list: ", error);
  //     }
  //   }
  // };

  const [lists, setLists] = useState([]);

  const handleAddList = async () => {
    if (listInput.trim() !== "") {
      try {
        // Add the new list to Firestore with timestamp
        const docRef = await addDoc(
          collection(db, "workspaces", workspaceId, "lists"),
          {
            title: listInput,
            timestamp: serverTimestamp(), // Add the timestamp field
          }
        );

        // Clear the input field and perform any additional actions
        setListInput("");
        console.log("New list added with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding new list: ", error);
      }
    }
  };

  useEffect(() => {
    const listsCollectionRef = collection(
      db,
      "workspaces",
      workspaceId,
      "lists"
    );
    const orderedListsQuery = query(
      listsCollectionRef,
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      orderedListsQuery,
      (snapshot) => {
        const listsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLists(listsData);
      },
      (error) => {
        console.error("Error fetching lists: ", error);
      }
    );

    return () => unsubscribe(); // Unsubscribe from the snapshot listener when component unmounts
  }, [workspaceId]);

  // Function to delete a list
  const deleteList = async (listId) => {
    try {
      // Delete the list document from Firestore
      await deleteDoc(doc(db, "workspaces", workspaceId, "lists", listId));
      console.log("List deleted successfully!");
    } catch (error) {
      console.error("Error deleting list: ", error);
    }
  };

  const [draggedCardId, setDraggedCardId] = useState(null);

  const [source, setSource] = useState(null);
  const [destination, SetDestination] = useState(null);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    SetDestination(destination);
    setSource(source);
    // Check if the card was dropped outside a valid droppable area
    if (!destination) {
      return;
    }

    // Check if the card was dropped in a different position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedId = result.draggableId;

    // Update the state with the dragged card ID
    setDraggedCardId(draggedId);

    // Update the lists and cards based on the drag and drop result
    const updatedLists = [...lists];
    const sourceListIndex = updatedLists.findIndex(
      (list) => list.id === source.droppableId
    );
    const destinationListIndex = updatedLists.findIndex(
      (list) => list.id === destination.droppableId
    );

    if (sourceListIndex === -1 || destinationListIndex === -1) {
      // Invalid source or destination list
      return;
    }

    const sourceList = updatedLists[sourceListIndex];
    const destinationList = updatedLists[destinationListIndex];

    if (!sourceList.cards || !destinationList.cards) {
      // Initialize cards array if it's undefined
      sourceList.cards = [];
      destinationList.cards = [];
    }

    // Move the card within the same list
    if (source.droppableId === destination.droppableId) {
      const movedCard = sourceList.cards.splice(source.index, 1)[0];
      sourceList.cards.splice(destination.index, 0, movedCard);
    } else {
      // Move the card to a different list
      const movedCard = sourceList.cards.splice(source.index, 1)[0];
      destinationList.cards.splice(destination.index, 0, movedCard);
    }

    // if (destination) {
    //   addCard("hello");
    // }
    if (source) {
      console.log("deleted");
      deleteCardFromWorkspace(workspaceId, draggedCardId);
    }
    setLists(updatedLists);
  };

  function addCard(text) {
    if (text.trim() !== "") {
      const newCard = {
        text: text,
      };

      addDoc(collection(db, workspaceId, source.toString(), "cards"), newCard)
        .then(() => {
          console.log("New card added:", newCard);
        })
        .catch((error) => {
          console.error("Error adding card:", error);
        });
    }
  }

  async function deleteCardFromWorkspace(workspaceId, draggedCardId) {
    const workspaceRef = doc(db, workspaceId);
    const workspaceSnapshot = await getDocs(workspaceRef);

    if (workspaceSnapshot.empty) {
      console.log("Workspace does not exist.");
      return;
    }

    const cardsCollectionRef = collection(
      db,
      `${workspaceId}/${source.toString()}/cards`
    );
    const draggedCardRef = doc(cardsCollectionRef, draggedCardId);

    try {
      await deleteDoc(draggedCardRef);
      console.log("Document deleted successfully.");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  function deleteCard(draggedCardId) {
    console.log(draggedCardId);
    if (draggedCardId) {
      const cardRef = doc(
        db,
        workspaceId,
        source.toString(),
        "cards",
        draggedCardId
      );

      deleteDoc(cardRef)
        .then(() => {
          console.log("Card deleted:", draggedCardId);
        })
        .catch((error) => {
          console.error("Error deleting card:", error);
        });
    }
  }

  return (
    <div className="body__content">
      <DragDropContext onDragEnd={onDragEnd}>
        {lists.map((list, index) => (
          <ShowingList
            key={list.id}
            id={list.id}
            index={index}
            lists={lists}
            setLists={setLists}
            draggedCardId={draggedCardId}
            listName={list.title}
            deleteList={deleteList}
            source={source}
            destination={destination}
            workspaceId={workspaceId} // Pass the workspaceId prop to ShowingList
          />
        ))}
      </DragDropContext>

      {clicked ? (
        <div className="addToButton">
          <Button className="addButton" onClick={() => setClick(false)}>
            <BsPlusLg className="addPlus" />
            Add another list
          </Button>
        </div>
      ) : (
        <div className="addOption">
          <Form>
            <Input
              className="addinput"
              autoFocus
              value={listInput}
              onChange={(e) => setListInput(e.target.value)}
            />

            <div className="addToCancel">
              <Button className="addOption_button" onClick={handleAddList}>
                Add
              </Button>

              <Button onClick={() => setClick(true)}>Cancel</Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Body;
//  {
//    /* <ShowingList listName="Assign" />
//       <ShowingList listName="In working" />
//       <ShowingList listName="Completed" /> */
//  }
