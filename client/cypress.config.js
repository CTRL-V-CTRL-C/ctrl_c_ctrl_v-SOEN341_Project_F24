import { defineConfig } from "cypress";

import { db } from "../server/database/db.js";
import { deleteEvaluation } from "../server/database/evaluation.js";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    watchForFileChanges: false,
    fixturesFolder: 'cypress/fixtures',
    setupNodeEvents(on) {
      on("task", {
        executeSQL(SQL) {
          return db.query(SQL);
        },
        deleteEvaluation({ teamId, evaluatorId, evaluateeId }) {
          return deleteEvaluation(db, teamId, evaluatorId, evaluateeId);
        }
      })
    },
  },
});
