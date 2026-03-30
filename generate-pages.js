/**
 * generate-pages.js
 * Generates 48 SEO landing pages for Cathey's Lawn Care
 * - 6 main service pages (e.g., services/lawn-mowing.html)
 * - 42 service+area pages (e.g., services/lawn-mowing-austin.html)
 *
 * Run: node generate-pages.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURATION
// ============================================================

const BUSINESS = {
  name: "Cathey's Lawn Care",
  phone: "(512) 413-8455",
  phoneRaw: "5124138455",
  email: "catheyslandscapes@gmail.com",
  owner: "Doug Cathey",
  city: "Austin",
  state: "TX",
  years: "10+",
  hours: "Mon-Sun, 8:00 AM - 6:00 PM CST",
  facebook: "https://www.facebook.com/CatheysLawnCareAustin/",
  yelp: "https://www.yelp.com/biz/catheys-lawn-care-austin-4",
  domain: "https://catheys-lawn-care.netlify.app"
};

const SERVICES = [
  {
    slug: "lawn-mowing",
    name: "Lawn Mowing",
    shortDesc: "Professional lawn mowing services",
    image: "lawn-mowing-1.png",
    image2: "lawn-mowing-2.png",
    icon: "\u{1F33F}",
    keywords: ["lawn mowing", "grass cutting", "yard mowing", "lawn maintenance", "lawn care"],
    benefits: [
      "Promotes lateral growth and root development for a thicker lawn",
      "Prevents thatch buildup that inhibits water and nutrient penetration",
      "Reduces pest habitats including mosquitoes and ticks",
      "Increases your home's curb appeal significantly",
      "Creates safer outdoor spaces for children and pets",
      "Saves you time with reliable, consistent scheduling"
    ],
    detailedContent: {
      intro: "A well-maintained lawn is the foundation of any beautiful property. At Cathey's Lawn Care, we understand that consistent, professional mowing is about much more than just keeping grass short \u2014 it's about promoting the overall health and vitality of your landscape. Our experienced crew uses commercial-grade equipment and proven techniques to deliver results that transform your yard into the envy of the neighborhood.",
      section1Title: "Why Professional Lawn Mowing Matters",
      section1: "Regular mowing promotes lateral growth and root development, resulting in a thicker, more resilient lawn that naturally crowds out weeds. When grass is maintained at the proper height, it develops deeper root systems that are better equipped to handle drought conditions and resist disease. Our team knows the optimal cutting heights for different grass varieties common in Central Texas, including Bermuda, St. Augustine, Zoysia, and Buffalo grass. We adjust our mowing patterns and blade heights seasonally to ensure your lawn receives exactly the care it needs throughout the year.",
      section2Title: "Our Comprehensive Mowing Process",
      section2: "Every visit from Cathey's Lawn Care includes more than just running a mower across your yard. We begin with a thorough inspection of your property, checking for debris, obstacles, and any areas that need special attention. Our mowing service includes precise edging along walkways, driveways, and landscape beds, string trimming around trees, fences, and other obstacles, and a complete cleanup of all grass clippings from hardscaped surfaces. We leave your property looking immaculate every single time.",
      section3Title: "Customized Mowing Schedules",
      section3: "We offer flexible mowing schedules tailored to your lawn's specific needs and your budget. During the peak growing season in Central Texas (typically March through October), most lawns benefit from weekly mowing. In the cooler months, we transition to bi-weekly service. Our team monitors weather conditions and adjusts schedules accordingly, ensuring your lawn is never cut too short during drought or too infrequently during rapid growth periods. Whether you need one-time service or year-round maintenance, we have a plan that works for you."
    }
  },
  {
    slug: "clean-ups",
    name: "Spring & Fall Clean Ups",
    shortDesc: "Seasonal property clean up services",
    image: "clean-ups-1.png",
    image2: "clean-ups-2.png",
    icon: "\u{1F342}",
    keywords: ["spring clean up", "fall clean up", "yard cleanup", "leaf removal", "debris removal", "landscape cleanup"],
    benefits: [
      "Removes accumulated debris, leaves, and dead vegetation",
      "Prepares your landscape for the next growing season",
      "Eliminates pest breeding grounds and disease vectors",
      "Restores curb appeal after harsh weather",
      "Prevents lawn damage from smothering leaf cover",
      "Creates clean, safe outdoor living spaces"
    ],
    detailedContent: {
      intro: "Seasonal transitions can wreak havoc on your landscape. Fallen leaves, storm debris, dead branches, and overgrown vegetation can quickly turn a beautiful yard into an eyesore \u2014 and worse, they can damage your lawn and garden if left unaddressed. Cathey's Lawn Care provides thorough spring and fall clean up services that restore your property's beauty and prepare it for the season ahead.",
      section1Title: "Spring Clean Up Services",
      section1: "After the long winter months, your property needs a fresh start. Our spring clean up service includes removing all accumulated leaves and debris, clearing out dead annual plants and perennial cutbacks, dethatching compacted lawn areas, edging all beds and walkways, pruning winter-damaged shrubs and ornamentals, and preparing your landscape beds for new growth. We also inspect your property for any winter damage that may need additional attention, such as frost-heaved pavers, damaged irrigation heads, or eroded mulch beds.",
      section2Title: "Fall Clean Up Services",
      section2: "Central Texas may not experience harsh winters, but the fall season brings its own challenges. Live oaks drop their leaves in spring, while other deciduous trees shed throughout autumn. Our fall clean up service includes comprehensive leaf removal from lawns, beds, and hardscaped areas, gutter clearing, final season pruning, removal of spent annual plants, and application of fresh mulch to protect root zones through winter. We ensure your property enters the cooler months clean, healthy, and ready to bounce back in spring.",
      section3Title: "Storm Damage & Emergency Clean Ups",
      section3: "Central Texas is no stranger to severe weather. When storms hit, Cathey's Lawn Care is ready to respond with emergency clean up services. We handle fallen branches and limbs, wind-blown debris, flood damage cleanup, and general restoration after severe weather events. Our team is equipped with the tools and experience to handle everything from minor branch removal to major storm damage clean up."
    }
  },
  {
    slug: "tree-trimming",
    name: "Tree Trimming",
    shortDesc: "Expert tree trimming and pruning services",
    image: "tree-trimming-1.png",
    image2: "tree-trimming-2.png",
    icon: "\u{1F333}",
    keywords: ["tree trimming", "tree pruning", "tree service", "branch removal", "tree maintenance", "arborist"],
    benefits: [
      "Promotes healthy growth and structural integrity",
      "Reduces storm damage risk through strategic thinning",
      "Enhances property aesthetics and curb appeal",
      "Removes hazardous dead or damaged branches",
      "Improves sunlight penetration for lawn and garden health",
      "Prevents branches from damaging structures and power lines"
    ],
    detailedContent: {
      intro: "Trees are among the most valuable assets on your property, providing shade, beauty, and increased property value. However, without proper maintenance, trees can become hazardous, unsightly, and unhealthy. Cathey's Lawn Care offers professional tree trimming services that enhance your trees' natural beauty while promoting their long-term health and structural integrity. Our skilled team uses industry-standard techniques and proper safety equipment to deliver results you can see and appreciate for years.",
      section1Title: "Professional Tree Trimming Techniques",
      section1: "Our team employs proven arboricultural techniques including crown cleaning (removing dead, diseased, or crossing branches), crown thinning (selectively removing interior branches to improve air circulation and light penetration), crown raising (removing lower branches for clearance), and crown reduction (reducing the overall size while maintaining natural form). We never top trees \u2014 a harmful practice that weakens tree structure and invites disease. Instead, we use proper pruning cuts that promote natural healing and healthy regrowth.",
      section2Title: "When to Trim Your Trees",
      section2: "In Central Texas, the best time for most tree trimming is during late winter or early spring, before new growth begins. However, dead or hazardous branches should be removed immediately regardless of season. Oak trees require special attention \u2014 to prevent the spread of oak wilt, a devastating fungal disease prevalent in the Austin area, we follow strict protocols and avoid pruning oaks during the high-risk period from February through June. We seal all oak pruning wounds immediately with wound dressing to prevent beetle transmission.",
      section3Title: "Trees We Service",
      section3: "Central Texas is home to a diverse array of tree species, and our team has experience working with all of them. We regularly trim and maintain live oaks, red oaks, post oaks, cedar elms, pecan trees, crepe myrtles, mountain laurels, bald cypress, Texas ash, and many more. Whether you have a single ornamental tree that needs shaping or an entire property full of mature oaks that need professional attention, Cathey's Lawn Care has the skills and equipment to handle the job safely and effectively."
    }
  },
  {
    slug: "mulching",
    name: "Mulching",
    shortDesc: "Professional mulching and bed maintenance",
    image: "mulching-1.png",
    image2: "mulching-2.png",
    icon: "\u{1FAB5}",
    keywords: ["mulching", "mulch installation", "landscape mulch", "garden mulch", "bed mulching", "organic mulch"],
    benefits: [
      "Regulates soil temperature through extreme Texas heat",
      "Naturally suppresses weeds by blocking sunlight",
      "Conserves soil moisture and reduces watering needs",
      "Enriches soil with organic nutrients over time",
      "Creates a polished, professional landscape appearance",
      "Protects plant root systems from temperature extremes"
    ],
    detailedContent: {
      intro: "Mulching is one of the most impactful things you can do for your landscape. A fresh layer of quality mulch transforms the look of your garden beds instantly while providing critical benefits to your plants' health. Cathey's Lawn Care provides professional mulching services that beautify your property and protect your landscape investment. We source high-quality organic mulch materials and apply them with precision for maximum benefit and visual appeal.",
      section1Title: "Benefits of Professional Mulching",
      section1: "Mulch does much more than just look good. A proper 2-3 inch layer of organic mulch regulates soil temperature, keeping roots cooler during scorching Austin summers and warmer during unexpected cold snaps. It acts as a natural weed barrier, dramatically reducing the time and chemicals needed for weed control. Mulch also conserves soil moisture by reducing evaporation \u2014 particularly important in Central Texas where water restrictions are common during summer months. Over time, organic mulch breaks down and enriches the soil with valuable nutrients, improving soil structure and promoting beneficial microbial activity.",
      section2Title: "Our Mulching Process",
      section2: "When you choose Cathey's Lawn Care for your mulching needs, we handle everything from start to finish. We begin by clearing all existing debris, weeds, and old decomposed mulch from your beds. We re-edge all bed borders for clean, defined lines. Then we apply fresh mulch to the appropriate depth \u2014 typically 2-3 inches for most applications. We carefully keep mulch pulled back from tree trunks and plant stems to prevent moisture-related issues like crown rot. The result is clean, professional-looking landscape beds that will maintain their appearance for months.",
      section3Title: "Mulch Types Available",
      section3: "We offer a variety of mulch options to suit your landscape style and budget. Our most popular options include hardwood mulch (a classic choice that breaks down slowly and enriches soil), cedar mulch (naturally pest-resistant with a pleasant aroma, excellent for Central Texas landscapes), native mulch (locally sourced, cost-effective, and perfect for large areas), and colored mulch (available in black, brown, and red for decorative applications). Our team can recommend the best mulch type for your specific landscape needs, soil conditions, and aesthetic preferences."
    }
  },
  {
    slug: "land-clearing",
    name: "Land Clearing",
    shortDesc: "Professional land and brush clearing",
    image: "land-clearing-1.png",
    image2: "land-clearing-2.png",
    icon: "\u{1F3D7}\uFE0F",
    keywords: ["land clearing", "brush clearing", "lot clearing", "property clearing", "brush removal", "vegetation clearing"],
    benefits: [
      "Clears overgrown brush, trees, and vegetation efficiently",
      "Prepares property for construction or landscaping projects",
      "Removes fire hazards from accumulated dead vegetation",
      "Reclaims usable outdoor space on your property",
      "Handles residential, commercial, and agricultural clearing",
      "Proper disposal and cleanup of all cleared materials"
    ],
    detailedContent: {
      intro: "Whether you're preparing a lot for construction, reclaiming overgrown acreage, or clearing brush for fire prevention, Cathey's Lawn Care provides efficient, professional land clearing services throughout the Greater Austin area. Our experienced crew is equipped to handle projects of all sizes \u2014 from clearing a backyard overgrown with cedar and brush to preparing multi-acre lots for development. We work with residential homeowners, commercial property managers, and agricultural landowners alike.",
      section1Title: "Residential Land Clearing",
      section1: "Many Austin-area properties have areas that have been neglected and overtaken by invasive cedar (Ashe juniper), mesquite, brush, and undergrowth. These overgrown areas are not only unusable \u2014 they can harbor pests, create fire hazards, and decrease your property value. Our residential clearing services restore these areas to usable space for gardens, play areas, outdoor entertainment zones, or simply to open up your property's sightlines and improve its overall appearance. We work carefully around existing trees and features you want to preserve.",
      section2Title: "Commercial & Agricultural Clearing",
      section2: "Cathey's Lawn Care handles commercial land clearing projects including lot preparation for new construction, fence line clearing, right-of-way maintenance, and agricultural land reclamation. We understand the importance of timelines and budgets in commercial work and pride ourselves on delivering projects on schedule. Our team coordinates with contractors, property managers, and landowners to ensure clearing work meets project specifications and local regulations.",
      section3Title: "Our Clearing Process",
      section3: "Every land clearing project begins with a thorough site assessment. We walk the property with you to understand your goals, identify any trees or features to preserve, and develop a clear plan of action. Our team then systematically clears the designated area, removing all brush, dead trees, stumps (grinding available), and debris. We haul away all cleared materials and leave the site clean and ready for its next use. For larger projects, we provide detailed estimates broken down by area and scope of work."
    }
  },
  {
    slug: "weed-control",
    name: "Weed Control",
    shortDesc: "Comprehensive weed control solutions",
    image: "weed-control-1.png",
    image2: "weed-control-2.png",
    icon: "\u{1F331}",
    keywords: ["weed control", "weed removal", "weed treatment", "lawn weeds", "weed prevention", "herbicide application"],
    benefits: [
      "Eliminates existing weeds competing with your lawn and plants",
      "Prevents future weed growth with pre-emergent treatments",
      "Restores lawn density and overall turf health",
      "Targets specific weed types with appropriate treatments",
      "Reduces the need for constant manual weeding",
      "Creates a cleaner, more uniform lawn appearance"
    ],
    detailedContent: {
      intro: "Weeds are more than just an eyesore \u2014 they actively steal water, nutrients, and sunlight from the plants you actually want in your landscape. Left unchecked, weeds can quickly overwhelm even the healthiest lawn, turning a lush green yard into a patchy, unsightly mess. Cathey's Lawn Care provides comprehensive weed control services that target existing weeds and prevent new ones from taking hold, restoring your lawn to its full potential.",
      section1Title: "Understanding Central Texas Weeds",
      section1: "The Austin area is home to a wide variety of troublesome weeds, and effective control starts with proper identification. Common warm-season weeds include crabgrass, dallisgrass, nutsedge (nutgrass), Bermuda grass (in St. Augustine lawns), and sandbur. Cool-season invaders include henbit, chickweed, annual bluegrass (Poa annua), clover, and dandelions. Each weed type requires a specific approach for effective control. Our team identifies the weeds in your lawn and develops a targeted treatment plan rather than applying a one-size-fits-all solution.",
      section2Title: "Our Weed Control Approach",
      section2: "Effective weed management is a year-round process. We use a combination of pre-emergent herbicides (applied in early spring and fall to prevent weed seeds from germinating), post-emergent treatments (targeting weeds that have already sprouted), and cultural practices (proper mowing height, fertilization, and watering recommendations) that promote a thick, healthy lawn capable of naturally outcompeting weeds. We select products that are effective against target weeds while being safe for your lawn type, pets, and the environment.",
      section3Title: "Long-Term Weed Prevention",
      section3: "The best weed control is a healthy, thick lawn that leaves no room for weeds to establish. That's why our weed control service goes beyond just spraying \u2014 we provide comprehensive recommendations for lawn care practices that promote turf density and vigor. This includes proper mowing heights (taller grass shades out weed seedlings), appropriate irrigation schedules (deep, infrequent watering encourages deep root growth), and fertilization programs that feed your lawn without encouraging weed growth. With consistent, professional weed management, you'll see dramatic improvement in your lawn's appearance and health."
    }
  }
];

const AREAS = [
  {
    slug: "austin",
    name: "Austin",
    county: "Travis County",
    population: "1,000,000+",
    description: "the state capital and cultural hub of Central Texas",
    neighborhoods: "South Austin, North Austin, East Austin, West Lake Hills, Barton Creek, Circle C Ranch, Mueller, Domain, Zilker, Hyde Park, Crestview, Allandale",
    climate: "With hot summers averaging 95\u00B0F+ and mild winters, Austin lawns face unique challenges including extended growing seasons, periodic drought conditions, and intense UV exposure",
    funFact: "Known as the Live Music Capital of the World, Austin homeowners take pride in their properties, and a well-maintained lawn is essential in this competitive real estate market"
  },
  {
    slug: "round-rock",
    name: "Round Rock",
    county: "Williamson County",
    population: "240,000+",
    description: "one of the fastest-growing cities in America, located just north of Austin",
    neighborhoods: "Teravista, Forest Creek, Paloma Lake, Brushy Creek, Cat Hollow, Settlers Crossing, Vista Oaks, Eagle Ridge",
    climate: "Round Rock shares Austin's hot climate with slightly more exposure to the Blackland Prairie winds, making regular lawn maintenance essential for keeping properties looking their best",
    funFact: "Home to Dell Technologies and a thriving family community, Round Rock residents invest in their properties, and curb appeal matters in this fast-growing housing market"
  },
  {
    slug: "leander",
    name: "Leander",
    county: "Williamson County",
    population: "75,000+",
    description: "a rapidly expanding community northwest of Austin",
    neighborhoods: "Crystal Falls, Travisso, Mason Hills, Bryson, Summerlyn, Reagan's Overlook, Sarita Valley, Block House Creek",
    climate: "Leander's Hill Country terrain features rocky limestone soil and cedar-heavy landscapes that require specialized lawn care knowledge and equipment",
    funFact: "As one of the fastest-growing cities in Texas, Leander's new developments and established neighborhoods alike need professional lawn care to maintain their property values"
  },
  {
    slug: "lakeway",
    name: "Lakeway",
    county: "Travis County",
    population: "20,000+",
    description: "an upscale lakeside community along Lake Travis",
    neighborhoods: "Lakeway proper, Rough Hollow, The Hills, Flintrock Falls, Cardinal Hills, Serene Hills",
    climate: "Lakeway's Hill Country location features terraced landscapes, rocky soil, and lake proximity that creates unique microclimate conditions for lawn and landscape care",
    funFact: "As one of Austin's most prestigious communities, Lakeway residents expect premium-quality lawn care that matches the caliber of their homes and the beauty of the Lake Travis shoreline"
  },
  {
    slug: "cedar-park",
    name: "Cedar Park",
    county: "Williamson County",
    population: "82,000+",
    description: "a thriving suburban community northwest of Austin",
    neighborhoods: "Twin Creeks, Ranch at Brushy Creek, Buttercup Creek, Cypress Canyon, Anderson Mill, Breakaway Park, Silverado, Carriage Hills",
    climate: "Cedar Park's mix of established neighborhoods and new developments means lawns range from mature landscapes needing renovation to fresh sod installations requiring careful establishment care",
    funFact: "Ranked among the best places to live in Texas, Cedar Park homeowners value their community's appearance, making professional lawn care a smart investment in property value"
  },
  {
    slug: "pflugerville",
    name: "Pflugerville",
    county: "Travis County",
    population: "73,000+",
    description: "a fast-growing community northeast of Austin",
    neighborhoods: "Blackhawk, Falcon Pointe, Meadows of Blackhawk, Highland Park, Wells Branch, Villages of Hidden Lake, Bohls Place, Spring Trails",
    climate: "Pflugerville sits on the Blackland Prairie with heavier clay soils that retain moisture differently than Hill Country soils, requiring adjusted mowing schedules and specialized treatment approaches",
    funFact: "With a strong sense of community and growing family population, Pflugerville homeowners depend on reliable lawn care services to keep their neighborhoods looking beautiful"
  },
  {
    slug: "georgetown",
    name: "Georgetown",
    county: "Williamson County",
    population: "75,000+",
    description: "a charming city known for its historic downtown square, located north of Round Rock",
    neighborhoods: "Sun City, Berry Creek, Cimarron Hills, Georgetown Village, Shady Oaks, Serenada, Westlake Woods, Wolf Ranch",
    climate: "Georgetown's mix of historic properties and master-planned communities like Sun City creates diverse lawn care needs, from maintaining established landscapes to servicing large HOA communities",
    funFact: "Named the #1 Sun City community and home to many active retirees, Georgetown residents value reliable, trustworthy lawn care partners who show up on time and do quality work"
  }
];

// ============================================================
// AREA-SPECIFIC CONTENT GENERATORS
// ============================================================

/**
 * Generate unique area-specific paragraphs for each service+area combo.
 * These paragraphs weave in area details so every page has distinct content.
 */
function generateAreaIntro(service, area) {
  const intros = {
    "lawn-mowing": {
      "austin": `Austin, Texas \u2014 ${area.description} \u2014 is a city where first impressions matter. With a population of ${area.population} residents and a fiercely competitive real estate market, maintaining a professionally mowed lawn isn't just about aesthetics; it's an investment in your property's value. Cathey's Lawn Care has been providing expert lawn mowing services to Austin homeowners for over a decade, and we understand the unique demands that Central Texas places on residential and commercial turf. From the tree-lined streets of Hyde Park to the sprawling lots of Circle C Ranch, our team delivers consistent, high-quality mowing that keeps your lawn looking its absolute best year-round.`,
      "round-rock": `Round Rock, ${area.description}, has experienced explosive growth in recent years, with its population now exceeding ${area.population} residents. This growth has brought thousands of new homes with freshly installed lawns that need consistent, professional care to thrive. Cathey's Lawn Care proudly serves Round Rock homeowners with dependable lawn mowing services designed for the unique conditions of ${area.county}. Whether your home is in the established community of Forest Creek or the newer developments of Paloma Lake, our experienced crew knows how to keep your lawn healthy, green, and perfectly manicured throughout every season.`,
      "leander": `Leander, ${area.description}, is one of the most exciting communities in the Greater Austin area. With a population of ${area.population} and new neighborhoods appearing seemingly overnight, the demand for professional lawn care has never been higher. Cathey's Lawn Care brings over a decade of experience to Leander homeowners who want their lawns to look exceptional without the hassle of doing it themselves. ${area.climate}, and our team has the specialized knowledge to handle these conditions with ease. From Crystal Falls to Bryson, we're the mowing company Leander trusts.`,
      "lakeway": `Lakeway is ${area.description}, where beautifully maintained landscapes are not just appreciated \u2014 they're expected. With a population of ${area.population}, this prestigious ${area.county} community features some of the most stunning homes and properties in the entire Austin metro area. Cathey's Lawn Care is proud to provide premium lawn mowing services to Lakeway residents who demand nothing less than perfection. ${area.climate}, and our crew has the expertise and equipment to navigate these unique conditions while delivering flawless results on every visit.`,
      "cedar-park": `Cedar Park, ${area.description}, is home to ${area.population} residents who take pride in their community's appearance. ${area.climate}. Cathey's Lawn Care has been serving Cedar Park neighborhoods for years, providing reliable, professional lawn mowing that keeps properties looking their best in every season. From the mature landscapes of Buttercup Creek to the newer homes in Cypress Canyon, our team understands the specific mowing needs of Cedar Park lawns and delivers consistent results that exceed expectations.`,
      "pflugerville": `Pflugerville, ${area.description}, has grown rapidly to a population of ${area.population}, making it one of the most dynamic communities in the Austin area. ${area.climate}. Cathey's Lawn Care specializes in serving Pflugerville homeowners with expert lawn mowing that accounts for these unique soil and climate conditions. Whether you live in Blackhawk, Falcon Pointe, or Wells Branch, our team provides the consistent, professional mowing service your lawn needs to look its best all year long.`,
      "georgetown": `Georgetown, ${area.description}, combines small-town charm with big-city amenities \u2014 and its ${area.population} residents expect their lawns to reflect that same quality. ${area.climate}. Cathey's Lawn Care is the trusted mowing partner for Georgetown homeowners who want professional results without the hassle. From the active adult community of Sun City to the family neighborhoods of Wolf Ranch, we tailor our mowing services to meet the specific needs of every Georgetown property we maintain.`
    },
    "clean-ups": {
      "austin": `Austin's dynamic seasons bring unique clean up challenges for the city's ${area.population} homeowners. From the massive live oak leaf drop in spring to the accumulation of storm debris during severe weather season, keeping an Austin property clean and well-maintained requires professional help. Cathey's Lawn Care has been providing comprehensive seasonal clean up services to Austin neighborhoods for over a decade. We serve homes throughout ${area.neighborhoods}, ensuring every property we touch is restored to pristine condition and ready for whatever the next season brings.`,
      "round-rock": `Round Rock's rapid growth to ${area.population} residents has created thousands of beautifully landscaped properties that need regular seasonal attention. ${area.climate}. Cathey's Lawn Care provides thorough spring and fall clean up services throughout Round Rock's premier neighborhoods including ${area.neighborhoods}. Our experienced crew handles everything from leaf removal and bed preparation to storm debris cleanup, ensuring your ${area.county} property always looks its best.`,
      "leander": `Leander's Hill Country setting creates specific clean up challenges that many homeowners don't anticipate. ${area.climate}. With a booming population of ${area.population}, more and more Leander homeowners are discovering the value of professional seasonal clean ups. Cathey's Lawn Care serves neighborhoods throughout Leander including ${area.neighborhoods}, providing thorough spring and fall clean up services that address the unique debris and vegetation challenges of this rapidly growing community.`,
      "lakeway": `Lakeway's stunning Hill Country properties, nestled along Lake Travis, accumulate seasonal debris differently than typical suburban lots. ${area.climate}. With mature trees, terraced landscapes, and premium landscaping throughout the community, Lakeway's ${area.population} residents need clean up crews who understand how to work carefully around high-value landscape features. Cathey's Lawn Care provides meticulous seasonal clean up services to Lakeway neighborhoods including ${area.neighborhoods}, treating every property with the care and attention it deserves.`,
      "cedar-park": `Cedar Park homeowners across the city's ${area.population}-strong community know that seasonal transitions require professional attention. ${area.climate}. Cathey's Lawn Care provides comprehensive spring and fall clean up services throughout Cedar Park, from the established landscapes of ${area.neighborhoods} to newer developments. Our team handles leaf removal, bed preparation, debris clearing, and everything in between, ensuring your property transitions smoothly between seasons.`,
      "pflugerville": `Pflugerville's unique position on the Blackland Prairie means seasonal clean ups require a different approach than Hill Country properties. ${area.climate}. With ${area.population} residents depending on professional lawn care, Cathey's Lawn Care has become a trusted clean up partner for Pflugerville homeowners. We serve neighborhoods including ${area.neighborhoods}, providing thorough seasonal services that account for Pflugerville's specific soil and drainage characteristics.`,
      "georgetown": `Georgetown's charming historic district and sprawling master-planned communities both require professional seasonal maintenance. ${area.climate}. Cathey's Lawn Care proudly serves Georgetown's ${area.population} residents with thorough spring and fall clean up services. From the well-manicured lawns of ${area.neighborhoods}, we handle every type of seasonal clean up challenge this ${area.county} community faces.`
    },
    "tree-trimming": {
      "austin": `Austin's urban forest is one of the city's greatest assets, with majestic live oaks, towering pecans, and graceful crepe myrtles shading neighborhoods across the city. For ${area.population} Austin residents, keeping these trees healthy and properly maintained is essential for property safety, aesthetics, and value. Cathey's Lawn Care provides professional tree trimming services throughout Austin, from the heritage oaks of ${area.neighborhoods} and beyond. ${area.climate}, making year-round tree care a necessity rather than a luxury.`,
      "round-rock": `Round Rock's tree canopy has matured significantly as this ${area.county} city has grown to ${area.population} residents. Established neighborhoods like Forest Creek and Brushy Creek feature large shade trees that require regular professional trimming, while newer developments in Paloma Lake and Teravista have younger trees that benefit from formative pruning. Cathey's Lawn Care provides expert tree trimming services throughout Round Rock, using proper techniques that promote healthy growth and protect your property from storm damage.`,
      "leander": `Leander's Hill Country landscape is characterized by native trees including live oaks, cedar elms, and the ubiquitous Ashe juniper (cedar) that defines the region. ${area.climate}. As Leander's population has surged to ${area.population}, the need for professional tree trimming has grown alongside it. Cathey's Lawn Care serves Leander neighborhoods including ${area.neighborhoods} with expert trimming services that keep your trees healthy, safe, and beautifully shaped.`,
      "lakeway": `Lakeway's Hill Country setting features some of the most impressive tree specimens in the Austin metro area. From ancient live oaks draped over lakeside properties to stately pecans shading the fairways of Flintrock Falls, the trees in this ${area.county} community are valuable assets that deserve professional care. ${area.climate}. Cathey's Lawn Care provides premium tree trimming services to Lakeway's ${area.population} residents, maintaining the majestic canopy that makes this community so special.`,
      "cedar-park": `Cedar Park's tree canopy is a mix of native and ornamental species that define the character of this ${area.county} community. ${area.climate}. With ${area.population} residents, Cedar Park's demand for professional tree care continues to grow. Cathey's Lawn Care provides comprehensive tree trimming services across Cedar Park neighborhoods including ${area.neighborhoods}, ensuring your trees remain healthy, attractive, and safe through every season.`,
      "pflugerville": `Pflugerville's prairie landscape features a different tree mix than the Hill Country areas to the west. ${area.climate}. The city's ${area.population} residents have access to Cathey's Lawn Care's professional tree trimming services, delivered by an experienced crew that understands the specific species and conditions found in ${area.county}. We serve all Pflugerville neighborhoods including ${area.neighborhoods}, providing expert trimming that promotes tree health and property safety.`,
      "georgetown": `Georgetown's tree canopy tells the story of the city itself \u2014 from the heritage pecan trees along the historic square to the carefully planned landscapes of Sun City and Berry Creek. ${area.climate}. Cathey's Lawn Care is the trusted tree trimming service for Georgetown's ${area.population} residents, providing professional care that respects the beauty and value of every tree we touch. We serve neighborhoods throughout Georgetown including ${area.neighborhoods}.`
    },
    "mulching": {
      "austin": `In Austin's intense Central Texas climate, mulching isn't optional \u2014 it's essential. ${area.climate}. For the city's ${area.population} homeowners, a properly mulched landscape means healthier plants, lower water bills, and dramatically improved curb appeal. Cathey's Lawn Care has been providing professional mulching services to Austin neighborhoods including ${area.neighborhoods} for over a decade, and we know exactly which mulch types and application methods work best for this region's unique conditions.`,
      "round-rock": `Round Rock homeowners understand that protecting their landscape investment requires more than just mowing and watering. With ${area.population} residents and a housing market where curb appeal directly impacts property values, professional mulching is one of the smartest investments you can make. ${area.climate}. Cathey's Lawn Care provides expert mulching services throughout Round Rock's premier neighborhoods including ${area.neighborhoods}, transforming landscape beds from ordinary to outstanding.`,
      "leander": `Leander's rapid growth has brought thousands of new homes with freshly installed landscape beds that need proper mulching to thrive. ${area.climate}. For Leander's ${area.population} residents, professional mulching is particularly important because it helps conserve moisture in the area's rocky, well-draining soil. Cathey's Lawn Care serves neighborhoods throughout Leander including ${area.neighborhoods}, providing expert mulch installation that protects your plants and enhances your property's appearance.`,
      "lakeway": `In Lakeway, where property values rank among the highest in the Austin metro area, the quality of your landscape maintenance speaks volumes. ${area.climate}. Cathey's Lawn Care provides premium mulching services to Lakeway's ${area.population} discerning homeowners, using high-quality materials and meticulous installation techniques that match the caliber of this ${area.county} community. We serve ${area.neighborhoods} and surrounding areas with mulching services designed to impress.`,
      "cedar-park": `Cedar Park homeowners take pride in their landscapes, and professional mulching is one of the most visible improvements you can make. ${area.climate}. With ${area.population} residents and a strong sense of community pride, Cedar Park's demand for quality mulching services continues to grow. Cathey's Lawn Care provides thorough, professional mulch installation throughout Cedar Park neighborhoods including ${area.neighborhoods}.`,
      "pflugerville": `Pflugerville's Blackland Prairie soils respond differently to mulching than Hill Country soils, and understanding this difference is key to getting the best results. ${area.climate}. Cathey's Lawn Care brings this specialized knowledge to Pflugerville's ${area.population} homeowners, providing mulching services tailored to the unique conditions found in ${area.county}. We serve neighborhoods including ${area.neighborhoods} with expert installation that maximizes the benefits of every cubic yard of mulch.`,
      "georgetown": `Georgetown's diverse landscape \u2014 from the historic homes near the square to the master-planned communities stretching toward the lake \u2014 all benefit from professional mulching. ${area.climate}. Cathey's Lawn Care serves Georgetown's ${area.population} residents with premium mulching services that protect plants, conserve water, and create a polished, well-maintained appearance. We work throughout ${area.neighborhoods} and all surrounding areas.`
    },
    "land-clearing": {
      "austin": `Austin's explosive growth has created enormous demand for land clearing services as property owners prepare lots for construction, reclaim overgrown areas, and manage brush for fire prevention. With ${area.population} residents and counting, Austin's mix of developed neighborhoods and raw Hill Country acreage means land clearing needs are incredibly diverse. Cathey's Lawn Care provides professional land clearing throughout Austin and ${area.county}, handling everything from small backyard brush clearing to large-scale lot preparation for new construction projects.`,
      "round-rock": `Round Rock's position as ${area.description} means constant development activity and property improvement projects that require professional land clearing. ${area.climate}. With ${area.population} residents and new construction happening throughout ${area.county}, the need for reliable clearing services has never been greater. Cathey's Lawn Care provides efficient, professional land clearing for Round Rock homeowners, builders, and commercial property owners, serving areas including ${area.neighborhoods} and beyond.`,
      "leander": `Leander's rapid expansion means new properties are constantly being developed on land that was recently covered in native brush and cedar. ${area.climate}. As the population has grown to ${area.population}, both new construction clearing and residential property reclamation have become major needs. Cathey's Lawn Care provides expert land clearing services throughout Leander, from the established neighborhoods of ${area.neighborhoods} to undeveloped parcels awaiting their transformation.`,
      "lakeway": `Lakeway's Hill Country terrain presents unique land clearing challenges that require experienced operators. ${area.climate}. Many Lakeway properties in areas like ${area.neighborhoods} sit on sloped, rocky terrain with dense cedar and brush that requires specialized clearing techniques. Cathey's Lawn Care brings the equipment and expertise needed to clear Lakeway properties safely and effectively, whether you're preparing a building site, creating defensible space around your home, or reclaiming overgrown areas of your ${area.county} property.`,
      "cedar-park": `Cedar Park's continued growth means land clearing is an ongoing need throughout this ${area.county} community. ${area.climate}. From clearing overgrown areas behind established homes in ${area.neighborhoods} to preparing lots for new construction, Cathey's Lawn Care handles land clearing projects of all sizes for Cedar Park's ${area.population} residents. Our team works efficiently to clear brush, remove dead trees, and prepare your property for whatever you have planned next.`,
      "pflugerville": `Pflugerville's growth from a small farming community to a city of ${area.population} has been remarkable, and that growth continues to drive demand for professional land clearing services. ${area.climate}. Cathey's Lawn Care serves Pflugerville homeowners and developers with comprehensive clearing services, from residential brush clearing in ${area.neighborhoods} to commercial lot preparation throughout ${area.county}. Our experienced crew handles the unique prairie vegetation and soil conditions found in this part of Central Texas.`,
      "georgetown": `Georgetown's expansion northward along the I-35 corridor has created significant demand for land clearing services. ${area.climate}. With ${area.population} residents and new developments appearing regularly, Cathey's Lawn Care is the trusted clearing partner for Georgetown property owners. We serve established neighborhoods like ${area.neighborhoods} as well as undeveloped parcels throughout ${area.county}, providing efficient, thorough clearing that respects the land and prepares it for its next chapter.`
    },
    "weed-control": {
      "austin": `Austin's long growing season and warm climate create ideal conditions for weeds to thrive year-round. ${area.climate}. For the city's ${area.population} homeowners, the battle against weeds is a constant challenge that requires professional intervention. Cathey's Lawn Care provides comprehensive weed control services throughout Austin, from the dense neighborhoods of ${area.neighborhoods} to larger properties on the city's outskirts. Our targeted approach addresses the specific weed species prevalent in ${area.county} for maximum effectiveness.`,
      "round-rock": `Round Rock's rapid growth to ${area.population} residents has brought thousands of new lawns that are particularly vulnerable to weed invasion during establishment. ${area.climate}. Cathey's Lawn Care provides expert weed control services throughout Round Rock, serving neighborhoods including ${area.neighborhoods}. Our team understands the specific weed pressures that ${area.county} lawns face and develops targeted treatment plans that eliminate existing weeds while preventing new ones from taking hold.`,
      "leander": `Leander homeowners face unique weed challenges due to the area's Hill Country terrain and soil conditions. ${area.climate}. With a rapidly growing population of ${area.population}, more and more Leander residents are discovering that professional weed control is essential for maintaining a beautiful lawn. Cathey's Lawn Care serves Leander neighborhoods including ${area.neighborhoods} with customized weed treatment programs designed for the specific conditions found in this part of ${area.county}.`,
      "lakeway": `In Lakeway, where beautifully maintained landscapes are the standard, weeds are especially unwelcome. ${area.climate}. Cathey's Lawn Care provides discreet, effective weed control services to Lakeway's ${area.population} residents, maintaining the pristine appearance that this ${area.county} community is known for. We serve ${area.neighborhoods} and surrounding areas with targeted treatments that eliminate weeds without harming your lawn, ornamentals, or the local environment.`,
      "cedar-park": `Cedar Park's diverse neighborhoods present a range of weed control challenges. ${area.climate}. With ${area.population} residents, Cedar Park's demand for professional weed management has grown significantly. Cathey's Lawn Care provides comprehensive weed control services throughout Cedar Park, from established neighborhoods like Buttercup Creek to newer developments in Cypress Canyon. Our approach combines pre-emergent prevention with targeted post-emergent treatments for year-round effectiveness.`,
      "pflugerville": `Pflugerville's Blackland Prairie soils create specific weed pressures that differ from other parts of the Austin metro area. ${area.climate}. The city's ${area.population} homeowners face challenges from both prairie-native weeds and invasive species that thrive in the heavy clay soils. Cathey's Lawn Care provides specialized weed control services for Pflugerville lawns, serving neighborhoods including ${area.neighborhoods} with treatments calibrated for the unique soil and growing conditions found in ${area.county}.`,
      "georgetown": `Georgetown's blend of historic properties and modern master-planned communities creates diverse weed control needs. ${area.climate}. Cathey's Lawn Care serves Georgetown's ${area.population} residents with professional weed management programs that keep lawns looking their best throughout the year. From the manicured grounds of Sun City to the family neighborhoods of ${area.neighborhoods}, we develop customized treatment plans that target the specific weeds affecting your ${area.county} lawn.`
    }
  };
  return intros[service.slug][area.slug] || service.detailedContent.intro;
}

function generateAreaWhySection(service, area) {
  const sections = {
    "austin": `Austin homeowners face specific ${service.name.toLowerCase()} challenges that set this market apart from other Texas cities. ${area.climate}. The combination of intense summer heat, periodic drought restrictions, and a competitive real estate market where curb appeal directly impacts home values makes professional ${service.name.toLowerCase()} services a necessity for most Austin properties. At Cathey's Lawn Care, we've spent over a decade learning the rhythms of Austin's climate and the preferences of its homeowners. We know that a property in Zilker has different needs than one in Mueller or Circle C Ranch, and we tailor our ${service.name.toLowerCase()} approach accordingly. ${area.funFact}. Our deep roots in this community mean we understand what Austin homeowners expect and consistently deliver results that exceed those expectations. We've built our reputation one yard at a time, and our growing base of loyal Austin customers is the best proof of our commitment to quality.`,

    "round-rock": `Round Rock has earned its reputation as ${area.description}, and that growth creates both opportunities and challenges for homeowners seeking quality ${service.name.toLowerCase()} services. ${area.funFact}. Many Round Rock homeowners are transplants from other states who may not be familiar with the specific lawn care challenges of Central Texas. That's where Cathey's Lawn Care comes in \u2014 we bridge the knowledge gap and provide expert ${service.name.toLowerCase()} services that account for the local climate, soil conditions, and grass varieties found throughout ${area.county}. Our team serves all of Round Rock's major neighborhoods including ${area.neighborhoods}, providing consistent, reliable service that takes the guesswork out of lawn maintenance. With ${area.population} residents and growing, Round Rock is a community we're proud to serve.`,

    "leander": `Leander's transformation from a small bedroom community to a thriving city of ${area.population} has been nothing short of remarkable. ${area.funFact}. For homeowners in this rapidly growing ${area.county} community, finding reliable ${service.name.toLowerCase()} services can be challenging as demand often outpaces supply. Cathey's Lawn Care has been serving Leander since the community's growth began accelerating, and we've grown alongside it. ${area.climate}. Our team has the specialized equipment and knowledge to handle Leander's unique terrain, and we've earned the trust of homeowners in neighborhoods like ${area.neighborhoods} through consistent, quality work. When you choose Cathey's Lawn Care for your Leander property, you're choosing a team that knows this community inside and out.`,

    "lakeway": `Lakeway residents choose their community for its unparalleled beauty, lake access, and quality of life \u2014 and they expect their lawn care provider to match that standard of excellence. ${area.funFact}. At Cathey's Lawn Care, we understand that serving Lakeway means delivering premium-quality ${service.name.toLowerCase()} with meticulous attention to detail. ${area.climate}. Our team has extensive experience working on Lakeway properties in ${area.neighborhoods} and throughout the greater ${area.county} lakeside area. We bring the right equipment, the right techniques, and the right attitude to every Lakeway job. For a community of ${area.population} residents who expect the best, Cathey's Lawn Care delivers nothing less.`,

    "cedar-park": `Cedar Park has consistently ranked among the best places to live in Texas, and its ${area.population} residents take visible pride in their community. ${area.funFact}. Cathey's Lawn Care has been a trusted ${service.name.toLowerCase()} partner for Cedar Park homeowners for years, serving neighborhoods throughout this vibrant ${area.county} city. ${area.climate}. Whether your property is a well-established home with mature landscaping or a recently built home with new sod and plantings, our team has the expertise to provide exactly the care your property needs. We serve all major Cedar Park neighborhoods including ${area.neighborhoods}, and our commitment to showing up on time, doing quality work, and leaving every property better than we found it has made us Cedar Park's preferred lawn care company.`,

    "pflugerville": `Pflugerville's growth from a quiet community to a thriving city of ${area.population} reflects the broader Austin-area boom, and with that growth comes increasing demand for professional ${service.name.toLowerCase()} services. ${area.funFact}. Cathey's Lawn Care understands Pflugerville's unique position within the Austin metro \u2014 this is a community where families put down roots and invest in their homes. ${area.climate}. Our team has developed specific expertise in managing the heavier clay soils and different growing conditions found in Pflugerville compared to the Hill Country areas to the west. We serve all major Pflugerville neighborhoods including ${area.neighborhoods}, providing ${service.name.toLowerCase()} services calibrated for this community's specific needs.`,

    "georgetown": `Georgetown offers a unique blend of historic charm and modern amenities that attracts a diverse population of ${area.population} residents. ${area.funFact}. From maintaining the manicured landscapes of Sun City's active adult community to caring for historic properties near the courthouse square, Cathey's Lawn Care understands the varied ${service.name.toLowerCase()} needs of Georgetown homeowners. ${area.climate}. Our team serves neighborhoods throughout Georgetown including ${area.neighborhoods}, and we pride ourselves on the personal, reliable service that Georgetown residents value. When you call Cathey's Lawn Care, you're not getting a faceless corporation \u2014 you're getting a family-owned company led by ${BUSINESS.owner} who treats your property like his own.`
  };
  return sections[area.slug] || '';
}

function generateAreaClimateSection(service, area) {
  const sections = {
    "austin": `Austin's climate presents year-round challenges for property maintenance. Summers regularly exceed 95\u00B0F with stretches above 100\u00B0F, putting enormous stress on lawns and landscapes. The city also experiences periodic drought conditions that can trigger watering restrictions, making proper ${service.name.toLowerCase()} even more critical for maintaining landscape health. Spring brings severe weather including hail, high winds, and heavy rainfall that can damage trees and scatter debris across properties. Even winter isn't without its challenges \u2014 as recent ice storms have demonstrated, Central Texas can experience sudden freezing events that damage plants and create cleanup needs. Our team at Cathey's Lawn Care monitors conditions throughout the year and adjusts our ${service.name.toLowerCase()} approach to match what your Austin property needs in every season.`,
    "round-rock": `Round Rock's climate mirrors much of Austin's heat and drought patterns, but the city's position on the edge of the Blackland Prairie brings additional considerations. ${area.climate}. During the peak summer months, temperatures frequently exceed 100\u00B0F, and the open terrain around many Round Rock neighborhoods means less shade and more direct sun exposure for lawns. The clay-heavy soils in parts of Round Rock expand and contract with moisture changes, affecting everything from tree root health to turf stability. Cathey's Lawn Care accounts for all of these ${area.county}-specific conditions in our ${service.name.toLowerCase()} approach, ensuring your Round Rock property receives care that's truly tailored to its environment.`,
    "leander": `Leander's Hill Country geography creates a landscape environment distinct from the Austin metro flatlands. ${area.climate}. The rocky limestone substrate means soil depths vary dramatically across properties, affecting root development and water retention. Cedar (Ashe juniper) pollen is a particular concern in winter months, and the trees themselves compete aggressively with ornamental plantings for water and nutrients. Summer heat is every bit as intense as Austin proper, and the higher elevation of many Leander neighborhoods means greater wind exposure. Cathey's Lawn Care has the equipment and expertise to handle these Hill Country-specific challenges, delivering ${service.name.toLowerCase()} results that account for Leander's unique terrain.`,
    "lakeway": `Lakeway's microclimate is influenced by its proximity to Lake Travis and its Hill Country elevation. ${area.climate}. The lake moderates temperature extremes somewhat, but the rocky, shallow soils characteristic of the area present their own set of challenges for landscape maintenance. Many Lakeway properties feature steep terrain and terraced landscapes that require specialized equipment and techniques. The combination of premium landscaping and challenging terrain means ${service.name.toLowerCase()} in Lakeway demands a higher level of skill and attention than typical suburban properties. Cathey's Lawn Care rises to this challenge on every visit, bringing the expertise that ${area.county}'s most discerning homeowners expect.`,
    "cedar-park": `Cedar Park occupies a transitional zone between the Blackland Prairie and the Hill Country, giving it characteristics of both environments. ${area.climate}. Soil conditions can vary significantly from one neighborhood to the next, with some areas featuring the heavy clay of the prairie and others the limestone-based soils of the hills. This variability means a one-size-fits-all approach to ${service.name.toLowerCase()} simply won't work in Cedar Park. Cathey's Lawn Care takes the time to understand the specific conditions on your property and adapts our services accordingly, whether you're in the established neighborhoods near Anderson Mill or the newer communities further north.`,
    "pflugerville": `Pflugerville's Blackland Prairie location creates distinct conditions for landscape maintenance. ${area.climate}. The heavy clay soils that characterize much of Pflugerville hold moisture longer than Hill Country soils, which can be both a blessing and a challenge. Lawns may stay greener longer during dry spells, but they're also more susceptible to fungal diseases and drainage issues. The relatively flat terrain means less shade from hills but also better air circulation. Cathey's Lawn Care has developed specialized approaches for Pflugerville properties that account for these prairie-specific conditions, ensuring optimal ${service.name.toLowerCase()} results for every property we maintain.`,
    "georgetown": `Georgetown's position at the northern edge of the Austin metro means it experiences some of the most extreme temperature variations in the region. ${area.climate}. The city's elevation and northerly location can mean slightly colder winters and hotter, more exposed summers compared to properties closer to downtown Austin. Georgetown also sits on a geological transition zone, with different soil types found across the city. From the alkaline limestone soils near Berry Creek to the heavier clays in eastern areas, effective ${service.name.toLowerCase()} requires understanding these local variations. Cathey's Lawn Care brings this localized knowledge to every Georgetown property we service in ${area.county}.`
  };
  return sections[area.slug] || '';
}

// ============================================================
// HTML GENERATORS
// ============================================================

function getNav() {
  return `<nav class="nav scrolled">
  <div class="container">
    <a href="../" class="nav-logo">
      <img src="../images/small-logo.png" alt="Cathey's Lawn Care" width="50" height="50">
      <div class="logo-text">Cathey's <span>Lawn Care</span></div>
    </a>
    <div class="nav-links">
      <a href="../#about">About</a>
      <div class="nav-dropdown">
        <a href="../#services" class="nav-dropdown-toggle">Services <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></a>
        <div class="nav-dropdown-menu">
          <a href="../services/lawn-mowing.html">Lawn Mowing</a>
          <a href="../services/clean-ups.html">Spring & Fall Clean Ups</a>
          <a href="../services/tree-trimming.html">Tree Trimming</a>
          <a href="../services/mulching.html">Mulching</a>
          <a href="../services/land-clearing.html">Land Clearing</a>
          <a href="../services/weed-control.html">Weed Control</a>
        </div>
      </div>
      <a href="../#testimonials">Reviews</a>
      <a href="../#gallery">Gallery</a>
      <a href="../#faq">FAQ</a>
      <a href="#quote">Get Quote</a>
    </div>
    <div class="nav-cta"><a href="#quote" class="btn btn-primary">Get Free Quote</a></div>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="../">Home</a>
  <a href="../#services">Services</a>
  <div class="mobile-submenu">
    <a href="../services/lawn-mowing.html">→ Lawn Mowing</a>
    <a href="../services/clean-ups.html">→ Clean Ups</a>
    <a href="../services/tree-trimming.html">→ Tree Trimming</a>
    <a href="../services/mulching.html">→ Mulching</a>
    <a href="../services/land-clearing.html">→ Land Clearing</a>
    <a href="../services/weed-control.html">→ Weed Control</a>
  </div>
  <a href="../#testimonials">Reviews</a>
  <a href="#quote">Get Quote</a>
  <a href="tel:${BUSINESS.phoneRaw}" class="btn btn-primary">Call Now</a>
</div>`;
}

function getFooter() {
  return `<footer class="footer">
  <div class="footer-grid">
    <div class="footer-brand">
      <a href="../" class="nav-logo">
        <img src="../images/small-logo.png" alt="Cathey's Lawn Care" width="40" height="40">
        <div class="logo-text">Cathey's <span>Lawn Care</span></div>
      </a>
      <p>Austin's trusted family-owned lawn care company. Making your home a place you'll always be proud of.</p>
      <div class="footer-social">
        <a href="${BUSINESS.facebook}" target="_blank" rel="noopener" aria-label="Facebook">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
        <a href="${BUSINESS.yelp}" target="_blank" rel="noopener" aria-label="Yelp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-4h2v4zm0-6h-2V9h2v2z"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <ul class="footer-links">
        <li><a href="../#about">About</a></li>
        <li><a href="../#services">Services</a></li>
        <li><a href="../#testimonials">Reviews</a></li>
        <li><a href="../#gallery">Gallery</a></li>
        <li><a href="../#faq">FAQ</a></li>
        <li><a href="../#contact">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <ul class="footer-links">
        ${SERVICES.map(s => `<li><a href="${s.slug}.html">${s.name}</a></li>`).join('\n        ')}
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <ul class="footer-links">
        <li><a href="tel:${BUSINESS.phoneRaw}">&#128222; ${BUSINESS.phone}</a></li>
        <li><a href="mailto:${BUSINESS.email}">&#128231; ${BUSINESS.email}</a></li>
        <li>&#128336; Mon-Sun, 8AM-6PM</li>
        <li>&#128205; Austin, TX &amp; Surrounding Areas</li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; <span id="currentYear">2026</span> Cathey's Lawn Care. All rights reserved. | Built by <a href="https://advancedmarketing.co" target="_blank" style="color:var(--gold)">Advanced Marketing</a></p>
  </div>
</footer>`;
}

function getFloatingElements() {
  return `<a href="tel:${BUSINESS.phoneRaw}" class="floating-cta" id="floatingCta" aria-label="Call us">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
</a>

<button class="back-to-top" id="backToTop" aria-label="Back to top">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
</button>

<div class="toast-container" id="toastContainer"></div>

<script src="../js/main.js"></script>`;
}

function getContactForm(service, area) {
  const areaText = area ? ` in ${area.name}` : '';
  const serviceOptionName = service.name.replace('&', '&amp;');

  const serviceOptions = SERVICES.map(s => {
    const optName = s.name.replace('&', '&amp;');
    const selected = s.slug === service.slug ? ' selected' : '';
    return `                <option${selected}>${optName}</option>`;
  }).join('\n');

  return `<section class="contact" id="quote">
  <div class="container">
    <div class="section-header">
      <div class="section-label">Get Started</div>
      <h2 class="section-title">Request Your Free ${service.name} Quote${areaText}</h2>
      <p class="section-desc">Fill out the form below and we'll get back to you within 24 hours.</p>
    </div>
    <div class="contact-form" style="max-width: 640px; margin: 0 auto;">
      <form id="contactForm">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Your Name *</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="email" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="phone">Phone Number *</label>
            <input type="tel" id="phone" name="phone" required>
          </div>
          <div class="form-group">
            <label for="service">Service Needed</label>
            <select id="service" name="service">
              <option value="">Select a service...</option>
${serviceOptions}
              <option>Other</option>
            </select>
          </div>
        </div>
        <div class="form-group full-width">
          <label for="date">Preferred Date</label>
          <input type="date" id="date" name="preferredDate">
        </div>
        <div class="form-group full-width">
          <label for="message">Message</label>
          <textarea id="message" name="message" rows="4" placeholder="Tell us about your project..."></textarea>
        </div>
        <!-- Honeypot -->
        <div class="hp-field">
          <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        </div>
        <div class="form-submit">
          <button type="submit" class="btn btn-primary w-100">Send My Request &rarr;</button>
        </div>
        <p class="form-privacy">By submitting, you agree to be contacted about your inquiry. We never share your info.</p>
      </form>
      <div class="form-success" id="formSuccess">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <h3>Thank You!</h3>
        <p>We've received your request and will get back to you within 24 hours.</p>
      </div>
    </div>
  </div>
</section>`;
}

function getBenefitsHTML(service, area) {
  return service.benefits.map(b => `          <div class="benefit-item">
            <span class="check">\u2713</span>
            <span>${b}</span>
          </div>`).join('\n');
}

function getRelatedServices(currentService) {
  const others = SERVICES.filter(s => s.slug !== currentService.slug);
  // Pick 3 related
  const related = others.slice(0, 3);
  return related.map(s => `          <a href="${s.slug}.html" class="related-card">
            <img src="../images/${s.image}" alt="${s.name}" loading="lazy">
            <div class="related-card-content">
              <h4>${s.icon} ${s.name}</h4>
              <span>Learn More &rarr;</span>
            </div>
          </a>`).join('\n');
}

function getSidebarServiceLinks(currentService) {
  return SERVICES.map(s => {
    const active = s.slug === currentService.slug ? ' style="color:var(--forest);font-weight:700;"' : '';
    return `            <li><a href="${s.slug}.html"${active}>${s.icon} ${s.name}</a></li>`;
  }).join('\n');
}

function getAreaTags(service) {
  return AREAS.map(a => `          <a href="${service.slug}-${a.slug}.html">${a.name}, TX</a>`).join('\n');
}

// ============================================================
// MAIN SERVICE PAGE GENERATOR
// ============================================================

function generateMainServicePage(service) {
  const title = `${service.name} Services | Cathey's Lawn Care - Austin, TX`;
  const metaDesc = `Professional ${service.name.toLowerCase()} services in Austin, TX and surrounding areas. Cathey's Lawn Care - family-owned, ${BUSINESS.years} years experience. Free estimates! Call ${BUSINESS.phone}.`;
  const keywords = service.keywords.join(', ') + ', Austin TX, lawn care near me, ' + service.keywords[0] + ' Austin Texas';
  const slug = `${service.slug}.html`;
  const canonicalUrl = `${BUSINESS.domain}/services/${slug}`;

  const dc = service.detailedContent;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="keywords" content="${keywords}">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="icon" type="image/png" href="../images/logo-cropped.png">

  <!-- Open Graph -->
  <meta property="og:title" content="${service.name} Services | Cathey's Lawn Care">
  <meta property="og:description" content="Professional ${service.name.toLowerCase()} in Austin, TX. Family-owned, ${BUSINESS.years} years. Free estimates!">
  <meta property="og:image" content="${BUSINESS.domain}/images/${service.image}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/services.css">

  <!-- Schema.org Service -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "${service.name} Services - Austin, TX",
    "provider": {
      "@type": "LocalBusiness",
      "name": "${BUSINESS.name}",
      "telephone": "${BUSINESS.phone}"
    },
    "areaServed": {
      "@type": "City",
      "name": "Austin",
      "addressRegion": "TX"
    },
    "description": "${metaDesc.replace(/"/g, '\\"')}"
  }
  </script>
</head>
<body>

${getNav()}

<!-- Hero -->
<section class="service-hero" style="background-image: url('../images/${service.image}')">
  <div class="service-hero-overlay"></div>
  <div class="container service-hero-content">
    <div class="hero-badge">${service.icon} Professional ${service.name} Services</div>
    <h1>Professional ${service.name} Services</h1>
    <p class="hero-sub">${service.shortDesc} by Austin's most trusted family-owned lawn care company. ${BUSINESS.years} years of experience serving the Greater Austin area.</p>
    <div class="hero-buttons">
      <a href="#quote" class="btn btn-primary">Get Your Free Quote</a>
      <a href="tel:${BUSINESS.phoneRaw}" class="btn btn-outline">Call ${BUSINESS.phone}</a>
    </div>
  </div>
</section>

<!-- Breadcrumb -->
<div class="breadcrumb">
  <div class="container">
    <a href="../">Home</a> <span>&rarr;</span> <a href="../#services">Services</a> <span>&rarr;</span> ${service.name}
  </div>
</div>

<!-- Main Content -->
<section class="service-content">
  <div class="container">
    <div class="content-grid">
      <div class="content-main">

        <h2>${dc.section1Title}</h2>
        <p>${dc.intro}</p>
        <p>${dc.section1}</p>

        <div class="content-image">
          <img src="../images/${service.image}" alt="${service.name} services in Austin TX" loading="lazy">
        </div>

        <h2>${dc.section2Title}</h2>
        <p>${dc.section2}</p>

        <h2>${dc.section3Title}</h2>
        <p>${dc.section3}</p>

        <h2>Benefits of Professional ${service.name}</h2>
        <div class="benefits-grid">
${getBenefitsHTML(service)}
        </div>

        <h2>Why Austin Homeowners Trust Cathey's Lawn Care</h2>
        <p>When it comes to ${service.name.toLowerCase()} in the Greater Austin area, homeowners have plenty of options. So why do so many choose Cathey's Lawn Care? It starts with our owner, ${BUSINESS.owner}, who founded this company with a simple mission: provide honest, reliable, high-quality lawn care at fair prices. Over ${BUSINESS.years} years later, that mission hasn't changed. We show up when we say we will, we do the job right, and we stand behind our work. Our team uses commercial-grade equipment maintained to the highest standards, and we carry full insurance for your peace of mind. We're not a franchise or a national chain \u2014 we're your neighbors, and we take personal pride in every property we maintain.</p>
        <p>From initial consultation to ongoing maintenance, we communicate clearly and deliver consistently. We offer free, no-obligation estimates and transparent pricing with no hidden fees. Our growing list of five-star reviews on Facebook and Yelp speaks to the quality of our work and the satisfaction of our customers. Whether you need one-time ${service.name.toLowerCase()} service or year-round maintenance, Cathey's Lawn Care is the partner you can count on.</p>

        <div class="content-image">
          <img src="../images/${service.image2}" alt="${service.name} by Cathey's Lawn Care" loading="lazy">
        </div>

        <h2>Service Areas</h2>
        <p>We provide professional ${service.name.toLowerCase()} services throughout the Greater Austin area including:</p>
        <div class="area-tags">
${getAreaTags(service)}
        </div>

        <h2>Related Services</h2>
        <div class="related-services">
${getRelatedServices(service)}
        </div>

      </div>

      <!-- Sidebar -->
      <aside class="content-sidebar">
        <div class="sidebar-card">
          <h3>Free Estimate</h3>
          <p>Call us today for a free, no-obligation estimate on ${service.name.toLowerCase()} services.</p>
          <a href="tel:${BUSINESS.phoneRaw}" class="btn btn-primary w-100">\u{1F4DE} ${BUSINESS.phone}</a>
        </div>
        <div class="sidebar-card">
          <h3>Business Hours</h3>
          <p>Mon-Sun: 8AM - 6PM CST</p>
          <p>Available 7 days a week!</p>
        </div>
        <div class="sidebar-card">
          <h3>Our Services</h3>
          <ul class="sidebar-links">
${getSidebarServiceLinks(service)}
          </ul>
        </div>
      </aside>
    </div>
  </div>
</section>

<!-- Quote Form -->
${getContactForm(service, null)}

<!-- Footer -->
${getFooter()}

<!-- Floating CTA & Scripts -->
${getFloatingElements()}
</body>
</html>`;
}

// ============================================================
// AREA SERVICE PAGE GENERATOR
// ============================================================

function generateAreaServicePage(service, area) {
  const title = `${service.name} in ${area.name}, TX | Cathey's Lawn Care`;
  const metaDesc = `Professional ${service.name.toLowerCase()} services in ${area.name}, TX. Cathey's Lawn Care - family-owned, ${BUSINESS.years} years experience. Free estimates! Call ${BUSINESS.phone}.`;
  const keywords = service.keywords.map(k => `${k} ${area.name} TX`).join(', ') + `, ${service.keywords[0]} near me, ${service.keywords[0]} ${area.name} Texas`;
  const slug = `${service.slug}-${area.slug}.html`;
  const canonicalUrl = `${BUSINESS.domain}/services/${slug}`;
  const mainServiceSlug = `${service.slug}.html`;

  const dc = service.detailedContent;

  // Generate unique area intro
  const areaIntro = generateAreaIntro(service, area);
  const areaWhySection = generateAreaWhySection(service, area);
  const areaClimateSection = generateAreaClimateSection(service, area);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="keywords" content="${keywords}">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="icon" type="image/png" href="../images/logo-cropped.png">

  <!-- Open Graph -->
  <meta property="og:title" content="${service.name} in ${area.name}, TX | Cathey's Lawn Care">
  <meta property="og:description" content="Professional ${service.name.toLowerCase()} in ${area.name}. Family-owned, ${BUSINESS.years} years. Free estimates!">
  <meta property="og:image" content="${BUSINESS.domain}/images/${service.image}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/services.css">

  <!-- Schema.org Service -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "${service.name} in ${area.name}, TX",
    "provider": {
      "@type": "LocalBusiness",
      "name": "${BUSINESS.name}",
      "telephone": "${BUSINESS.phone}"
    },
    "areaServed": {
      "@type": "City",
      "name": "${area.name}",
      "addressRegion": "TX"
    },
    "description": "${metaDesc.replace(/"/g, '\\"')}"
  }
  </script>
</head>
<body>

${getNav()}

<!-- Hero -->
<section class="service-hero" style="background-image: url('../images/${service.image}')">
  <div class="service-hero-overlay"></div>
  <div class="container service-hero-content">
    <div class="hero-badge">${service.icon} Professional ${service.name} Services</div>
    <h1>${service.name} in ${area.name}, Texas</h1>
    <p class="hero-sub">${service.shortDesc} by Austin's most trusted family-owned lawn care company. ${BUSINESS.years} years of experience serving ${area.name} and the Greater Austin area.</p>
    <div class="hero-buttons">
      <a href="#quote" class="btn btn-primary">Get Your Free Quote</a>
      <a href="tel:${BUSINESS.phoneRaw}" class="btn btn-outline">Call ${BUSINESS.phone}</a>
    </div>
  </div>
</section>

<!-- Breadcrumb -->
<div class="breadcrumb">
  <div class="container">
    <a href="../">Home</a> <span>&rarr;</span> <a href="../#services">Services</a> <span>&rarr;</span> <a href="${mainServiceSlug}">${service.name}</a> <span>&rarr;</span> ${area.name}
  </div>
</div>

<!-- Main Content -->
<section class="service-content">
  <div class="container">
    <div class="content-grid">
      <div class="content-main">

        <h2>${service.name} Services in ${area.name}, TX</h2>
        <p>${areaIntro}</p>

        <h2>${dc.section1Title} in ${area.name}</h2>
        <p>${dc.section1}</p>
        <p>For ${area.name} properties specifically, this is especially important given the local conditions. ${area.climate}. Our team at Cathey's Lawn Care adapts our ${service.name.toLowerCase()} techniques to account for the specific challenges that ${area.name} homeowners face, ensuring optimal results on every property we service throughout ${area.county}.</p>

        <div class="content-image">
          <img src="../images/${service.image}" alt="${service.name} in ${area.name} TX" loading="lazy">
        </div>

        <h2>${dc.section2Title}</h2>
        <p>${dc.section2}</p>
        <p>When serving ${area.name} properties, our crew pays particular attention to the conditions unique to this ${area.county} community. Whether we're working on a property in ${area.neighborhoods.split(', ').slice(0, 3).join(', ')}, or any other ${area.name} neighborhood, we bring the same level of professionalism, attention to detail, and commitment to excellence that has made Cathey's Lawn Care the top-rated ${service.name.toLowerCase()} provider in the area.</p>

        <h2>${dc.section3Title}</h2>
        <p>${dc.section3}</p>

        <h2>Benefits of Professional ${service.name} in ${area.name}</h2>
        <div class="benefits-grid">
${getBenefitsHTML(service, area)}
        </div>

        <h2>Understanding ${area.name}'s Climate and Its Impact on Your Landscape</h2>
        <p>${areaClimateSection}</p>

        <div class="content-image">
          <img src="../images/${service.image2}" alt="${service.name} company in ${area.name}" loading="lazy">
        </div>

        <h2>Why ${area.name} Homeowners Choose Cathey's Lawn Care</h2>
        <p>${areaWhySection}</p>
        <p>We proudly serve ${area.neighborhoods} and all surrounding neighborhoods in ${area.name}. No matter where your property is located in the ${area.name} area, Cathey's Lawn Care can provide the professional ${service.name.toLowerCase()} services you need to keep your landscape looking its best. Call us today at ${BUSINESS.phone} for a free, no-obligation estimate.</p>

        <h2>${service.name} Service Areas Near ${area.name}</h2>
        <p>In addition to ${area.name}, we provide professional ${service.name.toLowerCase()} services throughout the Greater Austin area:</p>
        <div class="area-tags">
${AREAS.filter(a => a.slug !== area.slug).map(a => `          <a href="${service.slug}-${a.slug}.html">${a.name}, TX</a>`).join('\n')}
        </div>

        <h2>Related Services in ${area.name}</h2>
        <div class="related-services">
${SERVICES.filter(s => s.slug !== service.slug).slice(0, 3).map(s => `          <a href="${s.slug}-${area.slug}.html" class="related-card">
            <img src="../images/${s.image}" alt="${s.name} in ${area.name}" loading="lazy">
            <div class="related-card-content">
              <h4>${s.icon} ${s.name}</h4>
              <span>${area.name} &rarr;</span>
            </div>
          </a>`).join('\n')}
        </div>

      </div>

      <!-- Sidebar -->
      <aside class="content-sidebar">
        <div class="sidebar-card">
          <h3>Free Estimate in ${area.name}</h3>
          <p>Call us today for a free, no-obligation ${service.name.toLowerCase()} estimate in ${area.name}.</p>
          <a href="tel:${BUSINESS.phoneRaw}" class="btn btn-primary w-100">\u{1F4DE} ${BUSINESS.phone}</a>
        </div>
        <div class="sidebar-card">
          <h3>Business Hours</h3>
          <p>Mon-Sun: 8AM - 6PM CST</p>
          <p>Available 7 days a week!</p>
        </div>
        <div class="sidebar-card">
          <h3>Our Services</h3>
          <ul class="sidebar-links">
${SERVICES.map(s => {
  const active = s.slug === service.slug ? ' style="color:var(--forest);font-weight:700;"' : '';
  return `            <li><a href="${s.slug}-${area.slug}.html"${active}>${s.icon} ${s.name}</a></li>`;
}).join('\n')}
          </ul>
        </div>
        <div class="sidebar-card">
          <h3>${area.name} Info</h3>
          <p><strong>County:</strong> ${area.county}</p>
          <p><strong>Population:</strong> ${area.population}</p>
          <p><strong>About:</strong> ${area.name} is ${area.description}.</p>
        </div>
      </aside>
    </div>
  </div>
</section>

<!-- Quote Form -->
${getContactForm(service, area)}

<!-- Footer -->
${getFooter()}

<!-- Floating CTA & Scripts -->
${getFloatingElements()}
</body>
</html>`;
}

// ============================================================
// CSS FOR SERVICE PAGES
// ============================================================

const SERVICE_CSS = `/* ============================================
   SERVICE PAGES - Generated Styles
   ============================================ */

/* Service Hero */
.service-hero {
  position: relative;
  min-height: 50vh;
  display: flex;
  align-items: center;
  background: center/cover no-repeat;
  padding: 8rem 2rem 4rem;
}
.service-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(26,58,42,0.7), rgba(26,58,42,0.9));
}
.service-hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}
.service-hero h1 {
  font-family: 'Bebas Neue';
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  color: white;
  letter-spacing: 3px;
  line-height: 1;
  margin-bottom: 1.5rem;
}
.service-hero .hero-sub {
  color: var(--gray-300);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2rem;
}
.service-hero .hero-badge {
  display: inline-block;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  color: var(--gold);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}
.service-hero .hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Breadcrumb */
.breadcrumb {
  padding: 1rem 2rem;
  background: var(--gray-50);
  font-size: 0.9rem;
}
.breadcrumb a {
  color: var(--green);
  font-weight: 500;
  text-decoration: none;
}
.breadcrumb a:hover {
  text-decoration: underline;
}
.breadcrumb span {
  color: var(--gray-400);
  margin: 0 0.35rem;
}

/* Service Content Layout */
.service-content {
  padding: 4rem 2rem;
  background: var(--white);
}
.content-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 3rem;
  align-items: start;
}
.content-main h2 {
  font-family: 'Bebas Neue';
  font-size: 1.8rem;
  color: var(--forest);
  letter-spacing: 1px;
  margin: 2.5rem 0 1rem;
}
.content-main h2:first-child {
  margin-top: 0;
}
.content-main p {
  color: var(--gray-600);
  line-height: 1.8;
  margin-bottom: 1.25rem;
}
.content-image {
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
}
.content-image img {
  width: 100%;
  display: block;
}

/* Benefits Grid */
.benefits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0 2rem;
}
.benefit-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: 8px;
  font-size: 0.95rem;
  color: var(--forest);
}
.benefit-item .check {
  color: var(--green);
  font-weight: 700;
  flex-shrink: 0;
}

/* Area Tags */
.area-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1rem 0 2rem;
}
.area-tags a {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  color: var(--green);
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s;
}
.area-tags a:hover {
  background: var(--green);
  color: white;
  border-color: var(--green);
}

/* Related Services */
.related-services {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0 2rem;
}
.related-card {
  background: var(--gray-50);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s;
  text-decoration: none;
  display: block;
}
.related-card:hover {
  transform: translateY(-4px);
}
.related-card img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}
.related-card-content {
  padding: 1rem;
}
.related-card-content h4 {
  font-family: 'Bebas Neue';
  color: var(--forest);
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  letter-spacing: 0.5px;
}
.related-card-content span {
  color: var(--green);
  font-weight: 600;
  font-size: 0.85rem;
}

/* Sidebar */
.content-sidebar {
  position: sticky;
  top: 100px;
}
.sidebar-card {
  background: var(--gray-50);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.sidebar-card h3 {
  font-family: 'Bebas Neue';
  font-size: 1.2rem;
  color: var(--forest);
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
}
.sidebar-card p {
  color: var(--gray-600);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}
.sidebar-links {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-links a {
  display: block;
  padding: 0.5rem 0;
  color: var(--green);
  font-weight: 500;
  border-bottom: 1px solid var(--gray-200);
  font-size: 0.9rem;
  text-decoration: none;
}
.sidebar-links a:hover {
  color: var(--forest);
}
.sidebar-links li:last-child a {
  border-bottom: none;
}

/* Responsive */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  .content-sidebar {
    position: static;
  }
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  .related-services {
    grid-template-columns: 1fr;
  }
  .service-hero {
    padding: 6rem 1rem 3rem;
    min-height: 40vh;
  }
}
`;

// ============================================================
// MAIN EXECUTION
// ============================================================

const servicesDir = path.join(__dirname, 'services');
const cssDir = path.join(__dirname, 'css');

// Ensure directories exist
fs.mkdirSync(servicesDir, { recursive: true });
fs.mkdirSync(cssDir, { recursive: true });

let totalFiles = 0;

// Write service pages CSS
const servicesCssPath = path.join(cssDir, 'services.css');
fs.writeFileSync(servicesCssPath, SERVICE_CSS, 'utf8');
console.log(`\u2713 Created: css/services.css`);

// Generate main service pages (6)
console.log('\n--- Generating Main Service Pages ---\n');
for (const service of SERVICES) {
  const filename = `${service.slug}.html`;
  const filepath = path.join(servicesDir, filename);
  const html = generateMainServicePage(service);
  fs.writeFileSync(filepath, html, 'utf8');
  totalFiles++;
  console.log(`\u2713 Created: services/${filename}`);
}

// Generate area service pages (6 services x 7 areas = 42)
console.log('\n--- Generating Area Service Pages ---\n');
for (const service of SERVICES) {
  for (const area of AREAS) {
    const filename = `${service.slug}-${area.slug}.html`;
    const filepath = path.join(servicesDir, filename);
    const html = generateAreaServicePage(service, area);
    fs.writeFileSync(filepath, html, 'utf8');
    totalFiles++;
    console.log(`\u2713 Created: services/${filename}`);
  }
}

console.log(`\n========================================`);
console.log(`Total pages generated: ${totalFiles}`);
console.log(`  - Main service pages: ${SERVICES.length}`);
console.log(`  - Area service pages: ${SERVICES.length * AREAS.length}`);
console.log(`  - CSS file: css/services.css`);
console.log(`========================================\n`);
