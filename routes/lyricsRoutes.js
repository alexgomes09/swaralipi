import Lyrics from "../models/Lyrics.js";
import { google } from "googleapis";
import app from "../server.js";
import config from "../config/config.js";
import { DynamoDBClient, BatchExecuteStatementCommand } from "@aws-sdk/client-dynamodb";

const scopes = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
];
const auth = new google.auth.JWT(
  config.CLIENT_EMAIL,
  null,
  config.PRIVATE_KEY,
  scopes
);
const drive = google.drive({ version: "v3", auth });

function lyricsRoutes() {
  app.post("/searchLyrics", function (req, res) {
    console.log("/searchLyrics");
    
    const query = {
      $or: [
        { name: { $regex: req.body.q, $options: "i" } },
        { type: { $regex: req.body.q, $options: "i" } },
        { singer: { $regex: req.body.q, $options: "i" } },
        { author: { $regex: req.body.q, $options: "i" } },
      ],
    };

    Lyrics.find(query)
      .limit(20)
      .then(function (data) {
        console.log(data)
        if (data) {
          return res.status(200).json(data);
        } else {
          return res.status(422).json("No data");
        }
      })
      .catch(function (error) {
        return res.status(500).send({
          success: false,
          message:
            "Encountered error while processing request, kindly try again",
          error: error,
        });
      });
  });
}

async function getFileByID(fileId) {
  try {
    return await drive.files.get({
      q: "mimeType: 'image/jpeg' and trashed=false",
      pageSize: 1,
      fileId: fileId,
      fields: "id, name, description",
    });
  } catch (error) {
    throw error;
  }
}

async function getFiles(pageToken) {
  try {
    return await drive.files
      .list({
        pageSize: 1000,
        q: "mimeType: 'image/jpeg' and trashed=false",
        fields: "files(id,name,description,parents),nextPageToken",
        pageToken: pageToken,
      })
      .then((res) => res.data);
  } catch (error) {
    throw error;
  }
}

// getFolders().then((folders) => {
//   getFiles().then((data) => {
//     data.files.map((file) => {
//       if (file.parents.length > 0) {
//         file.parents = getParentFolderName(folders, file.parents[0]);
//       }

//       storeLyrics(file);
//     });
//   });
// });


function storeLyrics(file) {
  if (!file) return;

  const description = file.description ? file.description : "";
  const fileId = file.id;
  const name = app.getFileNameWithoutExt(file.name);
  var singer = "";
  var author = "";

  if (!name || !fileId) {
    return;
  }

  if (description) {
    description.split(",").forEach((element) => {
      if (element.includes("singer")) {
        singer = element.split(":")[1].trim();
      } else if (element.includes("author")) {
        author = element.split(":")[1].trim();
      }
    });
  }

  const url = "https://drive.google.com/uc?export=view&id=" + fileId;

  var lyrics = new Lyrics();
  lyrics.fileId = fileId;
  lyrics.name = name;
  lyrics.type = file.parents;
  lyrics.singer = singer;
  lyrics.author = author;
  lyrics.url = url;

  Lyrics.findOneAndUpdate(
    { fileId: fileId },
    lyrics,
    { upsert: true, new: true, setDefaultsOnInsert: true },
    function (err, lyrics) {
      if (err) {
        // res.status(400).send({
        //   success: false,
        //   message: "Error saving the lyrics:",
        //   err: err,
        // });
        console.log(err.message);
      } else {
        console.log(lyrics);
        // res.status(200).send({
        //   success: true,
        //   message: "Successfully created lyrics",
        //   lyrics: lyrics,
        // });
      }
    }
  );
}

async function getFolders() {
  try {
    return await drive.files
      .list({
        q: "(mimeType = 'application/vnd.google-apps.folder') and trashed=false",
        fields: "files(id, name)",
      })
      .then((res) => {
        res.data.files.map((e) => {
          e.name = app.removeAllDigits(e.name);
        });

        return res.data.files;
      });
  } catch (error) {
    throw error;
  }
}

function getParentFolderName(array, parentFolderId) {
  return array.find((o) => o.id === parentFolderId).name.trim();
}

// var job = new cron.CronJob(
//   "*/10 * * * * *", //'* * 0 * * *' every day at 12am
//   function () {
//     console.log(job.nextDates().c);
//   },
//   null,
//   true,
//   "America/Toronto"
// );

export default lyricsRoutes;

//https://drive.google.com/uc?id=1Hzik1L7JKQZhDz0dDsPIdbGQARFy8o-W
