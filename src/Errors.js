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
    // this.display(field, errors);
    // this.updateButtons();
  }

  get(field) {
    return this.errors[field];
  }

  has(field) {
    return this.get(field).length > 0;
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
