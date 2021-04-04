const wtf = require('./src/index')
wtf.extend(require('./plugins/wikitext/src'))

// one
// let str = `[[one]] and [[two]] {{one}} and {{two}}`
// let doc = wtf(str)
// console.log(doc.templates(1)[0].json())

// let str = `{{Infobox country
//   | common_name = United Kingdom
//   | name = {{collapsible list
//    | title = hello
//    | {{Infobox
//     | data1={{lang|foo}}
//     | data2=bar
//     }}
//    }}
//   }}
// `
// let obj = wtf(str).infobox(0).json()
// console.log(obj)

let str = ` {{Infobox settlement
  |official_name            = Dollar Point, California
  |settlement_type          = [[census-designated place]]
  |image_skyline            = 
  |imagesize                = 
  |image_caption            = 
  |image_seal               = 
  |image_map                = Placer_County_California_Incorporated_and_Unincorporated_areas_Dollar_Point_Highlighted.svg
  |mapsize                  = 250x200px
  |map_caption              = Location in [[Placer County, California|Placer County]] and the state of [[California]]
  |image_map1               = 
  |mapsize1                 = 
  |map_caption1             = 
  |pushpin_map              = USA
  |pushpin_relief           = yes
  | pushpin_map_caption = Location in the United States
  |subdivision_type         = [[List of countries|Country]]
  |subdivision_name         = {{USA}}
  |subdivision_type1        = [[Political divisions of the United States|State]]
  |subdivision_name1        = {{flag|California}}
  |subdivision_type2        = [[List of counties in California|County]]
  |subdivision_name2        = [[Placer County, California|Placer]]
  |government_type          = 
  |leader_title             = N/A
  |leader_name              = 
  |leader_title1            = [[California State Legislature|State Senate]]
  |leader_name1             = [[Dave Cox]] ([[California Republican Party|R]])
  |leader_title2            = [[California State Assembly|State Assembly]] 
  |leader_name2             = [[Ted Gaines]] (R)
  |leader_title3            = [[California's 4th congressional district|U. S. Congress]]
  |leader_name3             = {{Representative|cacd|4|fmt=usleader}}<ref>{{Cite GovTrack|CA|4|accessdate=March 3, 2013}}</ref>
  |established_date         = 
  
  <!-- Area------------------>
  |area_magnitude           = 
  | unit_pref               = US
  | area_footnotes          = <ref>[http://www.census.gov/geo/www/gazetteer/files/Gaz_places_national.txt U.S. Census] {{webarchive |url=http://www.webcitation.org/699nOulzi?url=http://www.census.gov/geo/www/gazetteer/files/Gaz_places_national.txt |date=2012-07-14 }}</ref>
  | area_total_sq_mi        = 1.634
  | area_land_sq_mi         = 1.634
  | area_water_sq_mi        = 0
  | area_total_km2          = 4.232
  | area_land_km2           = 4.232
  | area_water_km2          = 0
  | area_water_percent      = 0
  | area_note               = 
  
  |elevation_ft             = 6483
  |elevation_m              = 1976
  |population_as_of         = [[2010 United States Census|2010]]
  |population_footnotes     = 
  |population_total         = 1215
  |population_metro         = 
  |population_density_km2   = auto
  |population_density_sq_mi = 
  |timezone                 = [[Pacific Time Zone|PST]]
  |utc_offset               = -8
  |coordinates              = {{coord|39|11|19|N|120|6|32|W|region:US_type:city|display=inline,title}}
  |timezone_DST             = PDT
  |utc_offset_DST           = -7
  |postal_code_type         = [[ZIP code]]
  |postal_code              = 96145
  |area_code                = [[Area code 530|530]]
  |blank_name               = [[Federal Information Processing Standard|FIPS code]]
  |blank_info               = 06-19455
  |blank1_name              = [[Geographic Names Information System|GNIS]] feature IDs
  |blank1_info              = 1723422; 2408680
  |footnotes                = 
  |website                  = 
  }}
  '''Dollar Point''' is a [[census-designated place]] (CDP) in [[Placer County, California|Placer County]], [[California]], [[United States]], along the northwest shore of [[Lake Tahoe]]. It is part of the [[Sacramento, California|Sacramento]]&ndash;[[Arden-Arcade, California|Arden-Arcade]]&ndash;[[Roseville, California|Roseville]] [[Sacramento metropolitan area|Metropolitan Statistical Area]]. The population was 1,215 at the [[2010 United States Census|2010 census]] down from 1,539 at the 2000 census.
  
  Dollar Point has been noted for its [[place names considered unusual|unusual place name]].<ref>{{cite book|last=Thompson|first=George E.|title=You Live Where?: Interesting and Unusual Facts about where We Live|url=https://books.google.com/books?id=0Ia7Rga26OkC&pg=PA10|date=1 July 2009|publisher=iUniverse|isbn=978-1-4401-3421-0|page=10}}</ref>
  
  ==History==
  In 1884 the Glenbrook Mills logged 337 acres on a point on Lake Tahoe. In 1898 [[Lake Tahoe Railway and Transportation Company]] (D.L. Bliss) was formed and built {{Convert|16|miles|km}} of narrow gauge track into the area that became known as Dollar Point. [[Southern Pacific Transportation Company|Southern Pacific]] leased the track rights in 1925 and converted the tracks to [[Standard gauge]] in 1926, bought the property in 1933, and abandoned the tracks in 1943. In 1916 Lora Josephine Knight bought the point. The land was originally part of an area called Chinquapin by the [[Washoe people|Washoe Indians]]. [[Robert Dollar]] purchased many properties such as the 1,436 acres in [[Rossmoor, Walnut Creek, California|Rossmoor, California]] and in 1927 he purchased the area that had been called  "Old Lousy", "the lousy point", and Observatory Point, from Lora Knight. She became well known for building [[Vikingsholm]] Castle in 1929. She and her husband were also primary financial backers of [[Charles Lindbergh]]'s non-stop solo flight across the Atlantic.   
  
  Dollar Point is located within the [[Sierra Nevada (U.S.)|Sierra Nevada Mountain Range]] on the Northwest corner of Lake Tahoe. [[Carnelian Bay, California|Carnelian Bay]] is on the north side, [[Tahoe City, California|Tahoe City]] to the south, and [[Tahoe National Forest]] and [[Burton Creek State Park]] extends along the entire east side. [[California State Route 28|State Route 28]] is the only major highway access to the area and runs the length of the northwest boundary of Dollar Point. Dollar also purchased a react of land to the east of SR 28 that is now called Chinquapin development.<ref name="Dollar Point History">{{cite web | url=http://www.dollarpoint.org/community-info/dollar-point-history/ | title=A Brief History of Dollar Point | publisher=Dollar Point Association | accessdate=March 4, 2015}}</ref>
  
  ==Geography==
  Dollar Point is located at {{coord|39|11|19|N|120|6|32|W|type:city}} (39.188639, -120.108848).<ref name="GR1">{{cite web|url=http://www.census.gov/geo/www/gazetteer/gazette.html|publisher=[[United States Census Bureau]]|accessdate=2011-04-23|date=2011-02-12|title=US Gazetteer files: 2010, 2000, and 1990}}</ref>
  `
let obj = wtf(str).coordinate(13)
console.log(obj)
