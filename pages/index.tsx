import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import { renderToString } from "react-dom/server";

const routes = new Set([
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "J",
  "L",
  "M",
  "N",
  "Q",
  "R",
  "S",
  "W",
  "Z",
]);

function processDirectionsText(text: string) {
  return text.replaceAll(/\[.*?\]/g, (match: string) => {
    const innerText = match.substring(1, match.length - 1);
    if (routes.has(innerText)) {
      return renderToString(
        <span className="inline-block align-text-bottom w-5 h-5 m-0 relative">
          <img
            className="align-bottom"
            src={`/subway-icons/${innerText.toLowerCase()}.svg`}
            alt={innerText}
          />
        </span>
      );
    }

    return match;
  });
}

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [startingPoint, setStartingPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [directions, setDirections] = useState("");

  console.log("Streamed response: ", directions);

  const prompt = `Create numbered directions for using the New York City subway to get from '${startingPoint}' to '${destination}'.

Enclose each subway route letter or number in square brackets.`;

  const getDirections = async (e: any) => {
    e.preventDefault();
    setDirections("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setDirections((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>SubwayGPT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center text-center px-4 mt-4">
        <div className="max-w-xl w-full">
          <div className="flex mt-4 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
            />
            <p className="text-left font-medium">Enter your starting point</p>
          </div>
          <input
            value={startingPoint}
            onChange={(e) => setStartingPoint(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5 p-2"
            placeholder={"Starting point..."}
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Enter your destination</p>
          </div>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5 p-2"
            placeholder={"Destination..."}
          />

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => getDirections(e)}
            >
              Generate directions &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {directions && (
                <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                  <div
                    className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                    onClick={() => {
                      navigator.clipboard.writeText(directions);
                      toast("Directions copied to clipboard", {
                        icon: "✂️",
                      });
                    }}
                  >
                    <div className="text-left mt-5 w-full">
                      <span
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: processDirectionsText(directions),
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
