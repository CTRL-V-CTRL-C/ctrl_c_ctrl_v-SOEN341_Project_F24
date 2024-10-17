import '../Styles/MembersPage.css';


function MembersPage() {
    const students = [
        { name: 'John Doe', id: 'STUD0001', email: 'john.doe@gmail.com' },
        { name: 'Jane Smith', id: 'STUD0002', email: 'jane.smith@gmail.com' },
        { name: 'Alice Johnson', id: 'STUD0003', email: 'alice.johnson@gmail.com' },
        // Add more students as needed
    ];

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
            {students.map((student, index) => (
                <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.id}</td>
                    <td>{student.email}</td>
                </tr>
                   ))}
            </tbody>
        </table>
    </div>
</div>
        
    )
}

export default MembersPage;