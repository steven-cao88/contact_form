describe('Errors', () => {
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

  const errorObj = new Errors(validationRules);

  it("should initialise with error object having keys of validationRules", () => {
    expect(Object.keys(errorObj.errors))
      .toEqual(Object.keys(validationRules));
  });

  // it("should initialise with no error", () => {
  //   expect(errorObj.any()).toBe(false);
  // });

  it("should be able to record errors for a field", () => {
    const field = 'first_name';
    const errors = ['Field cannot be empty'];
    errorObj.record(field, errors);
    expect(errorObj.get(field)).toEqual(errors);
  });
});
