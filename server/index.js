import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import multer from "multer";
import twilio from "twilio";
import dotenv from 'dotenv';
dotenv.config();
// import axios from "axios";
// import fs from "fs";

const uri =process.env.MONGODB_URI;
const port = process.env.PORT;

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const postcollection = client.db("database").collection("posts");
    const usercollection = client.db("database").collection("users");
    app.post("/register", async (req, res) => {
      const user = req.body;
      // console.log(user)
      const result = await usercollection.insertOne(user);
      res.send(result);
    });
    app.get("/loggedinuser", async (req, res) => {
      const email = req.query.email;
      const user = await usercollection.find({ email: email }).toArray();
      res.send(user);
    });
    // app.post("/post", async (req, res) => {
    //   const post = req.body;
    //   const result = await postcollection.insertOne(post);
    //   res.send(result);
    // });
    const getISTTime = () => {
      const now = new Date();
      const ISTOffset = 5.5 * 60 * 60 * 1000;
      return new Date(now.getTime() + ISTOffset);
    };

    const resetPostCountIfNeeded = async (user) => {
      const today = getISTTime().toDateString();
      const lastDate = user.lastPostDate
        ? new Date(user.lastPostDate).toDateString()
        : null;

      if (lastDate !== today) {
        await usercollection.updateOne(
          { email: user.email },
          {
            $set: {
              postsToday: 0,
              lastPostDate: getISTTime(),
            },
          }
        );

        // Returning updated user 
        return {
          ...user,
          postsToday: 0,
          lastPostDate: getISTTime(),
        };
      }

      return user;
    };

    app.post("/post", async (req, res) => {
      try {
        const post = req.body;
        let user = await usercollection.findOne({ email: post.email });

        if (!user) return res.status(404).json({ error: "User not found" });

        user = await resetPostCountIfNeeded(user);

        const followingCount = user.following.length || 0;
        const istTime = getISTTime();
        const hours = istTime.getHours();
        const minutes = istTime.getMinutes();

        // Post rules
        let allowed = false;

        if (followingCount === 0) {
          if (
            hours === 10 &&
            minutes >= 0 &&
            minutes <= 30 &&
            user.postsToday === 0
          ) {
            allowed = true;
          }
        } else if (followingCount === 2 && user.postsToday < 2) {
          allowed = true;
        } else if (followingCount > 10) {
          allowed = true;
        }

        if (!allowed) {
          return res.json({ message: "You cannot post right now." });
        }

        // Record post
        const result = await postcollection.insertOne(post);

        // Update user's post count and date in DB
        await usercollection.updateOne(
          { email: user.email },
          {
            $inc: { postsToday: 1 },
            $set: { lastPostDate: new Date() },
          }
        );

        res.json({ message: "Post successful", result });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal error" });
      }
    });

    // app.get("/post", async (req, res) => {
    //   const post = (await postcollection.find().toArray()).reverse();

    //   res.send(post);
    // });
    app.get("/post", async (req, res) => {
      const imagePosts = await postcollection
        .find({ photo: { $exists: true } })
        .toArray();
      const audioPosts = await postcollection
        .find({ data: { $exists: true } })
        .toArray();

      const formattedImagePosts = imagePosts.map((post) => ({
        _id: post._id,
        username: post.username,
        name: post.name,
        post: post.post,
        email: post.email,
        profilephoto: post.profilephoto,
        type: "image",
        mediaSrc: post.photo, 
      }));

      const formattedAudioPosts = audioPosts.map((post) => {
        const base64Data = post.data.buffer.toString("base64");
        const mediaSrc = `data:${post.contentType};base64,${base64Data}`;
        return {
          _id: post._id,
          username: post.username,
          name: post.name,
          post: post.post,
          email: post.email,
          profilephoto: post.profilephoto,
          type: "audio",
          mediaSrc,
        };
      });

      const allPosts = [
        ...formattedImagePosts,
        ...formattedAudioPosts,
      ].reverse();

      res.send(allPosts);
    });

    app.get("/userpost", async (req, res) => {
      const email = req.query.email;
      const post = (
        await postcollection.find({ email: email }).toArray()
      ).reverse();
      res.send(post);
    });
    app.get("/user", async (req, res) => {
      const user = await usercollection.find().toArray();
      res.send(user);
    });

    app.patch("/userupdate/:email", async (req, res) => {
      const filter = req.params;
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      const result = await usercollection.updateOne(filter, updateDoc, options);
      const result2 = await postcollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/users/:currentUserId/following/:post_email", async (req, res) => {
      const { currentUserId, post_email } = req.params;
      try {
        const currentUser = await usercollection.findOne({
          _id: new ObjectId(currentUserId),
        });

        if (!currentUser)
          return res.status(404).json({ message: "User not found" });

        const isFollowing = currentUser.following?.includes(post_email);
        res.send({ isFollowing });
      } catch (err) {
        res.status(500).json({ error: "Failed to check follow status" });
      }
    });

    app.post("/users/:currentUserId/follow", async (req, res) => {
      const { post_email } = req.body;
      const currentUserId = req.params.currentUserId;

      try {
        // Get current user (we need their email for follower field)
        const currentUser = await usercollection.findOne({
          _id: new ObjectId(currentUserId),
        });
        if (!currentUser)
          return res.status(404).json({ error: "Current user not found" });

        //  Find or create the target user
        let targetUser = await usercollection.findOne({ email: post_email });
        if (!targetUser) {
          const insertResult = await usercollection.insertOne({
            email: post_email,
            followers: [],
            following: [],
          });
          targetUser = { _id: insertResult.insertedId, email: post_email };
        }

        //  Update current user's following 
        await usercollection.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $addToSet: { following: post_email } }
        );

        // Updae target user's followers 
        await usercollection.updateOne(
          { email: post_email },
          { $addToSet: { followers: currentUser.email } }
        );

        res.status(200).json({ message: "Followed successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to follow user" });
      }
    });

    app.post("/users/:currentUserId/unfollow", async (req, res) => {
      const { post_email } = req.body;
      const currentUserId = req.params.currentUserId;

      try {
        // Fetch current userr
        const currentUser = await usercollection.findOne({
          _id: new ObjectId(currentUserId),
        });
        if (!currentUser)
          return res.status(404).json({ error: "Current user not found" });

        // Check if user to unfollow exist
        const userToUnfollow = await usercollection.findOne({
          email: post_email,
        });
        if (!userToUnfollow)
          return res.status(404).json({ error: "User to unfollow not found" });

        // Remove post_email from current user's following
        await usercollection.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $pull: { following: post_email } }
        );

        // Remove current user's email from target user's followers
        await usercollection.updateOne(
          { email: post_email },
          { $pull: { followers: currentUser.email } }
        );

        res.status(200).json({ message: "Unfollowed successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to unfollow user" });
      }
    });

    const sendEmailOTP = async (email, otp) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SENDER_EMAIL, 
          pass: process.env.EMAIL_PASS, 
        },
      });

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Your OTP for Audio Upload",
        text: `Your OTP is: ${otp}`,
      };

      await transporter.sendMail(mailOptions);
    };

    app.post("/send_otp/:email", async (req, res) => {
      const email = req.params.email;
      const otp = Math.floor(1000 + Math.random() * 9000); 
      const timeNow = getISTTime();

      try {
        await usercollection.updateOne(
          { email },
          { $set: { last_otp: otp, last_otp_time: timeNow } }
        );

        await sendEmailOTP(email, otp);

        res.status(200).json({ message: "OTP sent successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send OTP" });
      }
    });

    app.post("/verify_otp/:email", async (req, res) => {
      const email = req.params.email;
      const { otp: userOTP } = req.body;

      try {
        const user = await usercollection.findOne({ email });

        if (!user || !user.last_otp || !user.last_otp_time) {
          return res.status(400).json({ message: "OTP not generated" });
        }

        const dbOTP = user.last_otp;
        const otpTime = new Date(user.last_otp_time);
        const currentTime = getISTTime();
        const diffMinutes = (currentTime - otpTime) / (1000 * 60);

        if (Number(userOTP) === dbOTP && diffMinutes <= 10) {
          res.status(200).json({ message: "OTP verified" });
        } else {
          res.status(400).json({ message: "Invalid OTP or expired" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error verifying OTP" });
      }
    });
    // uploading audio starts here
    const upload = multer();

    app.post("/upload-audio", upload.single("audio"), async (req, res) => {
      const email = req.body.email;
      const profilephoto = req.body.profilephoto;
      const username = req.body.username;
      const name = req.body.name;
      const file = req.file;

      if (!file || !email) {
        return res.status(400).json({ error: "Missing file or email." });
      }

      try {
        const audioDoc = {
          email: email,
          profilephoto: profilephoto,
          username: username,
          name: name,
          filename: file.originalname,
          contentType: file.mimetype,
          data: file.buffer,
          uploadedAt: getISTTime(),
        };

        await postcollection.insertOne(audioDoc);
        res.json({ message: "Audio uploaded successfully" });
      } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Upload failed." });
      }
    });


    ////Switch language  task 5 ↓↓↓↓↓↓↓↓↓↓↓
    const otpStorage = {}; 

    // Replace with your credentials
    const emailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL, 
        pass: process.env.EMAIL_PASS, 
      },
    });
    const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    function generateOTP() {
      return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Email OTP
    app.post("/api/send-email-otp", (req, res) => {
      const { email } = req.body;
      const otp = generateOTP();
      otpStorage[email] = otp;

      emailTransport.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}`,
      });

      res.json({ success: true });
    });

    app.post("/api/verify-email-otp", (req, res) => {
      const { otp } = req.body;
      const valid = Object.values(otpStorage).includes(otp);
      res.json({ success: valid });
    });

    // SMS OTP
    app.post("/api/send-sms-otp", async (req, res) => {
      const { phone } = req.body;
      const otp = generateOTP();
      otpStorage[phone] = otp;

      await twilioClient.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILLIO_NUM, 
        to: phone,
      });

      res.json({ success: true });
    });

    app.post("/api/verify-sms-otp", (req, res) => {
      const { otp } = req.body;
      const valid = Object.values(otpStorage).includes(otp);
      res.json({ success: valid });
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Twiller is working");
});

app.listen(port, () => {
  console.log(`Twiller clone is workingon ${port}`);
});
