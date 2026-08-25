// src/data/research/sourcing/eggs/happy-egg_final.js
module.exports = {
  companyId: 'happy-egg',
  sourcing: {
    industry: 'eggs',
    lastVerified: '2026-07-29',

    model: 'contract-farms',
    modelSource: {
      name: 'Company merger press release — contracted family-farm network (including the Egg Innovations / Blue Sky Family Farms network across AR and the Midwest)',
      url: 'https://www.prnewswire.com/news-releases/happy-egg-strengthens-position-as-leading-egg-brand-with-integration-of-egg-innovations-302290413.html',
      date: '2024-10-29',
      basis: 'company-disclosure',
    },

    certifications: [],

    welfare: {
      housing: 'free-range',
      housingSource: {
        name: 'Cornucopia Organic Egg Scorecard — Happy Egg (page notes the brand sells organic, heritage, and pastured lines in addition to free-range)',
        url: 'https://www.cornucopia.org/scorecard/eggs/happy-egg/',
        date: '2024-03-22',
        basis: 'third-party-scorecard',
      },
      scorecards: [
        {
          name: 'Cornucopia Organic Egg Scorecard',
          ratedLine: 'Happy Egg Organic Free Range eggs',
          appliesTo: 'organic-line',
          rating: '1000/1700',
          tier: '4-star (1-5 scale)',
          year: 2024,
          url: 'https://www.cornucopia.org/scorecard/eggs/happy-egg/',
        },
      ],
    },

    enforcement: [],

    practices: [
      {
        claim:
          "Following an October 2024 merger with Egg Innovations, the company's production network spans contracted family farms in Arkansas and the Midwest (Indiana, Illinois, Michigan, Ohio, Kentucky, Iowa, Minnesota, Wisconsin), including farms marketed under the 'Blue Sky Family Farms' brand, with a combined flock of approximately 3.7 million hens.",
        basis: 'company-disclosure',
        source: {
          name: 'PR Newswire — Happy Egg / Egg Innovations merger release',
          url: 'https://www.prnewswire.com/news-releases/happy-egg-strengthens-position-as-leading-egg-brand-with-integration-of-egg-innovations-302290413.html',
          date: '2024-10-29',
        },
      },
    ],
  },
};
