const express = require("express");

const router = express.Router();

const TweetSchema = require("../Models/Tweets");

const db = require("../DB/Connection");

const Tweet = db.get("tweets");

const fetchuser = require("../Middlewares/fetchuser");

// ROUTE 1 : MAKE a Tweet using POST : "/api/v1/tweets/makeTweet"
router.post("/makeTweet", async (req, res) => {
  try {
    // validate the body
    const tweet = await TweetSchema.validateAsync(req.body);
    if (tweet) {
      // insert to DB
      const createdTweet = await Tweet.insert(tweet);
      return res.status(200).json({
        message: "Tweet Send Success  🍰",
        value: createdTweet,
      });
    }
    return res.status(422).json({
      message: "Try to make post using valid credentials 😠",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Some Internal Server Error ❎",
      errorMessage: error.message,
    });
  }
});

// ROUTE 2 : Read One using POST  : "/api/v1/tweets/makeTweet/:id"
router.get("/readMyTweet/:id", async (req, res) => {
  try {
    // find user using id
    const { id } = req.params;
    const value = await Tweet.findOne({
      _id: id,
    });
    if (id) {
      return res.status(200).json({
        message: value,
      });
    }
    return res.status(422).json({
      message: "Not Found ❎",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Some Internal Server Error ❎",
      errorMessage: error.message,
    });
  }
});

// ROUTE 3 : UPDATE a Tweet using POST : "/api/v1/tweets/updateMyTweet/:id"
router.put("/updateMyTweet/:id", async (req, res) => {
  try {
    // validete the body
    const value = await TweetSchema.validateAsync(req.body);
    if (value) {
      // update it
      const { id } = req.params;
      const items = await Tweet.findOne({
        _id: id,
      });
      if (items) {
        const updatedTweet = await Tweet.update(
          {
            _id: id,
          },
          {
            $set: value,
          }
        );
        return res.status(200).json({
          message: "Tweet Update Success 🍰",
          info: value,
        });
      }
    }
    return res.status(200).json({
      message: "Not Found ❎",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Some Internal Server Error ❎",
      errorMessage: error.message,
    });
  }
});

// ROUTE 4: DELETE a TWEET using POST : "/api/v1/tweets/deleteMyTweet/:id"
router.delete("/deleteMyTweet/:id", async (req, res) => {
  try {
    // find the user id
    const { id } = req.params;
    await Tweet.remove({
      _id: id,
    });
    return res.status(201).json({
      message: "Success 😈",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Some Internal Server Error ❎",
      errorMessage: error.message,
    });
  }
});

// ROUTE 5: GET all Tweets usign GET : "/api/v1/tweets/getAllTweets"
router.get("/getAllTweets", async (req, res) => {
  try {
    // find all the twets
    const items = await Tweet.find();
    if (items) {
      return res.status(200).json({
        message: items,
      });
    }
    return res.status(500).json({
      message: "No Tweets to show ❎",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Some Internal Server Error ❎",
      errorMessage: error.message,
    });
  }
});

module.exports = router;
