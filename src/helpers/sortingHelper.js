const categoriesOrder = [
  "National Holidays",
  "Seasons",
  "Marketing Holidays",
  "Services",
  "General Shop",
  "Occasions & Events",
];

const eventsOrder = [
  "Groundhog Day",
  "Random Acts of Kindness Day",
  "Love Your Pet Day",
  "Mardi Gras",
  "Women's Day",
  "National Puppy Day",
  "April Fools Day",
  "National Siblings Day",
  "National Pet Day",
  "National Adopt a Shelter Pet Day",
  "Cinco de Mayo",
  "National Nurses Day",
  "Heat Awareness Day (#NoFryDay)",
  "National Donut Day",
  "National Drive in Movie Day",
  "National Selfie Day",
  "Give Something Away Day",
  "International Day of Friendship",
  "International Cat Day",
  "National Dog Day",
  "International Coffee Day",
  "Taco Day",
  "Black Friday",
  "Cyber Monday",
  "National Cookie Day",
];

const sortBySortingArray = (collection, sortingArray) =>
  collection?.sort(
    (a, b) => sortingArray.indexOf(a.name) - sortingArray.indexOf(b.name)
  );

export const sortCategories = (categories) =>
  sortBySortingArray(categories, categoriesOrder);

export const sortMarketingHolidays = (marketingHolidays) =>
  sortBySortingArray(marketingHolidays, eventsOrder);

export const sortGeneralShop = (generalShop) => {
  const generalShopEventsOrder = [
    "COVID-19",
    "General Images",
    "Lost Customer",
    "Severe Weather",
    "Thank You",
    "Business Announcements",
  ];
  sortBySortingArray(generalShop, generalShopEventsOrder);
};
