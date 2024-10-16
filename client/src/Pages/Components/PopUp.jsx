import React from 'react';
import { useState } from 'react'
import './Styles/PopUp.css'

function PopUp(props) {


    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    // const handleUpload = async () => {
    //     // We will fill this out later
    //   };

    //pass in true for false value to trigger the pop up 
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <div className="dropZone">
                    <h3>Drag and Drop</h3>
                    <input type="file" className="upload"  onChange={handleFileChange}/>
                </div>
                {file && (
                    <section>
                        File details:
                        <ul>
                            <li>Name: {file.name}</li>
                            <li>Type: {file.type}</li>
                            <li>Size: {file.size} bytes</li>
                        </ul>
                    </section>
                )}

            </div>
            <div className="bu">
                <button className="close-btn" onClick={() => props.setTrigger(false)} >Close</button>
                {props.children}
                <button className="upload">Upload</button>
            </div>
        </div>
    ) : "";

}
export default PopUp;