import { randomLetters, uniqueRandomNumber } from "../../../server/test/utils.js";


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
            const schoolId = `STUD${uniqueRandomNumber(4)}`;
            const email = `EMAIL${randomLetters()}@gmail.com`;
            cy.visit('/registerAccount') // link to the page
            cy.get(':nth-child(1) > .field-label').type('Student'); // enter First name
            cy.get(':nth-child(2) > .field-label').type('testing'); // enter last name
            cy.get(':nth-child(4) > .field-label').type(email); // enter email
            cy.get(':nth-child(5) > .field-label').type(schoolId); // enter id
            cy.get(':nth-child(6) > .field-label').type('test1234'); // enter password
            cy.get(':nth-child(7) > .field-label').type('test1234'); // confirm password
            cy.get('.submit').click() // submit
        })

    // Student registration (error)
           it('Verification for student input  with invalid credential', () =>{
            cy.visit('/registerAccount') // link to the page
            cy.get(':nth-child(1) > .field-label').type('Student'); // enter First name
            cy.get(':nth-child(2) > .field-label').type('testing'); // enter last name
            cy.get(':nth-child(4) > .field-label').type('Studentbad@gmail.com'); // enter email
            cy.get(':nth-child(5) > .field-label').type('INST0000'); // enter id
            cy.get(':nth-child(6) > .field-label').type('test1234'); // enter password
            cy.get(':nth-child(7) > .field-label').type('test1234'); // confirm password
            cy.get('.submit').click() // submit
        })

    // Instructor registration
        it('Verification for Instructor input', () =>{
            const schoolId = `INST${uniqueRandomNumber(4)}`;
            const email = `EMAIL${randomLetters()}@gmail.com`;
            cy.visit('/registerAccount') // link to the page
            cy.get('.switch > :nth-child(3)').click(); // clicks on the student tab
            cy.get(':nth-child(1) > .field-label').type('Instructor'); // enter First name
            cy.get(':nth-child(2) > .field-label').type('test'); // enter last name
            cy.get(':nth-child(4) > .field-label').type(email); // enter email
            cy.get(':nth-child(5) > .field-label').type(schoolId); // enter id
            cy.get(':nth-child(6) > .field-label').type('tester123'); // enter password
            cy.get(':nth-child(7) > .field-label').type('tester123'); // confirm password
            cy.get('.submit').click() // submit 
        })

 // Instructor registration (error)
        it('Verification for Instructor with invalid credential ', () =>{
            cy.visit('/registerAccount') // link to the page
            cy.get('.switch > :nth-child(3)').click(); // clicks on the student tab
            cy.get(':nth-child(1) > .field-label').type('Instructor'); // enter First name
            cy.get(':nth-child(2) > .field-label').type('test'); // enter last name
            cy.get(':nth-child(4) > .field-label').type('Instructorbad@gmail.com'); // enter email
            cy.get(':nth-child(5) > .field-label').type('STUD0000'); // enter id
            cy.get(':nth-child(6) > .field-label').type('tester123'); // enter password
            cy.get(':nth-child(7) > .field-label').type('tester123'); // confirm password
            cy.get('.submit').click() // submit 
        })

})