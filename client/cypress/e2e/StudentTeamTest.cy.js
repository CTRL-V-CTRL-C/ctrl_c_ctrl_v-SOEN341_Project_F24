it('should display login-in user and correspoding teammates correctly', () => {

    const expectedTeammates = [
        { name: 'joe parker', email: "joeparker2@gmail.com" },
        { name: 'joe parker', email: "joeparker3@gmail.com" },
        { name: 'joe parker', email: "joeparker4@gmail.com" },
    ];

    //logging in student 
    cy.visit('/loginAccount');
    cy.get('#LoginEmail').type('joeparker1@gmail.com'); //entering the email
    cy.get('#LoginPassword').type('password'); //entering the password 
    cy.get('.submit').click(); //login

    // Checking that course and team box are visible
    cy.get('.course-title').should('be.visible').should('contain', 'test_course_1');//couse name is visible
    cy.get('.my-team-info').should('be.visible');//team box is visible

    //making sure the first elemnt is the loged-in user
    cy.get('.teammates-card').first().within(() => {
        cy.contains('joe parker');
        cy.contains('joeparker1@gmail.com');
    });
    cy.get('.teammates-card').should('exist').and('have.length.at.least', 2);

    //making sure all teamate are there
    cy.get('.teammates-card').each(($el,index) => {
        if (index >0){
            cy.wrap($el).within(() => { //need to wrap the team box object so that cypress can iterate over each element
                cy.log(`Checking teammate: ${expectedTeammates[index].name}`);
                cy.contains(expectedTeammates[index-1].name);
                cy.contains(expectedTeammates[index-1].email);
            });
        }
    });

});