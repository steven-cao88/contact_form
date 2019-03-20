class Validator {
  constructor(validationRules = {}) {
    this.setValidationRules(validationRules);
  }

  setValidationRules(validationRules = {}) {
    this.validationRules = validationRules;
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

    return errors;
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
