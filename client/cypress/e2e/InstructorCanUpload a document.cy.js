


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
        cy.get('#button-upload-document').click();
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

        //Reuploading the same file 
        
          //Uploading a document 
          cy.get('#button-upload-document').click();
          cy.get('label.upload-button').click();

          // Intercept the API call for upload document 
          cy.intercept('POST', '/api/upload/:courseId', (req) => {
              req.reply({
                  statusCode: 500,
                  body: { message: result.message },
              });
          }).as('upload/:courseId');

          cy.get('#fileUpload').attachFile('Sprint Planning - TASKS.pdf');
          cy.get('button.upload-button').click();
          });
        });