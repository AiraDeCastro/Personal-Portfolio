// Course objects
const courses = [
    { code: 'MAT8001C', name: 'Technical Math for Computer Science', term: 'Term 1', description:'The study of algebraic and transcendental functions is an essential prerequisite to Calculus.', image:'../Assignment1/images/MathematicsWithCalculus.jpeg'},
    { code: 'CST8215', name: 'Introduction to Database', term: 'Term 1', description:'Databases are used to store data and are a core component of many information technology systems.', image:'../Assignment1/images/DatabaseProcessing.jpeg'},
    { code: 'CST8116', name: 'Introduction to Computer Programming', term: 'Term 1', description:'Possessing the fundamentals of logic, problem-solving and programming language structure provides a solid foundation for further study in the field.',image:'../Assignment1/images/ProgrammingLogicDesign.jpeg'},
    { code: 'CST8101', name: 'Computer Essentials', term: 'Term 1', description:'Maintaining a computer, using operating system and productivity software, and expressing related environmental and sustainability concerns, is an important part of working with Information Technology.', image:'../Assignment1/images/ComputerEssentials.jpeg'},
    { code: 'CST8300', name: 'Achieving Success in Changing Environments', term: 'Term 1', description:'Rapid changes in technology have created personal and employment choices that challenge each of us to find our place as contributing citizens in the emerging society.', image:'../Assignment1/images/success.jpg'},
    { code: 'ENL1813T', name: 'Communications I', term: 'Term 1', description:'Communication remains an essential skill sought by employers, regardless of discipline or field of study. Using a practical, vocation-oriented approach, students focus on meeting the requirements of effective communication.', image:'../Assignment1/images/TechnicalScientificWriting.gif'},
    { code: 'ENL2019T', name: 'Technical Communication for Engineering Technology', term: 'Term 2', description:'The ability to communicate effectively in a technically-oriented interdisciplinary workplace is a foundational skill in an innovation-driven economy.', image:'../Assignment1/images/TechnicalScientificWriting.gif'},
    { code: 'CST2355', name: 'Database Systems', term: 'Term 2', description:'Database systems can automate data processing tasks as well as tie into the security of information technology systems.', image:'../Assignment1/images/DatabaseProcessing.jpeg'},
    { code: 'CST8285', name: 'Web Programming', term: 'Term 2', description:'The World Wide Web (WWW) has become an integrated part of everyday life.', image:'../Assignment1/images/Web.jpg'},
    { code: 'CST8284', name: 'Object Oriented Programming', term: 'Term 2', description:'Working in the field of information technology as a programmer requires a firm understanding of Object-Oriented Programming (OOP) concepts.', image:'../Assignment1/images/java.jpg'},
    { code: 'CST8102', name: 'Operating Systems Fundamentals', term: 'Term 2', description:'Operating systems form the backbone of information technology systems coordinating the interaction between hardware and software.', image:'../Assignment1/images/Linux.jpg'},
    { code: 'GED6022', name: 'A Sense of Humour', term: 'Term 2', description:'Humour is a universal tool of communication and social influence.', image:'../Assignment1/images/humor.png'},
    { code: 'GEP1001', name: 'Cooperative Education Readiness', term: 'Term 2', description:'Cooperative Education Readiness Outline provides a detailed description of the Cooperative Education Readiness activities and a summary of the key deadlines.', image:'../Assignment1/images/coop.jpg'},
];

// Function to sort courses by course code
function sortByCourseCode(courses) {
    return courses.sort((a, b) => {
        if (a.code < b.code) return -1;
        if (a.code > b.code) return 1;
        return 0;
    });
}  
// Function to filter courses by term
function filterByTerm(courses, term) {
    return courses.filter(course => course.term === term);
}

// Sort and filter courses for Term 1
const term1Courses = filterByTerm(sortByCourseCode(courses), 'Term 1');
    console.log('Term 1 Courses:');
    console.log(term1Courses);

// Sort and filter courses for Term 2
const term2Courses = filterByTerm(sortByCourseCode(courses), 'Term 2');
    console.log('Term 2 Courses:');
    console.log(term2Courses);

// Function to filter courses by search query
function filterBySearchQuery(courses, query) {
    return courses.filter(course => {
        const courseName = course.name.toLowerCase();
        const courseCode = course.code.toLowerCase();
        const searchTerm = query.toLowerCase();
        return courseName.includes(searchTerm) || courseCode.includes(searchTerm);
    });
}

// Function to render filtered courses
function renderCourses(courses) {
    const container = document.getElementById('course-container');
    container.innerHTML = '';

courses.forEach(course => {
    const courseElement = document.createElement('div');
    courseElement.textContent = `${course.code} - ${course.name} (${course.term})`;
    container.appendChild(courseElement);
    });
}
// Event listener for search bar
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', () => {
    const searchQuery = searchBar.value.trim();
    const filteredCourses = filterBySearchQuery(courses, searchQuery);
    renderCourses(filteredCourses);
});

// Initial rendering of all courses
renderCourses(courses);

// Function to filter courses by term
function filterByTerm(courses, term) {
    return courses.filter(course => course.term === term);
}

// Function to render filtered courses
function renderCourses(courses) {
    const container = document.getElementById('course-container');
    container.innerHTML = '';
    const courseContainer = document.getElementById('course-container');
    courseContainer.innerHTML = '';

    courses.forEach(course => {
        const courseItem = document.createElement('li');
        courseItem.innerHTML = `
            <div class="js-courses">
            <img src='${course.image}'>
            <h2>${course.code} - ${course.name} (${course.term})</h2>
            <p>${course.description}</p>
            </div>`;
        courseContainer.appendChild(courseItem);
    });
}

// Initial rendering of all courses
renderCourses(courses);

// Function to show Term 1 courses
function showTerm1Courses() {
    const term1Courses = filterByTerm(courses, 'Term 1');
    renderCourses(term1Courses);
}

// Function to show Term 2 courses
function showTerm2Courses() {
    const term2Courses = filterByTerm(courses, 'Term 2');
    renderCourses(term2Courses);
}
// Function to sort courses by term number
function sortByTerm1() {
    const sortedCourses = courses.sort((a, b) => {
        const termNumA = getTermNumber(a.term);
        const termNumB = getTermNumber(b.term);
        return termNumA - termNumB;
    });

    renderCourses(sortedCourses);
}

function sortByTerm2() {
    const sortedCourses = courses.sort((a, b) => {
        const termNumA = getTermNumber(a.term);
        const termNumB = getTermNumber(b.term);
        return termNumB - termNumA;
    });

    renderCourses(sortedCourses);
}
// Helper function to get term number from term string
function getTermNumber(term) {
    const termNum = term.replace('Term ', '');
    return parseInt(termNum);
}

document.head.appendChild(style);