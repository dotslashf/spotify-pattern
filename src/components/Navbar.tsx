import { useSession, signIn, signOut } from "next-auth/react";

function Navbar() {
  const { data, status } = useSession();

  return (
    <nav className="sticky top-0 z-50">
      <div>
        <div className="w-full bg-black  opacity-90 h-16 flex justify-between ">
          <div className="w-full lg:w-30/6 xl:w-full  h-full flex items-center px-4 text-white font-bold">
            {status === "authenticated"
              ? // @ts-ignore
                `@${data.session.user.name}`
              : "spotify-pattern"}
          </div>

          <div className="w-full  h-full flex justify-end items-center pr-4">
            {status === "authenticated" ? (
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-4 py-2 transition"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-4 py-2 transition"
                onClick={() => signIn()}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
