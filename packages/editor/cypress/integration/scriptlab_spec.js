/// <reference types="Cypress" />

// sample solutions
import Solution1 from '../sampleData/solutions/BlankWeb.json';
import BlankExcel from '../sampleData/solutions/BasicExcel.json';
import ReportGeneration from '../sampleData/solutions/ReportGeneration.json';

const EDITOR_URL = 'https://localhost:3000/';

function openExcelFromBlank() {
  getByTestId('new').click();

  getByTestId('host-selector').click();

  cy.get('.ms-ContextualMenu-list')
    .contains('EXCEL')
    .click();
}

// Tested Features
// 1. Create
// 2. Delete
// 3. Edit metadata
// 3. Edit file (in memory)
// 4. Edit file (localStorage)

// Helper Tasks
// - open editor this localStorage and this sessionStorage
// - Select Item on Backstage Menu

context('Script Lab Solutions', () => {
  it('create new solution', () => {
    // setup
    const solutions = [Solution1, BlankExcel, ReportGeneration];
    const host = 'EXCEL';
    const localStorage = solutions.reduce(
      (all, solution) => ({ ...all, [`solution#${solution.id}`]: solution }),
      {},
    );

    const startingSolutionCount = solutions.reduce((count, solution) => {
      return count + (solution.host === host ? 1 : 0);
    }, 0);

    openEditorWithState({
      sessionStorage: { host },
      localStorage,
    });

    // open backstage and click new button
    getByTestId('nav').click();
    getByTestId('new').click();

    // open backstage and validate that there is an additional solution
    getByTestId('nav').click();
    getByTestId('my-solution-list')
      .children()
      .should('have.length', startingSolutionCount + 1);
  });

  it('delete solution', () => {
    // setup
    const solutions = [Solution1, BlankExcel, ReportGeneration];
    const host = 'EXCEL';
    const localStorage = solutions.reduce(
      (all, solution) => ({ ...all, [`solution#${solution.id}`]: solution }),
      {},
    );

    const startingSolutionCount = solutions.reduce((count, solution) => {
      return count + (solution.host === host ? 1 : 0);
    }, 0);

    openEditorWithState({
      sessionStorage: { host },
      localStorage,
    });

    const solutionToDelete = ReportGeneration;
    openSolutionFromEditor(solutionToDelete.id);

    // click delete button
    getByTestId('delete').click();
    getByTestId('no-button').click(); // should close dialog

    getByTestId('delete').click();
    getByTestId('yes-button').click(); // this time click yes

    // open backstage and validate that there is an additional solution
    getByTestId('nav').click();
    getByTestId('my-solution-list')
      .children()
      .should('have.length', startingSolutionCount - 1);
  });

  it('change tabs (switch files)', () => {
    // opening with empty localStorage should land on backstage
    openEditorWithState({
      sessionStorage: { host: 'EXCEL' },
    });

    // click new on backstage
    getByTestId('new').click();

    // verify that CSS isn't selected
    getByTestId('file-switcher-pivot')
      .contains('CSS')
      .as('CSS')
      .should('not.be', 'active')
      .click();

    // verify that CSS is selected
    cy.get('@CSS').should('be', 'active');
  });

  it('edit solution name and description', () => {
    const solutions = [Solution1, BlankExcel, ReportGeneration];
    const host = 'EXCEL';
    const localStorage = solutions.reduce(
      (all, solution) => ({ ...all, [`solution#${solution.id}`]: solution }),
      {},
    );

    openEditorWithState({ sessionStorage: { host }, localStorage });

    openSolutionFromEditor(ReportGeneration.id);

    const newSolutionInfo = {
      name: 'New Solution Name',
      description: 'New Description',
    };

    getByTestId('solution-name').click();

    getByTestId('solution-name-field')
      .clear()
      .type(newSolutionInfo.name);
    getByTestId('solution-desc-field')
      .clear()
      .type(newSolutionInfo.description);

    cy.wait(100);
    getByTestId('update').click();

    // info should be updated

    getByTestId('solution-name').contains(newSolutionInfo.name);

    getByTestId('nav').click();

    getByTestId('my-solution-list').contains(newSolutionInfo.name);
    getByTestId('my-solution-list').contains(newSolutionInfo.description);
  });

  it('edit a solution (in memory)', () => {
    const solutions = [Solution1, BlankExcel, ReportGeneration];
    const host = 'EXCEL';
    const localStorage = solutions.reduce(
      (all, solution) => ({ ...all, [`solution#${solution.id}`]: solution }),
      {},
    );

    openEditorWithState({
      sessionStorage: { host },
      localStorage,
    });

    openSolutionFromEditor(ReportGeneration.id);

    const textToSet = '// This is a test\n';
    clearEditor()
      .then(() => editTextInMonacoEditor(textToSet))
      .then(() => formatDocument());

    openSolutionFromEditor(BlankExcel.id);
    cy.wait(1000);
    openSolutionFromEditor(ReportGeneration.id);
    cy.wait(1000);
    getEditorValue().then(value => expect(value).to.equal(textToSet.trim()));
  });

  it('edit a solution (persisted to localStorage)', () => {
    const solutions = [Solution1, BlankExcel, ReportGeneration];
    const host = 'EXCEL';
    const localStorage = solutions.reduce(
      (all, solution) => ({ ...all, [`solution#${solution.id}`]: solution }),
      {},
    );

    openEditorWithState({
      sessionStorage: { host },
      localStorage,
    });

    openSolutionFromEditor(ReportGeneration.id);

    const textToSet = '// This is a test\n';
    clearEditor()
      .then(() => editTextInMonacoEditor(textToSet))
      .then(() => formatDocument());

    openSolutionFromEditor(BlankExcel.id);
    cy.wait(1000);
    openSolutionFromEditor(ReportGeneration.id);

    // same as test above but in this test we refresh the page after editing
    cy.visit(EDITOR_URL);
    cy.wait(5000);
    openSolutionFromEditor(ReportGeneration.id);

    getEditorValue().then(value => expect(value).to.equal(textToSet.trim()));
  });
});

// Helpers
const getByTestId = id => cy.get(`[data-testid=${id}]`);

function openEditorWithState({ localStorage, sessionStorage }) {
  cy.window().then(win => {
    win.sessionStorage.clear();
    win.localStorage.clear();

    if (sessionStorage) {
      Object.entries(sessionStorage).forEach(([key, value]) =>
        win.sessionStorage.setItem(
          key,
          typeof value === 'string' ? value : JSON.stringify(value),
        ),
      );
    }

    if (localStorage) {
      Object.entries(localStorage).forEach(([key, value]) =>
        win.localStorage.setItem(
          key,
          typeof value === 'string' ? value : JSON.stringify(value),
        ),
      );
    }

    cy.visit(EDITOR_URL);
  });
}

function openSolutionFromEditor(solutionSearchString) {
  getByTestId('nav').click();
  getByTestId('my-solutions').click();
  getByTestId('solution-search').type(solutionSearchString);
  getByTestId('my-solution-list')
    .children()
    .should('have.length.gte', 1); // ensure at least 1 solution is found
  cy.get('[data-testid="my-solution-list"] > article:first-child').click();
}

function getNumberOfVisibleSolutionsInBackstage() {}

// monaco editor
function editTextInMonacoEditor(text) {
  return cy.window().then(win => win.MONACO_EDITOR.trigger('keyboard', 'type', { text }));
}

function getEditorValue() {
  return cy.window().then(win => win.MONACO_EDITOR.getValue().trim());
}

function clearEditor() {
  return cy.window().then(win => win.MONACO_EDITOR.setValue(''));
}

function formatDocument() {
  return cy
    .window()
    .then(win =>
      win.MONACO_EDITOR.trigger(
        'editor' /* source, unused */,
        'editor.action.formatDocument',
        '' /* payload, unused */,
      ),
    );
}
