// SEO settings used by prerender.mjs: page titles, meta descriptions, image file names and alt text.
// Titles lead with the search phrase people actually type ("event medical cover", "first aid cover", "first aid course"),
// stay within about 60 characters where possible, and end with the brand when it fits.
export const BRAND='Midlands Ambulance Group';
export const SITE='https://www.midlandsambulance.co.uk';
const CTA='Free quote within one working day.';

export const title=t=>(t+' | '+BRAND).length<=66?t+' | '+BRAND:t;

const AREA_TITLE={'west-midlands':'the West Midlands',wales:'Wales'};
export const areaSeo=(key,name)=>[
  `Event Medical & First Aid Cover in ${AREA_TITLE[key]||name}`,
  `Event medical and first aid cover in ${AREA_TITLE[key]||name}: Event Responders, technicians, paramedics and ambulances, with a written medical plan. ${CTA}`];

// [title, description] by page key. Pages not listed use their H1 and opening paragraph.
export const PAGES={
  home:['Event Medical & First Aid Cover UK','Event medical and first aid cover across the UK: Event Responders, technicians, paramedics and ambulances, with a written medical plan for every event. '+CTA],
  'event-medical-cover':['Event Medical Cover Services UK','Event medical cover sized to your crowd and risk: clinicians, ambulances, response vehicles and a medical plan your Safety Advisory Group will recognise.'],
  festivals:['Festival & Concert Medical Cover','Festival and concert medical cover, from single-stage gigs to multi-day camping events: treatment areas, roaming teams and ambulances. '+CTA],
  'sporting-events':['Sports Event Medical & First Aid Cover','Pitchside, trackside and course medical cover for sport, from triathlons and road races to athletics and professional fixtures. '+CTA],
  'dance-and-cheer':['Dance & Cheer Competition First Aid Cover','Mat-side medical cover for cheer and dance competitions, trusted by Future Cheer UK at arenas across the UK and in Paris. '+CTA],
  'film-and-tv':['Film Set Medics & Unit Medics for TV','Unit medics for film and TV: location shoots, stunt days and studio work, with response vehicles for remote locations. '+CTA],
  'corporate-events':['Corporate Event Medical & First Aid Cover','Discreet medical and first aid cover for corporate events, brand launches, awards nights and activity days, with a post-event report. '+CTA],
  'venues-and-conferences':['Venue & Conference Medical Cover','Medical cover for arenas, conference centres and venues, booked per event or on an ongoing contract, with incident reporting. '+CTA],
  'community-and-charity-events':['First Aid Cover for Community & Charity Events','First aid cover for fetes, galas, fun runs, bonfire nights and charity events, with charity rates and a medical plan for your council. '+CTA],
  'night-time-economy':['Night-Time Economy & Nightclub Medical Cover','Medical cover for town centres, nightclubs and late-night venues, working with door teams, street pastors and police to keep people safe. '+CTA],
  'ambulance-hire':['Event Ambulance & Response Vehicle Hire','Event ambulances and fast response vehicles, crewed by our own clinicians and booked with a medical plan for your event. '+CTA],
  'medical-planning':['Event Medical Plans & Risk Assessments','Event medical plans and medical risk assessments written for your Safety Advisory Group, licence or venue, using the Purple Guide approach.'],
  areas:['Event Medical Cover Areas: Midlands & UK-wide','Event medical and first aid cover from our Derbyshire base across the Midlands, the UK and Paris. Find your county or city. '+CTA],
  training:['First Aid Training Courses in the Midlands','First aid, paediatric first aid, AED, CPR and life support training, taught by working ambulance clinicians at our venue or your workplace.'],
  'basic-first-aid-cpr':['First Aid & CPR Course','A practical first aid and CPR course taught by working ambulance clinicians, for workplaces, clubs and community groups in the Midlands.'],
  'paediatric-first-aid':['Paediatric First Aid Course','A paediatric first aid course on babies and children for parents, grandparents, nannies and sports coaches, taught by working ambulance clinicians.'],
  'aed-cpr':['AED & CPR Training Course','Hands-on AED and CPR training for workplaces, clubs and community groups with a defibrillator, taught by working ambulance clinicians.'],
  'basic-life-support':['Basic Life Support (BLS) Training','Adult Basic Life Support training for healthcare and care teams: high-quality CPR, defibrillation and teamwork, taught by working ambulance clinicians.'],
  'intermediate-life-support':['Intermediate Life Support (ILS) Course','Intermediate Life Support training for registered healthcare professionals: assessment, rhythm recognition and leading a resuscitation team.'],
  'onsite-training':['On-site First Aid Training for Workplaces','First aid, AED and life support training delivered at your workplace by working ambulance clinicians, for groups across the UK.'],
  guides:['Event Safety & Medical Planning Guides','Free guides for event organisers: how many first aiders you need, the Purple Guide, medical plans, medical grades and hot weather events.'],
  about:['About Us: Event Medical Cover Since 2019','Midlands Ambulance Group has provided event medical cover since 2019. Founded by John Blake in Swadlincote, Derbyshire, and led by clinicians.'],
  team:['Our Clinical & Event Medical Team','Meet the Midlands Ambulance Group team: our Managing Director, Paramedic Clinical Lead, Medical Director and Event Responders.'],
  'case-studies':['Event Medical Cover Case Studies','How we covered the Banbury Triathlon, the Ministry of Defence Equestrian Trials and a Birmingham charity sleep out, and what we provided.'],
  reviews:['Reviews from Event Organisers','What event organisers say about Midlands Ambulance Group, from triathlons and cheer competitions to Ministry of Defence events.'],
  careers:['Event Medical Jobs & Careers','Join our event medical team: roles for Event Responders, technicians, paramedics, nurses and doctors at events across the Midlands and the UK.'],
  contact:['Contact Us, Swadlincote, Derbyshire','Contact Midlands Ambulance Group in Swadlincote, Derbyshire DE11 9ED. Call 0333 335 8999 or email info@midlandsambulance.co.uk.'],
  'get-a-quote':['Get an Event Medical Cover Quote','Get a quote for event medical cover in 60 seconds. Tell us the date, crowd size and postcode and we will reply within one working day.'],
  'privacy-policy':['Privacy Policy','How Midlands Ambulance Group collects, uses and protects personal information, including patient records, enquiries, training and cookies.'],
};

// Photo file names describe the picture (good for image search); alt text describes it for screen readers.
// Tiles that already carry a text label keep an empty alt so screen readers don't read the same thing twice.
export const IMG={
  evt_sport:['pitchside-medic-stamford-bridge','Midlands Ambulance Group clinician pitchside at Stamford Bridge'],
  evt_fest:['festival-medical-cover-stage','Our clinician watching the stage at a concert'],
  'cheer-arena':['cheer-competition-medical-cover','A cheer and dance competition in an arena covered by our medical team'],
  evt_film:['film-set-medic-location-shoot','A camera set up on a woodland film location'],
  case:['banbury-triathlon-medical-team','Our crew at the Banbury Triathlon'],
  dca:['event-ambulance-dual-crewed','A Midlands Ambulance Group dual crewed ambulance'],
  bonfire:['bonfire-night-first-aid-cover','A crowd watching a bonfire at night'],
  training:['event-medical-team','Our event medical team beside their vehicle'],
  landrover:['corporate-event-medical-cover','A branded vehicle at an evening corporate event'],
  evt_arena:['arena-event-medic','Our clinician watching over an arena event'],
  teamselfie:['event-medical-crew-on-shift','Two of our crew on shift at a city event'],
  nightcrowd:['night-event-medical-cover','A crowd at a night-time outdoor event'],
  'night-ambulance':['night-time-economy-ambulance','Our ambulance on standby in a city at night'],
  frvstreet:['response-car-town-centre','Our response car on a town centre street'],
  equestrian:['equestrian-event-medical-cover','Show jumping at an equestrian event'],
  dragon:['ambulance-wales-night-event','Our ambulance under a red dragon sculpture at night'],
  'arena-crowd':['venue-medical-cover-arena','A crowd inside a large venue'],
  westminster:['london-event-medical-cover-westminster','Westminster and Big Ben at night'],
  'london-night':['battersea-power-station-night-standby','Our ambulance at Battersea Power Station at night'],
  evt_run:['running-event-start-line','The start line of a running event'],
  'crew-duo':['event-clinicians-on-shift','Two of our clinicians on shift'],
  carols:['community-event-first-aid','Carol singers at a community event'],
  'venue-van':['venue-ambulance-standby','Our ambulance on standby outside a venue'],
  'venue-car':['venue-response-car','Our response car at a venue'],
  'treatment-tent':['event-treatment-tent','A medical treatment tent at an outdoor event'],
  transition:['triathlon-transition-medical-cover','A triathlon transition area'],
  'team-group':['event-medical-team-group','Members of the Midlands Ambulance Group team'],
  runner:['running-event-first-aid','A runner on a race course'],
  'rrv-field':['rapid-response-vehicle-field-event','Our rapid response vehicle at a field event'],
  're-enactment':['re-enactment-event-medical-cover','A battle re-enactment at an outdoor event'],
  'night-event':['evening-running-event','Runners at an evening running event'],
  funfair:['funfair-first-aid-cover','A funfair at night'],
  'fun-run':['fun-run-first-aid-cover','Runners at a fun run'],
  frv:['fast-response-vehicle-london','Our fast response vehicle in London'],
  'frv-dusk':['response-vehicle-dusk','Our response vehicle at dusk'],
  'fireworks-crew':['fireworks-display-first-aid','Our crew at a fireworks display'],
  'festival-crowd':['festival-crowd-medical-cover','A crowd at an outdoor festival'],
  evt_comm:['community-event-response-car','Our response car at a community event'],
  'derby-run':['road-race-medical-cover','The finish area of a town centre road race'],
  'crew-team':['event-medical-crew','Our crew with their vehicle'],
  'crew-selfie':['event-crew-indoor-event','Two of our crew at an indoor event'],
  areas:['outdoor-event-crowd','A crowd at an outdoor community event'],
  hero:['fast-response-vehicle-night','A Midlands Ambulance Group fast response vehicle at night'],
};
