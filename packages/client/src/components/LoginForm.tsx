import { FormEvent } from 'react';
import FormControl from './FormControl';

const LoginForm = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card flex-shrink-0 w-full max-w-sm shadow-2xl backdrop-blur-lg"
    >
      <div className="card-body">
        <FormControl label="Email" inputType="text" placeholder="email" />
        <FormControl label="Password" inputType="password" placeholder="password" />
        <div className="flex justify-between">
          <a href="#" className="label-text-alt link link-hover">
            Register
          </a>
          <a href="#" className="label-text-alt link link-hover">
            Forgot password?
          </a>
        </div>
        <div className="form-control mt-5">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
