describe('Admin — sign-in', () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
  });

  it('shows the password form, not the project list, when signed out', () => {
    cy.intercept('GET', '/api/admin-check', { authenticated: false }).as('check');
    cy.visit('/admin.html');
    cy.wait('@check');

    cy.get('#loginForm').should('be.visible');
    cy.get('#adminPanel').should('not.be.visible');
  });

  it('shows an error and stays on the form after a wrong password', () => {
    cy.intercept('GET', '/api/admin-check', { authenticated: false }).as('check');
    cy.intercept('POST', '/api/admin-login', { statusCode: 401, body: { error: 'Incorrect password' } }).as('login');
    cy.visit('/admin.html');
    cy.wait('@check');

    cy.get('#passwordInput').type('wrong-password');
    cy.get('#loginForm').submit();
    cy.wait('@login');

    cy.get('#loginError').should('be.visible').and('contain.text', 'Incorrect password');
    cy.get('#adminPanel').should('not.be.visible');
  });

  it('reveals the project list after a correct password', () => {
    cy.intercept('GET', '/api/admin-check', { authenticated: false }).as('check');
    cy.intercept('POST', '/api/admin-login', { statusCode: 200, body: { ok: true } }).as('login');
    cy.intercept('GET', '/data/projects-status.json', {}).as('status');
    cy.visit('/admin.html');
    cy.wait('@check');

    cy.get('#passwordInput').type('the-real-password');
    cy.get('#loginForm').submit();
    cy.wait('@login');

    cy.get('#adminPanel').should('be.visible');
    cy.get('#loginForm').should('not.be.visible');
  });

  it('returns to the password form on sign out', () => {
    cy.intercept('GET', '/api/admin-check', { authenticated: true }).as('check');
    cy.intercept('GET', '/data/projects-status.json', {}).as('status');
    cy.intercept('POST', '/api/admin-logout', { ok: true }).as('logout');
    cy.visit('/admin.html');
    cy.wait('@check');

    cy.get('#signOutBtn').click();
    cy.wait('@logout');

    cy.get('#loginForm').should('be.visible');
    cy.get('#adminPanel').should('not.be.visible');
  });
});

describe('Admin — project status', () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.intercept('GET', '/api/admin-check', { authenticated: true }).as('check');
    cy.visit('/admin.html');
    cy.wait('@check');
  });

  it('lists every project with an "In Progress" toggle', () => {
    const titles = [
      'Lavender Refreshments',
      "Jordyn's Bakes",
      'Gunita',
      'Set It Up',
      'Tic-Tac-Toe vs. Robot',
    ];
    cy.get('.project-row').should('have.length', titles.length);
    titles.forEach((title) => {
      cy.contains('.project-row', title).find('input[type="checkbox"]').should('exist');
    });
  });

  it('loads each toggle to match the fetched status file', () => {
    cy.intercept('GET', '/data/projects-status.json', {
      'lavender-refreshments': 'live',
      'jordyns-bakes': 'in-progress',
      gunita: 'in-progress',
      'set-it-up': 'live',
      'tic-tac-toe': 'live',
    }).as('status');
    cy.visit('/admin.html');
    cy.wait('@check');
    cy.wait('@status');

    cy.contains('.project-row', "Jordyn's Bakes").find('input[type="checkbox"]').should('be.checked');
    cy.contains('.project-row', 'Gunita').find('input[type="checkbox"]').should('be.checked');
    cy.contains('.project-row', 'Lavender Refreshments').find('input[type="checkbox"]').should('not.be.checked');
    cy.contains('.project-row', 'Set It Up').find('input[type="checkbox"]').should('not.be.checked');
    cy.contains('.project-row', 'Tic-Tac-Toe vs. Robot').find('input[type="checkbox"]').should('not.be.checked');
  });

  it('flags unsaved changes when a toggle is checked', () => {
    cy.get('#statusMsg').should('have.text', '');
    cy.contains('.project-row', 'Set It Up').find('input[type="checkbox"]').click();
    cy.get('#statusMsg').should('contain.text', 'Unsaved changes');
  });

  it('is marked noindex so it never shows up in search results', () => {
    cy.get('head meta[name="robots"]').should('have.attr', 'content', 'noindex, nofollow');
  });
});
