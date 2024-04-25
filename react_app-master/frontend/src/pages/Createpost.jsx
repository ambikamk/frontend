import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";
import getNotes from './Home';



function CreatePost() {
    const [title, setTitle] = useState("");
    const [uploadFile, setUploadFile] = useState(null); // Change the initial state to null

    
    const handleFileChange = (event) => {
        setUploadFile(event.target.files[0]);
    };

    const createNote = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", uploadFile); // Append the file to the FormData

        try {
            const res = await api.post("/api/notes/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 201) {
                alert("Note created!");
                getNotes();

            } else {
                alert("Failed to create note.");
            }


            getNotes();
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div>
            <h2>Create a Note</h2>
            <form onSubmit={createNote} encType="multipart/form-data">
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <br />
                <label htmlFor="file">Select a File:</label>
                <br />
                <input
                    type="file"
                    id="file"
                    name="file"
                    required
                    onChange={handleFileChange} // Handle file change event
                />
                <br />
                <input type="submit" value="Submit" />
            </form>

        </div>
    );
}

export default CreatePost;
