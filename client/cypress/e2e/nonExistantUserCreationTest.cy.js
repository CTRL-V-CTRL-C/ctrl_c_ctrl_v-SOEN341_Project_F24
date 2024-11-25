describe('CSV Upload and Success Popup', () => {

    it('should create teams and show success popup on valid CSV upload', () => {
        //loging in the instructor
        cy.visit('/loginAccount');
        cy.get('#LoginEmail').type('joeparker13@gmail.com');
        cy.get('#LoginPassword').type('password');
        cy.get('.submit').click();
        // Intercept the API call for team creation

        cy.get('#csvUploadButton').click();
    });

});