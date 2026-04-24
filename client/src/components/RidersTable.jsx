const PAYMENT_LABELS = {
  credit_card: 'Credit Card',
  debit_card:  'Debit Card',
  paypal:      'PayPal',
  apple_pay:   'Apple Pay',
  google_pay:  'Google Pay',
};

const RidersTable = ({ riders, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="table-wrap">
        <table>
          <TableHead />
          <tbody>
            <tr className="loading-row">
              <td colSpan={7}>
                <span className="spinner" />
                Loading riders…
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (!riders.length) {
    return (
      <div className="table-wrap">
        <div className="empty-state">
          <div className="empty-icon">🚗</div>
          <h3>No riders found</h3>
          <p>Add a new rider or try a different search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <TableHead />
        <tbody>
          {riders.map((rider) => (
            <tr key={rider.rider_id}>
              <td>
                <span className="rider-id">R{String(rider.rider_id).padStart(4, '0')}</span>
              </td>
              <td>
                <span className="rider-name">
                  {rider.first_name} {rider.last_name}
                </span>
              </td>
              <td>
                <span className="rider-email">{rider.email}</span>
              </td>
              <td>{rider.phone_number}</td>
              <td>
                <span className="pay-badge">
                  {PAYMENT_LABELS[rider.default_payment_method] || rider.default_payment_method}
                </span>
              </td>
              <td>
                <span className="rating-badge">
                  <span className="star">★</span>
                  {parseFloat(rider.rating).toFixed(2)}
                </span>
              </td>
              <td>
                <div className="actions-cell">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onEdit(rider)}
                    aria-label="Edit rider"
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(rider)}
                    aria-label="Delete rider"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableHead = () => (
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Payment</th>
      <th>Rating</th>
      <th>Actions</th>
    </tr>
  </thead>
);

export default RidersTable;
