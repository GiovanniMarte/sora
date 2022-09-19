interface FormControlProps {
  label: string;
  inputType: string;
  placeholder: string;
}

const FormControl = ({ label, inputType, placeholder }: FormControlProps) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input type={inputType} placeholder={placeholder} className="input input-bordered" />
    </div>
  );
};

export default FormControl;
