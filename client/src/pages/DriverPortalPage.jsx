import { useState, useEffect } from 'react';
import { useUser } from '@clerk/react';
import PortalNavbar from '../components/PortalNavbar';
import { ridesApi, paymentsApi } from '../services/api';

const TABS = [
  { id: 'dashboard', label: 'Dashboard'  },
  { id: 'find',      label: 'Find Rides' },
  { id: 'my-rides',  label: 'My Rides'  },
  { id: 'earnings',  label: 'Earnings'  },
];

const capWords = (s) =>
  s.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const EARNINGS_MOCK = [
  { label: 'Mon', amount: 67,  pct: 74  },
  { label: 'Tue', amount: 74,  pct: 81  },
  { label: 'Wed', amount: 91,  pct: 100 },
  { label: 'Thu', amount: 84,  pct: 92  },
  { label: 'Fri', amount: 110, pct: 100 },
  { label: 'Sat', amount: 98,  pct: 89  },
  { label: 'Sun', amount: 55,  pct: 60  },
];

/* ── In-Progress Ride Card ─────────────────────────────────────────────────── */
const InProgressCard = ({ ride, onComplete, onCancel, mutating }) => {
  if (!ride) return (
    <div className="in-progress-card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem' }}>
      No active ride right now.
    </div>
  );

  return (
    <div className="in-progress-card">
      <div className="ip-status-badge">
        <span className="ip-status-dot" />
        {ride.status.replace('_', ' ').toUpperCase()}
      </div>
      <div className="ip-fare-row">
        <div className="ip-route">
          <div className="ip-stop">
            <div className="ip-dot ip-dot-pickup" />
            {ride.pickup_location}
          </div>
          <div className="ip-stop">
            <div className="ip-dot ip-dot-dropoff" />
            {ride.dropoff_location}
          </div>
        </div>
        <div className="ip-fare-info">
          <div className="ip-fare">{ride.fare ? `$${parseFloat(ride.fare).toFixed(2)}` : '—'}</div>
          <div className="ip-distance">Ride #{ride.ride_id}</div>
        </div>
      </div>
      <div className="ip-progress-bar">
        <div className="ip-progress-fill" />
      </div>
      <div className="ip-actions">
        <button className="btn-complete" onClick={onComplete} disabled={mutating}>
          {mutating === 'complete' ? 'Completing…' : 'Complete ride'}
        </button>
        <button className="btn-cancel-ride" onClick={onCancel} disabled={mutating}>
          {mutating === 'cancel' ? 'Cancelling…' : 'Cancel'}
        </button>
      </div>
    </div>
  );
};

/* ── DriverPortalPage ──────────────────────────────────────────────────────── */
const DriverPortalPage = ({ theme, onThemeToggle }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Rides + payments state
  const [availableRides, setAvailableRides] = useState([]);
  const [myRides,        setMyRides]        = useState([]);
  const [payments,       setPayments]       = useState([]);
  const [activeRide,     setActiveRide]     = useState(null);
  const [loadingRides,   setLoadingRides]   = useState(false);
  const [loadingPayments,setLoadingPayments]= useState(false);
  const [accepting,      setAccepting]      = useState(null);
  const [mutating,       setMutating]       = useState(null);
  const [isAvailable,    setIsAvailable]    = useState(true);

  // ── Fetch active ride for dashboard ────────────────────────────────────────
  useEffect(() => {
    ridesApi.getAll({ statuses: 'in_progress,accepted,en_route' })
      .then((res) => setActiveRide(res.data.data?.[0] ?? null))
      .catch(() => {});
  }, []);

  // ── Fetch rides ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'find' && availableRides.length === 0) {
      setLoadingRides(true);
      ridesApi.getAll({ status: 'requested' })
        .then((res) => setAvailableRides(res.data.data))
        .catch(() => {})
        .finally(() => setLoadingRides(false));
    }
    if (activeTab === 'my-rides' && myRides.length === 0) {
      setLoadingRides(true);
      ridesApi.getAll()
        .then((res) => setMyRides(res.data.data))
        .catch(() => {})
        .finally(() => setLoadingRides(false));
    }
    if (activeTab === 'earnings' && payments.length === 0) {
      setLoadingPayments(true);
      paymentsApi.getAll()
        .then((res) => setPayments(res.data.data))
        .catch(() => {})
        .finally(() => setLoadingPayments(false));
    }
  }, [activeTab]);

  // ── Accept ride ────────────────────────────────────────────────────────────
  const handleAcceptRide = async (ride) => {
    setAccepting(ride.ride_id);
    try {
      await ridesApi.update(ride.ride_id, { status: 'accepted' });
      setAvailableRides((prev) => prev.filter((r) => r.ride_id !== ride.ride_id));
    } catch (_) {}
    finally { setAccepting(null); }
  };

  // ── Complete / Cancel active ride ──────────────────────────────────────────
  const handleCompleteRide = async () => {
    if (!activeRide) return;
    setMutating('complete');
    try {
      await ridesApi.update(activeRide.ride_id, { status: 'completed' });
      setActiveRide(null);
      setMyRides([]);
    } catch (err) {
      console.error('Complete ride failed:', err.response?.data || err.message);
    } finally { setMutating(null); }
  };

  const handleCancelRide = async () => {
    if (!activeRide) return;
    setMutating('cancel');
    try {
      await ridesApi.update(activeRide.ride_id, { status: 'cancelled' });
      setActiveRide(null);
      setMyRides([]);
    } catch (err) {
      console.error('Cancel ride failed:', err.response?.data || err.message);
    } finally { setMutating(null); }
  };

  // ── Earnings totals from payments ──────────────────────────────────────────
  const extraPill = (
    <button
      className={`avail-pill${isAvailable ? '' : ' avail-pill-off'}`}
      onClick={() => setIsAvailable((v) => !v)}
    >
      <span className="live-pill-dot" />
      {isAvailable ? 'Available' : 'Not Available'}
    </button>
  );

  const { user } = useUser();
  // Get initials from Clerk user
  const userInitials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.firstName
      ? user.firstName.slice(0, 2).toUpperCase()
      : '';
  const userName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName[0]}.`
    : user?.firstName || '';

  return (
    <div className="portal-shell">
      <PortalNavbar
        role="Driver"
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onThemeToggle={onThemeToggle}
        userInitials={userInitials}
        userName={userName}
        extraPill={extraPill}
      />

      {/* ── Dashboard ──────────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <div className="driver-dashboard">
          <div className="driver-dashboard-header">
            <h1 className="driver-dashboard-title">Dashboard</h1>
            <div className="driver-dashboard-subtitle">Your performance at a glance</div>
          </div>

          {/* Stats row */}
          <div className="driver-stats-row">
            <div className="driver-stat-card">
              <div className="driver-stat-label">Today's Earnings</div>
              <div className="driver-stat-value">$84</div>
              <div className="driver-stat-sub">+12% vs yesterday</div>
            </div>
            <div className="driver-stat-card">
              <div className="driver-stat-label">This Week</div>
              <div className="driver-stat-value">$521</div>
              <div className="driver-stat-sub">7 rides</div>
            </div>
            <div className="driver-stat-card">
              <div className="driver-stat-label">This Month</div>
              <div className="driver-stat-value">$1,840</div>
              <div className="driver-stat-sub">24 rides</div>
            </div>
            <div className="driver-stat-card">
              <div className="driver-stat-label">Driver Rating</div>
              <div className="driver-stat-value">4.9 ★</div>
              <div className="driver-stat-sub">214 total rides</div>
            </div>
          </div>

          <div className="driver-page">
            {/* Left panel */}
            <div className="portal-panel">
              <div className="section-label">Current Ride</div>
              <InProgressCard
                ride={activeRide}
                onComplete={handleCompleteRide}
                onCancel={handleCancelRide}
                mutating={mutating}
              />

              <div className="section-label" style={{ marginTop: '1.5rem' }}>Weekly Earnings</div>
              <div className="p-card">
                <div className="earnings-chart">
                  {EARNINGS_MOCK.map((e) => (
                    <div className="earnings-row" key={e.label}>
                      <span className="earnings-day">{e.label}</span>
                      <div className="earnings-bar-wrap">
                        <div className={`earnings-bar earnings-bar-${e.pct}`} />
                      </div>
                      <span className="earnings-amt">${e.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="portal-panel">
              <div className="section-label">Acceptance Rate</div>
              <div className="p-card acceptance-card">
                <div className="acceptance-rate">91%</div>
                <div className="acceptance-sub">This week · target ≥ 85%</div>
                <div className="acceptance-bar-wrap">
                  <div className="acceptance-bar" />
                </div>
              </div>

              <div className="section-label" style={{ marginTop: '1.5rem' }}>Recent Completed</div>
              <div className="p-card">
                {[
                  { route: 'Airport → Downtown',      id: 'R1042', fare: '$18.40' },
                  { route: 'UT Campus → Zilker Park', id: 'R1039', fare: '$11.20' },
                  { route: 'East 6th → Domain',       id: 'R1035', fare: '$16.90' },
                  { route: 'Rainey St → SoCo',        id: 'R1031', fare: '$9.75'  },
                ].map((item) => (
                  <div className="completed-item" key={item.id}>
                    <div>
                      <div className="completed-route">{item.route}</div>
                      <div className="completed-id">{item.id}</div>
                    </div>
                    <div className="completed-fare">{item.fare}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Find Rides ─────────────────────────────────────────────── */}
      {activeTab === 'find' && (
        <div className="find-rides-page">
          <div className="page-header">
            <h1>Find Rides</h1>
            <p>Open ride requests available for pickup</p>
          </div>

          {loadingRides ? (
            <div className="table-empty">Looking for available rides…</div>
          ) : availableRides.length === 0 ? (
            <div className="no-rides-state">
              <div className="no-rides-icon">🚗</div>
              <h3>No rides available right now</h3>
              <p>New requests will appear here automatically. Stay online!</p>
            </div>
          ) : (
            <div className="ride-request-grid">
              {availableRides.map((ride) => (
                <div className="ride-request-card" key={ride.ride_id}>
                  <div className="rr-header">
                    <span className="rr-id">Ride #{ride.ride_id}</span>
                    <span className="rr-fare">
                      ${ride.fare && parseFloat(ride.fare) > 0 ? parseFloat(ride.fare).toFixed(2) : '5.00'}
                    </span>
                  </div>

                  <div className="rr-stops">
                    <div className="rr-stop">
                      <div className="stop-dot-pickup" />
                      <span>{ride.pickup_location}</span>
                    </div>
                    <div className="rr-connector" />
                    <div className="rr-stop">
                      <div className="stop-dot-dropoff" />
                      <span>{ride.dropoff_location}</span>
                    </div>
                  </div>

                  <div className="rr-actions">
                    <button
                      className="btn-decline"
                      onClick={() => setAvailableRides((prev) => prev.filter((r) => r.ride_id !== ride.ride_id))}
                      disabled={accepting === ride.ride_id}
                    >
                      Decline
                    </button>
                    <button
                      className="btn-accept"
                      onClick={() => handleAcceptRide(ride)}
                      disabled={accepting === ride.ride_id}
                    >
                      {accepting === ride.ride_id ? 'Accepting…' : 'Accept'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── My Rides ───────────────────────────────────────────────── */}
      {activeTab === 'my-rides' && (
        <div className="history-page">
          <div className="page-header">
            <h1>My Rides</h1>
            <p>All rides on the RideFlow platform</p>
          </div>
          <div className="table-wrap">
            {loadingRides ? (
              <div className="table-empty">Loading rides…</div>
            ) : myRides.length === 0 ? (
              <div className="table-empty">No rides found.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Ride ID</th>
                    <th>Pickup</th>
                    <th>Dropoff</th>
                    <th>Status</th>
                    <th>Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {myRides.map((r) => (
                    <tr key={r.ride_id}>
                      <td><span className="ride-id-link">R{r.ride_id}</span></td>
                      <td>{r.pickup_location}</td>
                      <td>{r.dropoff_location}</td>
                      <td>
                        <span className={`status-badge status-${r.status}`}>
                          {capWords(r.status)}
                        </span>
                      </td>
                      <td>{r.fare ? `$${parseFloat(r.fare).toFixed(2)}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── Earnings ───────────────────────────────────────────────── */}
      {activeTab === 'earnings' && (
        <div className="earnings-page">
          <div className="page-header">
            <h1>Earnings</h1>
            <p>Your complete earnings breakdown</p>
          </div>

          {/* Period totals */}
          <div className="earnings-totals-row">
            <div className="earnings-total-card">
              <div className="et-label">Today</div>
              <div className="et-value">$84.00</div>
              <div className="et-sub">4 rides</div>
            </div>
            <div className="earnings-total-card">
              <div className="et-label">This Week</div>
              <div className="et-value">$521.00</div>
              <div className="et-sub">7 rides</div>
            </div>
            <div className="earnings-total-card">
              <div className="et-label">This Month</div>
              <div className="et-value">$1,840.00</div>
              <div className="et-sub">24 rides</div>
            </div>
            <div className="earnings-total-card highlight">
              <div className="et-label">This Year</div>
              <div className="et-value">$9,320.00</div>
              <div className="et-sub">214 rides total</div>
            </div>
          </div>

          {/* Weekly bar chart */}
          <div className="p-card earnings-chart-card">
            <div className="earnings-chart-title">Weekly Breakdown</div>
            <div className="earnings-chart earnings-chart-lg">
              {EARNINGS_MOCK.map((e) => (
                <div className="earnings-row" key={e.label}>
                  <span className="earnings-day">{e.label}</span>
                  <div className="earnings-bar-wrap">
                    <div className={`earnings-bar earnings-bar-${e.pct}`} />
                  </div>
                  <span className="earnings-amt">${e.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payments table */}
          <div className="section-label" style={{ marginBottom: '0.75rem' }}>
            Payment Records
          </div>
          <div className="table-wrap">
            {loadingPayments ? (
              <div className="table-empty">Loading payments…</div>
            ) : payments.length === 0 ? (
              <div className="table-empty">No payment records yet.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Ride</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.payment_id}>
                      <td><span className="ride-id-link">PAY-{p.payment_id}</span></td>
                      <td><span className="ride-id-link">R{p.ride_id}</span></td>
                      <td><strong>${parseFloat(p.amount).toFixed(2)}</strong></td>
                      <td>{capWords(p.payment_method)}</td>
                      <td>
                        <span className={`status-badge status-${p.status}`}>
                          {capWords(p.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default DriverPortalPage;
