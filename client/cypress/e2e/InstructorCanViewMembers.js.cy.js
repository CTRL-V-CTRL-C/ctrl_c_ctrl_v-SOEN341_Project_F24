
describe('Instructor view of the members', function(){

  it('Checks the members individually', ()=>{
  
    //Array of students 
    const studentsOfTheCourse = [
      {name:'joe parker', id:'STUD1001',email:'joeparker1@gmail.com'},
      {name:'joe parker', id:'STUD1002',email:'joeparker1@gmail.com'},
      {name:'joe parker', id:'STUD1003',email:'joeparker1@gmail.com'},
      {name:'joe parker', id:'STUD1004',email:'joeparker1@gmail.com'},
      {name:'joe parker', id:'STUD1005',email:'joeparker1@gmail.com'},
      {name:'joe parker', id:'STUD1006',email:'joeparker1@gmail.com'},
      {name:'joe parker', id:'STUD1007',email:'joeparker1@gmail.com'},
      {name:'joe parker', id:'STUD1008',email:'joeparker1@gmail.com'},
      {name:'joe parker', id:'STUD1009',email:'joeparker1@gmail.com'},
      {name:'joe parker', id:'STUD1010',email:'joeparker1@gmail.com'},
      {name:'joe parker', id:'STUD1011',email:'joeparker1@gmail.com'},
      {name:'joe parker', id:'STUD1012',email:'joeparker1@gmail.com'},
    ];

  // login info for the instructor 
  cy.visit('/Teams'); 
  cy.get('#LoginEmail').type('joeparker13@gmail.com');
  cy.get('#LoginPassword').type('password');
  cy.get('.submit').click();

  //Navigating to the members page 
  cy.get('#secondView').click();

  //Checking the student



  });

}); 