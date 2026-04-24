import { useState, useEffect } from 'react';

const STATUSES = [
  { value: 'available', label: 'Available' },
  { value: 'on_ride',   label: 'On Ride'   },
  { value: 'offline',   label: 'Offline'   },
];

const EMPTY_FORM = {
  first_name:    '',
  last_name:     '',
  email:         '',
  phone_number:  '',
  license_plate: '',
  vehicle_model: '',
  status:        'available',
  rating:        '5.00',
};

const DriverForm = ({ driver, onSave, onClose, loading }) => {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(driver);

  useEffect(() => {
    if (driver) {
      setForm({
        first_name:    driver.first_name    || '',
        last_name:     driver.last_name     || '',
        email:         driver.email         || '',
        phone_number:  driver.phone_number  || '',
        license_plate: driver.license_plate || '',
        vehicle_model: driver.vehicle_model || '',
        status:        driver.status        || 'available',
        rating:        driver.rating?.toString() || '5.00',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [driver]);

  const validate = () => {
    const errs = {};
    if (!form.first_name.trim())    errs.first_name    = 'Required';
    if (!form.last_name.trim())     errs.last_name     = 'Required';
    if (!form.email.trim()) {
      errs.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Invalid email';
    }
    if (!form.phone_number.trim())  errs.phone_number  = 'Required';
    if (!form.license_plate.trim()) errs.license_plate = 'Required';
    if (!form.vehicle_model.trim()) errs.vehicle_model = 'Required';
    const rating = parseFloat(form.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) errs.rating = 'Must be 1–5';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, rating: parseFloat(parseFloat(form.rating).toFixed(2)) });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Driver' : 'Add New Driver'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="d-first_name">First Name</label>
              <input id="d-first_name" name="first_name" value={form.first_name} onChange={handleChange} placeholder="Marcus" className={errors.first_name ? 'input-error' : ''} />
              {errors.first_name && <FieldError msg={errors.first_name} />}
            </div>

            <div className="form-group">
              <label htmlFor="d-last_name">Last Name</label>
              <input id="d-last_name" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Lee" className={errors.last_name ? 'input-error' : ''} />
              {errors.last_name && <FieldError msg={errors.last_name} />}
            </div>

            <div className="form-group full-width">
              <label htmlFor="d-email">Email</label>
              <input id="d-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="driver@rideflow.app" className={errors.email ? 'input-error' : ''} />
              {errors.email && <FieldError msg={errors.email} />}
            </div>

            <div className="form-group">
              <label htmlFor="d-phone">Phone Number</label>
              <input id="d-phone" name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="(512) 555-0200" className={errors.phone_number ? 'input-error' : ''} />
              {errors.phone_number && <FieldError msg={errors.phone_number} />}
            </div>

            <div className="form-group">
              <label htmlFor="d-plate">License Plate</label>
              <input id="d-plate" name="license_plate" value={form.license_plate} onChange={handleChange} placeholder="TXA-0000" className={errors.license_plate ? 'input-error' : ''} />
              {errors.license_plate && <FieldError msg={errors.license_plate} />}
            </div>

            <div className="form-group">
              <label htmlFor="d-vehicle">Vehicle Model</label>
              <input id="d-vehicle" name="vehicle_model" value={form.vehicle_model} onChange={handleChange} placeholder="Toyota Camry" className={errors.vehicle_model ? 'input-error' : ''} />
              {errors.vehicle_model && <FieldError msg={errors.vehicle_model} />}
            </div>

            <div className="form-group">
              <label htmlFor="d-status">Status</label>
              <select id="d-status" name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="d-rating">Rating (1–5)</label>
              <input id="d-rating" name="rating" type="number" min="1" max="5" step="0.01" value={form.rating} onChange={handleChange} className={errors.rating ? 'input-error' : ''} />
              {errors.rating && <FieldError msg={errors.rating} />}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <span className="spinner" />}
              {isEditing ? 'Save Changes' : 'Add Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FieldError = ({ msg }) => <span className="field-error">{msg}</span>;

export default DriverForm;
