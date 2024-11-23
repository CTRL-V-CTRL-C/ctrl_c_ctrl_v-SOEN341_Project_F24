
it('Should desplay proper message after teams are created', () => {
    //loging in the instructor
    cy.visit('/loginAccount');
    cy.get('#LoginEmail').type('joeparker13@gmail.com');
    cy.get('#LoginPassword').type('password');
    cy.get('.submit').click();
    //the upload button is clicked 
    cy.get('button').click();
    //making sure popup works
    cy.get('#cvsInnerPopup').should('be.visible');
    cy.get('#cvsTitle').should("be.visible").should('contain', 'Upload File');
    cy.get('#cvsDropZone').should('be.visible');
    cy.get('#cvsDragAndDrop').should('contain', 'Drag CVS file to upload');
    cy.get('.close-x').should('be.visible');
    cy.get('#cvsUploadFileButton').should('be.visible').should('contain','Upload').click();
    cy.get('#cvsErrorMessage').should('be.visible').should('contain', 'Please select a file before uploading.')//error message shows up if no file is uploded
    
    //Uploading the cvs file
    cy.get('#cvsChoseFileButton').should('be.visible').should('contain', 'Choose a file').click();
    cy.upload_file('../src/assets/files/test.csv', 'cvs', 'input[type="file"]');
});