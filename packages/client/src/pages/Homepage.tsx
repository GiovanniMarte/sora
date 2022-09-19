import LoginForm from '../components/LoginForm';

const Homepage = () => {
  return (
    <main className="hero min-h-screen bg-homepage-light">
      <div className="hero-content flex-col gap-10 lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <h3 className="text-2xl py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
            exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
          </h3>
        </div>
        <LoginForm />
      </div>
    </main>
  );
};

export default Homepage;
