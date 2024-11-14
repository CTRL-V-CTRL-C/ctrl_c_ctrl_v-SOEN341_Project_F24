import { randomLetters, uniqueRandomNumber } from "../../../server/test/utils.js";


describe('All register test functions',()=> {
    it('Component Presence',()=> {
        cy.visit('/registerAccount') // link to the page

        // General page 
        cy.get('.spacer').should('be.visible'); //nav bar
        cy.get('#LoginNav').should('be.visible'); // login
        cy.get('#SignupNav').should('be.visible'); // sign up

        cy.get('.form').should('be.visible'); // form
        cy.get('.title').should('be.visible'); // title
        cy.get('#StudentAccountSelect').should('be.visible'); //student tab
        cy.get('#InstructorAccountSelect').should('be.visible'); // instructor tab

        cy.get('#RegisterFirstName').should('be.visible'); // fist name box
        cy.get('#RegisterFirstName').should('be.visible'); // last name box 
        cy.get('#RegisterEmail').should('be.visible'); //email 
        cy.get('#RegisterId').should('be.visible'); // Id
        cy.get('#RegisterPassword').should('be.visible'); // password
        cy.get('#RegisterConfirmPassword').should('be.visible'); // password confirmed
        
    })

    // Student registration
        it('Verification for student input', () =>{
            const schoolId = `STUD${uniqueRandomNumber(4)}`;
            const email = `EMAIL${randomLetters()}@gmail.com`;
            cy.visit('/registerAccount') // link to the page
            cy.get('#RegisterFirstName').type('Student'); // enter First name
            cy.get('#RegisterLastName').type('testing'); // enter last name
            cy.get('#RegisterEmail').type(email); // enter email
            cy.get('#RegisterId').type(schoolId); // enter id
            cy.get('#RegisterPassword').type('test1234'); // enter password
            cy.get('#RegisterConfirmPassword').type('test1234'); // confirm password
            cy.get('#SignUp').click() // submit
        })

    // Student registration (error)
           it('Verification for student input  with invalid credential', () =>{
            cy.visit('/registerAccount') // link to the page
            cy.get('#RegisterFirstName').type('Student'); // enter First name
            cy.get('#RegisterLastName').type('testing'); // enter last name
            cy.get('#RegisterEmail').type('Studentbad@gmail.com'); // enter email
            cy.get('#RegisterId').type('INST0000'); // enter id
            cy.get('#RegisterPassword').type('test1234'); // enter password
            cy.get('#RegisterConfirmPassword').type('test1234'); // confirm password
            cy.get('#SignUp').click() // submit
        })

    // Instructor registration
        it('Verification for Instructor input', () =>{
            const schoolId = `INST${uniqueRandomNumber(4)}`;
            const email = `EMAIL${randomLetters()}@gmail.com`;
            cy.visit('/registerAccount') // link to the page
            cy.get('.switch > :nth-child(3)').click(); // clicks on the student tab
            cy.get('#RegisterFirstName').type('Instructor'); // enter First name
            cy.get('#RegisterLastName').type('test'); // enter last name
            cy.get('#RegisterEmail').type(email); // enter email
            cy.get('#RegisterId').type(schoolId); // enter id
            cy.get('#RegisterPassword').type('tester123'); // enter password
            cy.get('#RegisterConfirmPassword').type('tester123'); // confirm password
            cy.get('#SignUp').click() // submit 
        })

 // Instructor registration (error)
        it('Verification for Instructor with invalid credential ', () =>{
            cy.visit('/registerAccount') // link to the page
            cy.get('.switch > :nth-child(3)').click(); // clicks on the student tab
            cy.get('#RegisterFirstName').type('Instructor'); // enter First name
            cy.get('#RegisterLastName').type('test'); // enter last name
            cy.get('#RegisterEmail').type('Instructorbad@gmail.com'); // enter email
            cy.get('#RegisterId').type('STUD0000'); // enter id
            cy.get('#RegisterPassword').type('tester123'); // enter password
            cy.get('#RegisterConfirmPassword').type('tester123'); // confirm password
            cy.get('#SignUp').click() // submit 
        })

})