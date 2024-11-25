describe('CSV Upload and Success Popup', () => {

    //loging in the instructor
    cy.visit('/loginAccount');
    cy.get('#LoginEmail').type('joeparker13@gmail.com');
    cy.get('#LoginPassword').type('password');
    cy.get('.submit').click();

    it('should create teams and show success popup on valid CSV upload', () => {
        // Intercept the API call for team creation
        cy.intercept('POST', '/api/team/create', (req) => {
            req.reply({
                statusCode: 200,
                body: { message: 'Team created successfully' },
            });
        }).as('createTeam');

        // Attach a valid CSV file
        cy.get('button').click();
        cy.get('#fileUpload').attachFile('test.csv');
        cy.get('#cvsFileDetails').should('contain', 'Name: test.csv');
        // Click the upload button
        cy.get('#cvsUploadFileButton').click();

        // Wait for the API call to complete
        cy.wait('@createTeam').its('response.statusCode').should('eq', 200);

        // Verify the success popup appears
        cy.get('.success-popup').should('be.visible');
        cy.contains('File Upload Successful').should('be.visible');
        cy.contains(`Teams were succefully added. The members that dind't have an account were created and notified by email.`).should('be.visible');
        // Close the popup
        cy.get('.success-close-button').click();
        // Ensure the popup is no longer visible
        cy.get('.success-popup').should('not.exist');
    });

});