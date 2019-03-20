describe('Validator', () => {
  const validationRules = {
    first_name: ['required'],
    last_name: ['required'],
    email: ['required', 'email'],
    phone: ['phone'],
    street_number: ['required', 'numeric'],
    street_name: ['required'],
    street_type: ['required'],
    suburb: ['required'],
    postcode: ['required', 'postcode'],
  };

  const validator = new Validator(validationRules);

  it("should initialise with passed in rules", () => {
    expect(validator.validationRules).toEqual(validationRules);
  });

  it("should be able to return error on required field with empty value", () => {
    const field = 'first_name';
    const error = 'Field cannot be empty';
    const value = '';
    const errors = validator.validate(field, value);
    expect(errors).toContain(error);
  });

  it("should be able to return error on wrong email format", () => {
    const field = 'email';
    const error = 'Not a valid email';
    const value = 'abc@gmail';
    const errors = validator.validate(field, value);
    expect(errors).toContain(error);
  });

  it("should be able to return error on wrong phone format", () => {
    const field = 'phone';
    const error = 'Not a valid phone number';
    const value = '0422311';
    const errors = validator.validate(field, value);
    expect(errors).toContain(error);
  });

  it("should be able to return error on wrong postcode format", () => {
    const field = 'postcode';
    const error = 'Not a valid postcode';
    const value = '100';
    const errors = validator.validate(field, value);
    expect(errors).toContain(error);
  });

  it("should be able to return error on numeric field with NaN value", () => {
    const field = 'street_number';
    const error = 'Not a valid number';
    const value = '1oo';
    const errors = validator.validate(field, value);
    expect(errors).toContain(error);
  });
});
