var bucketName = "swaralipi";
var bucketRegion = "us-east-2";
var IdentityPoolId = "us-east-2:8cb91142-513c-4060-9b81-7f2948eddc96";
var files = [];

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
  }),
});

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: bucketName },
});

$(document).ready(function () {
  $("#file-input").on("change", function () {
    for (var i = 0; i < this.files.length; i++) {
      addTr(this.files[i]);
    }
  });

  // s3.listObjects("", (err, data) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(data);
  //   }
  // });

  // s3.deleteObject({Key:"ola"}, (err, data) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(data);
  //   }
  // });
});

function upload() {
  files.forEach((file) => {
    s3.upload(
      {
        Key: file.name,
        Body: file,
        Metadata: {
          Singer: "",
          Author: "",
          Category: "",
        },
      },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      }
    ).on("httpUploadProgress", ({ loaded, total }) => {
      console.log(loaded, total);
    });
  });
}

async function addTr(file) {
  files.push(file);

  let exifData = await exifr.parse(file, true);

  if (exifData == undefined) {
    return;
  }
  let singer,
    author,
    category = "";

  if (exifData.Singer) {
    singer = exifData.Singer;
  }

  if (exifData.Author) {
    author = exifData.Author;
  }

  if (exifData.Category) {
    category = exifData.Category;
  }

  $("table tbody").append(
    "<tr><td><input type='text' class='form-control-plaintext' value='" +
      getFileNameWithoutExt(file.name) +
      "'readonly </td>" +
      "<td><input type='text' class='form-control' value='" +
      singer +
      "'/></td>" +
      "<td><input type='text' class='form-control' value='" +
      author +
      "'/></td>" +
      "<td><input type='text' class='form-control' value=''/></td>" +
      "</tr>"
  );
}

function getFileNameWithoutExt(filename) {
  return filename.substring(0, filename.lastIndexOf(".")) || filename;
}
