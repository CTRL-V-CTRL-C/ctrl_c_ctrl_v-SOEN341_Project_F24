describe('Result view of the ', () => {
  it('passes', () => {
    cy.visit('/teams');

    //Login of the instructor
    cy.get('#LoginEmail').type('joeparker13@gmail.com');
    cy.get('#LoginPassword').type('password');
    cy.get('.submit').click();

    //accessing the results
    cy.get(':nth-child(1) > .teammates-card > .view-results-btn').click();


  });
}); 