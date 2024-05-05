import Image from "next/image";
import Link from "next/link";

import {
  roofRunningImg,
  laundromatImg,
  lockpickImg,
  repairKitImg,
  smokecrackImg,
  wordMemoryImg,
  choppingImg,
  thermiteImg,
} from "@/public/images/puzzles";

const puzzles = [
  {
    href: "/puzzles/thermite",
    img: thermiteImg,
    title: "Thermite",
    description:
      "Replica of the Thermite hack that is triggered when disabling lasers inside the Maze Bank on NoPixel 4.0",
  },
  {
    href: "/puzzles/roof-running",
    img: roofRunningImg,
    title: "Roof Running",
    description: "Replica of the Roof Running hack that is triggered when robbing AC-Units on NoPixel 4.0"
  },
  {
    href: "/puzzles/laundromat",
    img: laundromatImg,
    title: "Laundromat",
    description: "Replica of the Laundromat hack that is triggered when robbing the safe inside the south-side Laundromat on NoPixel 4.0"
  },
  {
    href: "/puzzles/lockpick",
    img: lockpickImg,
    title: "LockPick",
    description: "Replica of the LockPick hack that is triggered when lockpicking vehicles, among other things, on NoPixel 4.0"
  },
  {
    href: "/puzzles/repair-kit",
    img: repairKitImg,
    title: "RepairKit",
    description: "Replica of the RepairKit hack that is triggered when repairing vehicles on NoPixel 4.0"
  },
  {
    href: "SmokeCrack/SmokeCrack.html",
    img: smokecrackImg,
    title: "SmokeCrack",
    description: "Replica of the SmokeCrack hack that is triggered through the in-game PC when hacking Wi-Fi's on NoPixel 4.0"
  },
  // This doesn't work.
  //
  // {
  //   href: "/puzzles/word-memory",
  //   img: wordMemoryImg,
  //   title: "Word Memory",
  //   description: ""
  // },
  {
    href: "/puzzles/chopping",
    img: choppingImg,
    title: "Chopping",
    description: ""
  }
]

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center p-5 gap-5 ">
        <div className="
          w-full max-w-2xl
          p-5 mx-auto
          flex items-center flex-col
          rounded-lg
          shadow

          bg-mirage-900/50
        ">
          <h1 className="text-white text-5xl m-0 pb-5">NoPixel Hacking Simulator</h1>
          <p className="
            text-white
            text-xl
            text-center

            *:text-spring-green-300 hover:*:text-aquamarine-300
            ">
            Hover over the below <a>images</a> to discover the minigames that are currently available. For more
            information checkout the <Link href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0">GitHub Repository</Link>.
          </p>
        </div>
        <div className="flex flex-wrap justify-center max-w-4xl mx-auto">
          {puzzles.map((puzzle, index) => {
            return (
              <div className="flex-item m-2 p-2 rounded-lg text-center relative overflow-hidden bg-spring-green-300 shadow" key={index}>
                <Link href={puzzle.href} className="">
                  <Image
                      src={puzzle.img}
                      alt={puzzle.title}
                      width={250}
                      height={140}
                      className="rounded"
                  />
                  <div className="
                    absolute
                    top-0
                    left-0
                    w-full h-full
                    opacity-0
                    flex justify-center flex-col items-center
                    transition
                    duration-500
                    ease-in-out
                    bg-black/50

                    text-white
                    text-center

                    hover:opacity-100
                  ">
                    <h2 className="text-3xl">{puzzle.title}</h2>
                    <p className="text-xs max-w-[80%]">{puzzle.description}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="
          w-full max-w-2xl
          p-5 mx-auto
          flex flex-col items-center
          shadow
          rounded-lg

          text-white
          text-center

          bg-mirage-900/50
        ">
          <h2 className="text-5xl pb-5">Highscores</h2>
          <p className="text-xl max-w-[80%]">Coming soon...</p>
        </div>
      </main>
  );
}
