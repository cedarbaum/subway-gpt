import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="ml-2">
        <h1 className="sm:text-4xl text-2xl font-bold tracking-tight mb-2">
          SubwayGPT
        </h1>
        <h2>Get NYC subway directions using GPT-3</h2>
      </Link>
    </header>
  );
}
