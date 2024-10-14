import React from 'react';
import './Styles/PopUp.css'

function PopUp(props){

    //pass in true for false value to trigger the pop up 
    return(props.trigger) ? (
        <div className = "popup">
            <div className = "popup-inner">
                <button className = "close-btn" onClick={() => props.setTrigger(false)} >close</button>
                {props.children}
            </div> 

        </div>
    ) : "";

}
export default PopUp;