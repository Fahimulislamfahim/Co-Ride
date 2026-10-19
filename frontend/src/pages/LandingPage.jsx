import { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Star, 
  UserCheck, 
  Lock,
  Search, 
  MapPin, 
  ChevronDown, 
  ShieldAlert, 
  CheckCircle2, 
  HeartHandshake, 
  Users, 
  BadgePercent, 
  Fuel, 
  School, 
  PhoneCall, 
  Leaf, 
  Compass, 
  IdCard, 
  Menu, 
  X,
  Bike
} from 'lucide-react';

const ROUTE_DATA = {
  'Mirpur 10': { fare: 40, eta: '28 mins', rides: 14, cng: 120 },
  'Dhanmondi 27': { fare: 45, eta: '42 mins', rides: 9, cng: 150 },
  'Uttara Sector 7': { fare: 50, eta: '35 mins', rides: 11, cng: 180 },
  'Savar Bus Stand': { fare: 25, eta: '18 mins', rides: 16, cng: 90 },
  'ECBL': { fare: 40, eta: '30 mins', rides: 8, cng: 130 },
  'Gazipur': { fare: 60, eta: '50 mins', rides: 6, cng: 220 },
  'Mohammadpur': { fare: 50, eta: '45 mins', rides: 7, cng: 160 },
};

export default function LandingPage({ onNavigateLogin, onNavigateRegister }) {
  // Navigation Mobile Menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick Route Selector State
  const [selectedHub, setSelectedHub] = useState('Mirpur 10');
  const [selectedTime, setSelectedTime] = useState('Morning 08:30 AM');

  // Persona Switcher State
  const [persona, setPersona] = useState('rider'); // 'rider' | 'driver'

  // Calculator State
  const [calcHub, setCalcHub] = useState('Dhanmondi');
  const [commuteDays, setCommuteDays] = useState(5);
  const [vehicleMode, setVehicleMode] = useState('bike'); // 'bike' | 'car'

  // Savings Calculations
  const calcHubData = ROUTE_DATA[calcHub] || ROUTE_DATA['Dhanmondi 27'] || { cng: 150, fare: 45 };
  const modeMultiplier = vehicleMode === 'car' ? 1.3 : 1.0;
  const cngMultiplier = vehicleMode === 'car' ? 1.4 : 1.0;
  const monthlyDays = commuteDays * 4;
  const monthlyCng = Math.round((calcHubData.cng || 150) * monthlyDays * cngMultiplier);
  const monthlyCoRide = Math.round((calcHubData.fare || 45) * monthlyDays * modeMultiplier);
  const monthlySavings = Math.max(0, monthlyCng - monthlyCoRide);
  const co2Reduced = (monthlyDays * 22 * 0.045).toFixed(1);

  const activeRoute = ROUTE_DATA[selectedHub] || ROUTE_DATA['Mirpur 10'];

  return (
    <div className="landing_root">
      {/* ====================================================================
          STICKY TOP NAVIGATION BAR
          ==================================================================== */}
      <header className="landing_nav_wrapper">
        <div className="landing_nav_container">
          {/* Brand Logo */}
          <div 
            className="landing_brand_lockup" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            style={{ cursor: 'pointer' }}
          >
            <div className="landing_brand_badge">
              <img src="/logo.png" alt="CoRide Logo" className="landing_brand_logo_img" />
            </div>
            <div className="landing_brand_text">
              <span className="brand_main">Co</span>
              <span className="brand_accent">Ride</span>
            </div>
            <div className="landing_network_status">
              <span className="landing_pulse_dot" aria-hidden="true"></span>
              <span className="landing_network_label">DIU Campus Network</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="landing_nav_links">
            <a href="#how-it-works">How It Works</a>
            <a href="#fare-calculator">Fare Calculator</a>
            <a href="#safety-shield">Safety Shield</a>
            <a href="#routes">Campus Routes</a>
            <a href="#testimonials">Community</a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="landing_nav_actions">
            <button 
              type="button" 
              onClick={onNavigateLogin} 
              className="landing_btn_signin"
            >
              Sign In
            </button>
            <button 
              type="button" 
              onClick={() => onNavigateRegister('passenger')} 
              className="landing_btn_signup"
            >
              <span>Join Campus Pool</span>
              <ArrowRight size={15} />
            </button>
            {/* Mobile Hamburger Button */}
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="landing_mobile_toggle"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="landing_mobile_dropdown">
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#fare-calculator" onClick={() => setMobileMenuOpen(false)}>Fare Calculator</a>
            <a href="#safety-shield" onClick={() => setMobileMenuOpen(false)}>Safety Shield</a>
            <a href="#routes" onClick={() => setMobileMenuOpen(false)}>Campus Routes</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Community</a>
            <div className="mobile_action_buttons">
              <button 
                type="button" 
                onClick={() => { setMobileMenuOpen(false); onNavigateLogin(); }} 
                className="mobile_btn_login"
              >
                Sign In
              </button>
              <button 
                type="button" 
                onClick={() => { setMobileMenuOpen(false); onNavigateRegister('passenger'); }} 
                className="mobile_btn_register"
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ====================================================================
          HERO SECTION
          ==================================================================== */}
      <section className="landing_hero_section">
        <div className="landing_hero_grid">
          {/* Left Column: Headlines & Quick Search */}
          <div className="hero_left_col">
            <div className="hero_pill_tag">
              <Sparkles size={14} className="hero_pill_icon" />
              <span>Exclusive to Daffodil International University (@diu.edu.bd)</span>
            </div>

            <h1 className="hero_title">
              Skip the Crowded Buses.
              <span className="hero_title_gradient"> Share the Campus Commute.</span>
            </h1>

            <p className="hero_subtext">
              Connect with verified DIU peers traveling your exact route. Save up to 70% on daily transport, cut campus travel times in half, and ride in safe, verified university company.
            </p>

            <div className="hero_cta_row">
              <button 
                type="button" 
                onClick={onNavigateLogin} 
                className="hero_cta_primary"
              >
                <span>Find a Ride Now</span>
                <ArrowRight size={18} />
              </button>
              <button 
                type="button" 
                onClick={() => onNavigateRegister('driver')} 
                className="hero_cta_secondary"
              >
                <Bike size={18} />
                <span>Offer Seats as Driver</span>
              </button>
            </div>

            {/* Interactive Quick-Route Telemetry Box */}
            <div className="hero_route_box" id="routes">
              <div className="route_box_header">
                <div className="route_box_title">
                  <Compass size={16} className="route_box_icon" />
                  <span>Campus Route Dispatch</span>
                </div>
                <span className="route_box_tag">Real-Time Hub Matching</span>
              </div>

              <div className="route_fields_grid">
                <div className="route_field">
                  <label>Pickup Hub</label>
                  <div className="route_select_wrapper">
                    <select 
                      value={selectedHub} 
                      onChange={(e) => setSelectedHub(e.target.value)}
                      className="route_select"
                    >
                      <option value="Mirpur 10">Mirpur 10 (Zero Point)</option>
                      <option value="Dhanmondi 27">Dhanmondi 27 Hub</option>
                      <option value="Uttara Sector 7">Uttara Sector 7 (Metro)</option>
                      <option value="Savar Bus Stand">Savar Bus Stand</option>
                      <option value="ECBL">ECBL / Mirpur 1</option>
                      <option value="Gazipur">Gazipur Chourasta</option>
                      <option value="Mohammadpur">Mohammadpur Town Hall</option>
                    </select>
                    <ChevronDown size={15} className="select_arrow" />
                  </div>
                </div>

                <div className="route_field">
                  <label>Destination</label>
                  <div className="route_static_dest">
                    <School size={16} className="dest_icon" />
                    <span>DIU Smart City, Ashulia</span>
                  </div>
                </div>

                <div className="route_field">
                  <label>Departure Window</label>
                  <div className="route_select_wrapper">
                    <select 
                      value={selectedTime} 
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="route_select"
                    >
                      <option value="Morning 08:00 AM">Morning 08:00 AM</option>
                      <option value="Morning 08:30 AM">Morning 08:30 AM (Class Slot)</option>
                      <option value="Morning 09:30 AM">Morning 09:30 AM</option>
                      <option value="Noon 01:30 PM">Noon 01:30 PM</option>
                    </select>
                    <ChevronDown size={15} className="select_arrow" />
                  </div>
                </div>
              </div>

              <div className="route_telemetry_footer">
                <div className="telemetry_chip">
                  <span className="telemetry_pulse"></span>
                  <span>
                    Typical Fare: <strong>৳{activeRoute.fare}</strong> • Average ETA: <strong>{activeRoute.eta}</strong> • <strong>{activeRoute.rides} Rides Active Today</strong>
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={onNavigateLogin} 
                  className="route_search_btn"
                >
                  <Search size={15} />
                  <span>Search Rides</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Dexter Mascot Artwork & Live Ride Card */}
          <div className="hero_right_col">
            <div className="mascot_showcase_card">
              <div className="mascot_card_header">
                <div className="mascot_badge">
                  <span className="badge_chip">AI Commute Bot</span>
                  <span className="badge_ver">Dexter v2.8</span>
                </div>
                <div className="mascot_live_ping">
                  <span className="mascot_ping_dot"></span>
                  <span>Telemetry 5G</span>
                </div>
              </div>

              {/* Mascot Art Frame */}
              <div className="mascot_image_frame">
                <img 
                  src="/dexter-mascot.png" 
                  alt="Dexter the Commute Bot - CoRide Mascot"
                  className="mascot_img"
                  onError={(e) => {
                    // Fallback to high-res CDN if local image fails
                    e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpDt-SR0_CwffkRqIA1eLYyz1dH7bJ8YrFNDZ6zGNDzUFmNn5g-7evTBwLp50v1tnbTQGWrO8kedyyp1M0mkPFaeabKPF2Us_39s81bslt3QhigRvfKmrgeEuBFxcF8FjEHy4EH7tzy4nkUYQ5ZRqQ75G2j388tEPCuC78ovgochmRoc54yXwNW8ACjrWFsxXBovgd-zQvnqClS5j0peIUq5bX8k8crBVbaJHewhlPzveoVjQFNUEZng';
                  }}
                />
                <div className="mascot_status_overlay">
                  <div className="overlay_left">
                    <div className="overlay_icon">
                      <IdCard size={16} />
                    </div>
                    <div>
                      <span className="overlay_title">Dexter Active</span>
                      <span className="overlay_sub">Live Routing DIU-Net</span>
                    </div>
                  </div>
                  <span className="overlay_online_pill">ONLINE</span>
                </div>
              </div>

              {/* Mock Live Ride Card */}
              <div className="mock_ride_card">
                <div className="mock_ride_user_row">
                  <div className="mock_avatar_wrap">
                    <div className="mock_avatar">TA</div>
                    <span className="mock_verified_check">✓</span>
                  </div>
                  <div className="mock_user_info">
                    <span className="mock_name">Tanvir Ahmed</span>
                    <span className="mock_dept">SWE Dept • 11th Batch</span>
                  </div>
                  <div className="mock_rating_badge">
                    <Star size={13} className="star_gold" />
                    <span>4.98</span>
                    <span className="rating_count">(86)</span>
                  </div>
                </div>

                <div className="mock_vehicle_row">
                  <span className="mock_vehicle_name">Yamaha FZS V3</span>
                  <span className="mock_plate_badge">DHAKA METRO-LA 45-8921</span>
                </div>

                <div className="mock_route_row">
                  <div className="mock_route_path">
                    <span className="dot_cyan"></span>
                    <span>{selectedHub}</span>
                    <span className="arrow_dim">➔</span>
                    <span className="dot_emerald"></span>
                    <span>DIU Main Gate</span>
                  </div>
                  <div className="mock_seats_left">
                    <span className="seat_ping"></span>
                    <span>1 seat left</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={onNavigateLogin} 
                  className="mock_request_btn"
                >
                  <span>Request Seat</span>
                  <span className="mock_fare_chip">৳{activeRoute.fare}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          LIVE CAMPUS STATS TICKER
          ==================================================================== */}
      <section className="landing_stats_section">
        <div className="stats_container">
          <div className="stat_card">
            <div className="stat_icon_wrap icon_emerald">
              <UserCheck size={22} />
            </div>
            <div className="stat_metric">2,850+</div>
            <div className="stat_title">Verified Commuters</div>
            <p className="stat_desc">Authenticated with official @diu.edu.bd university emails</p>
          </div>

          <div className="stat_card">
            <div className="stat_icon_wrap icon_cyan">
              <BadgePercent size={22} />
            </div>
            <div className="stat_metric metric_gradient">৳620k+</div>
            <div className="stat_title">Student Money Saved</div>
            <p className="stat_desc">Combined transit savings across faculty and students this semester</p>
          </div>

          <div className="stat_card">
            <div className="stat_icon_wrap icon_emerald">
              <Car size={22} />
            </div>
            <div className="stat_metric">18,400+</div>
            <div className="stat_title">Safe Trips Shared</div>
            <p className="stat_desc">Reliable departures bypassing jam-packed local public buses</p>
          </div>

          <div className="stat_card">
            <div className="stat_icon_wrap icon_amber">
              <Star size={22} />
            </div>
            <div className="stat_metric">4.92 / 5.0</div>
            <div className="stat_title">Community Rating</div>
            <p className="stat_desc">Punctuality and mutual trust recorded across all 5 campuses</p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          DUAL PERSONA SWITCHER (RIDER VS DRIVER)
          ==================================================================== */}
      <section className="landing_persona_section" id="how-it-works">
        <div className="section_header_center">
          <div className="section_tag_pill">Campus Dynamic Network</div>
          <h2 className="section_title_lg">Tailored for the Daffodil Ecosystem</h2>
          <p className="section_subtext">
            Whether you need an affordable seat or have an empty bike pillion/car seat, CoRide guarantees mutual campus benefit.
          </p>

          {/* Toggle Buttons */}
          <div className="persona_toggle_bar">
            <button 
              type="button" 
              onClick={() => setPersona('rider')}
              className={`persona_btn ${persona === 'rider' ? 'active_persona' : ''}`}
            >
              I Need a Ride (Passenger)
            </button>
            <button 
              type="button" 
              onClick={() => setPersona('driver')}
              className={`persona_btn ${persona === 'driver' ? 'active_persona' : ''}`}
            >
              I Have a Bike or Car (Driver)
            </button>
          </div>
        </div>

        {/* Dynamic Persona Cards */}
        {persona === 'rider' ? (
          <div className="persona_cards_grid">
            <div className="persona_card">
              <div className="persona_card_icon">
                <Clock size={24} />
              </div>
              <h3>Guaranteed Morning Arrival</h3>
              <p>
                No waiting 45 minutes for packed public buses at Gabtoli, Mirpur 1, or Savar. Coordinate departure slots with peers to arrive at 8:30 AM lectures on time without stress.
              </p>
              <div className="persona_card_footer footer_emerald">
                <span>08:30 AM LECTURE READY</span>
                <CheckCircle2 size={16} />
              </div>
            </div>

            <div className="persona_card">
              <div className="persona_card_icon">
                <BadgePercent size={24} />
              </div>
              <h3>Student-Friendly Pocket Fares</h3>
              <p>
                Transparent, fixed peer seat contributions (৳25 – ৳50). Never get hit with surge pricing, rainy-day Uber multipliers, or bargaining with local CNG drivers.
              </p>
              <div className="persona_card_footer footer_cyan">
                <span>FIXED CAMPUS CONTRIBUTION</span>
                <CheckCircle2 size={16} />
              </div>
            </div>

            <div className="persona_card">
              <div className="persona_card_icon">
                <HeartHandshake size={24} />
              </div>
              <h3>Female-Friendly Matching</h3>
              <p>
                Filter and request rides driven exclusively by verified female students and faculty. Travel within a safe, comfortable, and respectful verified circle.
              </p>
              <div className="persona_card_footer footer_emerald">
                <span>GENDER-FILTERED CARPOOLS</span>
                <CheckCircle2 size={16} />
              </div>
            </div>
          </div>
        ) : (
          <div className="persona_cards_grid">
            <div className="persona_card">
              <div className="persona_card_icon">
                <Fuel size={24} />
              </div>
              <h3>Zero Out-of-Pocket Fuel</h3>
              <p>
                Fill your empty bike pillion seat or car rear seats with peers headed in the same direction. Seat contributions fully offset your daily Octane and refueling costs.
              </p>
              <div className="persona_card_footer footer_emerald">
                <span>100% FUEL RECOVERY</span>
                <CheckCircle2 size={16} />
              </div>
            </div>

            <div className="persona_card">
              <div className="persona_card_icon">
                <BadgePercent size={24} />
              </div>
              <h3>Zero Commission Platform</h3>
              <p>
                CoRide is run as an academic mobility initiative. 100% of peer contributions go straight to your digital wallet or bKash with 0% platform middleman fees.
              </p>
              <div className="persona_card_footer footer_cyan">
                <span>0% MIDDLEMAN DEDUCTION</span>
                <CheckCircle2 size={16} />
              </div>
            </div>

            <div className="persona_card">
              <div className="persona_card_icon">
                <Users size={24} />
              </div>
              <h3>Campus Networking</h3>
              <p>
                Turn boring highway traffic along Ashulia or Mirpur into networking opportunities. Connect with batch mates, share project ideas, and foster university camaraderie.
              </p>
              <div className="persona_card_footer footer_emerald">
                <span>DIU NETWORK BUILDING</span>
                <CheckCircle2 size={16} />
              </div>
            </div>
          </div>
        )}

        <div className="persona_cta_center">
          <button 
            type="button" 
            onClick={() => onNavigateRegister(persona === 'driver' ? 'driver' : 'passenger')}
            className="persona_switch_cta"
          >
            <span>{persona === 'driver' ? 'Register Your Vehicle as Driver' : 'Join CoRide as a Passenger'}</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* ====================================================================
          INTERACTIVE CAMPUS FUEL & SAVINGS CALCULATOR
          ==================================================================== */}
      <section className="landing_calculator_section" id="fare-calculator">
        <div className="calculator_container">
          <div className="calc_left_col">
            <div className="calc_header">
              <div className="calc_tag">
                <Sparkles size={14} />
                <span>Financial Telemetry</span>
              </div>
              <h2 className="calc_title">Calculate Your Monthly Commute Savings</h2>
              <p className="calc_desc">
                See what you spend on local CNG / commercial rides versus CoRide verified campus pools.
              </p>
            </div>

            {/* 1. Origin Neighborhood Selector */}
            <div className="calc_step_block">
              <label className="calc_label">1. Select Origin Neighborhood</label>
              <div className="hub_button_grid">
                {['Dhanmondi', 'Uttara', 'Mirpur', 'Gazipur', 'Savar', 'Mohammadpur'].map((hub) => (
                  <button
                    key={hub}
                    type="button"
                    onClick={() => setCalcHub(hub)}
                    className={`hub_calc_btn ${calcHub === hub ? 'active_hub' : ''}`}
                  >
                    <span className="hub_name">{hub}</span>
                    <span className="hub_fare_preview">৳{(ROUTE_DATA[hub]?.cng || 150)} CNG vs ৳{(ROUTE_DATA[hub]?.fare || 45)} Pool</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Days Slider */}
            <div className="calc_step_block">
              <div className="slider_header_row">
                <label className="calc_label">2. Weekly Campus Days</label>
                <span className="slider_value_badge">{commuteDays} Days / Week</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="6" 
                value={commuteDays} 
                onChange={(e) => setCommuteDays(parseInt(e.target.value, 10))}
                className="calc_range_slider"
              />
              <div className="slider_scale">
                <span>1 Day</span>
                <span>2 Days</span>
                <span>3 Days</span>
                <span>4 Days</span>
                <span>5 Days</span>
                <span>6 Days</span>
              </div>
            </div>

            {/* 3. Vehicle Mode */}
            <div className="calc_step_block">
              <label className="calc_label">3. Commute Vehicle Mode</label>
              <div className="vehicle_mode_buttons">
                <button
                  type="button"
                  onClick={() => setVehicleMode('bike')}
                  className={`mode_btn ${vehicleMode === 'bike' ? 'mode_btn_active' : ''}`}
                >
                  <Bike size={18} />
                  <span>Motorcycle (Pillion)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleMode('car')}
                  className={`mode_btn ${vehicleMode === 'car' ? 'mode_btn_active' : ''}`}
                >
                  <Car size={18} />
                  <span>Carpool (Shared Car)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Ledger Output */}
          <div className="calc_right_col">
            <div className="savings_ledger_card">
              <div className="ledger_top_bar">
                <span className="ledger_title">Monthly Savings Ledger</span>
                <span className="ledger_badge">DIU SUB-SUBSIDY</span>
              </div>

              <div className="ledger_breakdown">
                <div className="breakdown_row">
                  <span>Commercial Transit / CNG (Monthly):</span>
                  <span className="cng_strike">৳{monthlyCng.toLocaleString()}</span>
                </div>
                <div className="breakdown_row">
                  <span>CoRide Campus Pool (Monthly):</span>
                  <span className="coride_val">৳{monthlyCoRide.toLocaleString()}</span>
                </div>
              </div>

              <div className="ledger_giant_metric">
                <span className="giant_metric_label">Est. Cash Kept in Pocket</span>
                <div className="giant_metric_number">৳{monthlySavings.toLocaleString()}</div>
                <span className="giant_metric_sub">Saved per Month</span>
              </div>

              <div className="ledger_eco_chip">
                <Leaf size={20} className="leaf_icon" />
                <div>
                  <strong>🍃 {co2Reduced} kg CO₂ Reduced</strong>
                  <span>By consolidating single-commuter campus runs</span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => onNavigateRegister('passenger')} 
                className="ledger_cta_btn"
              >
                <span>Lock in your daily route savings</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          CAMPUS SAFETY & VERIFICATION SHIELD
          ==================================================================== */}
      <section className="landing_safety_section" id="safety-shield">
        <div className="section_header_center">
          <div className="section_tag_pill">
            <ShieldCheck size={14} />
            <span>Cryptographic Campus Protocol</span>
          </div>
          <h2 className="section_title_lg">Safety Built Exclusively for DIU. No Outsiders.</h2>
          <p className="section_subtext">
            Every single passenger and driver profile undergoes biometric and institutional database verification before taking the road.
          </p>
        </div>

        <div className="safety_cards_grid">
          <div className="safety_card">
            <div className="safety_icon_wrap">
              <ShieldCheck size={28} />
            </div>
            <div className="safety_layer">Layer 01: Authentication</div>
            <h3>Institutional Domain Lockdown</h3>
            <p>
              Every user must authenticate with a valid <strong className="text_highlight">@diu.edu.bd</strong> university email. Zero random strangers or commercial predatory accounts are permitted in the campus pool.
            </p>
            <div className="safety_card_footer">
              <Lock size={15} />
              <span>SSO DIU PORTAL INTEGRATION</span>
            </div>
          </div>

          <div className="safety_card">
            <div className="safety_icon_wrap">
              <IdCard size={28} />
            </div>
            <div className="safety_layer">Layer 02: Verification</div>
            <h3>Manual License & Plate Audit</h3>
            <p>
              Every motorcycle and car owner submits their government driving license, tax token, and vehicle registration for human security audit by DIU Transport committee.
            </p>
            <div className="safety_card_footer">
              <CheckCircle2 size={15} />
              <span>BRTA DATABASE VERIFIED</span>
            </div>
          </div>

          <div className="safety_card">
            <div className="safety_icon_wrap">
              <ShieldAlert size={28} />
            </div>
            <div className="safety_layer">Layer 03: Telemetry</div>
            <h3>Emergency SOS & Mutual Ratings</h3>
            <p>
              Built-in emergency SOS instant beacon alerts to campus security desks, live journey sharing with trusted university friends, and two-way rating accountability.
            </p>
            <div className="safety_card_footer">
              <MapPin size={15} />
              <span>LIVE CAMPUS POLICE MONITOR</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          HOW CORIDE WORKS (3-STEP ROADMAP)
          ==================================================================== */}
      <section className="landing_steps_section">
        <div className="section_header_center">
          <span className="section_tag_pill">Frictionless Workflow</span>
          <h2 className="section_title_lg">How CoRide Operates</h2>
          <p className="section_subtext">
            From morning wakeup to stepping onto Ashulia campus in three automated steps.
          </p>
        </div>

        <div className="steps_grid">
          <div className="step_card">
            <div className="step_top_row">
              <div className="step_badge">01</div>
              <span className="step_tag">60 SECONDS</span>
            </div>
            <h3>Authenticate</h3>
            <p>
              Log in with your DIU Student / Faculty email ID. Quick verification validates your phone number and generates your digital student commute pass.
            </p>
            <div className="step_pill_chip">
              <CheckCircle2 size={15} />
              <span>Verified DIU Credentials</span>
            </div>
          </div>

          <div className="step_card">
            <div className="step_top_row">
              <div className="step_badge badge_cyan">02</div>
              <span className="step_tag">INSTANT MATCH</span>
            </div>
            <h3>Match Route</h3>
            <p>
              Choose your morning pickup point and departure time slot, or publish empty motorcycle and car seats along your routine campus run.
            </p>
            <div className="step_pill_chip chip_cyan">
              <Compass size={15} />
              <span>Dynamic Waypoint Sync</span>
            </div>
          </div>

          <div className="step_card">
            <div className="step_top_row">
              <div className="step_badge">03</div>
              <span className="step_tag">CAMPUS DROP-OFF</span>
            </div>
            <h3>Commute & Split</h3>
            <p>
              Meet at the designated landmark hub, ride comfortably, and effortlessly settle transparent peer seat expenses via digital pass or cash.
            </p>
            <div className="step_pill_chip">
              <Sparkles size={15} />
              <span>Zero-Friction Cashless</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          CAMPUS VOICES (STUDENT TESTIMONIALS)
          ==================================================================== */}
      <section className="landing_testimonials_section" id="testimonials">
        <div className="section_header_center">
          <span className="section_tag_pill">Community Endorsement</span>
          <h2 className="section_title_lg">Campus Voices</h2>
          <p className="section_subtext">
            Real stories from DIU students and faculty traveling to Ashulia Smart City.
          </p>
        </div>

        <div className="testimonials_grid">
          <div className="testimonial_card">
            <div className="stars_row">
              {'★★★★★'.split('').map((s, idx) => (
                <span key={idx} className="gold_star">{s}</span>
              ))}
            </div>
            <p className="quote_text">
              “Before CoRide, getting to my 8:30 AM compiler design lab from Dhanmondi meant fighting for local bus seats. Now I ride with a fellow senior from software engineering every morning!”
            </p>
            <div className="author_row">
              <div className="author_avatar">SK</div>
              <div className="author_info">
                <span className="author_name">Sumaiya K.</span>
                <span className="author_meta">CSE 8th Semester • Mirpur 1 • 48 Trips</span>
              </div>
            </div>
          </div>

          <div className="testimonial_card">
            <div className="stars_row">
              {'★★★★★'.split('').map((s, idx) => (
                <span key={idx} className="gold_star">{s}</span>
              ))}
            </div>
            <p className="quote_text">
              “Covering my monthly bike fuel from Uttara used to drain my pocket money. With CoRide, two peers join my daily ride and my fuel is 100% covered! Win-win for all of us.”
            </p>
            <div className="author_row">
              <div className="author_avatar avatar_cyan">RI</div>
              <div className="author_info">
                <span className="author_name">Rakibul Islam</span>
                <span className="author_meta">BBA 6th Semester • Driver (CB Shine) • 112 Rides</span>
              </div>
            </div>
          </div>

          <div className="testimonial_card">
            <div className="stars_row">
              {'★★★★★'.split('').map((s, idx) => (
                <span key={idx} className="gold_star">{s}</span>
              ))}
            </div>
            <p className="quote_text">
              “The female-driver matching filter gives immense peace of mind. Punctual, safe, and pleasant morning conversations every day. A transformative initiative for our campus.”
            </p>
            <div className="author_row">
              <div className="author_avatar">FY</div>
              <div className="author_info">
                <span className="author_name">Farhana Yasmin</span>
                <span className="author_meta">Textile Eng. Faculty • Dhanmondi • 34 Trips</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          HIGH CONVERSION BOTTOM BANNER
          ==================================================================== */}
      <section className="landing_cta_banner_section">
        <div className="cta_banner_card">
          <div className="banner_content">
            <div className="banner_tag">
              <Sparkles size={14} />
              <span>Semester Transit Pass Active</span>
            </div>

            <h2 className="banner_title">Ready for Tomorrow Morning's Class?</h2>

            <p className="banner_subtitle">
              Join 2,800+ DIU students and faculty who never stress about long bus queues or unpredictable highway fares again.
            </p>

            <div className="banner_buttons">
              <button 
                type="button" 
                onClick={() => onNavigateRegister('passenger')} 
                className="banner_btn_primary"
              >
                Register with DIU Email
              </button>
              <button 
                type="button" 
                onClick={() => onNavigateRegister('driver')} 
                className="banner_btn_secondary"
              >
                I'm a Driver — Register Vehicle
              </button>
            </div>

            <div className="banner_guarantee">
              <CheckCircle2 size={16} className="guarantee_icon" />
              <span>100% Free Campus Community Platform • No Service Charges • Official DIU Student Initiative</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          MODERN FOOTER
          ==================================================================== */}
      <footer className="landing_footer">
        <div className="footer_container">
          <div className="footer_columns">
            {/* Col 1 */}
            <div className="footer_col_brand">
              <div className="footer_brand_lockup">
                <div className="landing_brand_badge footer_brand_badge">
                  <img src="/logo.png" alt="CoRide Logo" className="landing_brand_logo_img" />
                </div>
                <span className="footer_brand_name">Co<span className="brand_accent">Ride</span></span>
              </div>
              <p className="footer_brand_desc">
                High-performance intelligent transit and verified ridesharing network engineered exclusively for the Daffodil International University ecosystem.
              </p>
              <div className="footer_location_badge">
                <MapPin size={14} />
                <span>Ashulia Smart City, Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="footer_col">
              <h4>Platform</h4>
              <ul>
                <li><a href="#routes">Live Route Dispatch</a></li>
                <li><a href="#how-it-works">Carpool Matching</a></li>
                <li><a href="#fare-calculator">Smart Fare Matrix</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigateLogin(); }}>Student Digital Pass</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="footer_col">
              <h4>DIU Express Routes</h4>
              <ul>
                <li><span>Mirpur 10 & 1 ↔ DIU Main Gate</span></li>
                <li><span>Dhanmondi 27 ↔ Ashulia Campus</span></li>
                <li><span>Uttara Sector 7 ↔ Permanent Campus</span></li>
                <li><span>Savar Bus Stand ↔ Green Garden</span></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="footer_col">
              <h4>Security & Trust</h4>
              <div className="footer_trust_box">
                <div className="trust_box_header">
                  <ShieldCheck size={16} />
                  <span>DIU Verified Only</span>
                </div>
                <p>Mandatory DIU student/faculty ID gateway and encrypted live trip tracking.</p>
                <div className="trust_sos_row">
                  <PhoneCall size={14} />
                  <span>SOS HELPLINE: <strong>Ext. 999-DIU</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer_bottom_row">
            <span className="copyright_text">© 2026 CoRide • Daffodil International University Mobility Labs. All rights reserved.</span>
            <div className="footer_legal_links">
              <a href="#" onClick={(e) => e.preventDefault()}>Transit Regulations</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Privacy Architecture</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLogin(); }}>Campus Ops Portal</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
