const STATUS_LABELS = {
  available: 'Available',
  on_ride:   'On Ride',
  offline:   'Offline',
};

const DriversTable = ({ drivers, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="table-wrap">
        <table>
          <TableHead />
          <tbody>
            <tr className="loading-row">
              <td colSpan={8}>
                <span className="spinner" />
                Loading drivers…
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (!drivers.length) {
    return (
      <div className="table-wrap">
        <div className="empty-state">
          <div className="empty-icon">🚗</div>
          <h3>No drivers found</h3>
          <p>Add a new driver or try a different search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <TableHead />
        <tbody>
          {drivers.map((d) => (
            <tr key={d.driver_id}>
              <td>
                <span className="rider-id">D{String(d.driver_id).padStart(4, '0')}</span>
              </td>
              <td>
                <span className="rider-name">{d.first_name} {d.last_name}</span>
              </td>
              <td>
                <span className="rider-email">{d.email}</span>
              </td>
              <td>{d.phone_number}</td>
              <td>{d.vehicle_model}</td>
              <td>{d.license_plate}</td>
              <td>
                <span className={`driver-status-badge driver-status-${d.status}`}>
                  {STATUS_LABELS[d.status] || d.status}
                </span>
              </td>
              <td>
                <span className="rating-badge">
                  <span className="star">★</span>
                  {parseFloat(d.rating).toFixed(2)}
                </span>
              </td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-ghost btn-sm" onClick={() => onEdit(d)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(d)}>Delete</button>
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
      <th>Vehicle</th>
      <th>Plate</th>
      <th>Status</th>
      <th>Rating</th>
      <th>Actions</th>
    </tr>
  </thead>
);

export default DriversTable;
