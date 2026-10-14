const FIELDS = [
  ["fullName", "Full Name"],
  ["phone", "Phone"],
  ["addressLine1", "Address"],
  ["city", "City"],
  ["state", "State"],
  ["pincode", "Pincode"],
];

export const validateShipping = (v) => {
  const errors = {};
  FIELDS.forEach(([key, label]) => {
    if (!v[key].trim()) errors[key] = `${label} is required.`;
  });
  if (!errors.phone && !/^[0-9]{10}$/.test(v.phone.trim())) errors.phone = "Phone must be a valid 10 digit number.";
  if (!errors.pincode && !/^[0-9]{6}$/.test(v.pincode.trim())) errors.pincode = "Pincode must contain 6 digits.";
  return errors;
};

export default function CheckoutForm({ values, setValues, errors }) {
  return (
    <div className="form-card">
      <h2>Shipping Details</h2>
      {FIELDS.map(([key, label]) => (
        <div className="field" key={key}>
          <label htmlFor={key}>{label}</label>
          <input
            id={key}
            value={values[key]}
            onChange={(e) => setValues({ ...values, [key]: e.target.value })}
            className={errors[key] ? "invalid" : ""}
          />
          {errors[key] && <small className="error">{errors[key]}</small>}
        </div>
      ))}
    </div>
  );
}
