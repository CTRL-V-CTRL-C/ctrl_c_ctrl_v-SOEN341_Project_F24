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

    //making sure all teamate are there
    cy.get('.teammates-card').then(($el) => {
        const teamElements = Array.from($el).slice(1); //excluding the first element(which is the loged-in user)
        teamElements.each(($el, index) => {
            cy.wrap($el).within(() => { //need to wrap the team box object so that cypress can iterate over each element
                cy.log(`Checking teammate: ${expectedTeammates[index].name}`);
                cy.contains(expectedTeammates[index].name);
                cy.contains(expectedTeammates[index].email);
            });
        });
    });

});