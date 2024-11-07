
describe('All register test functions',()=> {

    it('Component Presence',()=> {
        cy.visit('/registerAccount') // link to the page

        // General page 
        cy.get('.spacer').should('be.visible'); //nav bar
        cy.get(':nth-child(2) > .navlink').should('be.visible'); // login
        cy.get(':nth-child(3) > .navlink').should('be.visible'); // sign up
        cy.get('.form').should('be.visible'); // form
        cy.get('.title').should('be.visible'); // title
        cy.get('.switch > :nth-child(2)').should('be.visible'); //student tab
        cy.get('.switch > :nth-child(3)').should('be.visible'); // instructor tab
        cy.get(':nth-child(1) > .input').should('be.visible'); // fist name box
        cy.get(':nth-child(2) > .input').should('be.visible'); // last name box 
        cy.get(':nth-child(4) > .input').should('be.visible'); //email 
        cy.get(':nth-child(5) > .input').should('be.visible'); // Id
        cy.get(':nth-child(6) > .input').should('be.visible'); // password
        cy.get(':nth-child(7) > .input').should('be.visible'); // password confirmed
        
    })

    // Student registration
        it('Verification for student input', () =>{
            cy.visit('/registerAccount') // link to the page
            cy.get('.switch > :nth-child(2)').click(); // clicks on the student tab
            cy.get(':nth-child(1) > .field-label').type('test'); // enter First name
            cy.get(':nth-child(2) > .field-label').type('testing'); // enter last name
            cy.get(':nth-child(4) > .field-label').type('testtesting@gmail.com'); // enter email
            cy.get(':nth-child(5) > .field-label').type('STUD0000');
            cy.get(':nth-child(6) > .field-label').type('test123');
            cy.get(':nth-child(7) > .field-label').type('test123');
        })

    // Instructor registration
        it('Verification for student input', () =>{
            cy.visit('/registerAccount') // link to the page
            cy.get('.switch > :nth-child(3)').click(); // clicks on the student tab
            cy.get(':nth-child(1) > .field-label').type('tester'); // enter First name
            cy.get(':nth-child(2) > .field-label').type('test'); // enter last name
            cy.get(':nth-child(4) > .field-label').type('testertest@gmail.com'); // enter email
            cy.get(':nth-child(5) > .field-label').type('INST0000');
            cy.get(':nth-child(6) > .field-label').type('tester123');
            cy.get(':nth-child(7) > .field-label').type('tester123');
        })
})