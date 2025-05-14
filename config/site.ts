export type SiteConfig = typeof siteConfig

export const siteConfig = {
  url: "https://www.browsemarketplaces.com",
  name: "Browse Multiple Marketplaces Nationwide",
  description:
    "Search across Facebook Marketplace, Amazon, eBay, and eBay Sold listings across the USA.",
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
      facebook: {
        new: "New",
        used: "Used",
      },
      ebay: {
        new: "New",
        used: "Used",
      },
      amazon: {
        new: "New",
        used: "Used",
      },
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
  marketplaces: {
    facebook: {
      name: "Facebook Marketplace",
      icon: "facebook.svg",
      templateURL:
        "https://www.facebook.com/marketplace/search?query=|STRING|&exact=false&radius=805",
      searchParams: {
        sortBy: "best_match",
        availability: "in stock",
        deliveryMethod: "all",
        daysSinceListed: "0",
      },
    },
    amazon: {
      name: "Amazon",
      icon: "amazon.png",
      templateURL: "https://www.amazon.com/s?k=|STRING|&tag=autoreplen-20",
      requiresCities: false,
      searchParams: {},
    },
    ebay: {
      name: "eBay",
      icon: "ebay.svg",
      templateURL:
        "https://www.ebay.com/sch/i.html?_nkw=|STRING|&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5339103825&customid=&toolid=10001&mkevt=1",
      requiresCities: false,
      searchParams: {
        minPrice: "_udlo",
        maxPrice: "_udhi",
      },
    },
    ebay_sold: {
      name: "eBay (Sold)",
      icon: "ebay.svg",
      templateURL:
        "https://www.ebay.com/sch/i.html?_nkw=|STRING|&LH_Sold=1&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5339103825&customid=&toolid=10001&mkevt=1",
      requiresCities: false,
      searchParams: {
        minPrice: "_udlo",
        maxPrice: "_udhi",
      },
    },
  },
}
