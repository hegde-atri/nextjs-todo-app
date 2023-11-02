"use client";
import { Header } from "./_components/Header";
import { api } from "~/trpc/react";
import { LoadingPage, LoadingSpinner } from "./_components/LoadingSpinner";
import type { Todo } from "@prisma/client";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  const { data, isLoading } = api.todo.getAll.useQuery();

  return (
    <div className="">
      <Header />
      {isLoading ? (
        <div className="mx-auto flex">
          <LoadingPage />
        </div>
      ) : (
        data!.map((item) => {
          return <Todo todo={item} authenticated={!!session.data?.user} />;
        })
      )}
    </div>
  );
}

const Todo = (props: { todo: Todo; authenticated: boolean }) => {
  const { mutate: updateStatus, isLoading: isStatusUpdating } =
    api.todo.updateDoneStatus.useMutation({
      onSuccess: () => {
        props.todo.done = !props.todo.done;
      },
    });

  const { mutate: deleteTodo, isLoading: isDeleting } =
    api.todo.deleteTodo.useMutation({
      onSuccess: () => {
        props.todo.id = undefined!;
      },
    });

  if (props.todo.id == undefined) {
    return;
  }

  return (
    <div
      key={props.todo.id}
      className="flex flex-row justify-between border-b border-slate-400 p-2"
    >
      <div>
        <h2 className="text-2xl font-bold">{props.todo.content}</h2>
        <p>
          <span>Status: </span>
          {props.todo.done ? "Done" : "Pending"}
        </p>
      </div>
      {props.authenticated ? (
        <div className="flex justify-center text-slate-100">
          {props.todo.done ? (
            <button
              className="rounded-md bg-orange-800 p-2"
              onClick={() =>
                updateStatus({ todoId: props.todo.id, done: false })
              }
            >
              {isStatusUpdating ? <LoadingSpinner /> : "Undo"}
            </button>
          ) : (
            <button
              className="items-center rounded-md bg-green-900 p-2"
              onClick={() =>
                updateStatus({ todoId: props.todo.id, done: true })
              }
            >
              {isStatusUpdating ? <LoadingSpinner /> : "Done"}
            </button>
          )}
          <button
            className="ml-2 rounded-md bg-red-900 p-2"
            onClick={() => deleteTodo({ todoId: props.todo.id })}
          >
            {isDeleting ? <LoadingSpinner /> : "Delete"}
          </button>
        </div>
      ) : null}
    </div>
  );
};
