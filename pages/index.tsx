import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import { renderToString } from "react-dom/server";
import { Switch } from "@headlessui/react";
import { useQueryState } from "next-usequerystate";
import Banner from "../components/Banner";

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
  const [startingPoint, setStartingPoint] = useQueryState("startingPoint");
  const [destination, setDestination] = useQueryState("destination");
  const [includeCurrentTime, setIncludeCurrentTime] = useState(false);
  const [directions, setDirections] = useState("");
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    if (localStorage?.getItem("warning-dismissed") !== null) {
      setBannerVisible(false);
    } else {
      setBannerVisible(true);
    }
  }, []);

  // console.log("Streamed response: ", directions);

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
        startingPoint,
        destination,
        ...(includeCurrentTime && {
          time: new Date().toLocaleString(),
        }),
      }),
    });

    // console.log("Edge function returned.");

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
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen bg-black text-white">
      <Head>
        <title>SubwayGPT</title>
      </Head>
      <Header />
      {bannerVisible && (
        <Banner
          title="Warning"
          description=<>
            This is just for fun/learning and should not be considered accurate!
            Some more info can be found{" "}
            <a
              className="underline font-bold"
              href="https://github.com/cedarbaum/subway-gpt/blob/main/README.md#this-doesnt-work-all-that-well"
              target="_"
            >
              here
            </a>
            .
          </>
          onClose={() => {
            localStorage?.setItem("warning-dismissed", "true");
            setBannerVisible(false);
          }}
        />
      )}
      <main className="flex flex-1 w-full flex-col items-center text-center px-4 mt-4">
        <div className="max-w-xl w-full">
          <div className="flex mt-4 items-center space-x-3">
            <p className="text-left font-medium">Enter your starting point</p>
          </div>
          <input
            value={startingPoint ?? ""}
            onChange={(e) => setStartingPoint(e.target.value)}
            className="text-black w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5 p-2"
            placeholder={"Starting point..."}
          />
          <div className="flex items-center space-x-3">
            <p className="text-left font-medium">Enter your destination</p>
          </div>
          <input
            value={destination ?? ""}
            onChange={(e) => setDestination(e.target.value)}
            className="text-black w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5 p-2"
            placeholder={"Destination..."}
          />
          <div className="flex justify-between">
            <label>Include current time</label>
            <Switch
              checked={includeCurrentTime}
              onChange={setIncludeCurrentTime}
              as={Fragment}
            >
              {({ checked }) => (
                <button
                  className={`${
                    checked ? "bg-blue-600" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Include current time</span>
                  <span
                    className={`${
                      checked ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </button>
              )}
            </Switch>
          </div>
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
                    className="rounded-xl shadow-md p-4 transition cursor-copy border"
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
