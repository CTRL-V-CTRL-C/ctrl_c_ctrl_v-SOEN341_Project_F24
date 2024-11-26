it('should display logged-in user and corresponding teammates correctly', () => {
   
    // Log in the student
    cy.visit('/loginAccount');
    cy.get('#LoginEmail').type('joeparker1@gmail.com'); 
    cy.get('#LoginPassword').type('password'); 
    cy.get('.submit').click(); 

    // Verify that the course and team box are visible
    cy.get('.course-title').should('be.visible').and('contain', 'test_course_1'); // Course name is visible
    cy.get('.my-team-info').should('be.visible'); // Team box is visible

    // Ensure there are at least 4 visible teammate cards
    cy.get('.teammates-card .teammate-card')
        .filter(':visible') // Filter to only visible elements
        .should('have.length.gte', 4); // Assert there are at least 4 visible teammate cards
});