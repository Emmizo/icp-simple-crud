import { useState,useEffect } from 'react';
import { crud_project_backend } from 'declarations/crud_project_backend';
import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory, canisterId } from 'declarations/crud_project_backend';

const App = () =>{
  //state for CRUD opertions
  const [items, setItems] = useState([]);
  const [newName, setNewName] =  useState("");
  const [newPrice, setPrice] = useState("");
  const [newQty, setQty] = useState("");
  const [updateIndex, setUpdateIndex] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateQty, setUpdateQty] = useState("");

  //Initialize CRUD back actor

  const agent = HttpAgent.createSync({host:"http://127.0.0.1:4943"});
  // IMPORTANT: Use this ONLY in development mode
agent.fetchRootKey();
  const crud_backend = Actor.createActor(idlFactory,{agent, canisterId});

  //fetch item on load

   // Fetch items on load
   useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await crud_backend.listItems();
        console.log('Fetched Items:', fetchedItems);  // Log to check the returned value
        
        // Ensure fetchedItems is an array
        if (Array.isArray(fetchedItems)) {
          setItems(fetchedItems);
        } else {
          console.error("Fetched items are not an array:", fetchedItems);
          setItems([]);  // Fallback to empty array if it's not an array
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        setItems([]);  // Fallback to empty array in case of an error
      }
    };
    fetchItems();
  }, []);

  //CRUD operations
  const addItem = async () => {
    if(newName.trim()== "" || newPrice.trim() === "" || newQty.trim() === "")return; //Avoid empty items
    await crud_backend.addItem(newName,newPrice,newQty);
    setNewName("");
    setPrice("");
    setQty("");
    const updatedItems = await crud_backend.listItems();
    setItems(updatedItems);
  };

  //delete
  const deleteItem = async (index) => {
    await crud_backend.deleteItem(index);
    const updatedItems = await crud_backend.listItems();
    setItems(updatedItems);
  };

  const updateItem = async () =>{
    if(updateIndex === null) return;
    try {
      const response = await crud_backend.updateItem(
        updateIndex,
        updateName,
        updatePrice,
        updateQty
      );
      console.log(response)
      const updatedItems = await crud_backend.listItems();
      setItems(updatedItems);
      setUpdateIndex(null);
    } catch (error){
      console.error("Error updating item:", error);
    }
  }

  return (
    <div className="container mt-4">
      {/*CRUD Section */}
      <section>
        <h1 className="text-center mb-4">CRUD Application</h1>
        <div className="col-12">
          <div className="col-m-6">
        <input className="form-control" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder='Enter name'/>
        </div>
        <div className="col-m-6">
        <input className="form-control mt-2" type="text" value={newPrice} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price"/>
        </div>
        <div className="col-m-6">
        <input className="form-control mt-2" type="text" value={newQty} onChange={(e) => setQty(e.target.value)} placeholder='Quantity'/>
        </div>
        <button className="btn btn-primary mt-2" onClick = {addItem}>Add Item</button>
        </div>
        <ul className="list-group mt-5">
          {items.map((item,index)=>(
            <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
              <div>
              <strong>Name:</strong> {item.name} <br />
                <strong>Price:</strong> {item.price} <br />
                <strong>Quantity:</strong> {item.quantity}
              </div>
              <div>
              <button
          className="btn btn-warning btn-sm"
          onClick={() => {
            setUpdateIndex(index);
            setUpdateName(item.name);
            setUpdatePrice(item.price);
            setUpdateQty(item.quantity);
          }}
        >Update</button>
          
              |<button className="btn btn-danger btn-sm" onClick = {() => deleteItem(index)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <hr/>
      {updateIndex !== null && (
  <div className="mt-4">
    <h3>Update Item</h3>
    <div className="mb-2">
      <input
        className="form-control"
        type="text"
        value={updateName}
        onChange={(e) => setUpdateName(e.target.value)}
        placeholder="Enter updated name"
      />
    </div>
    <div className="mb-2">
      <input
        className="form-control"
        type="text"
        value={updatePrice}
        onChange={(e) => setUpdatePrice(e.target.value)}
        placeholder="Enter updated price"
      />
    </div>
    <div className="mb-2">
      <input
        className="form-control"
        type="text"
        value={updateQty}
        onChange={(e) => setUpdateQty(e.target.value)}
        placeholder="Enter updated quantity"
      />
    </div>
    <button className="btn btn-success" onClick={updateItem}>
      Save Changes
    </button>
    <button
      className="btn btn-secondary ms-2"
      onClick={() => setUpdateIndex(null)} // Cancel update
    >
      Cancel
    </button>
  </div>
)}
       
    </div>
  );
};
export default App;