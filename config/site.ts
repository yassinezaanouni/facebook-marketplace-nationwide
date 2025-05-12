export type SiteConfig = typeof siteConfig

export const siteConfig = {
  url: "https://www.browsemarketplaces.com",
  name: "Browse Marketplaces: Nationwide Search for the Facebook Marketplace",
  description:
    "Search the Facebook Marketplace across the lower 48 states of the USA.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    donate: "https://www.paypal.com/donate/?hosted_button_id=VDZATQAYQMVM6",
    github: "https://github.com/gmoz22/facebook-marketplace-nationwide",
  },
  filters: {
    defaultDeliveryMethod: "all",
    deliveryMethod: {
      all: "All",
    },
    radius: "radius",
    defaultSortBy: "best_match",
    minPrice: "minPrice",
    maxPrice: "maxPrice",
    itemCondition: {
      new: "New",
      used_like_new: "Used Like New",
      used_good: "Used Good",
      used_fair: "Used Fair",
    },
    defaultAvailability: "in stock",
    availability: {
      "in stock": "Available",
    },
    defaultDaysSinceListed: "0",
    daysSinceListed: {
      "0": "All",
    },
  },
  templateURL: {
    miles:
      "https://www.facebook.com/marketplace/|CITY|/search?query=|STRING|&radius=805",
  },
  countries: {
    usa: {
      name: "USA (lower 48)",
      icon: "usa_48.png",
      locale: "miles",
      cities: [
        "Portland, OR",
        "Los Angeles, CA",
        "Durango, CO",
        "Broadus, MT",
        "Fort Worth, TX",
        "Boscobel, WI",
        "Fitzgerald, GA",
        "Oneonta, NY",
      ],
      cities_fb: [
        "portland",
        "la",
        "108129565875623",
        "109613652398861",
        "114148045261892",
        "106171882747436",
        "112442175434378",
        "113333232014461",
      ],
      coverage:
        "https://www.mapdevelopers.com/draw-circle-tool.php?circles=%5B%5B804670%2C34.0536909%2C-118.242766%2C%22%23FFAAAA%22%2C%22%23FF0000%22%2C0.4%5D%2C%5B804670%2C45.5202471%2C-122.6741949%2C%22%23FFAAAA%22%2C%22%23FF0000%22%2C0.4%5D%2C%5B804670%2C31.7098163%2C-83.2518613%2C%22%23FFAAAA%22%2C%22%23FF0000%22%2C0.4%5D%2C%5B804670%2C42.4517838%2C-75.0569094%2C%22%23FFAAAA%22%2C%22%23FF0000%22%2C0.4%5D%2C%5B804670%2C43.1367176%2C-90.7068445%2C%22%23FFAAAA%22%2C%22%23FF0000%22%2C0.4%5D%2C%5B804670%2C37.2713951%2C-107.8815978%2C%22%23FFAAAA%22%2C%22%23FF0000%22%2C0.4%5D%2C%5B804670%2C32.7762719%2C-97.3241996%2C%22%23FFAAAA%22%2C%22%23FF0000%22%2C0.4%5D%2C%5B804670%2C45.4390698%2C-105.4059145%2C%22%23FFAAAA%22%2C%22%23FF0000%22%2C0.4%5D%5D",
    },
  },
}
