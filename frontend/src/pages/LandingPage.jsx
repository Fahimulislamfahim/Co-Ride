import { ArrowRight, Bike, CheckCircle2 } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage({ onNavigateLogin, onNavigateRegister }) {
  return (
    <main className="simple_landing">
      <header className="simple_landing_header">
        <button
          type="button"
          className="simple_landing_brand"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="CoRide home"
        >
          <img src="/logo.png" alt="" className="simple_landing_logo" />
          <span>
            Co<span>Ride</span>
          </span>
        </button>

        <button type="button" className="simple_landing_signin" onClick={onNavigateLogin}>
          Sign in
        </button>
      </header>

      <section className="simple_landing_hero">
        <p className="simple_landing_eyebrow">DIU campus ride sharing</p>
        <h1>
          Your commute,
          <span> made simple.</span>
        </h1>
        <p className="simple_landing_description">
          Find a trusted ride to campus or share your empty seat with fellow students.
        </p>

        <div className="simple_landing_actions">
          <button type="button" className="simple_landing_primary" onClick={onNavigateLogin}>
            Find a ride
            <ArrowRight size={17} />
          </button>
          <button
            type="button"
            className="simple_landing_secondary"
            onClick={() => onNavigateRegister('driver')}
          >
            <Bike size={17} />
            Offer a seat
          </button>
        </div>

        <div className="simple_landing_trust">
          <CheckCircle2 size={16} />
          <span>Built for verified DIU students</span>
        </div>
      </section>
    </main>
  );
}
