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
