'use strict';

let currentStep = 0;
const totalSteps = 2;

// Validation
let formErrors = {};
const validations = {
  step_0: {
    first_name: ['required'],
    last_name: ['required'],
    email: ['required', 'email'],
    phone: ['phone'],
  },
  step_1: {
    street_number: ['required', 'numeric'],
    street_name: ['required'],
    street_type: ['required'],
    suburb: ['required'],
    postcode: ['required', 'postcode'],
  }
};

function initialiseFormErrors() {
  let formErrors = {};
  Object.keys(validations[`step_${currentStep}`]).forEach(key => formErrors[key] = []);
}

function hasAnyErrors() {
  for (let field in formErrors) {
    if (formErrors[field].length > 0) {
      return true;
    }
  }
  return false;
}

function recordErrors(field, errors) {
  formErrors[field] = errors;
  renderErrors();
}

function clearErrors(field) {
  formErrors[field] = [];
  renderErrors();
}

function renderErrors() {
  for (let field in formErrors) {
    if (formErrors[field].length > 0) {
      showError(field, formErrors[field]);
    } else {
      removeError(field);
    }
  }
  updateButtons();
}

function showError(field, errors) {
  let isSelect = false;
  let fieldDOM = document.querySelector(`input[name='${field}`);
  if (!fieldDOM) {
    // try finding select field
    fieldDOM = document.querySelector(`select[name='${field}`);
    isSelect = true;
  }

  if (fieldDOM) {
    const errorMessage = errors.join('. ');
    let errorsDiv;
    const container = isSelect ? fieldDOM.parentNode : fieldDOM;

    if (errorsDiv = container.parentNode.querySelector('.error')) {
      errorsDiv.innerHTML = errorMessage;
    } else {
      container.classList.add('is-danger');
      errorsDiv = document.createElement('div');
      errorsDiv.classList.add('error', 'has-text-danger');
      errorsDiv.innerHTML = errorMessage;
      container.after(errorsDiv);
    }
  }
}

function removeError(field) {
  let isSelect = false;
  let fieldDOM = document.querySelector(`input[name='${field}`);
  if (!fieldDOM) {
    // try finding select field
    fieldDOM = document.querySelector(`select[name='${field}`);
    isSelect = true;
  }

  if (fieldDOM) {
    const container = isSelect ? fieldDOM.parentNode : fieldDOM;
    container.classList.remove('is-danger');
    const errorsDivs = container.parentNode.querySelectorAll('.error');
    errorsDivs.forEach(errorsDiv => container.parentNode.removeChild(errorsDiv));
  }
}

function validateField(field) {
  const {name, tagName} = field;
  let value = null;
  if (tagName === 'SELECT') {
    value = field.options[field.selectedIndex].value;
  } else if (tagName === 'INPUT') {
    value = field.value;
  }
  validate(name, value);
}

function validateForm() {
  const inputs = document.querySelectorAll('input');
  inputs && inputs.forEach(input => validateField(input));

  const selects = document.querySelectorAll('select');
  selects && selects.forEach(select => {
    validateField(select)
  });
}

function validate(field, value) {
  const rules = validations[`step_${currentStep}`][field];
  const errors = [];
  rules && rules.forEach(rule => {
    const error = check(value, rule);
    if (error) {
      errors.push(error);
    }
  });

  if (errors.length > 0) {
    recordErrors(field, errors);
  } else {
    clearErrors(field);
  }
}

function check(value, rule) {
  if (rule === 'required' && value.trim() === '') {
    return 'Field cannot be empty';
  }
  if (rule === 'email' && !validateEmail(value)) {
    return 'Not a valid email';
  }
  if (rule === 'phone' && !validatePhone(value)) {
    return 'Not a valid phone number';
  }
  if (rule === 'postcode' && !validatePostcode(value)) {
    return 'Not a valid postcode';
  }
  if (rule === 'numeric' && isNaN(value)) {
    return 'Not a valid number';
  }
}

function validateEmail(email) {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  phone = phone.trim();
  if (phone === '') return true;
  const phoneRegex = /^0[0-8]\d{8}$/g;
  return phoneRegex.test(phone);
}

function validatePostcode(postcode) {
  const postcodeRegex = /^\d{4}$/g;
  if (!postcodeRegex.test(postcode)) {
    return false;
  }
  const postCodeNumber = parseInt(postcode, 10);
  return postCodeNumber >= 800 && postCodeNumber <= 7999;
}

// Transition
function updateProgressBar() {
  const progressBar = document.querySelector('#progress-bar');
  progressBar.value = currentStep / totalSteps * 100;
}

function next(event) {
  event.preventDefault();
  validateForm();
  if (!hasAnyErrors()) {
    if (currentStep === totalSteps - 1) {
      showInputDetails();
    } else {
      currentStep++;
      showCurrentStep();
    }
  } else {
    renderErrors();
  }
}

function back(event) {
  event.preventDefault();
  validateForm();
  if (!hasAnyErrors()) {
    currentStep--;
    if (currentStep < 0) {
      currentStep = 0;
    }
    showCurrentStep();
  } else {
    renderErrors();
  }

}

function setNextButtonEvent() {
  const nextButton = document.querySelector('.next');
  nextButton.addEventListener(
    'click',
    event => next(event)
  );
}

function setBackButtonEvent() {
  const backButton = document.querySelector('.back');
  backButton.addEventListener(
    'click',
    event => back(event)
  );
}

function updateButtons() {
  const backButton = document.querySelector('.back');
  backButton.disabled = currentStep === 0 || hasAnyErrors();

  const nextButton = document.querySelector('.next');
  nextButton.disabled = hasAnyErrors();
  if (currentStep === totalSteps - 1) {
    nextButton.innerHTML = 'Submit';
  }
}

function showCurrentStep() {
  const steps = document.querySelectorAll('.step');
  steps.forEach((step, index) => {
    if (index === currentStep) {
      step.classList.remove('hidden');
      step.classList.add('shown');
    } else {
      step.classList.add('hidden');
      step.classList.remove('shown');
    }
  });
  updateButtons();
  initialiseFormErrors();
  updateProgressBar();
}

function hideInputForm() {
  const inputForm = document.querySelector('.input-details');
  inputForm.classList.add('hidden');
}

function collectFormData() {
  const formData = {};
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    formData[input.name] = input.value;
  });
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    formData[select.name] = select.options[select.selectedIndex].value;
  });
  return formData;
}

function renderSubmittedData() {
  const submittedData = collectFormData();
  const container = document.querySelector('#submitted-container');
  for (let field in submittedData) {
    const fieldDOM = document.createElement('div');
    fieldDOM.classList.add('column', 'is-half');
    fieldDOM.innerHTML = ucwords(field) + ': ' + submittedData[field];
    container.appendChild(fieldDOM);
  }
}

function ucwords(value) {
  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.substr(1))
    .join(' ');
}

function showInputDetails() {
  hideInputForm();
  renderSubmittedData();
  const submittedDetailBox = document.querySelector('#submitted-details');
  submittedDetailBox.classList.add('shown');
}

function initialise() {
  showCurrentStep();
  setBackButtonEvent();
  setNextButtonEvent();
  setInputEvent();
}

function setInputEvent() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('change', event => validateField(event.target));
    input.addEventListener('blur', event => validateField(event.target));
  });
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    select.addEventListener('change', event => validateField(event.target));
  });
}
initialise();
