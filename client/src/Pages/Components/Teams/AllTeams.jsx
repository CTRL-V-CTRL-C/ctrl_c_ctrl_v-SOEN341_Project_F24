import PopUp from '../PopUp';
import { useState } from 'react';

function AllTeams() {

    const [buttonPopup, setButtonPopup] = useState(false);

    return (
        <div>
            <button onClick = {() => setButtonPopup(true)}>Upload</button> 
            <PopUp trigger ={buttonPopup}setTrigger= {setButtonPopup}>
            </PopUp>
        </div>
    )
}

export default AllTeams;