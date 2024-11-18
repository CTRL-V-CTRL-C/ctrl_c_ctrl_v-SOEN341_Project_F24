it('Should desplay proper message after teams are created', () => {
    //loging in the instructor
    cy.visit('/loginAccount');
    cy.get('#LoginEmail').type('joeparker13@gmail.com');
    cy.get('#LoginPassword').type('password');
    cy.get('.submit').click();
    //after they login need to see intructors page (the upload button and correct switch menu)
    cy.get('button').click();
    //making sure popup works
    cy.get('#cvsInnerPopup').should('be.visible');
    cy.get('#cvsTitle').should("be.visible").should('contain', 'Upload File');
    cy.get('#cvsDropZone').should('be.visible');
    cy.get('#cvsDragAndDrop').should('contain', 'Drag CVS file to upload');
    cy.get('#cvsUploadFileButton').should('be.visible').should('contain', 'Choose a file');
    cy.get('#cvsChoseFileButton').should('be.visible').should('contain','Upload');
    cy.get('.close-x').should('be.visible');

});