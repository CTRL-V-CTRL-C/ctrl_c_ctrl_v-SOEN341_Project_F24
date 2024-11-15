it('Should desplay proper message after teams are created', () => {
    const fileName = '../src/assets/files/'; // Replace with your file name

    //loging in the instructor
    cy.visit('/loginAccount');
    cy.get('#LoginEmail').type('joeparker13@gmail.com');
    cy.get('#LoginPassword').type('password');
    cy.get('.submit').click();
    //after they login need to see intructors page (the upload button and correct switch menu)


});