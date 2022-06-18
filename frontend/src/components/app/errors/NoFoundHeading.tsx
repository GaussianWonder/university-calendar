import { Component } from "solid-js";

const NotFoundHeading: Component = () => {
  return (
    <>
      <h1 text-3xl text-gray-800 font-medium>
        <span text-5xl text-gray-900 font-bold>404</span>
        Resource not found
      </h1>
      <p text-xl font-normal text-gray-800>Maybe you do not have enough permissions to view this item</p>
    </>
  );
};

export default NotFoundHeading;
