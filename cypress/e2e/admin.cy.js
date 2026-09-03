describe('Admin — project status', () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.visit('/admin.html');
  });

  it('lists every project with an "In Progress" toggle', () => {
    const titles = ['Lavender Refreshments', "Jordyn's Bakes", 'Set It Up', 'Tic-Tac-Toe', 'Inspiration'];
    cy.get('.project-row').should('have.length', titles.length);
    titles.forEach((title) => {
      cy.contains('.project-row', title).find('input[type="checkbox"]').should('exist');
    });
  });

  it('loads each toggle to match the fetched status file', () => {
    cy.intercept('GET', '/data/projects-status.json', {
      'lavender-refreshments': 'live',
      'jordyns-bakes': 'in-progress',
      'set-it-up': 'live',
      'tic-tac-toe': 'live',
      inspiration: 'live',
    }).as('status');
    cy.visit('/admin.html');
    cy.wait('@status');

    cy.contains('.project-row', "Jordyn's Bakes").find('input[type="checkbox"]').should('be.checked');
    cy.contains('.project-row', 'Lavender Refreshments').find('input[type="checkbox"]').should('not.be.checked');
    cy.contains('.project-row', 'Set It Up').find('input[type="checkbox"]').should('not.be.checked');
    cy.contains('.project-row', 'Tic-Tac-Toe').find('input[type="checkbox"]').should('not.be.checked');
    cy.contains('.project-row', 'Inspiration').find('input[type="checkbox"]').should('not.be.checked');
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
