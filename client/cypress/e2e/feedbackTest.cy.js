it('Student can successfully give feeback', ()=>{
     //logging in student 
     cy.visit('/loginAccount'); 
     cy.get(':nth-child(2) > .field-label').type('joeparker1@gmail.com'); //entering the email
     cy.get(':nth-child(3) > .field-label').type('password'); //entering the password 
     cy.get('.submit').click(); //login
     //after they login must show students view (correct switch menu)
     cy.get('button').should('be.visible')
     cy.get(':nth-child(3) > .navlink').click();//login out
})