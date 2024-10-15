import React from 'react';
import './Styles/PopUp.css'

function PopUp(props){

    //pass in true for false value to trigger the pop up 
    return(props.trigger) ? (
        <div className = "popup">
            <div className = "popup-inner">
                <div className = "dropZone">
                    <h3>Drag and drop</h3>
                    <button className = "upload">Choose File From Computer</button>
                </div>
            </div> 
            <button className = "close-btn" onClick={() => props.setTrigger(false)} >close</button>
                {props.children}
        </div>
    ) : "";

}
export default PopUp;