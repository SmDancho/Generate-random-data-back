const { faker } = require('@faker-js/faker');

const getusers = (req, res) => {
  const { currentPage, userNums, errorRate, seed , region } = req.body;

  const NUM_USERS = userNums;
  const page = Number(currentPage);
  const SEED_VALUE = Number(seed); // Change this to any number to use a different seed value

  const NUM_ERRORS = errorRate;
  const ERROR_TYPES = ['delete', 'insert', 'swap'];
  const ERROR_RATE = NUM_ERRORS / (NUM_USERS * Object.keys(ERROR_TYPES).length);

  const generateSeed = faker.seed(SEED_VALUE + page);

  const users = Array.from({ length: NUM_USERS }, () => {
    const country = region;

    faker.locale = getLocaleForCountry(country);

    const firstName = maybeError(faker.name.firstName(), ERROR_RATE);
    const lastName = maybeError(faker.name.lastName(), ERROR_RATE);
    const streetAddress = maybeError(faker.address.streetAddress(), ERROR_RATE);
    const city = maybeError(faker.address.city(), ERROR_RATE);
    const state = maybeError(faker.address.state(), ERROR_RATE);
    const zipCode = maybeError(faker.address.zipCode(), ERROR_RATE);
    const phone = maybeError(faker.phone.number(), ERROR_RATE);

    return {
      firstName,
      lastName,
      address: {
        street: streetAddress,
        city,
        state,
        zipCode,
        country,
      },
      phone,
    };
  });

  function getLocaleForCountry(country) {
    switch (country) {
      case 'Poland':
        return 'pl';
      case 'USA':
        return 'en'
      default:
        return 'it';
    }
  }

  function maybeError(value, errorRate) {
    for (let i = 0; i < NUM_ERRORS; i++) {
      if (Math.random() < errorRate) {
        const type =
          ERROR_TYPES[Math.floor(Math.random() * ERROR_TYPES.length)];
        switch (type) {
          case 'delete':
            // Delete a character at random position
            const index1 = Math.floor(Math.random() * value.length);
            value = value.substring(0, index1) + value.substring(index1 + 1);
            break;
          case 'insert':
            // Insert a random character at random position
            const index2 = Math.floor(Math.random() * value.length);
            const char = String.fromCharCode(
              Math.floor(Math.random() * 26) + 97
            );
            value = value.substring(0, index2) + char + value.substring(index2);
            break;
          case 'swap':
            // Swap two adjacent characters
            const index3 = Math.floor(Math.random() * (value.length - 1));
            value =
              value.substring(0, index3) +
              value.charAt(index3 + 1) +
              value.charAt(index3) +
              value.substring(index3 + 2);
            break;
        }
      }
    }
    return value;
  }

  return res.status(200).json({ users, generateSeed });
};

module.exports = { getusers };
