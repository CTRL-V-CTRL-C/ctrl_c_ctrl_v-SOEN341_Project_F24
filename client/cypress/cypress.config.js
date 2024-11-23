export default defineConfig({
    e2e: {
      baseUrl: 'http://localhost:5173/',
      watchForFileChanges: false,
      fixturesFolder: 'cypress/fixtures',
      setupNodeEvents(on, config) {
        // implement node event listeners here
      },
    },
  });