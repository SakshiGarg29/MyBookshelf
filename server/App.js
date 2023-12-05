const api_helper = require("./api-helper");
const postEntry = require("./PostEntryMDB");
const postEntries = require("./PostEntriesMDB");
const replaceEntry = require("./ReplaceEntryMDB");
const getEntry = require("./GetEntryMDB");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 443;

app.use(express.static("public"));

app.get("/api/search-books", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  api_helper
    .make_Google_API_call(
      "https://www.googleapis.com/books/v1/volumes?q=" + req.query.search
    )
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.post("/api/my-books", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  console.log("/api/my-books");
  let result = await getEntry({ username: req.query.userid });
  result.interestedIn.push(req.query.bookurl);
  await replaceEntry({ username: req.query.userid }, result);
  res.send("done--post");
});

app.post("/api/my-books/delete", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  console.log("/api/my-books/delete");
  console.log(req.query.userid);
  console.log(req.query.bookurl);
  let result = await getEntry({ username: req.query.userid });
  result.interestedIn = result.interestedIn.filter(
    (x) => x !== req.query.bookurl
  );
  console.log(result);
  await replaceEntry({ username: req.query.userid }, result);
  res.send("done--delete");
});

app.post("/api/login", bodyParser.json(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  console.log("/api/login");
  console.log(req.query.userid);
  console.log(req.query.password);
  console.log(req.body);
  let result = await getEntry({ username: req.query.userid });
  console.log(result);

  if (result === null) {
    return res.send([]);
  } else if (result.password === req.query.password) {
    delete result.password;
    res.send([result]);
  } else {
    return res.send([]);
  }
});

app.post("/api/signup", bodyParser.json(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  console.log("/api/login");
  console.log(req.query.userid);
  console.log(req.query.password);
  console.log(req.query.name);
  console.log(req.body);
  let result = await getEntry({ username: req.query.userid });
  console.log(result);

  if (
    result !== null ||
    !req.query.userid ||
    !req.query.password ||
    !req.query.name
  ) {
    return res.send([]);
  } else {
    const user = {
      name: req.query.name,
      interestedIn: [],
      username: req.query.userid,
      password: req.query.password,
    };
    await postEntry(user);
    let signupuser = await getEntry({ username: req.query.userid });
    return res.send([signupuser]);
  }
});

app.get("/api/init", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const insertManyResult = "None";
  const books = [
    {
      name: "user_1",
      interestedIn: [
        "https://www.googleapis.com/books/v1/volumes/qBxhhMkSLRMC",
        "https://www.googleapis.com/books/v1/volumes/oAXHCgAAQBAJ",
      ],
    },
    {
      name: "user_2",
      interestedIn: [
        "https://www.googleapis.com/books/v1/volumes/xr6nEAAAQBAJ",
        "https://www.googleapis.com/books/v1/volumes/Q-LQCwAAQBAJ",
      ],
    },
  ];
  console.log(postEntry);
  try {
    insertManyResult = await postEntries(books);
    console.log(
      `${insertManyResult.insertedCount} documents successfully inserted.\n`
    );
  } catch (err) {
    console.error(
      `Something went wrong trying to insert the new documents: ${err}\n`
    );
  }

  res.send(insertManyResult);
});

app.get("/api/shelf/find", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  console.log("/api/shelf/find");
  console.log(req.query.userid);
  let reponseData = [];
  console.log(getEntry);
  try {
    let result = await getEntry({ username: req.query.userid });
    console.log(result);

    Promise.all(
      result?.interestedIn.map((element) =>
        api_helper.make_Google_API_call(element)
      )
    )
      .then((results) => {
        results.forEach((item) => {
          reponseData.push(JSON.parse(item));
        });
        res.send(reponseData);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.error(
      `Something went wrong trying to insert the new documents: ${err}\n`
    );
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
