// @ts-nocheck
import Layout from "@/components/Layout";
import { getSession } from "next-auth/react";
import ColorThief from "colorthief";
import { useRef, useState } from "react";
import Head from "next/head";

export default function Home({ topTracksData, usersPlaylists }) {
  const canvasRef = useRef(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [tracks, setTracks] = useState(null);

  async function generateDominantColors() {
    const tracks = topTracksData.items;
    setTracks(
      tracks.map((track) => {
        return `${track.name} - ${track.artists[0].name}`;
      })
    );
    const dominantColors = await Promise.all(
      tracks.map((track) => {
        const img = new Image();
        img.src = track.album.images[2].url;
        img.crossOrigin = "Anonymous";
        return new Promise((resolve) => {
          img.onload = () => {
            const colorThief = new ColorThief();
            const color = colorThief.getColor(img);
            resolve(color);
          };
        });
      })
    );
    return dominantColors;
  }

  async function generateImage() {
    const colors = await generateDominantColors();
    setIsGenerated(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    const rectPerRow = 10;
    const imageWidth = canvas.width / 10;
    let imageHeight = canvas.height / Math.ceil(colors.length / rectPerRow);
    for (let i = 0; i < colors.length; i++) {
      let x = (i % rectPerRow) * imageWidth;
      let y = Math.floor(i / rectPerRow) * imageHeight;
      ctx.fillStyle = `rgb(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]})`;
      ctx.fillRect(x, y, imageWidth, imageHeight);
    }
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = canvas.toDataURL();
    link.click();
  }

  return (
    <>
      <Head>
        <title>Spotify Pattern</title>
      </Head>
      <Layout>
        {topTracksData.items && usersPlaylists ? (
          <div className="flex w-full flex-col items-center space-y-4 py-8">
            <div>
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-4 py-2 transition"
                onClick={() => generateImage()}
              >
                Generate
              </button>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <canvas ref={canvasRef} width={500} height={500} />
              {isGenerated && (
                <div>
                  <button
                    type="button"
                    className="text-white bg-green-700 hover:bg-green-800 rounded-lg text-sm px-4 py-2 transition"
                    onClick={() => handleDownload()}
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
            {isGenerated && (
              <div className="max-w-4xl">
                <ul className="grid grid-cols-10 text-xs text-gray-800 list-none gap-4">
                  {tracks.map((track, i) => {
                    return (
                      <li key={i} className="flex items-center text-center">
                        {track}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  const res = await fetch("https://spotify-pattern.vercel.app/api/spotify", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token.accessToken}`,
    },
  });
  const { topTracksData, usersPlaylists } = await res.json();
  return {
    props: {
      topTracksData,
      usersPlaylists,
    },
  };
}
