describe('Admin — project status', () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.visit('/admin.html');
  });

  it('lists every project with an "In Progress" toggle', () => {
    const titles = ['Lavender Refreshments', "Jordyn's Bakes", 'Tic-Tac-Toe', 'Inspiration', 'Ticket Pricing'];
    cy.get('.project-row').should('have.length', titles.length);
    titles.forEach((title) => {
      cy.contains('.project-row', title).find('input[type="checkbox"]').should('exist');
    });
  });

  it('loads current status from the data file unchecked by default', () => {
    cy.get('.project-row input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).should('not.be.checked');
    });
  });

  it('flags unsaved changes when a toggle is checked', () => {
    cy.get('#statusMsg').should('have.text', '');
    cy.contains('.project-row', 'Ticket Pricing').find('input[type="checkbox"]').click();
    cy.get('#statusMsg').should('contain.text', 'Unsaved changes');
  });

  it('is marked noindex so it never shows up in search results', () => {
    cy.get('head meta[name="robots"]').should('have.attr', 'content', 'noindex, nofollow');
  });
});
