export default function UserCard({ user }: any) {
  return (
    <>
      <div className="flex bg-zinc-800 p-4 rounded-md m-2 group border border-transparent hover:border-yellow-500 duration-300 min-w-[500px] ">
        <img
          src={user.profilePic}
          alt="loading"
          className=" bg-white w-40 h-40 rounded-full invert border-4 group-hover:border-blue-500 duration-300"
        />
        <div className="flex relative top-12 -right-10 flex-col gap-4 group-hover:text-yellow-500 duration-300">
          <p className="text-4xl">{user.username}</p>
          <p>{user.createdAt}</p>
          
        </div>
      </div>
    </>
  );
}
