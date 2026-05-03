const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.global-nav');
const yearSpan = document.querySelectorAll('.current-year');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });
}

const currentYear = new Date().getFullYear();
if (yearSpan.length) {
  yearSpan.forEach((node) => {
    node.textContent = currentYear;
  });
}

const formStatus = (formId, message) => {
  const status = document.getElementById(`${formId}-status`);
  if (status) {
    status.textContent = message;
  }
};

const handleForm = (formId, successText) => {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus(formId, successText);
    form.reset();
  });
};

['civilian-form', 'dispatch-form', 'traffic-form', 'arrest-form', 'evidence-form', 'warrant-form', 'civilian-lookup-form', 'plate-lookup-form', 'license-form', 'vehicle-form', 'plate-form', 'business-form', 'application-form', 'complaint-form'].forEach((id) => {
  handleForm(id, 'Entry captured locally. Ready for future database integration.');
});

const mockLookup = (formId, responseText) => {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus(formId, responseText);
    form.reset();
  });
};

mockLookup('civilian-lookup-form', 'Civilian lookup captured. Mock record ready.');
mockLookup('plate-lookup-form', 'Plate search recorded. Flags are ready for later integration.');

const filterButtons = document.querySelectorAll('.filter-btn');
const pins = document.querySelectorAll('.map-pin');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    pins.forEach((pin) => {
      if (filter === 'all') {
        pin.style.display = 'inline-flex';
      } else {
        pin.style.display = pin.dataset.category === filter ? 'inline-flex' : 'none';
      }
    });
  });
});

const setActiveNav = () => {
  const links = document.querySelectorAll('.global-nav a');
  const path = window.location.pathname.split('/').pop();
  links.forEach((link) => {
    if (link.getAttribute('href') === path || (path === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active-link');
    }
  });
};

setActiveNav();
