require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "../public")));
app.use(
  "/NODE_MODULES",
  express.static(path.join(__dirname, "../../node_modules"))
);
app.use(
  "/images",
  express.static(path.join(__dirname, "../public/assets/images"))
);

// your API calls

// example API call
app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

app.get("/rover-gallery", async function (req, res) {
  let galleryEP = `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.query.name}/photos?api_key=${process.env.API_KEY}`;
  const manifestEP = `https://api.nasa.gov/mars-photos/api/v1/manifests/${req.query.name}?api_key=${process.env.API_KEY}`;
  try {
    const manifest = await fetch(manifestEP).then((meta) => meta.json());
    const {
      name,
      landing_date: landingEpoch,
      launch_date: launchEpoch,
      max_sol: maxSol,
      max_date,
      status,
      total_photos: gallerySize,
    } = manifest.photo_manifest || {};
    let camera = "&camera=NAVCAM";
    //hardly any photos taken by spirit and opportunity beyond this range hance - 300
    const sol = `&sol=${maxSol - 300}`;
    if (req.query.name.toLowerCase() !== "curiosity") {
      camera = "";
    }
    galleryEP = `${galleryEP}${sol}${camera}&page=1`;
    const photos = await fetch(galleryEP)
      .then((album) => album.json())
      .then((json) => json.photos);
    res.json({
      manifest: {
        name,
        "landed on": landingEpoch,
        "launched on": launchEpoch,
        status,
        "total photos taken": gallerySize,
        "most recently active": max_date,
      },
      photos,
      albumSize: photos.length,
    });
  } catch (error) {
    console.log("error:", error);
  }
});

app.listen(port, () =>
  console.log(`Mars App Server listening on port ${port}!`)
);
