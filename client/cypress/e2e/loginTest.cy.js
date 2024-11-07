describe('All login Test functions', function(){

    it('should have all elements on page', () => {
        cy.visit('/loginAccount'); 
        cy.get(':nth-child(3) > .navlink').should('be.visible');//login link
        cy.get(':nth-child(3) > .navlink').should('be.visible');//signup link
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
        cy.get(':nth-child(2) > .field-label').type('jamesnorth@gmail.com');
        cy.get(':nth-child(3) > .field-label').type('password');
        cy.get('.submit').click();
        //after they login need to see other elements
        cy.get('.switch > :nth-child(2)').should('be.visible')// the teams page swtich bar on the left
        cy.get('.switch > :nth-child(3)').should('be.visible')//the memeberss page switch bar on the right
        cy.get('button').should('be.visible')
        cy.get(':nth-child(3) > .navlink').click();//login out
    })  
    it('should login as a student with correct credentials', () =>{
        cy.visit('/loginAccount'); 
        cy.get(':nth-child(2) > .field-label').type('joeparker@gmail.com');
        cy.get(':nth-child(3) > .field-label').type('password');
        cy.get('.submit').click(); //login
        cy.get('button').should('be.visible')
        cy.get(':nth-child(3) > .navlink').click();//login out
    })  
})
