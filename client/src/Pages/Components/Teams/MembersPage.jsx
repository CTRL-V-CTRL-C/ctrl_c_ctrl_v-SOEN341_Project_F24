import '../Styles/MembersPage.css';

function MembersPage() {
    return (
<div id="whole">
            <div id="TitlePosition"><p id="PageTitle">Student List</p></div>  
    <div>
        <table id="TableStyle"> 
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Id</th>
                    <th>Email</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td> FirstName LastName</td>
                    <td>STUDXXXXX</td>
                    <td>studentemail@gmail.com</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
        
    )
}

export default MembersPage;