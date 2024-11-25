describe('The instructor can upload a document', () => {
 
  it('Uploading a document', ()=>{
        cy.visit('/documents');

        //login 
        cy.get('#LoginEmail').type('joeparker13@gmail.com');
        cy.get('#LoginPassword').type('password');
        cy.get('.submit').click();

        //Navigating to the document page
        cy.get('#Documents').click();

        //Uploading a document 
        cy.get('#UploadButton').click();
        cy.get('label.upload-button').click();
  });
});