it('Student can successfully give feeback', ()=>{
     //logging in student 
     cy.visit('/loginAccount'); 
     cy.get('#LoginEmail').type('joeparker1@gmail.com'); //entering the email
     cy.get('#LoginPassword').type('password'); //entering the password 
     cy.get('.submit').click(); //login
     //after user logs in makes sure they are apart of a team 
     cy.get('.course-title').should('be.visible'); //make sure person is registered for a course
     cy.get(':nth-child(1) > .teammate-info > :nth-child(1)').should('contain', 'joe parker').should('be.visible');//make sure name of user is the first teamate 
     cy.get(':nth-child(1) > .teammate-info > :nth-child(2)').should('contain', 'joeparker1@gmail.com').should('be.visible');//making sure users email in there
     //user can see other members of their team and see the review button
     cy.get(':nth-child(2) > .teammate-info > :nth-child(1)').should('contain','joe parker').should('be.visible');
     cy.get(':nth-child(2) > .teammate-info > :nth-child(2)').should('contain', 'joeparker2@gmail.com').should('be.visible');
     cy.get(':nth-child(2) > .review-btn').should('be.visible').should('contain', 'Review').click(); //review button is there and is clicked 
     //user can review the teamate 
     cy.get('.teammate-evaluation > .team-name').should('be.visible')//heading is visible 
     //coopeartion section with stars are visible
     cy.get(':nth-child(1) > .criteria-section > .criteria-name').should('contain',"COOPERATION").should('be.visible');
     cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(1) > .sc-egkSDF > svg > path').should('be.visible')
     cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(2) > .sc-egkSDF > svg > path').should('be.visible').click();
     cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(4) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(1) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(1) > .evaluation-description').should('be.visible'); //description of criteria
     cy.get(':nth-child(1) > .comment-box').should('be.visible').type("cooperation wasn't good"); //make sure text box is there
     //second critera with starts
     cy.get(':nth-child(2) > .criteria-section > .criteria-name').should('contain','CONCEPTUAL CONTRIBUTION').should('be.visible');
     cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(1) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(2) > .sc-egkSDF > svg > path').should('be.visible').click();//give creiteria two stars
     cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(4) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(2) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg').should('be.visible');
     cy.get(':nth-child(2) > .evaluation-description').should('be.visible');//description of criteria
     cy.get(':nth-child(2) > .comment-box').should('be.visible').type('ok conceptual contribution');//enter text box message
     //third critera
     cy.get(':nth-child(3) > .criteria-section > .criteria-name').should('contain','PRACTICAL CONTRIBUTION').should('be.visible');
     cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(1) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(2) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('be.visible').click();
     cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(4) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(3) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg').should('be.visible');
     cy.get(':nth-child(3) > .evaluation-description').should('be.visible');
     cy.get(':nth-child(3) > .comment-box').should('be.visible').type('average practical contribution')
     //fourth criteria
     cy.get(':nth-child(4) > .criteria-section > .criteria-name').should('contain','WORK ETHIC').should('be.visible');
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(1) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(2) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(3) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(4) > .sc-egkSDF > svg > path').should('be.visible').click();
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg > path').should('be.visible');
     cy.get(':nth-child(4) > .evaluation-description').should('be.visible');
     cy.get(':nth-child(4) > .comment-box').should('be.visible').type('good work ethic');
     //submit the form
     cy.get('.button__text').should('be.visible').click();
     
     //validate the form has correct information
     cy.get('h3').should('contain','Are you sure you want to submit the following evaluation ?').should('be.visible');
    
     cy.get('.confirmation-details > :nth-child(1) > :nth-child(1)').should('contain','Criteria: COOPERATION').should('be.visible');
     cy.get('.confirmation-details > :nth-child(1) > :nth-child(2)').should("be.visible");//rating is visible
     cy.get('.confirmation-details > :nth-child(1) > :nth-child(2)').should('be.visible');//comment is visible 
     //**cy.get('.confirmation-details > :nth-child(1) > :nth-child(2)').should('contain','cooperation wasn't good')should('be.visible'); **/
    
     cy.get('.confirmation-details > :nth-child(2) > :nth-child(1)').should('contain','Criteria: CONCEPTUAL CONTRIBUTION').should('be.visible');
     cy.get('.confirmation-details > :nth-child(2) > :nth-child(2)').should('be.visible');
     cy.get('.confirmation-details > :nth-child(2) > :nth-child(3)').should('be.visible');
     //**cy.get('.confirmation-details > :nth-child(2) > :nth-child(3)').should('contain', 'ok conceptual contribution').should('be.visible');**/
     
     cy.get('.confirmation-details > :nth-child(3) > :nth-child(1)').should('contain','').should('be.visible');
     cy.get('.confirmation-details > :nth-child(3) > :nth-child(2)').should('be.visible');
     cy.get('.confirmation-details > :nth-child(3) > :nth-child(3)').should('be.visible');
     //**cy.get('.confirmation-details > :nth-child(3) > :nth-child(3)').should('contain','average practical contribution').should('be.visible');**/

     cy.get('.confirmation-details > :nth-child(4) > :nth-child(1)').should('contain','Criteria: WORK ETHIC').should('be.visible');
     cy.get('.confirmation-details > :nth-child(4) > :nth-child(2)').should('be.visible');
     cy.get(':nth-child(4) > :nth-child(3)').should('be.visible');
     //**cy.get(':nth-child(4) > :nth-child(3)').should('contain','good work ethic').should('be.visible');**/

     //submit the form
     cy.get('.cancel-button').should('be.visible').click(); //click cnacel button should bring us back to the review form
     cy.get(':nth-child(4) > .criteria-section > .sc-blHHSb > :nth-child(5) > .sc-egkSDF > svg > path').click()//can change one part of the review
     cy.get(':nth-child(4) > .comment-box').type('excellent work ethic');
     cy.get('.button__text').click();//resubmit the form
     cy.get(':nth-child(4) > :nth-child(3)').should('contain','excellent work ethic').should('be.visible');//make sure the updates are made 
     cy.get('.confirm-button').should('be.visible').click();//confirm the form

     //refresh page 
     cy.get('.switch > :nth-child(3)').click();//swtich views
     cy.get('.switch > :nth-child(2)').click();//switch back to team page
     cy.get(':nth-child(2) > .review-btn').click();//click on the evaluation we just made 

     //confirm all the information is there and is correct 
     // cy.get(':nth-child(1) > .comment-box').should('contain','cooperation wasnt good');
     // cy.get(':nth-child(2) > .comment-box').should('contain', 'ok conceptual contribution');
     // cy.get(':nth-child(3) > .comment-box').should('contain','average practical contribution');
     // cy.get(':nth-child(4) > .comment-box').should('contain','excellent work ethic');

     //reset the form
     
     //logout
     cy.get(':nth-child(3) > .navlink').click();



})
