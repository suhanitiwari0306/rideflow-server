import { useState, useEffect } from 'react';

const PAYMENT_METHODS = [
  { value: 'credit_card',  label: 'Credit Card' },
  { value: 'debit_card',   label: 'Debit Card' },
  { value: 'paypal',       label: 'PayPal' },
  { value: 'apple_pay',    label: 'Apple Pay' },
  { value: 'google_pay',   label: 'Google Pay' },
];

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  default_payment_method: 'credit_card',
  rating: '5.00',
};

const RiderForm = ({ rider, onSave, onClose, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(rider);

  useEffect(() => {
    if (rider) {
      setForm({
        first_name: rider.first_name || '',
        last_name: rider.last_name || '',
        email: rider.email || '',
        phone_number: rider.phone_number || '',
        default_payment_method: rider.default_payment_method || 'credit_card',
        rating: rider.rating?.toString() || '5.00',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [rider]);

  const validate = () => {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = 'Required';
    if (!form.last_name.trim())  errs.last_name  = 'Required';
    if (!form.email.trim()) {
      errs.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Invalid email';
    }
    if (!form.phone_number.trim()) errs.phone_number = 'Required';
    const rating = parseFloat(form.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errs.rating = 'Must be between 1 and 5';
    }
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
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSave({
      ...form,
      rating: parseFloat(parseFloat(form.rating).toFixed(2)),
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Rider' : 'Add New Rider'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Jane"
                className={errors.first_name ? 'input-error' : ''}
              />
              {errors.first_name && <FieldError msg={errors.first_name} />}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className={errors.last_name ? 'input-error' : ''}
              />
              {errors.last_name && <FieldError msg={errors.last_name} />}
            </div>

            <div className="form-group full-width">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <FieldError msg={errors.email} />}
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                id="phone_number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="(512) 555-0100"
                className={errors.phone_number ? 'input-error' : ''}
              />
              {errors.phone_number && <FieldError msg={errors.phone_number} />}
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating (1–5)</label>
              <input
                id="rating"
                name="rating"
                type="number"
                min="1"
                max="5"
                step="0.01"
                value={form.rating}
                onChange={handleChange}
                className={errors.rating ? 'input-error' : ''}
              />
              {errors.rating && <FieldError msg={errors.rating} />}
            </div>

            <div className="form-group full-width">
              <label htmlFor="default_payment_method">Default Payment Method</label>
              <select
                id="default_payment_method"
                name="default_payment_method"
                value={form.default_payment_method}
                onChange={handleChange}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <span className="spinner" />}
              {isEditing ? 'Save Changes' : 'Add Rider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FieldError = ({ msg }) => (
  <span className="field-error">{msg}</span>
);

export default RiderForm;
