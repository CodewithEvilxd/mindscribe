const LandingPage = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="text-center">
        <h1 className="font-title mt-[5rem] text-7xl font-bold">
          Welcome to Mindscribe
        </h1>
        <p className="mt-3">
          Streamline your learning and workflow with seamless PDF note-taking
        </p>
      </div>
      <div className="mx-auto mt-12 flex gap-5">
        <a href="/workspace">
          <button className="p-4 border-2 rounded-xl hover:border-black duration-150 ease-in-out">
            Get Started
          </button>
        </a>
        <a href="/documentation">
          <button className="p-4 border-2 rounded-xl hover:border-black duration-150 ease-in-out">
            Documentation
          </button>
        </a>
      </div>
      <div className="mx-auto mt-6 max-w-[90%]">
        <img src="/banner.png" className="rounded-2xl border shadow-2xl" />
      </div>
    </div>
  );
};

export default LandingPage;
