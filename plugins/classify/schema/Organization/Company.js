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
      'advertising',
      'airline_alliance',
      'ambulance_company',
      'architectural_practice',
      'brand',
      'bus_company',
      'business_park',
      'central_bank',
      'certification_mark',
      'company',
      'company/unternehmen',
      'disney_resort',
      'economy',
      'exchange',
      'financial_index',
      'fishery',
      'industrial_process',
      'interbank_network',
      'law_firm',
      'livery_company',
      'loyalty_program',
      'mine',
      'mining',
      'occupation',
      'product',
      'property_development',
      'record_label',
      'restaurant',
      'television_channel',
      'television_station',
      'toy',
      'u.s._national_banks',
      'winery',
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
