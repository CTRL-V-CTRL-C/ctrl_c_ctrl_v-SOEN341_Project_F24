describe('Student can review their results', () => {
  it('passes', () => {
    cy.visit('/teams')

    cy.get('#LoginEmail').type('joeparker1@gmail.com'); 
    cy.get('#LoginPassword').type('password'); 
    cy.get('.submit').click(); 

    //access reviews
    cy.get('#release-reviews').click();
    

  })
})