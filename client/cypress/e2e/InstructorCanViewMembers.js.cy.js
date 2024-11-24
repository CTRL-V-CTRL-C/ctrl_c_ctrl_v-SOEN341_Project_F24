
describe('Instructor view of the members', function(){

  it('Checks the members individually', ()=>{

  // login info for the instructor 
  cy.visit('/Teams'); 
  cy.get('#LoginEmail').type('joeparker13@gmail.com');
  cy.get('#LoginPassword').type('password');
  cy.get('.submit').click();


  });

}); 