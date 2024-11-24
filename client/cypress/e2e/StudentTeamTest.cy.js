it('should have all elements on page', () => {
    //logging in student 
    cy.visit('/loginAccount');
    cy.get('#LoginEmail').type('joeparker1@gmail.com'); //entering the email
    cy.get('#LoginPassword').type('password'); //entering the password 
    cy.get('.submit').click(); //login
});