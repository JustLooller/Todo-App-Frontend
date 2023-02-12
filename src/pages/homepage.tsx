import axios from "axios";
import { Router, useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Todo from "@/components/Todo";
import React from "react";
import {
  getRequestWithAuthHeader,
  postRequestWithAuthHeader,
} from "@/utils/apiRequests";

export default function Homepage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [binTodos, setBinTodos] = useState<Todo[]>([]);
  const [whichTodos, setWhichTodos] = useState<boolean>(false); //0 normal 1 bin
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [titleEmptyError, setTitleEmptyError] = useState<boolean>(false);

  const router = useRouter();

  interface Todo {
    Todo_ID: number;
    Title: string;
    Body: string;
    Create_Time: Date;
    Last_Update_Time: Date;
    Status: boolean;
    InRecycleBin: boolean;
  }


  const getTodos = async () => {
    const response = await getRequestWithAuthHeader(
      "http://localhost:8000/api/todos/all"
    );
    setTodos(response?.data);
  };
  const getTodosFromBin = async () => {
    const response = await getRequestWithAuthHeader(
      "http://localhost:8000/api/todos/getFromBin"
    );
    setBinTodos(response?.data.data);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      router.push("/login");
    }
    const username = localStorage.getItem("username");
    getTodos();
    getTodosFromBin();
  }, []);

  const handleAddTodo = async (title: string, body?: string) => {
    setTitleEmptyError(false);

    if (title.length === 0) {
      setTitleEmptyError(true);
      return;
    }
    const response = await postRequestWithAuthHeader(
      "http://localhost:8000/api/todos/add",
      {
        title: title,
        username: localStorage.getItem("username"),
        body: body,
      }
    );
    const newTodo = response!.data.data;
    setTodos((prevTodos) => prevTodos.concat(newTodo));
    setTitle("");
    setBody("");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    router.push("/");
  };

  const handleClickOnRecycleBin = () => {
    getTodos();
    getTodosFromBin();
    setWhichTodos(!whichTodos);
  };

  return (
    <div className="min-h-screen decoration-clone bg-gradient-to-bl from-gray-400 to-gray-700 h-full w-full">
      <div className="p-10 flex flex-row-reverse">
        <button
          className=" bg-gray-300 border border-gray-400 hover:bg-gray-500 hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-gray-600 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg px-10 py-2"
          onClick={() => handleLogout()}
        >
          Logout
        </button>
        <button
          className="mr-3 bg-gray-300 border border-gray-400 hover:bg-gray-500 hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-gray-600 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg px-10 py-2"
          onClick={() => handleClickOnRecycleBin()}
        >
          {whichTodos ? <>Home</> : <>Recycle Bin</>}
        </button>
      </div>
      <div className=" relative md:container md:mx-auto h-full w-full mx-auto flex flex-col justify-center py-10">
        <h1 className="text-4xl text-white font-bold text-center">Homepage</h1>
        <div className="flex flex-row justify-center mt-10">
          <p className="text-white text-xl font-light mr-5">Add a new todo:</p>
          <input
            className="border border-gray-400 rounded-lg p-1 focus: outline-none mr-3"
            type="text"
            name="title"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <input
            className="border border-gray-400 rounded-lg p-1 focus: outline-none mr-3"
            type="text"
            name="body"
            value={body}
            placeholder="Body"
            onChange={(e) => setBody(e.target.value)}
          ></input>
          <button
            className="text-green-500 bg-gray-300 border border-gray-400 hover:bg-green-500 hover:text-black hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg p-1 px-4"
            type="button"
            onClick={() => handleAddTodo(title, body)}
          >
            Add
          </button>
        </div>
        {titleEmptyError && (
          <div className="flex justify-center text-red-500 mt-9">
            <p>You cannot add a Todo without a title.</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-5 py-20">
          {whichTodos
            ? binTodos &&
              binTodos.map((todo: Todo) => {
                return (
                  <Todo
                    key={todo.Todo_ID}
                    id={todo.Todo_ID}
                    title={todo.Title}
                    body={todo.Body}
                    creation_date={todo.Create_Time}
                    last_edit_date={todo.Last_Update_Time}
                    isCompleted={!!todo.Status}
                    isInRecycleBin={!!todo.InRecycleBin}
                    setTodos={setTodos}
                    setBinTodos={setBinTodos}
                    whichTodos={whichTodos}
                  />
                );
              })
            : todos &&
              todos.map((todo: Todo) => {
                return (
                  <Todo
                    key={todo.Todo_ID}
                    id={todo.Todo_ID}
                    title={todo.Title}
                    body={todo.Body}
                    creation_date={todo.Create_Time}
                    last_edit_date={todo.Last_Update_Time}
                    isCompleted={!!todo.Status}
                    isInRecycleBin={!!todo.InRecycleBin}
                    setTodos={setTodos}
                    setBinTodos={setBinTodos}
                    whichTodos={whichTodos}
                  />
                );
              })}
        </div>
      </div>
    </div>
  );
}
