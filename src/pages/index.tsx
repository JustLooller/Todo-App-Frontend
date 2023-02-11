import Router from "next/router";
export default function Landing() {

  function handleClick(event: any): void {
    if (event.target.name === "LoginButton") Router.push("/login");
    else if (event.target.name === "RegisterButton") Router.push("/register");
  }
  
  return (
    <div className="min-h-screen decoration-clone bg-gradient-to-bl from-gray-400 to-gray-700 h-full w-full">
      <div className="container h-full w-full mx-auto flex flex-col justify-center py-10  ">
        <div className="bg-gray-800 w-full mx-auto py-8 px-8 rounded-md shadow-lg">
          <h1 className="text-4xl text-white font-bold text-center">
            Welcome!
          </h1>
          <div className="w-full flex justify-evenly text-black py-7 ">
            <button
              className="bg-gray-300 border border-gray-400 hover:bg-gray-500 hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-gray-600 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg px-6 py-2"
              name="LoginButton"
              onClick={(e) => handleClick(e)}
            >
              Login
            </button>

            <button
              className="bg-gray-300 border border-gray-400 hover:bg-gray-500 hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-gray-600 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg py-2 px-6"
              name="RegisterButton"
              onClick={(e) => handleClick(e)}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
