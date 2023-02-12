import React, { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import { NextSeo } from "next-seo";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userNotFound, setUserNotFound] = useState<boolean>(false);

  async function handleLogin(event: any) {
    setUserNotFound(false);
    event.preventDefault();

    if (username.length == 0) {
      setUserNotFound(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/login",
        {
          username,
          password,
        }
      );
      if (response.data.status === "success") {
        console.log(response);
        localStorage.setItem("jwt", response.data.token);
        localStorage.setItem("username", username);
        Router.push({
          pathname: "/homepage",
        });
      }
    } catch (error) {
      setUserNotFound(true);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      Router.push("/homepage");
    }
  });

  return (
    <>
      <NextSeo title="Login" description="Login page" />
      <div className="min-h-screen decoration-clone bg-gradient-to-bl from-gray-400 to-gray-700 h-full w-full">
        <div className="container h-full w-full mx-auto flex flex-col justify-center py-10">
          <div className="bg-gray-800 w-full mx-auto py-8 px-8 rounded-md shadow-lg">
            <h1 className="text-4xl text-white font-bold text-center">Login</h1>
            <div className="w-full flex justify-evenly text-black py-7 ">
              <input
                className="border border-gray-400 rounded-lg p-1 focus: outline-none "
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="border border-gray-400 rounded-lg p-1 focus: outline-none "
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="bg-gray-300 border border-gray-400 hover:bg-gray-500 hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-gray-600 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg px-4"
                type="button"
                onClick={(e) => handleLogin(e)}
              >
                Login
              </button>
            </div>
            <div className="flex justify-center text-red-500">
              {userNotFound ? (
                <p> This username and password combination is not valid.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
