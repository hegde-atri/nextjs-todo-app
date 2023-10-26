import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { Header } from "./_components/Header";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <div className="">
      <Header />
      <h1>Hey!</h1>
    </div>
  );
}
