describe('CSV Upload and Success Popup', () => {
    beforeEach(() => {
        //loging in the instructor
        cy.visit('/loginAccount');
        cy.get('#LoginEmail').type('joeparker13@gmail.com');
        cy.get('#LoginPassword').type('password');
        cy.get('.submit').click();
    });

    it('should create teams and show success popup on valid CSV upload', () => {
        // Intercept the API call for team creation
        cy.intercept('POST', '/api/team/create', (req) => {
            req.reply({
                statusCode: 200,
                body: { message: 'Team created successfully' },
            });
        }).as('createTeam');

        // Attach a valid CSV file
        const filePath = 'test.csv';
        
        cy.get('button').click();
        cy.get('#cvsChoseFileButton').attachFile(filePath);

        // Click the upload button
        cy.get('#cvsUploadFileButton').click();

        // Wait for the API call to complete
        cy.wait('@createTeam').its('response.statusCode').should('eq', 200);

        // Verify the success popup appears
        cy.get('.success-popup').should('be.visible'); // Adjust the selector if necessary
        cy.contains('File Upload Successful').should('be.visible');
        cy.contains(
            `Teams were succefully added.
    The members that dind't have an account were created and notified by email.`
        ).should('be.visible');

        // Close the popup
        cy.get('.success-close-button').click();

        // Ensure the popup is no longer visible
        cy.get('.success-popup').should('not.exist');
    });








    // it('Should desplay proper message after teams are created', () => {

    //     //the upload button is clicked 
    //     cy.get('button').click();
    //     //making sure popup works
    //     cy.get('#cvsInnerPopup').should('be.visible');
    //     cy.get('#cvsTitle').should("be.visible").should('contain', 'Upload File');
    //     cy.get('#cvsDropZone').should('be.visible');
    //     cy.get('#cvsDragAndDrop').should('contain', 'Drag CVS file to upload');
    //     cy.get('.close-x').should('be.visible');
    //     cy.get('#cvsUploadFileButton').should('be.visible').should('contain', 'Upload').click();
    //     cy.get('#cvsErrorMessage').should('be.visible').should('contain', 'Please select a file before uploading.');//error message shows up if no file is uploded

    //     //Uploading the cvs file
    // });


});