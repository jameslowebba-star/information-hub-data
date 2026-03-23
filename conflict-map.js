/* ===== CONFLICT & RESOURCE MAP — Tool #6 ===== */

const CONFLICT_DATA = [
  {
    id: "hormuz",
    name: "Strait of Hormuz Crisis",
    region: "Middle East",
    lat: 26.6, lng: 56.5,
    status: "active",
    statusLabel: "Active Conflict",
    type: "Naval Blockade / Proxy War",
    duration: "Escalated Feb 2026",
    actors: [
      { name: "Iran (IRGC)", role: "Blockade enforcement" },
      { name: "Houthis (Ansarallah)", role: "Red Sea / Bab el-Mandeb attacks" },
      { name: "United States", role: "Naval presence, strikes on Iran" },
      { name: "Israel", role: "Joint strikes with US" },
      { name: "Saudi Arabia / UAE", role: "Regional coalition" }
    ],
    resources: [
      { name: "Oil", icon: "oil", color: "#1a1a2e", pct: "20-25% of global petroleum transits Hormuz" },
      { name: "LNG", icon: "gas", color: "#2d4059", pct: "~20% of global LNG trade" }
    ],
    whoBenefits: "Russia (higher oil prices), US/Australia LNG exporters (market share), China (cheap Iranian crude). War risk insurance surged to 5% of vessel value.",
    marketImpact: "Brent crude spiked to $126/bbl from ~$80. 94% drop in Hormuz transits. Global shipping rerouted adding 10-15 days. Tanker insurance costs skyrocketed.",
    recentDev: "Feb 28, 2026: US/Israel strike Iran, kill Khamenei. Iran closes Hormuz, attacks 21+ ships by March 12. Houthis threaten Bab el-Mandeb blockade. Trump issues 48hr ultimatum March 23.",
    keyMetric: "$126/bbl Brent peak",
    sources: [
      { name: "Wikipedia", url: "https://en.wikipedia.org/wiki/2026_Strait_of_Hormuz_crisis" },
      { name: "Reuters", url: "https://www.reuters.com/world/cargo-ship-hit-by-projectile-strait-hormuz-crew-evacuates-2026-03-11/" },
      { name: "World Economic Forum", url: "https://www.weforum.org/stories/2026/03/iran-conflict-disrupts-oil-and-gas-supply-top-energy-stories-march-2026/" }
    ]
  },
  {
    id: "drc",
    name: "DRC / Great Lakes Crisis",
    region: "Central Africa",
    lat: -1.5, lng: 29.0,
    status: "active",
    statusLabel: "Active Conflict",
    type: "Insurgency / Resource War",
    duration: "Ongoing since 2021 (M23 resurgence)",
    actors: [
      { name: "M23 Rebels", role: "Eastern DRC territorial control" },
      { name: "Rwanda", role: "Backing M23 (UN-documented)" },
      { name: "DRC Army (FARDC)", role: "Government defense" },
      { name: "Various militias", role: "130+ armed groups in eastern DRC" },
      { name: "Uganda", role: "Cross-border operations" }
    ],
    resources: [
      { name: "Cobalt", icon: "mineral", color: "#3b82f6", pct: "~73% of global supply" },
      { name: "Coltan", icon: "mineral", color: "#8b5cf6", pct: "~60% of global tantalum" },
      { name: "Gold", icon: "gold", color: "#d4a843", pct: "Significant artisanal mining" },
      { name: "Copper", icon: "mineral", color: "#f59e0b", pct: "Major reserves in Katanga" }
    ],
    whoBenefits: "Smuggling networks moving minerals through Rwanda/Uganda for export. Chinese refiners buying discounted cobalt. Rwanda's economy directly benefits from looted minerals.",
    marketImpact: "Cobalt price spikes → EV battery costs rise → Tesla, BYD supply chain pressure. Tantalum shortages affect electronics manufacturing globally. Copper supply risk for green energy transition.",
    recentDev: "Jan 2025: M23 captures Goma (pop. 2M). Feb: ceasefire collapses repeatedly. Mar 2026: M23 controls large swaths of North Kivu. US sanctions Rwanda-linked networks. Cobalt smuggling valued at billions annually.",
    keyMetric: "73% global cobalt",
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/news/2025/1/27/m23-rebels-enter-goma-drc" },
      { name: "UN Panel of Experts", url: "https://www.un.org/securitycouncil/sanctions/1533/panel-of-experts/reports" },
      { name: "Reuters", url: "https://www.reuters.com/world/africa/" }
    ]
  },
  {
    id: "ukraine",
    name: "Ukraine-Russia War",
    region: "Eastern Europe",
    lat: 48.5, lng: 37.5,
    status: "active",
    statusLabel: "Active War",
    type: "Interstate War",
    duration: "Since February 2022",
    actors: [
      { name: "Russia", role: "Invasion force, occupying ~18% of Ukraine" },
      { name: "Ukraine", role: "Defending sovereign territory" },
      { name: "NATO / US / EU", role: "Weapons, funding, sanctions" },
      { name: "China / India", role: "Buying discounted Russian energy" }
    ],
    resources: [
      { name: "Natural Gas", icon: "gas", color: "#2d4059", pct: "Russia was ~40% of EU gas pre-war" },
      { name: "Wheat", icon: "grain", color: "#d4a843", pct: "Ukraine + Russia = ~25% global wheat exports" },
      { name: "Neon", icon: "mineral", color: "#06b6d4", pct: "Ukraine produced ~50% of semiconductor-grade neon" },
      { name: "Titanium", icon: "mineral", color: "#6b7280", pct: "Ukraine has significant titanium reserves" }
    ],
    whoBenefits: "US LNG exporters (replaced Russian gas to EU), US defense industry ($175B+ in aid contracts), India/China (cheap Russian crude at $20-30 discount).",
    marketImpact: "European gas prices surged 10x in 2022. Wheat prices spiked causing food crises in Africa/Middle East. Neon shortage threatened chip manufacturing. Fertilizer costs doubled globally.",
    recentDev: "2025: Front lines largely static. Russia gains incrementally in Donetsk. Ukraine strikes deep into Russia with Western missiles. 2026: Ceasefire negotiations stall. Sanctions tighten but Russia adapts via parallel trade networks.",
    keyMetric: "25% global wheat",
    sources: [
      { name: "ISW", url: "https://www.understandingwar.org/backgrounder/russian-offensive-campaign-assessment" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/tag/russia-ukraine-war/" },
      { name: "Reuters", url: "https://www.reuters.com/world/europe/ukraine/" }
    ]
  },
  {
    id: "sudan",
    name: "Sudan Civil War",
    region: "North Africa",
    lat: 15.5, lng: 32.5,
    status: "active",
    statusLabel: "Active War",
    type: "Civil War",
    duration: "Since April 2023",
    actors: [
      { name: "SAF (Sudanese Armed Forces)", role: "Military government under al-Burhan" },
      { name: "RSF (Rapid Support Forces)", role: "Paramilitary under Hemeti" },
      { name: "UAE", role: "Backing RSF (weapons, funding)" },
      { name: "Egypt / Saudi Arabia", role: "Supporting SAF" }
    ],
    resources: [
      { name: "Gold", icon: "gold", color: "#d4a843", pct: "3rd largest reserves in Africa, ~100 tonnes/yr" },
      { name: "Oil", icon: "oil", color: "#1a1a2e", pct: "Transit point for South Sudan crude" },
      { name: "Gum Arabic", icon: "grain", color: "#92400e", pct: "~70% of global supply" }
    ],
    whoBenefits: "RSF controls gold mines (Jebel Amer), exports via UAE/Dubai. Wagner Group (now Africa Corps) involved in gold smuggling. UAE refineries process Sudanese gold.",
    marketImpact: "Gold smuggling bypasses sanctions, suppresses official export revenue. Gum arabic shortage affects food/beverage industry globally (used in Coca-Cola, cosmetics). Oil transit disruptions affect South Sudan's landlocked exports.",
    recentDev: "2025: RSF controls most of Darfur and Khartoum. 10M+ displaced (world's largest displacement crisis). 2026: famine declared in multiple regions. SAF recaptures some Khartoum neighborhoods. International community largely disengaged.",
    keyMetric: "10M+ displaced",
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/tag/sudan/" },
      { name: "UN OCHA", url: "https://www.unocha.org/sudan" },
      { name: "The Sentry", url: "https://thesentry.org/reports/" }
    ]
  },
  {
    id: "sahel",
    name: "Sahel Insurgency Belt",
    region: "West Africa",
    lat: 14.0, lng: 0.0,
    status: "active",
    statusLabel: "Active Insurgency",
    type: "Jihadist Insurgency / Coup Belt",
    duration: "Escalating since 2012",
    actors: [
      { name: "JNIM (al-Qaeda affiliate)", role: "Primary insurgent group" },
      { name: "IS Sahel (ISIS affiliate)", role: "Expanding operations" },
      { name: "Mali / Niger / Burkina Faso juntas", role: "Military governments post-coup" },
      { name: "Russia (Africa Corps)", role: "Replaced French forces, mining deals" },
      { name: "France (expelled)", role: "Former security partner, withdrew 2022-23" }
    ],
    resources: [
      { name: "Gold", icon: "gold", color: "#d4a843", pct: "Mali #3, Burkina #4 in Africa" },
      { name: "Uranium", icon: "mineral", color: "#22c55e", pct: "Niger ~5% of global supply (powers France's reactors)" },
      { name: "Oil", icon: "oil", color: "#1a1a2e", pct: "Niger's new pipeline (Agadem-Benin)" }
    ],
    whoBenefits: "Russia (Africa Corps gets mining concessions for security). Artisanal miners in ungoverned areas. Smuggling networks across Libya-Niger-Mali corridor. China (infrastructure-for-resources deals).",
    marketImpact: "Uranium supply risk threatens France's 70% nuclear-dependent energy grid. Gold production disruptions in Mali/Burkina affect global supply. New Niger oil pipeline (90k bpd target) faces security threats.",
    recentDev: "2025: Alliance of Sahel States (AES) formalizes — Mali, Niger, Burkina exit ECOWAS. Russia expands military presence. IS Sahel attacks surge. 2026: Niger oil exports begin but pipeline under threat. France loses all influence. Humanitarian crisis deepens.",
    keyMetric: "5% global uranium",
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/tag/sahel/" },
      { name: "Africa Center", url: "https://africacenter.org/spotlight/sahel/" },
      { name: "Crisis Group", url: "https://www.crisisgroup.org/africa/sahel" }
    ]
  },
  {
    id: "taiwan",
    name: "South China Sea / Taiwan",
    region: "East Asia",
    lat: 24.8, lng: 119.9,
    status: "escalating",
    statusLabel: "Escalating Tensions",
    type: "Territorial Dispute / Geopolitical Standoff",
    duration: "Ongoing, intensifying since 2020",
    actors: [
      { name: "China (PRC)", role: "Claims Taiwan + 90% of SCS" },
      { name: "Taiwan (ROC)", role: "De facto independent, TSMC base" },
      { name: "United States", role: "Taiwan's key security backer" },
      { name: "Philippines / Vietnam", role: "SCS territorial claimants" }
    ],
    resources: [
      { name: "Semiconductors", icon: "mineral", color: "#06b6d4", pct: "TSMC = ~72% of global foundry market" },
      { name: "Rare Earths", icon: "mineral", color: "#8b5cf6", pct: "China controls ~61% mining, ~91% processing" },
      { name: "Oil & Gas (SCS)", icon: "oil", color: "#1a1a2e", pct: "~11 billion barrels, 190 Tcf gas in SCS" },
      { name: "Fisheries", icon: "grain", color: "#2563eb", pct: "12% of global fish catch from SCS" }
    ],
    whoBenefits: "Intel/Samsung (TSMC disruption = market share). Non-China rare earth producers (Australia, US). Defense contractors on all sides.",
    marketImpact: "Taiwan disruption = estimated $2.5T hit to US GDP alone. Global chip shortage would dwarf 2021 crisis. Rare earth export bans already affecting EV/wind/defense supply chains. SCS shipping lane disruption affects $5.3T in annual trade.",
    recentDev: "Aug 2025: Chinese vessels collide with Philippine ship at Scarborough Shoal. Mar 2026: Philippines rejects China SCS claims. China escalates anti-independence rhetoric. Taiwan eyes nuclear restart. PLAAF sorties near Taiwan increase 40% year-over-year.",
    keyMetric: "72% global chips",
    sources: [
      { name: "East Asia Forum", url: "https://eastasiaforum.org/2026/02/27/drifting-through-dispute-in-the-south-china-sea/" },
      { name: "ISW", url: "https://understandingwar.org/research/china-taiwan/china-taiwan-update-march-20-2026/" },
      { name: "CNN", url: "https://www.cnn.com/2026/03/19/asia/china-taiwan-invasion-plans-us-intl-hnk" }
    ]
  },
  {
    id: "ethiopia",
    name: "Ethiopia / Tigray",
    region: "East Africa",
    lat: 13.5, lng: 39.47,
    status: "escalating",
    statusLabel: "Escalating",
    type: "Internal Conflict / Water Dispute",
    duration: "Post-ceasefire breakdown, 2025-ongoing",
    actors: [
      { name: "Ethiopian Govt (ENDF)", role: "Federal military" },
      { name: "TPLF / TDF", role: "Tigray defense forces" },
      { name: "Amhara Fano militias", role: "Fighting both sides" },
      { name: "Eritrea (EDF)", role: "Intervening in Tigray" },
      { name: "UAE", role: "Backing Ethiopia" }
    ],
    resources: [
      { name: "Gold", icon: "gold", color: "#d4a843", pct: "Tigray = ~50% of Ethiopia's gold output" },
      { name: "Nile Water (GERD)", icon: "mineral", color: "#2563eb", pct: "Controls Blue Nile headwaters — existential for Egypt" },
      { name: "Potash & Rare Earths", icon: "mineral", color: "#8b5cf6", pct: "Untapped deposits in Tigray/Afar" }
    ],
    whoBenefits: "Foreign mining firms (Canadian/Chinese operating during chaos). Egypt/Eritrea (weaken Ethiopia over GERD dam). Armed groups controlling illicit gold trade.",
    marketImpact: "Gold supply disruptions from Tigray could support prices. GERD dispute affects Nile water allocation for 250M+ people across Ethiopia, Sudan, Egypt. Minor rare earth potential risk.",
    recentDev: "2025: TPLF internal coup, TPF clashes. Jan 2026: Clashes in Tselemti/Alamata. Feb: ENDF military buildup, Eritrea accusations. Mar: AU calls for restraint, fears of full-scale regional war.",
    keyMetric: "250M+ depend on Nile",
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/features/2026/2/18/fears-of-slow-certain-death-stalk-tigray-amid-rumblings-of-renewed-war" },
      { name: "UN News", url: "https://news.un.org/en/story/2026/02/1166930" },
      { name: "Lawfare", url: "https://www.lawfaremedia.org/article/ethiopia-s-troubled-peace" }
    ]
  },
  {
    id: "myanmar",
    name: "Myanmar Civil War",
    region: "Southeast Asia",
    lat: 19.75, lng: 96.13,
    status: "active",
    statusLabel: "Active Civil War",
    type: "Revolution / Ethnic Armed Conflict",
    duration: "Since Feb 2021 coup",
    actors: [
      { name: "Military Junta (SAC)", role: "Coup government" },
      { name: "NUG / PDF", role: "Shadow civilian govt + resistance" },
      { name: "Ethnic Armed Orgs (KIA, TNLA, AA)", role: "Territorial control in border regions" },
      { name: "China", role: "Economic interests, pipeline protection" }
    ],
    resources: [
      { name: "Rare Earths", icon: "mineral", color: "#8b5cf6", pct: "~40% of China's heavy rare earth imports" },
      { name: "Jade", icon: "mineral", color: "#22c55e", pct: "~90% of global jade (est. $31B/yr industry)" },
      { name: "Natural Gas", icon: "gas", color: "#2d4059", pct: "Pipelines to China (Shwe gas field)" },
      { name: "Tin", icon: "mineral", color: "#6b7280", pct: "Significant global tin producer" }
    ],
    whoBenefits: "Military-linked companies controlling jade/gem mines. China (cheap rare earths, pipeline leverage). Thai/Chinese border traders in grey market minerals.",
    marketImpact: "Rare earth supply disruptions when China periodically bans Myanmar imports. Jade market largely illicit. Tin supply affects global electronics soldering. Gas pipeline disruptions affect China's energy security.",
    recentDev: "2025: Resistance forces gain control of ~60% of territory. Operation 1027 captures major border towns. Junta loses control of key rare earth mining regions. 2026: Junta retreats to central lowlands. China brokers local ceasefires to protect pipeline.",
    keyMetric: "40% China rare earths",
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/tag/myanmar/" },
      { name: "Myanmar Now", url: "https://myanmar-now.org/en/" },
      { name: "Crisis Group", url: "https://www.crisisgroup.org/asia/south-east-asia/myanmar" }
    ]
  },
  {
    id: "libya",
    name: "Libya Political Crisis",
    region: "North Africa",
    lat: 26.58, lng: 12.22,
    status: "de-escalating",
    statusLabel: "De-escalating",
    type: "Political Deadlock / Oil Control",
    duration: "Since 2011 (post-Gaddafi fragmentation)",
    actors: [
      { name: "GNU (Tripoli)", role: "Internationally recognized govt" },
      { name: "LNA / Haftar (East)", role: "Military strongman, controls oil crescent" },
      { name: "Turkey / Italy", role: "Backing GNU" },
      { name: "UAE / Egypt", role: "Backing Haftar / LNA" }
    ],
    resources: [
      { name: "Oil", icon: "oil", color: "#1a1a2e", pct: "Africa's largest reserves (~48B barrels, ~3% global)" }
    ],
    whoBenefits: "Fuel smuggling networks ($5-7B/yr illicit trade). Haftar family controls eastern oil infrastructure. Europe needs Libyan light sweet crude as Russian oil alternative.",
    marketImpact: "Oil shutdowns cause Brent price spikes. Stable Libyan production (~1.4M bpd) pressures European refining margins. Europe relies on Libya to diversify away from Russian oil.",
    recentDev: "2025: Central bank crisis caused oil shutdowns. Fuel smuggling surge ($6.7B loss). IOCs return (Chevron, Eni, Total — $20B deals). 2026: Mabruk field restarts. Production targets 1.6M bpd. UN warns of 'explosion risk' from political deadlock.",
    keyMetric: "48B barrels reserves",
    sources: [
      { name: "Reuters", url: "https://www.reuters.com/business/energy/libyas-mabruk-oil-field-increase-production-up-30000-bpd-2026-03-01/" },
      { name: "UN Security Council", url: "https://press.un.org/en/2026/sc16298.doc.htm" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/news/2026/2/11/libya-issues-rare-oil-exploration-licences-to-foreign-firms" }
    ]
  },
  {
    id: "arctic",
    name: "Arctic NATO-Russia Standoff",
    region: "Arctic",
    lat: 67.7, lng: 36.0,
    status: "escalating",
    statusLabel: "Escalating Tensions",
    type: "Geopolitical Standoff / Military Buildup",
    duration: "Intensifying since 2022",
    actors: [
      { name: "Russia (Northern Fleet)", role: "Arctic militarization, resource claims" },
      { name: "NATO (Arctic Sentry)", role: "New Arctic command, 25k troops in exercises" },
      { name: "Norway / Finland / Sweden", role: "Frontline NATO states" },
      { name: "China", role: "'Near-Arctic state' claims, Polar Silk Road" }
    ],
    resources: [
      { name: "Oil", icon: "oil", color: "#1a1a2e", pct: "~20% of Russia's production from Arctic" },
      { name: "Natural Gas", icon: "gas", color: "#2d4059", pct: "~75% of Russia's reserves in Arctic" },
      { name: "Rare Earths", icon: "mineral", color: "#8b5cf6", pct: "Tomtor deposit — one of world's largest" },
      { name: "Shipping Routes", icon: "mineral", color: "#06b6d4", pct: "Northern Sea Route — 40% shorter Asia-Europe" }
    ],
    whoBenefits: "US/NATO defense industry (Arctic buildup = bigger budgets). Non-Arctic energy exporters (Qatar, US shale). China (Polar Silk Road ambitions). Russia (militarized control of NSR = toll revenue).",
    marketImpact: "Higher oil/gas/LNG prices from Russian supply risk. Elevated rare earth prices delay green tech transition. Northern Sea Route insurance rates rising. Arctic resource extraction increasingly contested.",
    recentDev: "Oct 2025: NATO CAOC opens in Bodø, Norway. Feb 2026: NATO launches Arctic Sentry. Mar 2026: Cold Response 2026 (25,000 troops). NATO studying 'what-if' Arctic conflict scenarios. Russia warns of growing tensions.",
    keyMetric: "75% Russia gas reserves",
    sources: [
      { name: "NATO", url: "https://www.nato.int/en/news-and-events/articles/news/2026/02/11/nato-secretary-general-outlines-new-activity-arctic-sentry-ahead-of-defence-ministers-meeting" },
      { name: "Defense News", url: "https://www.defensenews.com/global/europe/2026/03/09/nato-to-study-what-if-scenarios-that-could-cause-arctic-conflict-with-russia/" },
      { name: "Reuters", url: "https://www.reuters.com/markets/commodities/us-europe-fall-behind-race-control-arctic-vladimirov-petrova-2026-01-29/" }
    ]
  },
  {
    id: "gaza",
    name: "Israel–Palestine (Gaza)",
    region: "Middle East",
    lat: 31.4, lng: 34.4,
    status: "active",
    statusLabel: "Active War / Occupation",
    type: "War / Military Occupation",
    duration: "Escalated Oct 2023, ongoing",
    actors: [
      { name: "Israel (IDF)", role: "Military operations, controls 53-58% of Gaza" },
      { name: "Hamas", role: "Former governing authority, armed resistance" },
      { name: "Palestinian Authority", role: "Limited governance in West Bank" },
      { name: "United States", role: "Primary military/diplomatic backer of Israel" },
      { name: "Egypt", role: "Controls Rafah border crossing" }
    ],
    resources: [
      { name: "Natural Gas (Leviathan)", icon: "gas", color: "#2d4059", pct: "Leviathan: largest E. Med gas field — $2.36B expansion approved" },
      { name: "Gaza Marine Gas Field", icon: "gas", color: "#06b6d4", pct: "~1 Tcf gas offshore Gaza — undeveloped, contested" },
      { name: "Gum Arabic", icon: "grain", color: "#92400e", pct: "Strategic Mediterranean coastline and shipping lanes" }
    ],
    whoBenefits: "Israel (territorial control, gas field access, Ben Gurion Canal proposals). US defense contractors ($17.9B in military aid since Oct 2023). Egypt (Rafah crossing leverage, gas pipeline deals). Chevron (Leviathan expansion).",
    marketImpact: "Regional instability drives oil risk premiums. Leviathan gas field shut down Feb 2026 for expansion — temporary supply disruption to Egypt/Jordan. Suez Canal shipping reroutes. Defense stocks surge globally.",
    recentDev: "Oct 2025: Ceasefire agreed, hostages released. IDF retains control of 53-58% of Gaza. March 2026: Rafah crossing closed then partially reopened. 72,000+ Palestinians killed since Oct 2023. 18,500 patients await medical evacuation. Settler violence surges 54% in West Bank.",
    keyMetric: "72,000+ killed",
    sources: [
      { name: "UN OCHA", url: "https://www.ochaopt.org/content/humanitarian-situation-report-19-march-2026" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/news/2026/3/13/whats-happened-in-gaza-and-the-west-bank-since-the-start-of-the-iran-war" },
      { name: "Reuters", url: "https://www.reuters.com/business/energy/chevron-takes-final-investment-decision-leviathan-gas-expansion-2026-01-16/" }
    ]
  },
  {
    id: "lebanon",
    name: "Israel–Lebanon (Hezbollah)",
    region: "Middle East",
    lat: 33.85, lng: 35.86,
    status: "active",
    statusLabel: "Active War",
    type: "Cross-Border War",
    duration: "Reignited March 2026",
    actors: [
      { name: "Israel (IDF)", role: "Airstrikes, ground invasion of south Lebanon" },
      { name: "Hezbollah", role: "Rocket/drone attacks on Israeli bases" },
      { name: "Iran (IRGC)", role: "Commands Hezbollah operations per Lebanese PM" },
      { name: "UNIFIL", role: "UN peacekeepers — mandate ending 2026" },
      { name: "Lebanese Government", role: "Condemned Hezbollah, banned its military activity" }
    ],
    resources: [
      { name: "Mediterranean Gas", icon: "gas", color: "#2d4059", pct: "Disputed maritime boundary — Karish/Qana fields" },
      { name: "Water (Litani River)", icon: "mineral", color: "#2563eb", pct: "Israel targeting all Litani bridge crossings" },
      { name: "Strategic Territory", icon: "mineral", color: "#6b7280", pct: "Buffer zone south of Litani — Israel's stated objective" }
    ],
    whoBenefits: "Israel (eliminates Hezbollah northern threat, secures gas fields). Iran (proxy pressure on Israel). US defense industry. Syria (Hezbollah distracted from Syrian theater).",
    marketImpact: "Oil risk premiums elevated due to regional escalation. Eastern Mediterranean gas supply uncertainty (Karish field). Lebanon's economy — already collapsed — faces total breakdown. ~1M displaced (20% of population). Insurance rates for E. Med shipping surge.",
    recentDev: "Nov 2024: US-France brokered ceasefire. Israel never withdrew, violated agreement daily. Feb 28, 2026: US/Israel strike Iran → Hezbollah retaliates. Mar 2: Full war resumes. Mar 16: Israel ground invasion of south Lebanon. Mar 22: Israel destroys Qasmiyeh Bridge over Litani. UNIFIL HQ hit. 1,000+ killed in Lebanon.",
    keyMetric: "1M displaced",
    sources: [
      { name: "Wikipedia", url: "https://en.wikipedia.org/wiki/2026_Lebanon_war" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/opinions/2026/3/11/the-israel-hezbollah-ceasefire-was-built-to-fail" },
      { name: "Asharq Al-Awsat", url: "https://english.aawsat.com/arab-world/5254050-ceasefire-efforts-enter-open-ended-pause-alarming-lebanese" }
    ]
  }
];

/* ---- Status helpers ---- */
const STATUS_COLORS = {
  active:       { bg: "#ef4444", text: "#fff" },
  escalating:   { bg: "#f59e0b", text: "#000" },
  "de-escalating": { bg: "#22c55e", text: "#000" },
  ceasefire:    { bg: "#3b82f6", text: "#fff" }
};

const RESOURCE_ICONS = {
  oil:     "⬤",
  gas:     "⬤",
  gold:    "⬤",
  mineral: "⬤",
  grain:   "⬤"
};

/* ---- Map initialization ---- */
let conflictMap = null;
let markers = [];
let activeCard = null;

function initConflictMap() {
  if (conflictMap) return;

  const mapEl = document.getElementById("conflict-map-container");
  if (!mapEl) return;

  conflictMap = L.map("conflict-map-container", {
    center: [20, 30],
    zoom: 2,
    minZoom: 2,
    maxZoom: 7,
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: true,
    worldCopyJump: true
  });

  // Dark tile layer
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(conflictMap);

  // Zoom control top-right
  L.control.zoom({ position: "topright" }).addTo(conflictMap);

  // Add markers
  CONFLICT_DATA.forEach(c => {
    const statusColor = STATUS_COLORS[c.status]?.bg || "#ef4444";
    const pulseClass = c.status === "active" ? "pulse-marker" : "static-marker";

    const icon = L.divIcon({
      className: `conflict-marker ${pulseClass}`,
      html: `<div class="marker-dot" style="background:${statusColor};box-shadow:0 0 12px ${statusColor}80;"></div>
             <div class="marker-label">${c.name.split("/")[0].split("(")[0].trim()}</div>`,
      iconSize: [120, 40],
      iconAnchor: [60, 20]
    });

    const marker = L.marker([c.lat, c.lng], { icon }).addTo(conflictMap);
    marker.on("click", () => showIntelCard(c));
    markers.push({ marker, data: c });
  });

  // Update stats
  updateMapStats();
}

function updateMapStats() {
  const active = CONFLICT_DATA.filter(c => c.status === "active").length;
  const escalating = CONFLICT_DATA.filter(c => c.status === "escalating").length;
  const totalResources = new Set();
  CONFLICT_DATA.forEach(c => c.resources.forEach(r => totalResources.add(r.name)));

  // Find hottest zone (active + most recent dev)
  const hottest = CONFLICT_DATA.find(c => c.id === "hormuz") || CONFLICT_DATA[0];

  document.getElementById("stat-conflicts").textContent = CONFLICT_DATA.length;
  document.getElementById("stat-active").textContent = active;
  document.getElementById("stat-escalating").textContent = escalating;
  document.getElementById("stat-resources").textContent = totalResources.size;
  document.getElementById("stat-hottest").textContent = hottest.name.split("/")[0].split("(")[0].trim();
}

/* ---- Intel Card ---- */
function showIntelCard(data) {
  activeCard = data;
  const panel = document.getElementById("intel-panel");
  const sc = STATUS_COLORS[data.status] || STATUS_COLORS.active;

  panel.innerHTML = `
    <button class="intel-close" onclick="closeIntelCard()">&times;</button>
    <div class="intel-header">
      <span class="intel-status-badge" style="background:${sc.bg};color:${sc.text};">${data.statusLabel}</span>
      <h3 class="intel-title">${data.name}</h3>
      <p class="intel-meta">${data.region} &middot; ${data.type} &middot; ${data.duration}</p>
    </div>

    <div class="intel-section">
      <h4><span class="intel-icon">👥</span> Key Actors</h4>
      <div class="intel-actors">
        ${data.actors.map(a => `<div class="actor-row"><span class="actor-name">${a.name}</span><span class="actor-role">${a.role}</span></div>`).join("")}
      </div>
    </div>

    <div class="intel-section">
      <h4><span class="intel-icon">⛏</span> Resources at Stake</h4>
      <div class="intel-resources">
        ${data.resources.map(r => `
          <div class="resource-chip">
            <span class="resource-dot" style="background:${r.color};"></span>
            <span class="resource-name">${r.name}</span>
            <span class="resource-pct">${r.pct}</span>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="intel-section">
      <h4><span class="intel-icon">💰</span> Who Benefits</h4>
      <p>${data.whoBenefits}</p>
    </div>

    <div class="intel-section">
      <h4><span class="intel-icon">📊</span> Market Impact</h4>
      <p>${data.marketImpact}</p>
    </div>

    <div class="intel-section">
      <h4><span class="intel-icon">📰</span> Recent Developments</h4>
      <p>${data.recentDev}</p>
    </div>

    <div class="intel-section intel-sources">
      <h4>Sources</h4>
      <div class="source-links">
        ${data.sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`).join("")}
      </div>
    </div>
  `;

  panel.classList.add("open");

  // Fly to marker
  conflictMap.flyTo([data.lat, data.lng], 4, { duration: 1.2 });
}

function closeIntelCard() {
  document.getElementById("intel-panel").classList.remove("open");
  activeCard = null;
  conflictMap.flyTo([20, 30], 2, { duration: 1 });
}

/* ---- Filter by status ---- */
function filterConflicts(status) {
  // Update button states
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  if (status !== "all") {
    document.querySelector(`[data-filter="${status}"]`)?.classList.add("active");
  } else {
    document.querySelector('[data-filter="all"]')?.classList.add("active");
  }

  markers.forEach(({ marker, data }) => {
    if (status === "all" || data.status === status) {
      marker.setOpacity(1);
      marker.getElement()?.classList.remove("dimmed");
    } else {
      marker.setOpacity(0.2);
      marker.getElement()?.classList.add("dimmed");
    }
  });
}

/* ---- List view ---- */
function renderConflictList() {
  const list = document.getElementById("conflict-list");
  if (!list) return;

  list.innerHTML = CONFLICT_DATA.map(c => {
    const sc = STATUS_COLORS[c.status] || STATUS_COLORS.active;
    return `
      <div class="conflict-list-card" onclick="showIntelCard(CONFLICT_DATA.find(d=>d.id==='${c.id}'))">
        <div class="clc-header">
          <span class="clc-status" style="background:${sc.bg};color:${sc.text};">${c.statusLabel}</span>
          <span class="clc-metric">${c.keyMetric}</span>
        </div>
        <h4 class="clc-name">${c.name}</h4>
        <p class="clc-region">${c.region} &middot; ${c.type}</p>
        <div class="clc-resources">
          ${c.resources.map(r => `<span class="clc-res-chip"><span class="resource-dot" style="background:${r.color};"></span>${r.name}</span>`).join("")}
        </div>
      </div>
    `;
  }).join("");
}
