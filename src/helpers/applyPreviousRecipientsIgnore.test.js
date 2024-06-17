/* eslint-disable jest/no-standalone-expect */
import theoretically from "jest-theories";
import applyPreviousRecipientsIgnore from "./applyPreviousRecipientsIgnore";

const getRecipient = (number, ignore = false) => ({
  id: number.toString(),
  firstName: "John",
  lastName: `Doe ${number}`,
  email: `test${number}@test.com`,
  ignore,
});

describe("filterOutIgnoredRecipients", () => {
  const theories = [
    {
      name: "Should return fetchedRecipients, when prevRecients is null",
      input: {
        prevRecipients: null,
        fetchedRecipients: [getRecipient(1), getRecipient(2)],
      },
      expected: [getRecipient(1, false), getRecipient(2, false)],
    },
    {
      name: "Should return fetchedRecipients, when prevRecients is empty",
      input: {
        prevRecipients: [],
        fetchedRecipients: [getRecipient(1), getRecipient(2)],
      },
      expected: [getRecipient(1, false), getRecipient(2, false)],
    },
    {
      name: "Should return only newly fetched customers",
      input: {
        prevRecipients: [getRecipient(1, true), getRecipient(2, false)],
        fetchedRecipients: [getRecipient(2), getRecipient(3)],
      },
      expected: [getRecipient(2, false), getRecipient(3, false)],
    },
    {
      name: "Should set correct ignore value for matching recipients",
      input: {
        prevRecipients: [getRecipient(1, false), getRecipient(2, true)],
        fetchedRecipients: [getRecipient(2), getRecipient(3)],
      },
      expected: [getRecipient(2, true), getRecipient(3, false)],
    },
    {
      name: "Should set correct ignore value for matching recipients, when there are multiple customers with same email",
      input: {
        prevRecipients: [
          {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "test@test.com",
            ignore: true,
          },
        ],
        fetchedRecipients: [
          {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "test@test.com",
            ignore: false,
          },
          {
            id: 2,
            firstName: "John",
            lastName: "Doe 2",
            email: "test@test.com",
            ignore: false,
          },
        ],
      },
      expected: [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "test@test.com",
          ignore: true,
        },
        {
          id: 2,
          firstName: "John",
          lastName: "Doe 2",
          email: "test@test.com",
          ignore: false,
        },
      ],
    },
  ];

  theoretically(
    ({ name }) => `${name}`,
    theories,
    async (theory) => {
      const { prevRecipients, fetchedRecipients } = theory.input;

      const actual = applyPreviousRecipientsIgnore(
        prevRecipients,
        fetchedRecipients
      );

      expect(actual).toStrictEqual(theory.expected);
    }
  );
});
