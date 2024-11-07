
describe('All register test functions',()=> {

    it('Component Presence',()=> {
        cy.visit('/registerAccount') // link to the page
        
        // General page 
        cy.get('.spacer').should('be.visible') //nav bar
        cy.get(':nth-child(2) > .navlink').should('be.visible') // login
        cy.get(':nth-child(3) > .navlink').should('be.visible') // sign up
        cy.get('.form').should('be.visible').should('be.visible') // form
        cy.get('.title').should('be.visible').should('be.visible') // title
    
        // Student registration
        
        cy.get('.switch > :nth-child(2)').should('be.visible') //student tab
        cy.get('.switch > :nth-child(3)').should('be.visible') // instructor tab
        cy.get(':nth-child(1) > .input')// fist name box
        cy.get(':nth-child(2) > .input') // last name box 
        cy.get(':nth-child(4) > .input') //email 
        cy.get(':nth-child(4) > .input') // Id
    })
})