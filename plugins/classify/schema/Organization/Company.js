export default {
  name: 'Company',
  //
  children: {},
  //
  categories: {
    mapping: [
      'companies listed on the new york stock exchange',
      'jazz record labels',
      'video game development companies',
      'american record labels',
      'companies listed on nasdaq',
      'video game companies of the united states',
      'companies formerly listed on the london stock exchange',
      'multinational companies headquartered in the united states',
      'companies listed on the tokyo stock exchange',
      're-established companies',
      'companies based in new york city',
      'defunct video game companies',
      'companies formed by merger',
      'entertainment companies based in california',
      'acquisition',
    ],
    patterns: [/companies (established|based) in ./],
  },
  //
  descriptions: {
    patterns: [/(company|subsidary)/],
  },
  //
  infoboxes: {
    mapping: [
      'airline_alliance',
      'architectural_practice',
      'brand',
      'business_park',
      'central_bank',
      'certification_mark',
      'company',
      'Disney_resort',
      'economist',
      'economy',
      'exchange',
      'financial_index',
      'fishery',
      'industrial_process',
      'interbank_network',
      'law_firm',
      'loyalty_program',
      'mine',
      'mining',
      'occupation',
      'product',
      'restaurant',
      'property_development',
      'public_transit',
      'record_label',
      'shopping_mall',
      'television_station',
      'toy',
      'television_channel',
      'U.S._national_banks',
      'company/Unternehmen',
      'winery',
      'advertising',
      'ambulance_company',
      'bus_company',
      'company',
      'livery_company',
      'company/unternehmen',
    ],
    patterns: [],
  },
  //
  sections: {
    mapping: ['products'],
    patterns: [],
  },
  //
  templates: {
    mapping: [],
    patterns: [/-company-stub$/],
  },
  //
  titles: {
    mapping: ['company', 'newspaper', 'restaurant', 'retailer', 'store'],
    patterns: [],
  },
}
