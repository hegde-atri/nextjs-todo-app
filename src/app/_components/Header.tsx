"use client";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "./LoadingSpinner";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export const Header = () => {
  let router = useRouter();
  let { data: session } = useSession();
  let [todo, setTodo] = useState("");

  const { mutate } = api.todo.create.useMutation({
    onSuccess: () => {
      setTodo("");
      router.refresh();
    },
  });

  let username = "hegde-atri";
  return (
    <div className="flex justify-center border-b border-slate-400 p-2">
      <a href={`@ ${username}`}>
        <img
          className="rounded-full"
          src={session?.user.image!}
          height={65}
          width={65}
        />
      </a>
      <input
        className="grow bg-transparent p-4 px-16 outline-none"
        value={todo}
        placeholder="Task"
        onChange={(e) => setTodo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (todo !== "") {
              mutate({ content: todo });
            }
          }
        }}
      />
    </div>
  );
  /* return (
   *   <div className="flex w-full gap-3">
   *     // User button here
   *     <input
   *       placeholder="Type some emojis!"
   *       className="grow bg-transparent outline-none"
   *       type="text"
   *       value={input}
   *       onChange={(e) => setInput(e.target.value)}
   *       onKeyDown={(e) => {
   *         if (e.key === "Enter") {
   *           e.preventDefault();
   *           if (input !== "") {
   *             mutate({ content: input });
   *           }
   *         }
   *       }}
   *       disabled={isPosting}
   *     />
   *     {input !== "" && !isPosting && (
   *       <button onClick={() => mutate({ content: input })}>Post</button>
   *     )}
   *     {isPosting && (
   *       <div className="flex items-center justify-center">
   *         <LoadingSpinner size={20} />
   *       </div>
   *     )}
   *   </div>
   *  ); */
};
