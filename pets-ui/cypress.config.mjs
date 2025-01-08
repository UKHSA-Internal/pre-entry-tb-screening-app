import { defineConfig } from "cypress";

import cypressMochawesomeReporter from 'cypress-mochawesome-reporter/plugin'

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {     
    charts: true,     
    reportFilename: "[name]-report",       
    timestamp: "yyyy-mm-dd-HH-MM", 
    reportDir: "cypress/reports",     
    overwrite: false,     
    html: true,     
    json: true,     
    embeddedScreenshots: true
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      cypressMochawesomeReporter(on)
      return config;
      
    },
  },
  component: {
    supportFile: false,
    devServer: {
      framework: "react",
      bundler: "vite"
    },
  },
});

