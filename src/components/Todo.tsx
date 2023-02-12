import React, { useState } from "react";
import axios from "axios";
import {
  getRequestWithAuthHeader,
  postRequestWithAuthHeader,
} from "@/utils/apiRequests";

interface Props {
  id: number;
  title: string;
  body: string;
  creation_date: Date;
  last_edit_date: Date;
  isCompleted: boolean;
  isInRecycleBin: boolean;
  setTodos: any;
  setBinTodos: any;
  whichTodos: boolean;
}

interface Todo {
  Todo_ID: number;
  Title: string;
  Body: string;
  Create_Time: Date;
  Last_Update_Time: Date;
  Status: boolean;
  InRecycleBin: boolean;
}

function Todo(props: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedBody, setEditedBody] = useState<string>("");
  const [emptyTitleError, setEmptyTitleError] = useState<boolean>(false);

  const creationDate = props.creation_date.toString().split("T")[0];
  const creationTime = props.creation_date
    .toString()
    .split("T")[1]
    .replace("Z", "")
    .substring(0, 8);
  const lastEditDate = props.last_edit_date.toString().split("T")[0];
  const lastEditTime = props.last_edit_date
    .toString()
    .split("T")[1]
    .replace("Z", "")
    .substring(0, 8);

  const handleEditTodo = async (
    id: number,
    newTitle: string,
    newBody?: string
  ) => {
    setEmptyTitleError(false);
    if (newTitle.length === 0) {
      setEmptyTitleError(true);
      return;
    }
    const result = await postRequestWithAuthHeader(
      "http://localhost:8000/api/todos/update",
      { todo_Id: id, title: newTitle, body: newBody }
    );
    const editedTodo = result!.data.data;
    props.setTodos((prevTodos: Todo[]) =>
      prevTodos.map((todo) =>
        todo.Todo_ID === editedTodo.Todo_ID
          ? {
              ...todo,
              Title: editedTodo.Title,
              Body: editedTodo.Body,
              Last_Update_Time: editedTodo.Last_Update_Time,
            }
          : todo
      )
    );
    setIsEditing(false);
  };
  const handleDeleteTodo = async (id: number) => {
    const result = await postRequestWithAuthHeader(
      "http://localhost:8000/api/todos/delete",
      { todo_Id: id }
    );
    const todoToDelete = result!.data.data;
    if (todoToDelete === 1) {
      if (props.whichTodos) {
        props.setBinTodos((prevTodos: Todo[]) =>
          prevTodos.filter((todo: Todo) => todo.Todo_ID !== id)
        );
      } else {
        props.setTodos((prevTodos: Todo[]) =>
          prevTodos.filter((todo: Todo) => todo.Todo_ID !== id)
        );
      }
    }
  };
  const markAsDone = async (id: number) => {
    const result = await postRequestWithAuthHeader(
      "http://localhost:8000/api/todos/markAsDone",
      { todo_Id: id }
    );
    const todoToMarkAsDone = result!.data.data;
    if (todoToMarkAsDone) {
      props.setTodos((prevTodos: Todo[]) =>
        prevTodos.map((todo: Todo) =>
          todo.Todo_ID === todoToMarkAsDone.Todo_ID
            ? {
                ...todo,
                Status: todoToMarkAsDone.Status,
              }
            : todo
        )
      );
    }
  };
  const handleRestoreTodo = async (id: number) => {
    const result = await postRequestWithAuthHeader(
      "http://localhost:8000/api/todos/recoverFromBin",
      { todo_Id: id }
    );
    const todoToRecover = result!.data.data;
    if (todoToRecover) {
      props.setBinTodos((prevTodos: Todo[]) =>
        prevTodos.filter((todo) => todo.Todo_ID !== todoToRecover.Todo_ID)
      );
    }
  };
  const handleMoveToBin = async (id: number) => {
    const result = await postRequestWithAuthHeader(
      "http://localhost:8000/api/todos/moveToBin",
      { todo_Id: id }
    );
    const binnedTodo = result!.data.data;
    if (binnedTodo) {
      props.setTodos((prevTodos: Todo[]) =>
        prevTodos.filter((todo) => todo.Todo_ID !== binnedTodo.Todo_ID)
      );
    }
  };
  function conditionalColorRender(status: boolean): string {
    return status
      ? "decoration-clone bg-gradient-to-tr rounded-lg px-5 py-3 shadow-lg from-green-500 to-green-600"
      : "decoration-clone bg-gradient-to-tr rounded-lg px-5 py-3 shadow-lg from-gray-400 to-gray-500";
  }
  function conditionalRenderButtons(bin: boolean) {
    if (bin) {
      return (
        <div className="container flex flex-row justify-around py-2">
          <button
            className="text-green-500 bg-gray-300 border border-gray-400 hover:bg-green-500 hover:text-black hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg p-1 px-4"
            name="Restore"
            type="button"
            onClick={() => handleRestoreTodo(props.id)}
          >
            Recover
          </button>
          <button
            className="text-red-500 bg-gray-300 border border-gray-400 hover:bg-red-500 hover:text-black hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg p-1 px-4"
            name="deleteTodo"
            type="button"
            onClick={() => handleDeleteTodo(props.id)}
          >
            Delete
          </button>
        </div>
      );
    } else {
      if (props.isCompleted) {
        return (
          <div className="container flex flex-row justify-around py-2">
            <button
              className="text-red-500 bg-gray-300 border border-gray-400 hover:bg-red-500 hover:text-black hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg p-1 px-4"
              name="MoveTodoToBin"
              type="button"
              onClick={() => handleMoveToBin(props.id)}
            >
              Move To Bin
            </button>
          </div>
        );
      }
      if (isEditing) {
        return (
          <div className="container flex flex-row justify-around py-2">
            <button
              className="bg-gray-300 border border-gray-400 hover:bg-gray-500 hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-gray-600 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg px-1"
              name="editTodo"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              className="text-green-500 bg-gray-300 border border-gray-400 hover:bg-green-500 hover:text-black hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg p-1 px-4"
              name="saveChanges"
              type="button"
              onClick={() => handleEditTodo(props.id, editedTitle, editedBody)}
            >
              Save Changes
            </button>
          </div>
        );
      } else {
        return (
          <div className="container flex flex-row justify-around py-2">
            <button
              className="bg-gray-300 border border-gray-400 hover:bg-gray-500 hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-gray-600 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg px-1"
              name="editTodo"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="text-red-500 bg-gray-300 border border-gray-400 hover:bg-red-500 hover:text-black hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg p-1 px-4"
              name="deleteTodo"
              type="button"
              onClick={() => handleMoveToBin(props.id)}
            >
              Move to Bin
            </button>
            <button
              className="text-green-500 bg-gray-300 border border-gray-400 hover:bg-green-500 hover:text-black hover:shadow-xl text:black focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out uppercase font-medium text-xs rounded-lg p-1 px-4"
              name="saveChanges"
              type="button"
              onClick={() => markAsDone(props.id)}
            >
              Done!
            </button>
          </div>
        );
      }
    }
  }

  return (
    <div id="container" className={conditionalColorRender(props.isCompleted)}>
      <div className="flex flex-col justify-center">
        {isEditing ? (
          <input
            className="border border-gray-400 rounded-lg p-1 mt-2 focus: outline-none"
            type="text"
            name="titleEdit"
            placeholder={
              emptyTitleError ? "Please insert a title" : props.title
            }
            onChange={(e) => setEditedTitle(e.target.value)}
          ></input>
        ) : (
          <h1 className="text-3xl text-white font-bold text-center">
            {props.title}
          </h1>
        )}
      </div>
      <div className="flex flex-col justify-center text-white font-normal text-center mt-20">
        {isEditing ? (
          <input
            className="border border-gray-400 rounded-lg p-1 focus: outline-none text-black"
            type="text"
            name="bodyEdit"
            placeholder={props.body}
            onChange={(e) => setEditedBody(e.target.value)}
          ></input>
        ) : (
          <p>{props.body}</p>
        )}
      </div>
      <div>
        <div className="text-white flex-shrink mt-20 py-2">
          <p className="font-extralight text-xs">
            Creation time: {creationDate + "  " + creationTime}
          </p>
          <p className="font-extralight text-xs">
            Last Update Time: {lastEditDate + "  " + lastEditTime}
          </p>
        </div>
        {conditionalRenderButtons(props.whichTodos)}
      </div>
    </div>
  );
}

export default React.memo(Todo);
