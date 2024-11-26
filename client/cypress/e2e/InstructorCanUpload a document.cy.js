describe('The instructor can upload a document', () => {
 
  it('Uploading a document', ()=>{
        cy.visit('/documents');

        //login 
        cy.get('#LoginEmail').type('joeparker13@gmail.com');
        cy.get('#LoginPassword').type('password');
        cy.get('.submit').click();

        //Navigating to the document page
        cy.get('#Documents').click();

        //clicking the upload button
        cy.get('#button-upload-document').click();
        //choosing a file
        cy.get('label.upload-button').click();

        // Intercept the API call for upload document 
        cy.intercept('POST', '/api/upload/:courseId', (req) => {
            req.reply({
                statusCode: 200,
                body: { message: 'The document was successfully uploaded' },
            });
        }).as('upload/:courseId');

        cy.get('#fileUpload').attachFile('Sprint Planning - TASKS.pdf');
        cy.get('button.upload-button').click();

        //checking for the success message 
        cy.get('.success').should('be.visible');

        // //Reuploading the same file 
        
        //   //clicking the upload button
        //   cy.get('#button-upload-document').click();
        //   //choosing a file
        //   cy.get('label.upload-button').click();

        //   // Intercept the API call for upload document 
        //   cy.intercept('POST', '/api/upload/:courseId', (req) => {
        //       req.reply({
        //           statusCode: 500,
        //           body: { message: result.message },
        //       });
        //   }).as('upload/:courseId');

        //   cy.get('#fileUpload').attachFile('Sprint Planning - TASKS.pdf');
        //   cy.get('button.upload-button').click();

        //   //checking for the error message
        //   cy.get('#errorDocumentUpload').should('be.visible');
          
          });
        });