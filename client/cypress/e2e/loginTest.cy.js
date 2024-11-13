describe('All login Test functions', function(){

    it('should have all elements on page', () => {
        cy.visit('/loginAccount'); 
        cy.get('#LoginNav').should('be.visible');//login link
        cy.get('#SignupNav').should('be.visible');//signup link
        cy.get('.form').should('be.visible'); 
        cy.get('.title').should('be.visible');
        cy.get(':nth-child(2) > .field-label').should('be.visible'); //username box
        cy.get(':nth-child(3) > .field-label').should('be.visible');//password box
        cy.get('.submit').should('be.visible');
        cy.get('.signin').should('be.visible'); //sign in link
    });
    it('should login instuctor with correct credentials',()=>{
        //loging in the instructor
        cy.visit('/loginAccount'); 
        cy.get(':nth-child(2) > .field-label').type('joeparker13@gmail.com');
        cy.get(':nth-child(3) > .field-label').type('password');
        cy.get('.submit').click();
        //after they login need to see intructors page (the upload button and correct switch menu)
        cy.get('.switch > :nth-child(2)').should('be.visible')// the teams page swtich bar on the left
        cy.get('.switch > :nth-child(3)').should('be.visible')//the memeberss page switch bar on the right
        cy.get('button').should('be.visible')
        cy.get('#LogoutnNav').click();//login out
    })  
    it('should login as a student with correct credentials', () =>{
        //logging in student 
        cy.visit('/loginAccount'); 
        cy.get(':nth-child(2) > .field-label').type('joeparker1@gmail.com'); //entering the email
        cy.get(':nth-child(3) > .field-label').type('password'); //entering the password 
        cy.get('.submit').click(); //login
        //after they login must show students view (correct switch menu)
        cy.get('.switch > :nth-child(2)').should('be.visible');
        cy.get('.switch > :nth-child(3)').should('be.visible')
        cy.get('#LogoutnNav').should('be.visible').click();//login out
    })  
    it('error message if we have wrong credentials ', ()=>{
        //loggin in with incorrect credentials will get an error message
        cy.visit('/loginAccount'); 
        cy.get(':nth-child(2) > .field-label').type('jamenorth@gmail.com'); //entering the email
        cy.get(':nth-child(3) > .field-label').type('password1'); //entering the password 
        cy.get('.submit').click(); //login
        cy.get('.error-message > p').should('be.visible'); 
    })
})