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
    it('Written review can be edited and should show up after refreshing page', () => {

        //reset the form (useful here if the test fails in the middle of doing a review and we need to rerun the test)
        cy.task("deleteEvaluation", { teamId: 1, evaluatorId: 1, evaluateeId: 2 })

        cy.get(':nth-child(2) > .review-btn').should('be.visible').should('contain', 'Review').click(); //review button is there and is clicked 
        //checking error message
        cy.get('.button__text').click();//Submit the form
        cy.get('.error').should('be.visible').and('contain', 'Evaluate all criteria before submitting.');

        //first criteria
        cy.get(':nth-child(1) > .comment-box').type("cooperation wasnt good");
        cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').click();

        //second criteria
        cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(2) > .sc-egkSDF > svg > path').should('be.visible').click();//giving 2 stars
        cy.get(':nth-child(2) > .comment-box').should('be.visible').type('ok conceptual contribution');
        //third criteria
        cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('be.visible').click();//giving 3 starts
        cy.get(':nth-child(3) > .comment-box').should('be.visible').type('average practical contribution')
        //fourth criteria
        cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(4) > .sc-egkSDF > svg > path').should('be.visible').click();//giving 4 stars
        cy.get(':nth-child(4) > .comment-box').should('be.visible').type('good work ethic');
        //submit the form
        cy.get('.button__text').should('be.visible').click();

        //checking that correct review was redered 
        const reviewInfo = [
            { criteria: "COOPERATION", Rating: "3", Comment: "cooperation wasnt good" },
            { criteria: "CONCEPTUAL CONTRIBUTION", Rating: "2", Comment: "ok conceptual contributio" },
            { criteria: "PRACTICAL CONTRIBUTION", Rating: "3", Comment: "average practical contribution" },
            { criteria: "WORK ETHIC", Rating: "4", Comment: "good work ethic" },
        ]
        cy.get('.confirmation-details .confirmation-criteria').each(($criteria, index) => {
            cy.wrap($criteria).find('p').first().should('be.visible').and('contain', reviewInfo[index].criteria);
            // Check that the correct star rating is displayed based on the index
            cy.wrap($criteria).find('p').eq(1).should('contain.text', reviewInfo[index].Rating);
            // Check that the comment box for each criteria displays the correct comment
            cy.wrap($criteria).find('p').eq(2).should('contain.text', reviewInfo[index].Comment);
        });
        //both buttons are there 
        cy.get('.confirm-button').should('be.visible').and('contain', 'Confirm');
        cy.get('.cancel-button').should('be.visible').and('contain', 'Cancel').click();
        //editing review 
        cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg > path').click();//giving 5 stars 
        cy.get(':nth-child(4) > .comment-box').clear().type('excellent work ethic');//changing comment
        cy.get('.button__text').click();//Submit the form
        //recheck the criteria 
        cy.get('.confirmation-details > :nth-child(4) > :nth-child(2)').should('contain', '5')
        cy.get(':nth-child(4) > :nth-child(3)').should('contain', 'excellent work ethic').should('be.visible');//make sure the updates are made 
        cy.get('.confirm-button').should('be.visible').click();//confirm the form
        cy.get('.button__text').click();//Submit the form
        cy.get('.confirm-button').should('be.visible').and('contain', 'Confirm').click();//confirm 
        //refresh page
        cy.get('#secondView').click();
        cy.get('#firstView').click();
        cy.get(':nth-child(2) > .review-btn').should('be.visible').should('contain', 'Review').click();
        //make sure the review is there with the correct information after refreshing
        cy.get(':nth-child(1) > .comment-box').should('contain', "cooperation wasnt good");
        cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('have.css', 'color').and('eq', "rgb(0, 0, 0)");//first criteria is 3 starts
        cy.get(':nth-child(2) > .comment-box').should('contain', 'ok conceptual contribution');
        cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(2) > .sc-egkSDF > svg > path').should('have.css', 'color').and('eq', "rgb(0, 0, 0)");//second criteria is 2 starts
        cy.get(':nth-child(3) > .comment-box').should('contain', 'average practical contribution');
        cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('have.css', 'color').and('eq', "rgb(0, 0, 0)");//third criteria is 3 starts
        cy.get(':nth-child(4) > .comment-box').should('contain', 'excellent work ethic');
        cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg > path').should('have.css', 'color').and('eq', "rgb(0, 0, 0)");//fourth criteria is 5 starts

    });
});