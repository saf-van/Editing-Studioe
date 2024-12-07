// script.js
const subjectContainer = document.getElementById('subjectContainer');
const addSubjectBtn = document.getElementById('addSubjectBtn');

// Function to create a subject with dropdown modules
function createSubject(subjectName, modules = []) {
  const collapseId = `collapse-${subjectName.replace(/\s+/g, '-').toLowerCase()}`;

  const subjectCard = document.createElement('div');
  subjectCard.classList.add('accordion-item', 'mb-3');

  subjectCard.innerHTML = `
    <div class="accordion-header">
      <button
        class="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#${collapseId}"
        aria-expanded="false"
        aria-controls="${collapseId}">
        ${subjectName}
      </button>
    </div>
    <div id="${collapseId}" class="accordion-collapse collapse">
      <div class="accordion-body">
        <ul class="list-group mb-3">
          ${modules.map(module => `<li class="list-group-item"><a href="${module.link}" target="_blank">${module.name}</a></li>`).join('')}
        </ul>
        <button class="btn btn-sm btn-primary" onclick="addModule('${collapseId}')">+ Add Module</button>
      </div>
    </div>
  `;

  subjectContainer.appendChild(subjectCard);
}

// Function to add a module to a subject
function addModule(collapseId) {
  const moduleName = prompt('Enter the module name:');
  const moduleLink = prompt('Enter the module link:');
  if (moduleName && moduleLink) {
    const moduleList = document.querySelector(`#${collapseId} .list-group`);
    const moduleItem = document.createElement('li');
    moduleItem.classList.add('list-group-item');
    moduleItem.innerHTML = `<a href="${moduleLink}" target="_blank">${moduleName}</a>`;
    moduleList.appendChild(moduleItem);
  }
}

// Event listener for adding a new subject
addSubjectBtn.addEventListener('click', () => {
  const subjectName = prompt('Enter the subject name:');
  if (subjectName) {
    createSubject(subjectName);
  }
});

// Example preloaded subjects
createSubject('Python', [
  { name: 'Module 1: hello', link: 'https://example.com/algebra' },
  { name: 'Module 2: there', link: 'https://example.com/geometry' },
]);

createSubject('Chemistry', [
  { name: 'Module 1: hey', link: 'https://example.com/physics' },
  { name: 'Module 2: hai', link: 'https://example.com/chemistry' },
]);

createSubject('Electronics', [
    { name: 'Module 1: hey', link: 'https://example.com/physics' },
    { name: 'Module 2: hai', link: 'https://example.com/chemistry' },
  ]);
