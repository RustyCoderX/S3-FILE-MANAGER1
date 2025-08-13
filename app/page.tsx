/* import Image from "next/image";

import NavBar from "@/components/nav";

export default function Home() {
  return (
    <div>
     <NavBar/>
    </div>
  );
}
 */
import NavBar from "@/components/nav";
import S3FileExplorer from "@/components/S3FileExplorer"

async function getData() {
  const res = await fetch("http://localhost:3000/api/objects", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const data = await getData();
  return (
    <div className="relative min-h-screen">
      {/* Blue, Black, Silver Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-800 via-gray-900 to-gray-200" />
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 -z-10 opacity-20 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/dots.png')]" />
      <NavBar />
      <main className="flex flex-col items-center justify-start py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-100 drop-shadow-lg">S3 File Explorer</h1>
        <S3FileExplorer data={data} />
      </main>
    </div>
  );
}