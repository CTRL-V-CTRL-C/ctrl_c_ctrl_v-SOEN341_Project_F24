describe('CSV Upload and Success Popup', () => {
    beforeEach(() => {
        //loging in the instructor
        cy.visit('/loginAccount');
        cy.get('#LoginEmail').type('joeparker13@gmail.com');
        cy.get('#LoginPassword').type('password');
        cy.get('.submit').click();
    });
});