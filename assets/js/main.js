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

// Shared frontend data model
const NThaCityData = {
  civilians: [],
  vehicles: [],
  licenses: [],
  warrants: [],
  arrests: [],
  incidents: [],
  evidence: [],
  trafficStops: [],
  calls911: [],
  officers: []
};

// Data persistence functions
function saveData() {
  localStorage.setItem('NThaCityData', JSON.stringify(NThaCityData));
}

function loadData() {
  const data = localStorage.getItem('NThaCityData');
  if (data) {
    Object.assign(NThaCityData, JSON.parse(data));
  }
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Add record functions
function addCivilian(record) {
  record.id = generateId('civ');
  record.createdAt = new Date().toISOString();
  NThaCityData.civilians.push(record);
  saveData();
  return record;
}

function addVehicle(record) {
  record.id = generateId('veh');
  record.createdAt = new Date().toISOString();
  NThaCityData.vehicles.push(record);
  saveData();
  return record;
}

function addLicense(record) {
  record.id = generateId('lic');
  record.createdAt = new Date().toISOString();
  NThaCityData.licenses.push(record);
  saveData();
  return record;
}

function add911Call(record) {
  record.id = generateId('911');
  record.createdAt = new Date().toISOString();
  NThaCityData.calls911.push(record);
  saveData();
  return record;
}

function addTrafficStop(record) {
  record.id = generateId('stop');
  record.createdAt = new Date().toISOString();
  NThaCityData.trafficStops.push(record);
  saveData();
  return record;
}

function addArrest(record) {
  record.id = generateId('arr');
  record.createdAt = new Date().toISOString();
  NThaCityData.arrests.push(record);
  saveData();
  return record;
}

function addEvidence(record) {
  record.id = generateId('evd');
  record.createdAt = new Date().toISOString();
  NThaCityData.evidence.push(record);
  saveData();
  return record;
}

function addWarrant(record) {
  record.id = generateId('war');
  record.createdAt = new Date().toISOString();
  NThaCityData.warrants.push(record);
  saveData();
  return record;
}

// Lookup functions
function lookupCivilian(query) {
  const lowerQuery = query.toLowerCase();
  return NThaCityData.civilians.filter(civ =>
    civ.firstName.toLowerCase().includes(lowerQuery) ||
    civ.lastName.toLowerCase().includes(lowerQuery) ||
    civ.discord.toLowerCase().includes(lowerQuery) ||
    (civ.id && civ.id.toLowerCase().includes(lowerQuery))
  );
}

function lookupVehiclePlate(plate) {
  const normalizedPlate = normalizePlate(plate);
  return NThaCityData.vehicles.filter(veh =>
    normalizePlate(veh.plate) === normalizedPlate
  );
}

// Helper functions
function getFormData(form) {
  const data = {};
  const formData = new FormData(form);
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

function normalizePlate(plate) {
  return plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function showFormMessage(form, message, type = 'success') {
  const status = form.querySelector('.form-status');
  if (status) {
    status.textContent = message;
    status.className = `form-status ${type}`;
  }
}

// Render functions
function renderCivilianPreview(record) {
  const container = document.getElementById('civilian-preview');
  if (!container) return;

  container.innerHTML = `
    <div class="record-preview">
      <h3>Civilian Record Created</h3>
      <div class="record-grid">
        <div><strong>Name:</strong> ${record.firstName} ${record.lastName}</div>
        <div><strong>Civilian ID:</strong> ${record.id}</div>
        <div><strong>DOB:</strong> ${record.dob}</div>
        <div><strong>Phone:</strong> ${record.phone}</div>
        <div><strong>Discord:</strong> ${record.discord}</div>
        <div><strong>Address:</strong> ${record.address}</div>
        <div><strong>Occupation:</strong> ${record.occupation}</div>
        <div><strong>Driver License:</strong> ${record.driverLicense}</div>
        <div><strong>Vehicle:</strong> ${record.vehicleMake} ${record.vehicleModel} (${record.plate})</div>
        <div><strong>Created:</strong> ${formatDate(record.createdAt)}</div>
      </div>
    </div>
  `;
}

function renderLookupResults(container, results, type) {
  if (!container) return;

  if (results.length === 0) {
    container.innerHTML = `<div class="lookup-result">No ${type} records found.</div>`;
    return;
  }

  const html = results.map(result => {
    if (type === 'civilian') {
      return `
        <div class="lookup-result">
          <h4>${result.firstName} ${result.lastName}</h4>
          <div class="result-details">
            <div><strong>ID:</strong> ${result.id}</div>
            <div><strong>DOB:</strong> ${result.dob}</div>
            <div><strong>Phone:</strong> ${result.phone}</div>
            <div><strong>Address:</strong> ${result.address}</div>
            <div><strong>Occupation:</strong> ${result.occupation}</div>
            <div><strong>Driver License:</strong> ${result.driverLicense}</div>
            <div><strong>Vehicle:</strong> ${result.vehicleMake} ${result.vehicleModel} (${result.plate})</div>
          </div>
        </div>
      `;
    } else if (type === 'vehicle') {
      return `
        <div class="lookup-result">
          <h4>Plate: ${result.plate}</h4>
          <div class="result-details">
            <div><strong>Vehicle:</strong> ${result.vehicleMake} ${result.vehicleModel} (${result.vehicleYear})</div>
            <div><strong>Color:</strong> ${result.vehicleColor}</div>
            <div><strong>Owner:</strong> ${result.ownerName}</div>
            <div><strong>Insurance:</strong> ${result.insuranceStatus}</div>
            <div><strong>Registration:</strong> ${result.registrationStatus}</div>
            <div><strong>Notes:</strong> ${result.notes || 'None'}</div>
          </div>
        </div>
      `;
    }
    return '';
  }).join('');

  container.innerHTML = html;
}

// Dashboard update function
function updateDashboard() {
  const activeUnits = document.getElementById('active-units');
  const pendingCalls = document.getElementById('pending-calls');
  const activeWarrants = document.getElementById('active-warrants');
  const recentArrests = document.getElementById('recent-arrests');
  const openReports = document.getElementById('open-reports');

  if (activeUnits) activeUnits.textContent = '14'; // Mock value
  if (pendingCalls) pendingCalls.textContent = NThaCityData.calls911.filter(c => c.status !== 'Closed').length;
  if (activeWarrants) activeWarrants.textContent = NThaCityData.warrants.filter(w => w.status === 'Active').length;
  if (recentArrests) recentArrests.textContent = NThaCityData.arrests.length;
  if (openReports) openReports.textContent = NThaCityData.incidents.length;
}

// Form handlers
function handleCivilianForm() {
  const form = document.getElementById('civilian-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = getFormData(form);
    const record = addCivilian(data);
    renderCivilianPreview(record);
    showFormMessage(form, 'Civilian profile registered successfully.');
    form.reset();
  });
}

function handle911Form() {
  const form = document.getElementById('dispatch-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = getFormData(form);
    add911Call(data);
    updateDashboard();
    showFormMessage(form, '911 call logged successfully.');
    form.reset();
  });
}

function handleTrafficForm() {
  const form = document.getElementById('traffic-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = getFormData(form);
    addTrafficStop(data);
    showFormMessage(form, 'Traffic stop logged successfully.');
    form.reset();
  });
}

function handleArrestForm() {
  const form = document.getElementById('arrest-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = getFormData(form);
    addArrest(data);
    updateDashboard();
    showFormMessage(form, 'Arrest report filed successfully.');
    form.reset();
  });
}

function handleEvidenceForm() {
  const form = document.getElementById('evidence-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = getFormData(form);
    addEvidence(data);
    showFormMessage(form, 'Evidence submitted successfully.');
    form.reset();
  });
}

function handleWarrantForm() {
  const form = document.getElementById('warrant-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = getFormData(form);
    addWarrant(data);
    updateDashboard();
    showFormMessage(form, 'Warrant added successfully.');
    form.reset();
  });
}

function handleCivilianLookupForm() {
  const form = document.getElementById('civilian-lookup-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = form.querySelector('[name="lookupQuery"]').value;
    const results = lookupCivilian(query);
    renderLookupResults(document.getElementById('civilian-lookup-results'), results, 'civilian');
    showFormMessage(form, `Found ${results.length} civilian record(s).`);
  });
}

function handlePlateLookupForm() {
  const form = document.getElementById('plate-lookup-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const plate = form.querySelector('[name="plateLookup"]').value;
    const results = lookupVehiclePlate(plate);
    renderLookupResults(document.getElementById('plate-lookup-results'), results, 'vehicle');
    showFormMessage(form, `Found ${results.length} vehicle record(s).`);
  });
}

function handleLicenseForm() {
  const form = document.getElementById('license-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = getFormData(form);
    addLicense(data);
    showFormMessage(form, 'License application submitted successfully.');
    form.reset();
  });
}

function handleVehicleForm() {
  const form = document.getElementById('vehicle-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = getFormData(form);
    addVehicle(data);
    showFormMessage(form, 'Vehicle registered successfully.');
    form.reset();
  });
}

function handleDMVPlateForm() {
  const form = document.getElementById('dmv-plate-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const plate = form.querySelector('[name="plateSearch"]').value;
    const results = lookupVehiclePlate(plate);
    renderLookupResults(document.getElementById('dmv-plate-results'), results, 'vehicle');
    showFormMessage(form, `Found ${results.length} vehicle record(s).`);
  });
}

// Map filter behavior
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

// Initialize
loadData();
handleCivilianForm();
handle911Form();
handleTrafficForm();
handleArrestForm();
handleEvidenceForm();
handleWarrantForm();
handleCivilianLookupForm();
handlePlateLookupForm();
handleLicenseForm();
handleVehicleForm();
handleDMVPlateForm();
updateDashboard();

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
