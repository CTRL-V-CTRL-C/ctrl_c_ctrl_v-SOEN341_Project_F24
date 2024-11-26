describe('Debug fixture file', () => {
    it('Loads test.csv from fixtures', () => {
      cy.fixture('test.csv').then((fileContent) => {
        cy.log('File content:', fileContent);
      });
    });
  });