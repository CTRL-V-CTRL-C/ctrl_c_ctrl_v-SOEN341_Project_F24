describe('All login Test functions', function(){

    it('should have all elements on page', () => {
        cy.visit('/loginAccount'); 
        cy.get('#LoginNav').should('be.visible');//login link
        cy.get('#SignupNav').should('be.visible');//signup link
        cy.get('.form').should('be.visible'); 
        cy.get('.title').should('be.visible');
        cy.get('#LoginEmail').should('be.visible'); //username box
        cy.get('#LoginPassword').should('be.visible');//password box
        cy.get('.submit').should('be.visible');
        cy.get('.signin').should('be.visible'); //sign in link
    });
    it('should login instuctor with correct credentials',()=>{
        //loging in the instructor
        cy.visit('/loginAccount'); 
        cy.get('#LoginEmail').type('joeparker13@gmail.com');
        cy.get('#LoginPassword').type('password');
        cy.get('.submit').click();
        //after they login need to see intructors page (the upload button and correct switch menu)
        cy.get('#firstView').should('be.visible').should('contain', 'Teams')// the teams page swtich bar on the left
        cy.get('#secondView').should('be.visible').should('contain', 'Members')//the memeberss page switch bar on the right
        cy.get('button').should('be.visible')
        cy.get('#LogoutnNav').click();//login out
    })  
    it('should login as a student with correct credentials', () =>{
        //logging in student 
        cy.visit('/loginAccount'); 
        cy.get('#LoginEmail').type('joeparker1@gmail.com'); //entering the email
        cy.get('#LoginPassword').type('password'); //entering the password 
        cy.get('.submit').click(); //login
        //after they login must show students view (correct switch menu)
        cy.get('#firstView').should('be.visible').should('contain', 'My Team'); //left side is My Teams
        cy.get('#secondView').should('be.visible').should('contain', 'Other Teams');//right side is other teams
        cy.get('#LogoutnNav').should('be.visible').click();//login out
    })  
    it('error message if we have wrong credentials ', ()=>{
        //loggin in with incorrect credentials will get an error message
        cy.visit('/loginAccount'); 
        cy.get('#LoginEmail').type('jamenorth@gmail.com'); //entering the email
        cy.get('#LoginPassword').type('password1'); //entering the password 
        cy.get('.submit').click(); //login
        cy.get('.error-message > p').should('be.visible'); 
    })
})