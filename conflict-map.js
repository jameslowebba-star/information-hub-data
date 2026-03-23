/* ===== GLOBAL CRISIS MAP — Tool #6 ===== */

/* ---- Default (fallback) data — overridden by conflict-data.json when pipeline runs ---- */
const DEFAULT_CONFLICT_DATA = [
  {
    id: "hormuz",
    name: "Strait of Hormuz Crisis",
    region: "Middle East",
    lat: 26.6, lng: 56.5,
    status: "active",
    statusLabel: "Active Conflict",
    type: "Naval Blockade / Proxy War",
    duration: "Escalated Feb 2026",
    featured: true,
    severity: 10,
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
    timeline: [
      { date: "Feb 28, 2026", event: "US/Israel strike Iran — Khamenei killed" },
      { date: "Mar 1, 2026", event: "Iran closes Strait of Hormuz" },
      { date: "Mar 12, 2026", event: "21+ commercial ships attacked" },
      { date: "Mar 23, 2026", event: "Trump issues 48-hour ultimatum to Iran" }
    ],
    sources: [
      { name: "Wikipedia", url: "https://en.wikipedia.org/wiki/2026_Strait_of_Hormuz_crisis" },
      { name: "Reuters", url: "https://www.reuters.com/world/cargo-ship-hit-by-projectile-strait-hormuz-crew-evacuates-2026-03-11/" },
      { name: "World Economic Forum", url: "https://www.weforum.org/stories/2026/03/iran-conflict-disrupts-oil-and-gas-supply-top-energy-stories-march-2026/" }
    ]
  },
  {
    id: "gaza",
    name: "Israel\u2013Palestine (Gaza)",
    region: "Middle East",
    lat: 31.4, lng: 34.4,
    status: "active",
    statusLabel: "Active War / Occupation",
    type: "War / Military Occupation",
    duration: "Escalated Oct 2023, ongoing",
    featured: true,
    severity: 9,
    actors: [
      { name: "Israel (IDF)", role: "Military operations, controls 53-58% of Gaza" },
      { name: "Hamas", role: "Former governing authority, armed resistance" },
      { name: "Palestinian Authority", role: "Limited governance in West Bank" },
      { name: "United States", role: "Primary military/diplomatic backer of Israel" },
      { name: "Egypt", role: "Controls Rafah border crossing" }
    ],
    resources: [
      { name: "Natural Gas (Leviathan)", icon: "gas", color: "#2d4059", pct: "Largest E. Med gas field \u2014 $2.36B expansion approved" },
      { name: "Gaza Marine Gas Field", icon: "gas", color: "#06b6d4", pct: "~1 Tcf gas offshore Gaza \u2014 undeveloped, contested" },
      { name: "Strategic Coastline", icon: "mineral", color: "#92400e", pct: "Mediterranean shipping lanes and Ben Gurion Canal proposals" }
    ],
    whoBenefits: "Israel (territorial control, gas field access, Ben Gurion Canal proposals). US defense contractors ($17.9B in military aid since Oct 2023). Egypt (Rafah crossing leverage, gas pipeline deals). Chevron (Leviathan expansion).",
    marketImpact: "Regional instability drives oil risk premiums. Leviathan gas field shut down Feb 2026 for expansion \u2014 temporary supply disruption to Egypt/Jordan. Suez Canal shipping reroutes. Defense stocks surge globally.",
    recentDev: "Oct 2025: Ceasefire agreed, hostages released. IDF retains control of 53-58% of Gaza. March 2026: Rafah crossing closed then partially reopened. 72,000+ Palestinians killed since Oct 2023. 18,500 patients await medical evacuation. Settler violence surges 54% in West Bank.",
    keyMetric: "72,000+ killed",
    timeline: [
      { date: "Oct 7, 2023", event: "Hamas attack on Israel \u2014 war begins" },
      { date: "Oct 2025", event: "Ceasefire agreed, hostages released" },
      { date: "Mar 2026", event: "Rafah crossing partially reopened; 72,000+ killed" }
    ],
    sources: [
      { name: "UN OCHA", url: "https://www.ochaopt.org/content/humanitarian-situation-report-19-march-2026" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/news/2026/3/13/whats-happened-in-gaza-and-the-west-bank-since-the-start-of-the-iran-war" },
      { name: "Reuters", url: "https://www.reuters.com/business/energy/chevron-takes-final-investment-decision-leviathan-gas-expansion-2026-01-16/" }
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
    featured: true,
    severity: 9,
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
    timeline: [
      { date: "Feb 2022", event: "Russia invades Ukraine" },
      { date: "2023-2024", event: "Counteroffensives and attrition warfare" },
      { date: "2025-2026", event: "Static front lines, incremental Russian gains in Donetsk" }
    ],
    sources: [
      { name: "ISW", url: "https://www.understandingwar.org/backgrounder/russian-offensive-campaign-assessment" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/tag/russia-ukraine-war/" },
      { name: "Reuters", url: "https://www.reuters.com/world/europe/ukraine/" }
    ]
  },
  {
    id: "lebanon",
    name: "Israel\u2013Lebanon (Hezbollah)",
    region: "Middle East",
    lat: 33.85, lng: 35.86,
    status: "active",
    statusLabel: "Active War",
    type: "Cross-Border War",
    duration: "Reignited March 2026",
    featured: true,
    severity: 9,
    actors: [
      { name: "Israel (IDF)", role: "Airstrikes, ground invasion of south Lebanon" },
      { name: "Hezbollah", role: "Rocket/drone attacks on Israeli bases" },
      { name: "Iran (IRGC)", role: "Commands Hezbollah operations per Lebanese PM" },
      { name: "UNIFIL", role: "UN peacekeepers \u2014 mandate ending 2026" },
      { name: "Lebanese Government", role: "Condemned Hezbollah, banned its military activity" }
    ],
    resources: [
      { name: "Mediterranean Gas", icon: "gas", color: "#2d4059", pct: "Disputed maritime boundary \u2014 Karish/Qana fields" },
      { name: "Water (Litani River)", icon: "mineral", color: "#2563eb", pct: "Israel targeting all Litani bridge crossings" },
      { name: "Strategic Territory", icon: "mineral", color: "#6b7280", pct: "Buffer zone south of Litani \u2014 Israel's stated objective" }
    ],
    whoBenefits: "Israel (eliminates Hezbollah northern threat, secures gas fields). Iran (proxy pressure on Israel). US defense industry. Syria (Hezbollah distracted from Syrian theater).",
    marketImpact: "Oil risk premiums elevated due to regional escalation. Eastern Mediterranean gas supply uncertainty (Karish field). Lebanon's economy \u2014 already collapsed \u2014 faces total breakdown. ~1M displaced (20% of population). Insurance rates for E. Med shipping surge.",
    recentDev: "Nov 2024: US-France brokered ceasefire. Israel never withdrew, violated agreement daily. Feb 28, 2026: US/Israel strike Iran \u2192 Hezbollah retaliates. Mar 2: Full war resumes. Mar 16: Israel ground invasion of south Lebanon. Mar 22: Israel destroys Qasmiyeh Bridge over Litani. UNIFIL HQ hit. 1,000+ killed in Lebanon.",
    keyMetric: "1M displaced",
    timeline: [
      { date: "Nov 2024", event: "US-France brokered ceasefire" },
      { date: "Feb 28, 2026", event: "US/Israel strike Iran \u2014 Hezbollah retaliates" },
      { date: "Mar 16, 2026", event: "Israel ground invasion of south Lebanon" },
      { date: "Mar 22, 2026", event: "Qasmiyeh Bridge destroyed; UNIFIL HQ hit" }
    ],
    sources: [
      { name: "Wikipedia", url: "https://en.wikipedia.org/wiki/2026_Lebanon_war" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/opinions/2026/3/11/the-israel-hezbollah-ceasefire-was-built-to-fail" },
      { name: "Asharq Al-Awsat", url: "https://english.aawsat.com/arab-world/5254050-ceasefire-efforts-enter-open-ended-pause-alarming-lebanese" }
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
    featured: true,
    severity: 8,
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
    timeline: [
      { date: "Apr 2023", event: "War erupts between SAF and RSF" },
      { date: "2025", event: "RSF controls Darfur and Khartoum; 10M+ displaced" },
      { date: "2026", event: "Famine declared; SAF slowly recapturing areas" }
    ],
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/tag/sudan/" },
      { name: "UN OCHA", url: "https://www.unocha.org/sudan" },
      { name: "The Sentry", url: "https://thesentry.org/reports/" }
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
    featured: true,
    severity: 8,
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
    marketImpact: "Cobalt price spikes \u2192 EV battery costs rise \u2192 Tesla, BYD supply chain pressure. Tantalum shortages affect electronics manufacturing globally. Copper supply risk for green energy transition.",
    recentDev: "Jan 2025: M23 captures Goma (pop. 2M). Feb: ceasefire collapses repeatedly. Mar 2026: M23 controls large swaths of North Kivu. US sanctions Rwanda-linked networks. Cobalt smuggling valued at billions annually.",
    keyMetric: "73% global cobalt",
    timeline: [
      { date: "2021", event: "M23 resurgence in eastern DRC" },
      { date: "Jan 2025", event: "M23 captures Goma (pop. 2M)" },
      { date: "Mar 2026", event: "M23 controls large swaths of North Kivu" }
    ],
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/news/2025/1/27/m23-rebels-enter-goma-drc" },
      { name: "UN Panel of Experts", url: "https://www.un.org/securitycouncil/sanctions/1533/panel-of-experts/reports" },
      { name: "Reuters", url: "https://www.reuters.com/world/africa/" }
    ]
  },
  {
    id: "sahel",
    name: "Sahel Insurgency Belt",
    region: "West Africa",
    lat: 14.0, lng: 0.0,
    status: "escalating",
    statusLabel: "Escalating Insurgency",
    type: "Jihadist Insurgency / Coup Belt",
    duration: "Escalating since 2012",
    featured: false,
    severity: 7,
    actors: [
      { name: "JNIM (al-Qaeda affiliate)", role: "Primary insurgent group" },
      { name: "IS Sahel (ISIS affiliate)", role: "Expanding operations, Niamey airport attack Feb 2026" },
      { name: "Mali / Niger / Burkina Faso juntas", role: "Military governments post-coup" },
      { name: "Russia (Africa Corps)", role: "Replaced French forces, mining deals" },
      { name: "ECOWAS", role: "Activating standby force Mar 2026" }
    ],
    resources: [
      { name: "Gold", icon: "gold", color: "#d4a843", pct: "Mali #3, Burkina #4 in Africa" },
      { name: "Uranium", icon: "mineral", color: "#22c55e", pct: "Niger ~5% of global supply (powers France's reactors)" },
      { name: "Oil", icon: "oil", color: "#1a1a2e", pct: "Niger's new Agadem-Benin pipeline" }
    ],
    whoBenefits: "Russia (Africa Corps gets mining concessions for security). Artisanal miners in ungoverned areas. Smuggling networks across Libya-Niger-Mali corridor. China (infrastructure-for-resources deals).",
    marketImpact: "Uranium supply risk threatens France's 70% nuclear-dependent energy grid. Gold production disruptions in Mali/Burkina affect global supply. New Niger oil pipeline (90k bpd target) faces security threats.",
    recentDev: "Mar 2026: ECOWAS activates standby force. Feb: JNIM coordinates attacks in Burkina Faso. IS Sahel attacks Niamey airport. AES juntas dissolve political parties. 9,362 deaths from 3,737 incidents across Central Sahel in 2025.",
    keyMetric: "9,362 killed (2025)",
    timeline: [
      { date: "2020-2023", event: "Coups in Mali, Niger, Burkina Faso" },
      { date: "2025", event: "AES formalizes; 9,362 deaths across Sahel" },
      { date: "Mar 2026", event: "ECOWAS activates standby force; IS attacks Niamey" }
    ],
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/news/2026/3/2/west-african-regional-army-why-thousands-of-soldiers-are-deploying" },
      { name: "Reuters", url: "https://www.reuters.com/world/africa/islamist-militant-attacks-niger-benin-nigeria-border-zone-soaring-research-shows-2026-02-26/" },
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
    featured: true,
    severity: 8,
    actors: [
      { name: "China (PRC)", role: "Claims Taiwan + 90% of SCS" },
      { name: "Taiwan (ROC)", role: "De facto independent, TSMC base" },
      { name: "United States", role: "Taiwan's key security backer" },
      { name: "Philippines / Vietnam", role: "SCS territorial claimants" },
      { name: "Japan", role: "Defense partner, contingency planning" }
    ],
    resources: [
      { name: "Semiconductors", icon: "mineral", color: "#06b6d4", pct: "TSMC = ~72% of global foundry market" },
      { name: "Rare Earths", icon: "mineral", color: "#8b5cf6", pct: "China controls ~61% mining, ~91% processing" },
      { name: "Oil & Gas (SCS)", icon: "oil", color: "#1a1a2e", pct: "~11 billion barrels, 190 Tcf gas in SCS" },
      { name: "Fisheries", icon: "grain", color: "#2563eb", pct: "12% of global fish catch from SCS" }
    ],
    whoBenefits: "Intel/Samsung (TSMC disruption = market share). Non-China rare earth producers (Australia, US). Defense contractors on all sides.",
    marketImpact: "Taiwan disruption = estimated $2.5T hit to US GDP alone. Global chip shortage would dwarf 2021 crisis. Rare earth export bans already affecting EV/wind/defense supply chains. SCS shipping lane disruption affects $5.3T in annual trade.",
    recentDev: "Mar 20: Philippines accuses Chinese navy of radar lock on PH frigate at Sabina Shoal. Mar 16: PH rejects China SCS sovereignty claim. Mar 6: PH arrests spies leaking resupply info to China. PLAAF sorties near Taiwan increase 40% year-over-year.",
    keyMetric: "$5.3T annual trade",
    timeline: [
      { date: "Aug 2025", event: "Chinese vessels collide with Philippine ship at Scarborough Shoal" },
      { date: "Mar 6, 2026", event: "Philippines arrests spies leaking resupply info to China" },
      { date: "Mar 16, 2026", event: "Philippines rejects China SCS sovereignty claim" },
      { date: "Mar 20, 2026", event: "Chinese navy radar lock on PH frigate at Sabina Shoal" }
    ],
    sources: [
      { name: "Reuters", url: "https://www.reuters.com/world/china/philippines-rejects-beijings-claim-sovereignty-over-south-china-sea-2026-03-16/" },
      { name: "Reuters", url: "https://www.reuters.com/world/china/philippines-accuses-chinese-navy-ship-alarming-radar-lock-its-vessel-2026-03-20/" },
      { name: "CFR", url: "https://www.cfr.org/global-conflict-tracker/conflict/territorial-disputes-south-china-sea" }
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
    featured: false,
    severity: 6,
    actors: [
      { name: "Ethiopian Govt (ENDF)", role: "Federal military" },
      { name: "TPLF / TDF", role: "Tigray defense forces" },
      { name: "Amhara Fano militias", role: "Fighting both sides" },
      { name: "Eritrea (EDF)", role: "Intervening in Tigray" },
      { name: "UAE", role: "Backing Ethiopia" }
    ],
    resources: [
      { name: "Gold", icon: "gold", color: "#d4a843", pct: "Tigray = ~50% of Ethiopia's gold output" },
      { name: "Nile Water (GERD)", icon: "mineral", color: "#2563eb", pct: "Controls Blue Nile headwaters \u2014 existential for Egypt" },
      { name: "Potash & Rare Earths", icon: "mineral", color: "#8b5cf6", pct: "Untapped deposits in Tigray/Afar" }
    ],
    whoBenefits: "Foreign mining firms (Canadian/Chinese operating during chaos). Egypt/Eritrea (weaken Ethiopia over GERD dam). Armed groups controlling illicit gold trade.",
    marketImpact: "Gold supply disruptions from Tigray could support prices. GERD dispute affects Nile water allocation for 250M+ people across Ethiopia, Sudan, Egypt. Minor rare earth potential risk.",
    recentDev: "2025: TPLF internal coup, TPF clashes. Jan 2026: Clashes in Tselemti/Alamata. Feb: ENDF military buildup, Eritrea accusations. Mar: AU calls for restraint, fears of full-scale regional war.",
    keyMetric: "250M+ depend on Nile",
    timeline: [
      { date: "Nov 2022", event: "Pretoria ceasefire agreement" },
      { date: "2025", event: "TPLF internal coup; ceasefire breaks down" },
      { date: "Mar 2026", event: "AU calls for restraint; fears of renewed war" }
    ],
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
    featured: false,
    severity: 7,
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
    timeline: [
      { date: "Feb 2021", event: "Military coup; resistance begins" },
      { date: "Oct 2023", event: "Operation 1027 \u2014 resistance captures border towns" },
      { date: "2026", event: "Junta retreats to central lowlands; ~60% territory lost" }
    ],
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
    featured: false,
    severity: 5,
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
    recentDev: "2025: Central bank crisis caused oil shutdowns. Fuel smuggling surge ($6.7B loss). IOCs return (Chevron, Eni, Total \u2014 $20B deals). 2026: Mabruk field restarts. Production targets 1.6M bpd. UN warns of 'explosion risk' from political deadlock.",
    keyMetric: "48B barrels reserves",
    timeline: [
      { date: "2011", event: "Gaddafi overthrown; state fragments" },
      { date: "2025", event: "Central bank crisis, oil shutdowns" },
      { date: "2026", event: "Mabruk field restarts; targeting 1.6M bpd" }
    ],
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
    featured: false,
    severity: 6,
    actors: [
      { name: "Russia (Northern Fleet)", role: "Arctic militarization, resource claims" },
      { name: "NATO (Arctic Sentry)", role: "New Arctic command, 25k troops in exercises" },
      { name: "Norway / Finland / Sweden", role: "Frontline NATO states" },
      { name: "China", role: "'Near-Arctic state' claims, Polar Silk Road" }
    ],
    resources: [
      { name: "Oil", icon: "oil", color: "#1a1a2e", pct: "~20% of Russia's production from Arctic" },
      { name: "Natural Gas", icon: "gas", color: "#2d4059", pct: "~75% of Russia's reserves in Arctic" },
      { name: "Rare Earths", icon: "mineral", color: "#8b5cf6", pct: "Tomtor deposit \u2014 one of world's largest" },
      { name: "Shipping Routes", icon: "mineral", color: "#06b6d4", pct: "Northern Sea Route \u2014 40% shorter Asia-Europe" }
    ],
    whoBenefits: "US/NATO defense industry (Arctic buildup = bigger budgets). Non-Arctic energy exporters (Qatar, US shale). China (Polar Silk Road ambitions). Russia (militarized control of NSR = toll revenue).",
    marketImpact: "Higher oil/gas/LNG prices from Russian supply risk. Elevated rare earth prices delay green tech transition. Northern Sea Route insurance rates rising. Arctic resource extraction increasingly contested.",
    recentDev: "Oct 2025: NATO CAOC opens in Bod\u00f8, Norway. Feb 2026: NATO launches Arctic Sentry. Mar 2026: Cold Response 2026 (25,000 troops). NATO studying 'what-if' Arctic conflict scenarios. Russia warns of growing tensions.",
    keyMetric: "75% Russia gas reserves",
    timeline: [
      { date: "Oct 2025", event: "NATO CAOC opens in Bod\u00f8, Norway" },
      { date: "Feb 2026", event: "NATO launches Arctic Sentry" },
      { date: "Mar 2026", event: "Cold Response 2026 \u2014 25,000 troops deployed" }
    ],
    sources: [
      { name: "NATO", url: "https://www.nato.int/en/news-and-events/articles/news/2026/02/11/nato-secretary-general-outlines-new-activity-arctic-sentry-ahead-of-defence-ministers-meeting" },
      { name: "Defense News", url: "https://www.defensenews.com/global/europe/2026/03/09/nato-to-study-what-if-scenarios-that-could-cause-arctic-conflict-with-russia/" },
      { name: "Reuters", url: "https://www.reuters.com/markets/commodities/us-europe-fall-behind-race-control-arctic-vladimirov-petrova-2026-01-29/" }
    ]
  },
  /* ===== NEW CONFLICT ZONES V2 ===== */
  {
    id: "yemen",
    name: "Yemen / Red Sea (Houthi)",
    region: "Middle East",
    lat: 12.58, lng: 43.33,
    status: "de-escalating",
    statusLabel: "De-escalating",
    type: "Insurgency / Proxy Conflict",
    duration: "Civil war since 2014; Red Sea attacks Nov 2023\u2013Sep 2025",
    featured: false,
    severity: 5,
    actors: [
      { name: "Houthis (Ansarallah)", role: "Iran-backed rebels controlling Sanaa" },
      { name: "Saudi-led Coalition", role: "Backing internationally recognized government" },
      { name: "Iran", role: "Arms supplier to Houthis" },
      { name: "Yemen Government (PLC)", role: "Internationally recognized, Aden-based" },
      { name: "US / UK", role: "Counter-Houthi naval strikes" }
    ],
    resources: [
      { name: "Maritime Trade", icon: "mineral", color: "#06b6d4", pct: "12-15% of global trade transits Suez/Red Sea" },
      { name: "Oil Transit", icon: "oil", color: "#1a1a2e", pct: "~9% of seaborne petroleum via Bab el-Mandeb" }
    ],
    whoBenefits: "Non-aligned shipping firms (exempt from Houthi attacks). Houthis (domestic popularity, regional leverage). Iran (proxy pressure on Western interests).",
    marketImpact: "Ships rerouted around Africa adding 10-15 days and significant costs. Suez Canal traffic dropped 42-67% during peak attacks. Higher global logistics prices impacted consumer goods.",
    recentDev: "No Red Sea shipping incidents since Sep 2025 (UN Jan 2026 report). Houthis exercising restraint amid Israel-US-Iran escalation. UN extends monitoring mission to Jul 2026. 100+ ships attacked, 4 sunk, 9+ mariners killed during 2023-2025 campaign.",
    keyMetric: "100+ ships attacked",
    timeline: [
      { date: "Nov 2023", event: "Houthis begin Red Sea shipping attacks" },
      { date: "Jan 2024", event: "US/UK launch counter-strikes on Yemen" },
      { date: "Sep 2025", event: "Last Red Sea shipping incident" },
      { date: "Mar 2026", event: "Houthis restraining amid Iran-Israel war" }
    ],
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/news/2026/3/7/why-yemens-houthis-are-staying-out-of-israel-us-fight-with-iran-for-now" },
      { name: "UN Security Council", url: "https://press.un.org/en/2026/sc16274.doc.htm" },
      { name: "CFR", url: "https://www.cfr.org/global-conflict-tracker/conflict/war-yemen" }
    ]
  },
  {
    id: "somalia",
    name: "Somalia (Al-Shabaab)",
    region: "East Africa",
    lat: 2.05, lng: 45.32,
    status: "active",
    statusLabel: "Active Insurgency",
    type: "Insurgency / Counterterrorism",
    duration: "Since 2007 (17+ years)",
    featured: false,
    severity: 6,
    actors: [
      { name: "Al-Shabaab", role: "Al-Qaeda affiliate, controls ~30% territory" },
      { name: "Federal Government of Somalia", role: "Central government, counteroffensives" },
      { name: "ATMIS / AUSSOM", role: "AU peacekeeping force" },
      { name: "United States", role: "Air support and special operations" },
      { name: "Clan Militias", role: "Local allied forces" }
    ],
    resources: [
      { name: "Charcoal Trade", icon: "grain", color: "#92400e", pct: "Al-Shabaab's primary revenue \u2014 banned by UN but ongoing" },
      { name: "Extortion Revenue", icon: "gold", color: "#d4a843", pct: "~$100-200M/yr from taxes on businesses and checkpoints" },
      { name: "Strategic Coastline", icon: "mineral", color: "#06b6d4", pct: "Longest coastline in Africa \u2014 piracy corridor" }
    ],
    whoBenefits: "Al-Shabaab ($100-200M/yr extortion). Charcoal smuggling networks to Gulf states. Arms dealers. Regional powers projecting influence (Turkey, UAE, Ethiopia).",
    marketImpact: "Disrupts regional trade and humanitarian aid delivery. Illicit charcoal trade funds terrorism. Piracy risk in Indian Ocean shipping lanes. Instability deters foreign investment in East Africa.",
    recentDev: "Mar 2026: SNAF/AUSSOM capture strategic cities. NISA twin operations killed 22+ al-Shabaab including senior leaders in Mudug/Hiran. Mar 11: SNA captures safe haven in Middle Shabelle. Government counteroffensive gaining momentum.",
    keyMetric: "~30% territory controlled",
    timeline: [
      { date: "2007", event: "Al-Shabaab insurgency begins" },
      { date: "2022", event: "Somalia declares 'total war' on Al-Shabaab" },
      { date: "Mar 2026", event: "Major government gains; 22+ militants killed in twin ops" }
    ],
    sources: [
      { name: "CFR", url: "https://www.cfr.org/global-conflict-tracker/conflict/al-shabab-somalia" },
      { name: "Anadolu Agency", url: "https://www.aa.com.tr/en/africa/twin-operations-in-somalia-kill-more-than-22-al-shabaab-terrorists/3864120" },
      { name: "Reuters", url: "https://www.reuters.com/world/africa/somalia-says-it-killed-29-al-shabaab-militants-with-international-support-2026-01-01/" }
    ]
  },
  {
    id: "haiti",
    name: "Haiti Gang Crisis",
    region: "Caribbean",
    lat: 18.54, lng: -72.34,
    status: "active",
    statusLabel: "Active Crisis",
    type: "Gang Insurgency / State Collapse",
    duration: "Since 2021 (post-Mo\u00efse assassination)",
    featured: false,
    severity: 6,
    actors: [
      { name: "Jimmy Ch\u00e9rizier (Barbecue)", role: "G9 gang alliance leader" },
      { name: "400 Mawozo", role: "Major gang controlling eastern Port-au-Prince" },
      { name: "Haitian National Police", role: "Security forces, making territorial gains" },
      { name: "Transitional Presidential Council", role: "Interim governing authority" },
      { name: "Gang Suppression Force", role: "UN-backed anti-gang force; Chad deploying 800" }
    ],
    resources: [
      { name: "Gold (Unexploited)", icon: "gold", color: "#d4a843", pct: "Estimated ~$20B in untapped deposits" },
      { name: "Iridium", icon: "mineral", color: "#8b5cf6", pct: "2nd largest reserves globally (unquantified)" },
      { name: "Drug Transit", icon: "mineral", color: "#ef4444", pct: "Key cocaine transshipment point to US/Europe" }
    ],
    whoBenefits: "Gangs (extortion, kidnapping, drug trafficking). Corrupt politicians and business elites arming gangs. US private security contractors (Vectus Global). Drug cartels using Haiti as transit.",
    marketImpact: "Local economy collapsed \u2014 gangs control ports and roads. Increased migration flows to US/Dominican Republic. Drug trafficking to US and Europe. Minimal global resource disruption but humanitarian catastrophe.",
    recentDev: "Mar 2026: UN notes police territorial gains as 'glimmer of hope.' 300+ groups register for Aug/Dec elections. National Pact signed. Chad deploying 800 troops to replace Kenyan force. HRW reports 1,243 killed in government drone strikes since 2025, including 60 civilians. 8,100 killed in 2025 alone.",
    keyMetric: "90% Port-au-Prince controlled",
    timeline: [
      { date: "Jul 2021", event: "President Mo\u00efse assassinated" },
      { date: "2024", event: "Gangs seize 80%+ of Port-au-Prince" },
      { date: "Mar 2026", event: "Police gains; elections planned Aug/Dec 2026" }
    ],
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/news/2026/3/10/hundreds-killed-in-haiti-drone-strikes-including-60-civilians-report" },
      { name: "UN News", url: "https://news.un.org/en/story/2026/03/1167143" },
      { name: "UN News", url: "https://news.un.org/en/story/2026/03/1167139" }
    ]
  },
  {
    id: "venezuela",
    name: "Venezuela-Guyana (Essequibo)",
    region: "South America",
    lat: 6.3, lng: -59.7,
    status: "de-escalating",
    statusLabel: "De-escalating",
    type: "Territorial Dispute",
    duration: "Claim since 1841; escalated 2015 (oil discovery)",
    featured: false,
    severity: 4,
    actors: [
      { name: "Venezuela", role: "Claims 70% of Guyana's territory (Essequibo)" },
      { name: "Guyana", role: "Defending sovereignty, oil boom" },
      { name: "ICJ", role: "Adjudicating the dispute \u2014 hearings May 2026" },
      { name: "ExxonMobil", role: "Operating Stabroek Block \u2014 916k bpd" },
      { name: "United States", role: "Security partner for Guyana" }
    ],
    resources: [
      { name: "Oil (Stabroek Block)", icon: "oil", color: "#1a1a2e", pct: "11B barrels \u2014 Exxon producing 916k bpd" },
      { name: "Gold", icon: "gold", color: "#d4a843", pct: "Significant deposits in Essequibo region" }
    ],
    whoBenefits: "ExxonMobil (massive Stabroek profits). Guyana (fastest-growing economy on Earth). US (energy diversification from Venezuela). Guyana's government (resource wealth leverage).",
    marketImpact: "Delayed Stabroek exploration in 30% of block due to dispute. Risk premium on Guyana oil. Post-de-escalation unlocks growth path to 1.7M bpd by 2030. Guyana now 3rd largest oil producer in South America.",
    recentDev: "Mar 11-13, 2026: Venezuela protests Guyana seismic survey off Essequibo coast. Guyana rejects, citing 1899 arbitral award. Exxon production hits 916k bpd. ICJ hearings scheduled May 2026. Tensions easing post-Maduro removal.",
    keyMetric: "916k bpd production",
    timeline: [
      { date: "2015", event: "Exxon discovers massive Stabroek oil reserves" },
      { date: "Dec 2023", event: "Venezuela referendum claims Essequibo" },
      { date: "Mar 2026", event: "Venezuela protests seismic survey; ICJ hearings May" }
    ],
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/news/longform/2025/5/23/borders-and-ballots-why-essequibo-is-controversial-in-venezuelas-election" },
      { name: "Reuters", url: "https://www.reuters.com/business/energy/guyanas-oil-growth-potential-rises-venezuela-tensions-set-ease-2026-02-17/" },
      { name: "Reuters", url: "https://www.reuters.com/business/energy/exxon-accelerates-oil-gas-projects-guyana-amid-high-prices-2026-03-19/" }
    ]
  },
  {
    id: "kashmir",
    name: "India-Pakistan (Kashmir)",
    region: "South Asia",
    lat: 34.5, lng: 76.5,
    status: "ceasefire",
    statusLabel: "Ceasefire Holding",
    type: "Territorial Dispute / Insurgency",
    duration: "Since 1947; insurgency since 1989",
    featured: false,
    severity: 5,
    actors: [
      { name: "India", role: "Administers Jammu & Kashmir" },
      { name: "Pakistan", role: "Administers Azad Kashmir / Gilgit-Baltistan" },
      { name: "Jaish-e-Mohammed", role: "Pakistan-linked militant group" },
      { name: "Lashkar-e-Taiba", role: "Pakistan-linked militant group" },
      { name: "The Resistance Front", role: "Active militant group in J&K" }
    ],
    resources: [
      { name: "Indus River Water", icon: "mineral", color: "#2563eb", pct: "Critical for Pakistan \u2014 ~90% of agriculture depends on Indus" },
      { name: "Hydropower", icon: "mineral", color: "#06b6d4", pct: "18 GW potential in J&K" },
      { name: "Lithium", icon: "mineral", color: "#8b5cf6", pct: "5.9M tonnes discovered \u2014 ~1% global reserves" }
    ],
    whoBenefits: "Defense industries on both sides (China to Pakistan, US/Israel to India via arms sales). Regional powers using Kashmir as leverage. India (lithium deposits for EV transition).",
    marketImpact: "Escalation triggers flight disruptions, airspace closures, bilateral trade halt ($1.2B). Potential energy price spikes and stock volatility (Nifty dropped 1.4% during 2025 escalation). Nuclear risk premium on both economies.",
    recentDev: "Feb 2026: Security forces killed 9 militants. LoC ceasefire violation Feb 20 \u2014 no deaths. Home Minister visits focused on drone threats and tourism. Post-2025 Pahalgam attack ceasefire holding with low violence levels.",
    keyMetric: "2 nuclear powers",
    timeline: [
      { date: "1947", event: "First Indo-Pakistan war over Kashmir" },
      { date: "Apr 2025", event: "Pahalgam tourist attack; India strikes Pakistan" },
      { date: "Feb 2026", event: "Ceasefire holding; 9 militants killed" }
    ],
    sources: [
      { name: "Crisis Group", url: "https://www.crisisgroup.org/crisiswatch/february-trends-and-march-alerts-2026" },
      { name: "Reuters", url: "https://www.reuters.com/world/asia-pacific/what-happened-indias-attack-pakistan-over-kashmir-tourists-killings-2025-05-07/" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/tag/india-pakistan-tensions/" }
    ]
  },
  {
    id: "mexico",
    name: "Mexico Cartel War",
    region: "North America",
    lat: 20.67, lng: -103.35,
    status: "active",
    statusLabel: "Active Conflict",
    type: "Cartel War / Narco-Insurgency",
    duration: "Escalated 2024 (Sinaloa civil war); Feb 2026 (CJNG crisis)",
    featured: true,
    severity: 8,
    actors: [
      { name: "CJNG (Jalisco New Generation Cartel)", role: "Most powerful cartel; leader El Mencho killed Feb 2026" },
      { name: "Sinaloa Cartel (Chapitos vs Mayos)", role: "Civil war since 2024; fentanyl empire" },
      { name: "Mexican Military / National Guard", role: "Government security forces; 25+ killed in CJNG retaliation" },
      { name: "United States", role: "Intelligence support, DEA operations, fentanyl pressure" },
      { name: "President Claudia Sheinbaum", role: "Dual-track strategy: social + military" }
    ],
    resources: [
      { name: "Fentanyl / Drugs", icon: "mineral", color: "#ef4444", pct: "Mexico is primary source of US fentanyl; multi-billion $ trade" },
      { name: "Oil (Fuel Theft)", icon: "oil", color: "#1a1a2e", pct: "Billions in Pemex pipeline theft (Guanajuato/Salamanca)" },
      { name: "Avocados / Agriculture", icon: "grain", color: "#22c55e", pct: "Cartel extortion of $1.5B/yr from farming (Michoacan)" },
      { name: "Migration Routes", icon: "mineral", color: "#f59e0b", pct: "Human smuggling via Chiapas-Guatemala corridor" }
    ],
    whoBenefits: "Cartels ($billions in drug revenue). Chemical precursor suppliers (China). US private prison industry. Arms manufacturers (US guns flow south). Corruption networks in politics and law enforcement.",
    marketImpact: "Fentanyl crisis kills 70,000+ Americans yearly. US-Mexico trade ($800B+) disrupted by cartel violence. Auto industry supply chains affected. Tourism sector hit — Puerto Vallarta, Guadalajara airports shut during CJNG retaliation. Avocado prices spike from extortion.",
    recentDev: "Feb 22, 2026: Mexican special forces kill CJNG leader El Mencho in Tapalpa, Jalisco (CIA intelligence assist). CJNG retaliates across 28 states — roadblocks, arson, 25+ National Guard killed. Sinaloa civil war continues in Culiacán (homicides up 400%). Government claims 50% reduction in fentanyl supply to US. Succession crisis looms as El Mencho's family all imprisoned.",
    keyMetric: "28 states hit",
    timeline: [
      { date: "2006", event: "Calderón launches militarized war on drugs" },
      { date: "Jul 2024", event: "Sinaloa cartel civil war erupts in Culiacán" },
      { date: "Feb 22, 2026", event: "El Mencho killed; CJNG retaliates across 28 states" },
      { date: "Mar 2026", event: "CJNG succession crisis; nationwide instability" }
    ],
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/news/2026/2/24/with-el-mencho-killed-whats-next-for-mexico-and-the-jalisco-cartel" },
      { name: "Lawfare", url: "https://www.lawfaremedia.org/article/u.s.-mexico-cooperation-after-el-mencho" },
      { name: "BBC", url: "https://www.bbc.com/news/articles/cx2g3vmde0eo" }
    ]
  },
  {
    id: "mozambique",
    name: "Mozambique (Cabo Delgado)",
    region: "Southeast Africa",
    lat: -12.75, lng: 39.5,
    status: "active",
    statusLabel: "Active Insurgency",
    type: "Islamist Insurgency / Gas Crisis",
    duration: "Since October 2017",
    featured: false,
    severity: 6,
    actors: [
      { name: "IS-Mozambique (ISM)", role: "Islamist insurgents controlling forest areas" },
      { name: "Mozambique Army (FADM)", role: "Government military forces" },
      { name: "Rwanda Defense Force (RDF)", role: "Allied troops securing gas sites; threatens withdrawal" },
      { name: "TotalEnergies", role: "Operator of $20B LNG project" },
      { name: "Local militias", role: "Community support forces" }
    ],
    resources: [
      { name: "Natural Gas (LNG)", icon: "gas", color: "#2d4059", pct: "1.44% of global proven reserves; $20B Afungi LNG project" },
      { name: "Government Revenue", icon: "gold", color: "#d4a843", pct: "$35B potential gas revenue for Mozambique" }
    ],
    whoBenefits: "TotalEnergies and partners (resumed $20B project). Mozambique government ($35B potential revenue). Rwanda (security funding). Insurgent networks (illicit mining, smuggling).",
    marketImpact: "5-year delay in 13M tonnes/year LNG supply. Jan 2026 restart raises global LNG market hopes. Security costs inflate project economics. Potential major addition to European gas diversification away from Russia.",
    recentDev: "Jan 2026: TotalEnergies restarts $20B LNG project after 5-year freeze. Feb 22: Convoy ambush kills 14 state forces. Mar: Clashes in Catupa forest, RDF airstrikes ongoing. Rwanda warns it may withdraw troops if funding not secured (Mar 14). AfDB provides $28M for reconstruction.",
    keyMetric: "6,498 killed since 2017",
    timeline: [
      { date: "Oct 2017", event: "Insurgency begins in Cabo Delgado" },
      { date: "2021", event: "TotalEnergies suspends $20B LNG project" },
      { date: "Jan 2026", event: "LNG project restarts after 5-year freeze" },
      { date: "Mar 2026", event: "Rwanda threatens troop withdrawal" }
    ],
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/news/2026/1/29/total-restarts-20bn-lng-project-in-mozambique-after-five-year-freeze" },
      { name: "Reuters", url: "https://www.reuters.com/world/africa/rwanda-warns-it-may-withdraw-troops-mozambiques-insurgency-hit-cabo-delgado-2026-03-14/" },
      { name: "ReliefWeb", url: "https://reliefweb.int/report/mozambique/mozambique-conflict-monitor-update-11-march-2026" }
    ]
  },
  {
    id: "ecuador",
    name: "Ecuador Gang Crisis",
    region: "South America",
    lat: -2.2, lng: -79.9,
    status: "escalating",
    statusLabel: "Escalating",
    type: "Organized Crime / Gang War",
    duration: "Since 2021, surging 2024-2026",
    featured: false,
    severity: 7,
    actors: [
      { name: "Los Choneros", role: "Dominant gang, allied with Sinaloa Cartel" },
      { name: "Los Lobos", role: "Dissident gang, allied with CJNG" },
      { name: "President Daniel Noboa", role: "Declared 'internal armed conflict' Jan 2024" },
      { name: "United States", role: "Joint operations support, Trump backing" },
      { name: "Mexican Cartels (Sinaloa / CJNG)", role: "Using Ecuador as cocaine transit hub" }
    ],
    resources: [
      { name: "Oil", icon: "oil", color: "#1a1a2e", pct: "~0.5% of global production" },
      { name: "Bananas", icon: "grain", color: "#22c55e", pct: "~30% of global banana exports" },
      { name: "Cocaine Transit", icon: "mineral", color: "#ef4444", pct: "Major Pacific coast hub for Colombian cocaine" },
      { name: "Illegal Gold Mining", icon: "gold", color: "#d4a843", pct: "Emerging extraction in conflict zones" }
    ],
    whoBenefits: "Mexican cartels (Sinaloa, CJNG) via drug routes. Illegal miners. Splinter gangs filling power vacuums. Arms dealers. Private security industry.",
    marketImpact: "Disrupts oil and banana exports. Criminal economy estimated at $30B annually (~25% of GDP). Global cocaine supply chain risks. Tourism industry devastated. Insurance costs surge for businesses.",
    recentDev: "Mar 2026: US-Ecuador joint operations targeting criminal economy with Trump backing. Curfews in 4 provinces. Los Lobos leader arrested in Mexico City (Mar 18). Homicides hit 9,216 in 2025 \u2014 up 30% year-over-year, giving Ecuador a murder rate of ~47 per 100,000.",
    keyMetric: "9,216 homicides (2025)",
    timeline: [
      { date: "2021", event: "Gang violence surges as cartels expand" },
      { date: "Jan 2024", event: "President Noboa declares \"internal armed conflict\"" },
      { date: "2025", event: "9,216 homicides \u2014 30% increase year-over-year" },
      { date: "Mar 2026", event: "US-Ecuador joint ops; Los Lobos leader arrested" }
    ],
    sources: [
      { name: "Al Jazeera", url: "https://www.aljazeera.com/news/2026/3/11/ecuador-prepares-for-attack-on-criminal-economy-with-trump-backing" },
      { name: "Reuters", url: "https://www.reuters.com/world/americas/murders-ecuador-jump-30-2025-2026-01-20/" },
      { name: "Reuters", url: "https://www.reuters.com/world/americas/leader-ecuadors-los-lobos-crime-group-arrested-mexico-city-2026-03-18/" }
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
  oil:     "\u2b24",
  gas:     "\u2b24",
  gold:    "\u2b24",
  mineral: "\u2b24",
  grain:   "\u2b24"
};

/* ---- Data management — load from JSON or use defaults ---- */
let CONFLICT_DATA = [...DEFAULT_CONFLICT_DATA];
let conflictMap = null;
let markers = [];
let activeCard = null;
let detailViewOpen = false;

async function loadConflictData() {
  try {
    const owner = "jameslowebba-star";
    const repo = "information-hub-data";
    const url = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/conflict-data.json`;
    const resp = await fetch(url, { cache: "no-store" });
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        CONFLICT_DATA = data;
        console.log(`[Conflict Map] Loaded ${data.length} zones from pipeline`);
        return;
      }
    }
  } catch (e) {
    console.log("[Conflict Map] Pipeline data unavailable, using defaults");
  }
  CONFLICT_DATA = [...DEFAULT_CONFLICT_DATA];
}

/* ---- Map initialization ---- */
function initConflictMap() {
  if (conflictMap) {
    /* If map exists but data may have updated, refresh markers */
    refreshMarkers();
    updateMapStats();
    renderFeaturedConflicts();
    return;
  }

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

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(conflictMap);

  L.control.zoom({ position: "topright" }).addTo(conflictMap);

  addMarkers();
  updateMapStats();
  renderFeaturedConflicts();
}

function addMarkers() {
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
    marker.on("click", () => openDetailView(c));
    markers.push({ marker, data: c });
  });
}

function refreshMarkers() {
  markers.forEach(({ marker }) => conflictMap.removeLayer(marker));
  markers = [];
  addMarkers();
}

function updateMapStats() {
  const active = CONFLICT_DATA.filter(c => c.status === "active").length;
  const escalating = CONFLICT_DATA.filter(c => c.status === "escalating").length;
  const totalResources = new Set();
  CONFLICT_DATA.forEach(c => c.resources.forEach(r => totalResources.add(r.name)));

  const sorted = [...CONFLICT_DATA].sort((a, b) => (b.severity || 0) - (a.severity || 0));
  const hottest = sorted[0] || CONFLICT_DATA[0];

  const el = (id) => document.getElementById(id);
  if (el("stat-conflicts")) el("stat-conflicts").textContent = CONFLICT_DATA.length;
  if (el("stat-active")) el("stat-active").textContent = active;
  if (el("stat-escalating")) el("stat-escalating").textContent = escalating;
  if (el("stat-resources")) el("stat-resources").textContent = totalResources.size;
  if (el("stat-hottest")) el("stat-hottest").textContent = hottest.name.split("/")[0].split("(")[0].trim();
}

/* ===== DETAIL VIEW — Full Conflict Page ===== */
function openDetailView(data) {
  activeCard = data;
  detailViewOpen = true;
  const sc = STATUS_COLORS[data.status] || STATUS_COLORS.active;

  const panel = document.getElementById("intel-panel");
  panel.innerHTML = `
    <div class="detail-view">
      <button class="detail-back" onclick="closeDetailView()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        Back to Map
      </button>

      <div class="detail-hero">
        <span class="detail-status" style="background:${sc.bg};color:${sc.text};">${data.statusLabel}</span>
        <h2 class="detail-title">${data.name}</h2>
        <p class="detail-meta">${data.region} &middot; ${data.type} &middot; ${data.duration}</p>
        <div class="detail-key-metric">
          <span class="dkm-label">Key Metric</span>
          <span class="dkm-value">${data.keyMetric}</span>
        </div>
      </div>

      <div class="detail-grid">
        <!-- Key Actors -->
        <div class="detail-card">
          <h3><span class="dc-icon">\ud83d\udc65</span> Key Actors</h3>
          <div class="detail-actors">
            ${data.actors.map(a => `
              <div class="detail-actor">
                <span class="da-name">${a.name}</span>
                <span class="da-role">${a.role}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Resources at Stake -->
        <div class="detail-card">
          <h3><span class="dc-icon">\u26cf</span> Resources at Stake</h3>
          <div class="detail-resources">
            ${data.resources.map(r => `
              <div class="detail-resource">
                <div class="dr-header">
                  <span class="dr-dot" style="background:${r.color};"></span>
                  <span class="dr-name">${r.name}</span>
                </div>
                <span class="dr-pct">${r.pct}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Who Benefits -->
        <div class="detail-card full-width">
          <h3><span class="dc-icon">\ud83d\udcb0</span> Who Benefits</h3>
          <p>${data.whoBenefits}</p>
        </div>

        <!-- Market Impact -->
        <div class="detail-card full-width">
          <h3><span class="dc-icon">\ud83d\udcca</span> Market & Economic Impact</h3>
          <p>${data.marketImpact}</p>
        </div>

        <!-- Timeline -->
        ${data.timeline ? `
        <div class="detail-card full-width">
          <h3><span class="dc-icon">\ud83d\udcc5</span> Timeline</h3>
          <div class="detail-timeline">
            ${data.timeline.map((t, i) => `
              <div class="tl-item ${i === data.timeline.length - 1 ? 'tl-latest' : ''}">
                <div class="tl-dot"></div>
                <div class="tl-content">
                  <span class="tl-date">${t.date}</span>
                  <span class="tl-event">${t.event}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
        ` : ""}

        <!-- Recent Developments -->
        <div class="detail-card full-width">
          <h3><span class="dc-icon">\ud83d\udcf0</span> Recent Developments</h3>
          <p>${data.recentDev}</p>
        </div>

        <!-- Sources -->
        <div class="detail-card full-width detail-sources-card">
          <h3>Sources</h3>
          <div class="detail-source-links">
            ${data.sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.name} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>`).join("")}
          </div>
        </div>
      </div>
    </div>
  `;

  panel.classList.add("open", "detail-mode");
  conflictMap.flyTo([data.lat, data.lng], 4, { duration: 1.2 });

  /* Scroll panel to top */
  panel.scrollTop = 0;
}

function closeDetailView() {
  const panel = document.getElementById("intel-panel");
  panel.classList.remove("open", "detail-mode");
  activeCard = null;
  detailViewOpen = false;
  conflictMap.flyTo([20, 30], 2, { duration: 1 });
}

/* Legacy alias */
function showIntelCard(data) { openDetailView(data); }
function closeIntelCard() { closeDetailView(); }

/* ---- Filter by status ---- */
function filterConflicts(status) {
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

/* ---- Active Flashpoints (featured crises, scroll section) ---- */
function renderFeaturedConflicts() {
  const container = document.getElementById("featured-conflicts");
  if (!container) return;

  const featured = CONFLICT_DATA
    .filter(c => c.featured)
    .sort((a, b) => (b.severity || 0) - (a.severity || 0));

  container.innerHTML = featured.map(c => {
    const sc = STATUS_COLORS[c.status] || STATUS_COLORS.active;
    return `
      <div class="featured-card" onclick="openDetailView(CONFLICT_DATA.find(d=>d.id==='${c.id}'))">
        <div class="fc-top">
          <span class="fc-status" style="background:${sc.bg};color:${sc.text};">${c.statusLabel}</span>
          <span class="fc-severity">Severity: ${c.severity || "?"}/10</span>
        </div>
        <h4 class="fc-name">${c.name}</h4>
        <p class="fc-meta">${c.region} &middot; ${c.type}</p>
        <div class="fc-resources">
          ${c.resources.slice(0, 3).map(r => `<span class="fc-res"><span class="resource-dot" style="background:${r.color};"></span>${r.name}</span>`).join("")}
        </div>
        <div class="fc-bottom">
          <span class="fc-metric">${c.keyMetric}</span>
          <span class="fc-cta">Full Intel \u2192</span>
        </div>
      </div>
    `;
  }).join("");
}


