import PopUp from './Components/PopUp';
import { useState } from 'react';
function CVSUpload() {

    const [buttonPopup, setButtonPopup] = useState(false);

    return (
        <div>
            <button onClick = {() => setButtonPopup(true)}>Upload</button> 
            <PopUp trigger ={buttonPopup}setTrigger= {setButtonPopup}>
            </PopUp>
        </div>
    );
}
export default CVSUpload;