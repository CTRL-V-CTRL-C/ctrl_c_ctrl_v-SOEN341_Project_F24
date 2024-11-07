describe('All login Test functions', function(){
    
    it('should have all elements on page', () => {
        cy.visit('/loginAccount'); 
        cy.get('.form').should('exist'); 
        cy.get('.title').should('exist');
        cy.get(':nth-child(2) > .field-label').should('exist');
        cy.get(':nth-child(3) > .field-label').should('exist');
        cy.get('.submit').should('exist');
        cy.get('.signin').should('exist');
        cy.get(':nth-child(3) > .navlink').should('exist');
        cy.get(':nth-child(3) > .navlink').should('exist');
    });

    it('should login user with correct credentials',()=>{
        
    })
    
})
