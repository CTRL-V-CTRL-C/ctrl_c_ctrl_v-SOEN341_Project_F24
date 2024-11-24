
it('Student can successfully give feeback', ()=>{
     //logging in student 
     cy.visit('/loginAccount'); 
     cy.get('#LoginEmail').type('joeparker1@gmail.com'); //entering the email
     cy.get('#LoginPassword').type('password'); //entering the password 
     cy.get('.submit').click(); //login

     //reset the form (useful here if the test fails in the middle of doing a review and we need to rerun the test)
     cy. task("deleteEvaluation", { teamId: 1, evaluatorId: 1, evaluateeId: 2 } )

     cy.get(':nth-child(2) > .review-btn').should('be.visible').should('contain', 'Review').click(); //review button is there and is clicked 
     cy.get('.teammate-evaluation > .team-name').should('be.visible').should('contain','Evaluating: joe parker')  //teammates name appears at the top
     //first criteria with 5 stars are visible
     cy.get(':nth-child(1) > .criteria-section > .criteria-name').should('contain',"COOPERATION").should('be.visible');
     cy.get('sc-blHHSb jMEGer').each(($el,index) =>{
          cy.wrap($el).within(() =>{
               cy.get
          })
     })


     cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(1) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(2) > .sc-egkSDF > svg > path').should('be.visible').click();
     cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('be.visible').click();//giving 3 stars 
     cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(4) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(1) > .evaluation-description').should('be.visible'); //description of criteria
     cy.get(':nth-child(1) > .comment-box').should('be.visible').type("cooperation wasn't good"); //make sure text box is there and writing a comment
     //second critera with starts
     cy.get(':nth-child(2) > .criteria-section > .criteria-name').should('contain','CONCEPTUAL CONTRIBUTION').should('be.visible');
     cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(1) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(2) > .sc-egkSDF > svg > path').should('be.visible').click();//giving 2 stars
     cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(4) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(2) > .evaluation-description').should('be.visible');//description of criteria
     cy.get(':nth-child(2) > .comment-box').should('be.visible').type('ok conceptual contribution');//enter text box message
     //third critera
     cy.get(':nth-child(3) > .criteria-section > .criteria-name').should('contain','PRACTICAL CONTRIBUTION').should('be.visible');
     cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(1) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(2) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('be.visible').click();//giving 3 starts
     cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(4) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(3) > .evaluation-description').should('be.visible');
     cy.get(':nth-child(3) > .comment-box').should('be.visible').type('average practical contribution')
     //fourth criteria
     cy.get(':nth-child(4) > .criteria-section > .criteria-name').should('contain','WORK ETHIC').should('be.visible');
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(1) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(2) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(4) > .sc-egkSDF > svg > path').should('be.visible').click();//giving 4 stars
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(4) > .evaluation-description').should('be.visible');
     cy.get(':nth-child(4) > .comment-box').should('be.visible').type('good work ethic');
     //submit the form
     cy.get('.button__text').should('be.visible').click();
     
     //validate the form has correct information
     cy.get('h3').should('contain','Are you sure you want to submit the following evaluation ?').should('be.visible');
     //first criteria 
     cy.get('.confirmation-details > :nth-child(1) > :nth-child(1)').should('contain','Criteria: COOPERATION').should('be.visible');
     cy.get('.confirmation-details > :nth-child(1) > :nth-child(2)').should("be.visible").should('contain', 'Rating: 3');//rating is visible
     cy.get('.confirmation-details > :nth-child(1) > :nth-child(3)').should('be.visible').should('contain', "Comment: cooperation wasn't good");//comment is visible 
     //second criteria 
     cy.get('.confirmation-details > :nth-child(2) > :nth-child(1)').should('contain','Criteria: CONCEPTUAL CONTRIBUTION').should('be.visible');
     cy.get('.confirmation-details > :nth-child(2) > :nth-child(2)').should('be.visible').should('contain', 'Rating: 2');;
     cy.get('.confirmation-details > :nth-child(2) > :nth-child(3)').should('be.visible').should('contain', 'ok conceptual contribution').should('be.visible');
     //third criteria 
     cy.get('.confirmation-details > :nth-child(3) > :nth-child(1)').should('contain','').should('be.visible');
     cy.get('.confirmation-details > :nth-child(3) > :nth-child(2)').should('be.visible').should('contain', 'Rating: 3');;
     cy.get('.confirmation-details > :nth-child(3) > :nth-child(3)').should('contain','average practical contribution').should('be.visible');
     //fourth criteria 
     cy.get('.confirmation-details > :nth-child(4) > :nth-child(1)').should('contain','Criteria: WORK ETHIC').should('be.visible');
     cy.get('.confirmation-details > :nth-child(4) > :nth-child(2)').should('be.visible').should('contain', 'Rating: 4');;
     cy.get(':nth-child(4) > :nth-child(3)').should('contain','good work ethic').should('be.visible');

     //before confirming the form we can go back and edit the review 
     cy.get('.cancel-button').should('be.visible').click(); //cancel button should bring us back to the review form
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg > path').click();//giving 5 stars 
     cy.get(':nth-child(4) > .comment-box').type('excellent work ethic');//changing comment
     cy.get('.button__text').click();//Submit the form
     
     //check to make sure the new edit was changed in the review 
     cy.get(':nth-child(4) > :nth-child(3)').should('contain','excellent work ethic').should('be.visible');//make sure the updates are made 
     cy.get('.confirm-button').should('be.visible').click();//confirm the form

     //refresh page 
     cy.get('.switch > :nth-child(3)').click();//swtich views
     cy.get('.switch > :nth-child(2)').click();//switch back to team page
     cy.get(':nth-child(2) > .review-btn').click();//click on the evaluation we just made 

     //make sure the review is there with the correct information after refreshing
     cy.get(':nth-child(1) > .comment-box').should('contain',"cooperation wasn't good");
     cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('have.css', 'color').and('eq',"rgb(0, 0, 0)");//first criteria is 3 starts
     cy.get(':nth-child(2) > .comment-box').should('contain', 'ok conceptual contribution');
     cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(2) > .sc-egkSDF > svg > path').should('have.css', 'color').and('eq',"rgb(0, 0, 0)");//second criteria is 2 starts
     cy.get(':nth-child(3) > .comment-box').should('contain','average practical contribution');
     cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('have.css', 'color').and('eq',"rgb(0, 0, 0)");//third criteria is 3 starts
     cy.get(':nth-child(4) > .comment-box').should('contain','excellent work ethic');
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg > path').should('have.css', 'color').and('eq',"rgb(0, 0, 0)");//fourth criteria is 5 starts
    
     //deleting the review
     cy. task("deleteEvaluation", { teamId: 1, evaluatorId: 1, evaluateeId: 2 } )
     
     //logout
     cy.get(':nth-child(3) > .navlink').click();
})
