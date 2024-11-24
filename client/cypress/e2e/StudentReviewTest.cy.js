describe('Students can give feedback', function () {
    beforeEach(() => {
        //loging in the instructor
        cy.visit('/loginAccount');
        cy.get('#LoginEmail').type('joeparker1@gmail.com');
        cy.get('#LoginPassword').type('password');
        cy.get('.submit').click();
    });

    it('review popup is rendered with proper elements', () => {
        const criteria = [
            'COOPERATION',
            'CONCEPTUAL CONTRIBUTION',
            'PRACTICAL CONTRIBUTION',
            'WORK ETHIC'
        ]
        cy.get(':nth-child(2) > .review-btn').should('be.visible').should('contain', 'Review').click(); //review button is there and is clicked 
        cy.get('.teammate-evaluation > .team-name').should('be.visible').should('contain', 'Evaluating: joe parker')//reviewing teammates name is at the top

        //iterating over each critera box to make sure everything is rendered
        cy.get('.teammates-card').eq(1).within(() => {//picking the second element with that classname
            cy.get('.criteria-section').each(($section, index) => {
                cy.wrap($section).parent().within(() => {
                    cy.get('.criteria-name').should('be.visible').and('contain', criteria[index]);
                    cy.get('label').should('have.length', 5);//5 starts are visible
                    cy.get('.evaluation-description').should('be.visible').and('contain.text', 'Did they');
                    cy.get('textarea.comment-box').should('exist').and('be.visible');
                })
            })
        })
    });

});