
describe('Instructor view of the members', function(){

  it('Checks the members individually', ()=>{
  
    //Array of students 
    const studentsOfTheCourse = [
      {name:'joe parker', id:'STUD1001',email:'joeparker1@gmail.com'},
      {name:'joe parker', id:'STUD1002',email:'joeparker2@gmail.com'},
      {name:'joe parker', id:'STUD1003',email:'joeparker3@gmail.com'},
      {name:'joe parker', id:'STUD1004',email:'joeparker4@gmail.com'},
      {name:'joe parker', id:'STUD1005',email:'joeparker5@gmail.com'},
      {name:'joe parker', id:'STUD1006',email:'joeparker6@gmail.com'},
      {name:'joe parker', id:'STUD1007',email:'joeparker7@gmail.com'},
      {name:'joe parker', id:'STUD1008',email:'joeparker8@gmail.com'},
      {name:'joe parker', id:'STUD1009',email:'joeparker9@gmail.com'},
      {name:'joe parker', id:'STUD1010',email:'joeparker10@gmail.com'},
      {name:'joe parker', id:'STUD1011',email:'joeparker11@gmail.com'},
      {name:'joe parker', id:'STUD1012',email:'joeparker12@gmail.com'},
    ];

  // login info for the instructor 
  cy.visit('/Teams'); 
  cy.get('#LoginEmail').type('joeparker13@gmail.com');
  cy.get('#LoginPassword').type('password');
  cy.get('.submit').click();

  //Navigating to the members page 
  cy.get('#secondView').click();

  //Checking the apperance 
  cy.get('#PageTitle').should('be.visible');
  cy.get('#studentList').should('be.visible');
    cy.get('.studentInformation').should('be.visible');
//Cheking if each student is present 



  });

}); 