describe('Student can review their results', () => {
  it('passes', () => {
    cy.visit('/teams')

     //login as a instructor
     cy.get('#LoginEmail').type('joeparker13@gmail.com');
     cy.get('#LoginPassword').type('password');
     cy.get('.submit').click();

     //releasing the reviews
     cy.get('#release-reviews').click();

    //login out
     cy.get('#LogoutnNav').click();

     // login in as a student 
    cy.get('#LoginEmail').type('joeparker1@gmail.com'); 
    cy.get('#LoginPassword').type('password'); 
    cy.get('.submit').click(); 

    //access reviews
    cy.get('#release-reviews').click();

    //checking if their is a pop up 
    cy.get('.eval-popup-inner').should('be.visible');
    

  })
})