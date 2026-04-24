import { useState, useEffect, useCallback } from 'react';
import { ridersApi } from '../services/api';
import RidersTable from '../components/RidersTable';
import RiderForm from '../components/RiderForm';
import DeleteModal from '../components/DeleteModal';

const RidersPage = ({ addToast }) => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mutating, setMutating] = useState(false);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingRider, setEditingRider] = useState(null); // null = create mode
  const [deletingRider, setDeletingRider] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchRiders = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const res = await ridersApi.getAll(q);
      setRiders(res.data.data);
    } catch (err) {
      addToast('Failed to load riders: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchRiders(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchRiders]);

  // ── Create ─────────────────────────────────────────────────────────────────
  const handleCreate = async (formData) => {
    setMutating(true);
    try {
      const res = await ridersApi.create(formData);
      setRiders((prev) => [res.data.data, ...prev]);
      setShowForm(false);
      addToast(`Rider ${res.data.data.first_name} added successfully`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create rider', 'error');
    } finally {
      setMutating(false);
    }
  };

  // ── Update ─────────────────────────────────────────────────────────────────
  const handleUpdate = async (formData) => {
    setMutating(true);
    try {
      const res = await ridersApi.update(editingRider.rider_id, formData);
      setRiders((prev) =>
        prev.map((r) => (r.rider_id === editingRider.rider_id ? res.data.data : r))
      );
      setEditingRider(null);
      setShowForm(false);
      addToast('Rider updated successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update rider', 'error');
    } finally {
      setMutating(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setMutating(true);
    try {
      await ridersApi.delete(deletingRider.rider_id);
      setRiders((prev) => prev.filter((r) => r.rider_id !== deletingRider.rider_id));
      addToast(`Rider ${deletingRider.first_name} deleted`, 'success');
      setDeletingRider(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete rider', 'error');
    } finally {
      setMutating(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingRider(null);
    setShowForm(true);
  };

  const openEdit = (rider) => {
    setEditingRider(rider);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRider(null);
  };

  const avgRating = riders.length
    ? (riders.reduce((sum, r) => sum + parseFloat(r.rating || 0), 0) / riders.length).toFixed(2)
    : '—';

  return (
    <>
      <div className="page-header">
        <h1>Riders</h1>
        <p>Manage all registered riders on the RideFlow platform</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Riders</div>
          <div className="stat-value">{loading ? '…' : riders.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Rating</div>
          <div className="stat-value">{loading ? '…' : avgRating}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Search Results</div>
          <div className="stat-value">{loading ? '…' : riders.length}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Rider
        </button>
      </div>

      {/* Table */}
      <RidersTable
        riders={riders}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeletingRider}
      />

      {/* Create / Edit Modal */}
      {showForm && (
        <RiderForm
          rider={editingRider}
          onSave={editingRider ? handleUpdate : handleCreate}
          onClose={closeForm}
          loading={mutating}
        />
      )}

      {/* Delete Confirm Modal */}
      {deletingRider && (
        <DeleteModal
          rider={deletingRider}
          onConfirm={handleDelete}
          onClose={() => setDeletingRider(null)}
          loading={mutating}
        />
      )}
    </>
  );
};

export default RidersPage;
