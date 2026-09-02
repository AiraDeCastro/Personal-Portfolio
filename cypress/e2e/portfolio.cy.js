describe('Portfolio site', () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.visit('/');
  });

  it('renders the hero section with headline and CTAs', () => {
    cy.get('.hero-title').should('be.visible').and('contain.text', 'I build things');
    cy.contains('.hero-actions a', 'View my work').should('have.attr', 'href', '#work');
    cy.contains('.hero-actions a', "Let's talk").should('have.attr', 'href', '#contact');
  });

  it('has a nav bar linking to every section', () => {
    const sections = ['#work', '#skills', '#about', '#contact'];
    sections.forEach((hash) => {
      cy.get(`.main-nav a[href="${hash}"]`).should('exist');
      cy.get(hash).should('exist');
    });
  });

  it('turns the header solid after scrolling past the hero', () => {
    cy.get('.site-header').should('not.have.class', 'is-scrolled');
    cy.scrollTo(0, 400);
    cy.get('.site-header').should('have.class', 'is-scrolled');
  });

  it('lists project cards with a title, tags, and a working GitHub link', () => {
    cy.get('.project-card').should('have.length.at.least', 4);
    cy.get('.project-card').each(($card) => {
      cy.wrap($card).find('h3').should('not.be.empty');
      cy.wrap($card)
        .find('.project-links a[href*="github.com/AiraDeCastro"]')
        .should('exist');
    });
  });

  it('lists all skill categories', () => {
    const categories = [
      'Languages',
      'Systems & Tools',
      'Software Development',
      'AI & Automation',
      'QA & Testing',
      'Certifications',
    ];
    categories.forEach((category) => {
      cy.get('.skill-block h3').contains(category).should('exist');
    });
  });

  it('shows working contact links in the footer', () => {
    cy.get('.contact-links a[href^="mailto:"]').should('exist');
    cy.get('.contact-links a[href^="tel:"]').should('exist');
    cy.get('.contact-links a').contains('LinkedIn').should('have.attr', 'href').and('include', 'linkedin.com');
    cy.get('.contact-links a').contains('GitHub').should('have.attr', 'href').and('include', 'github.com');
  });

  it('opens and closes the mobile nav menu', () => {
    cy.viewport(390, 844);
    cy.get('#mainNav').should('not.have.class', 'is-open');
    cy.get('#navToggle').click();
    cy.get('#mainNav').should('have.class', 'is-open');
    cy.get('#mainNav a').first().click();
    cy.get('#mainNav').should('not.have.class', 'is-open');
  });
});
