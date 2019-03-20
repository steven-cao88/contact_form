'use strict';

// Global variables
const totalSteps = 2;
let currentStep = 0;
const validationRules = {
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

// Class to store and render errors
class Errors {
  constructor(validationRules = {}) {
    this.errors = {};
    if (validationRules) {
      this.initialise(validationRules);
    }
  }

  initialise(validationRules = {}) {
    const errors = {};
    Object.keys(validationRules).forEach(key => errors[key] = []);
    this.errors = errors;
  }

  any() {
    for (let field in this.errors) {
      if (this.errors[field].length > 0) {
        return true;
      }
    }
    return false;
  }

  record(field, errors) {
    this.errors[field] = errors;
    this.display(field, errors);
    this.updateButtons();
  }

  clear(field) {
    this.errors[field] = [];
    this.remove(field);
    this.updateButtons();
  }

  display(field, errors) {
    let isSelect = false;
    let fieldDOM = document.querySelector(`input[name='${field}`);

    if (!fieldDOM) {
      // try finding select field
      fieldDOM = document.querySelector(`select[name='${field}`);
      isSelect = true;
    }

    if (fieldDOM) {
      const errorMessage = errors.join('. ');
      const container = isSelect ? fieldDOM.parentNode : fieldDOM;
      let errorsDiv;

      // error div already exists, just update content
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

  remove(field) {
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

  updateButtons() {
    const hasAnyErrors = this.any();
    const backButton = document.querySelector('.back');
    const nextButton = document.querySelector('.next');

    backButton.disabled = currentStep === 0 || hasAnyErrors;
    nextButton.disabled = hasAnyErrors;
  }
}

// Class to validate input fields
class Validator {
  constructor(validationRules = {}) {
    this.setValidationRules(validationRules);
  }

  setValidationRules(validationRules = {}) {
    this.validationRules = validationRules;
    this.errors = new Errors(validationRules);
  }

  validateField(fieldDOM) {
    const {name, tagName} = fieldDOM;
    let value = null;

    if (tagName === 'SELECT') {
      value = fieldDOM.options[fieldDOM.selectedIndex].value;
    } else if (tagName === 'INPUT') {
      value = fieldDOM.value;
    }
    this.validate(name, value);
  }

  validate(field, value) {
    const rules = this.validationRules[field];
    const errors = [];

    rules && rules.forEach(rule => {
      const error = this.test(value, rule);
      if (error) {
        errors.push(error);
      }
    });

    if (errors.length > 0) {
      this.errors.record(field, errors);
    } else {
      this.errors.clear(field);
    }
  }

  test(value, rule) {
    if (rule === 'required' && value.trim() === '') {
      return 'Field cannot be empty';
    }
    if (rule === 'email' && !this.validateEmail(value)) {
      return 'Not a valid email';
    }
    if (rule === 'phone' && !this.validatePhone(value)) {
      return 'Not a valid phone number';
    }
    if (rule === 'postcode' && !this.validatePostcode(value)) {
      return 'Not a valid postcode';
    }
    if (rule === 'numeric' && isNaN(value)) {
      return 'Not a valid number';
    }
  }

  validateEmail(email) {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }

  validatePhone(phone) {
    phone = phone.trim();
    if (phone === '') return true;
    const phoneRegex = /^0[0-8]\d{8}$/g;
    return phoneRegex.test(phone);
  }

  validatePostcode(postcode) {
    const postcodeRegex = /^\d{4}$/g;
    if (!postcodeRegex.test(postcode)) {
      return false;
    }
    const postCodeNumber = parseInt(postcode, 10);
    return postCodeNumber >= 800 && postCodeNumber <= 7999;
  }

  validateForm() {
    const inputs = document.querySelectorAll('input');
    inputs && inputs.forEach(input => this.validateField(input));

    const selects = document.querySelectorAll('select');
    selects && selects.forEach(select => this.validateField(select));
  }
}

// Class to handle UI and transitions
class ContactForm {
  constructor() {
    this.validator = new Validator(validationRules[`step_${currentStep}`]);
  }

  updateProgressBar() {
    const progressBar = document.querySelector('#progress-bar');
    progressBar.value = currentStep / totalSteps * 100;
  }

  next(event) {
    event.preventDefault();
    this.validator.validateForm();

    if (!this.validator.errors.any()) {
      if (currentStep === totalSteps - 1) {
        this.showSubmittedDetails();
      } else {
        currentStep++;
        this.showCurrentStep();
      }
    }
  }

  back(event) {
    event.preventDefault();
    this.validator.validateForm();

    if (!this.validator.errors.any()) {
      currentStep--;

      if (currentStep < 0) {
        currentStep = 0;
      }

      this.showCurrentStep();
    }
  }

  showCurrentStep() {
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
    this.validator.setValidationRules(validationRules[`step_${currentStep}`]);
    this.updateProgressBar();
    this.updateButtons();
  }

  updateButtons() {
    const nextButton = document.querySelector('.next');
    const backButton = document.querySelector('.back');

    if (currentStep === totalSteps - 1) {
      nextButton.innerHTML = 'Submit';
    } else {
      nextButton.innerHTML = 'Next';
    }

    if (currentStep === 0) {
      backButton.disabled = true;
    } else {
      backButton.disabled = false;
    }
  }

  setNextButtonEvent() {
    const nextButton = document.querySelector('.next');
    nextButton.addEventListener(
      'click',
      event => this.next(event)
    );
  }

  setBackButtonEvent() {
    const backButton = document.querySelector('.back');
    backButton.addEventListener(
      'click',
      event => this.back(event)
    );
  }

  setInputEvent() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('change', event => this.validator.validateField(event.target));
      input.addEventListener('blur', event => this.validator.validateField(event.target));
    });
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      select.addEventListener('change', event => this.validator.validateField(event.target));
    });
  }

  showSubmittedDetails() {
    this.hideInputForm();
    this.renderSubmittedData();
    const submittedDetailBox = document.querySelector('#submitted-details');
    submittedDetailBox.classList.add('shown');
  }

  hideInputForm() {
    const inputForm = document.querySelector('#input-details');
    inputForm.classList.add('hidden');
  }

  renderSubmittedData() {
    const submittedData = this.collectFormData();
    const container = document.querySelector('#submitted-container');

    for (let field in submittedData) {
      const fieldDOM = document.createElement('div');
      fieldDOM.classList.add('column', 'is-half');
      fieldDOM.innerHTML = ucwords(field) + ': ' + submittedData[field];
      container.appendChild(fieldDOM);
    }
  }

  collectFormData() {
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

  initialise() {
    this.showCurrentStep();
    this.setBackButtonEvent();
    this.setNextButtonEvent();
    this.setInputEvent();
  }
}

function ucwords(value) {
  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.substr(1))
    .join(' ');
}

const contactForm = new ContactForm();
contactForm.initialise();
