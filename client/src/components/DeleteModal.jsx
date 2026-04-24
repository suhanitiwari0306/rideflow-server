const DeleteModal = ({ rider, onConfirm, onClose, loading }) => {
  if (!rider) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm delete-modal">
        <div className="modal-header">
          <h2>Delete Rider</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to delete{' '}
            <span className="rider-name-highlight">
              {rider.first_name} {rider.last_name}
            </span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading && <span className="spinner" />}
            Delete Rider
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
