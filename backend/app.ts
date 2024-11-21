import express from "express";

//add from solution
import { Request, Response, NextFunction } from "express";

import cors from "cors";
import jwt from "jsonwebtoken";
import {
  findUserById,
  IDecodedUser,
  verifyUser,
  parseToken,
  addPost,
  posts,
  sleep,
} from "./fakedb";

//from solution
declare global {
  namespace Express {
    interface Request {
      user?: IDecodedUser;
    }
  }
}


//Mark Tasaka

const port = 8085;
const app = express();
app.use(cors());
app.use(express.json());




// TODO: Obviously use a more secure signing key than "secret"
app.post("/api/user/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const user = verifyUser(email, password);
    const token = jwt.sign({ id: user.id }, "secret", {
      expiresIn: "2 days",
    });
    res.json({ result: { user, token } });
  } catch (error) {
    res.status(401).json({ error });
  }
});

app.post("/api/user/validation", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = parseToken(authHeader, res);
    const decodedUser = jwt.verify(token, "secret");
    const user = findUserById((decodedUser as IDecodedUser).id);
    res.json({ result: { user, token } });
  } catch (error) {
    res.status(401).json({ error });
  }
});

app.get("/api/posts", async (_, res) => {
  // Sleep delay goes here
  //1 second delay
  await sleep(1000);
  res.json(posts);
});

// ⭐️ TODO: Implement this yourself
app.get("/api/posts/:id", (request, response) => {
  const id = request.params.id; // "2"
  // Find post by ID
  const post = posts.find((post) => post.id === parseInt(id));

  if (!post) {
    return response.status(404).json({ error: "Post not found" });
  }

  // Add author name by truncating email
  const user = findUserById(post.userId);

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  const authorName = user.email.substring(0, user.email.indexOf("@"));

  // Return the detailed post
  return response.json({
    ...post,
    authorName, // For display
    userId: post.userId, // Include if needed for logic but keep hidden on the frontend
  });
});
/**
 * Problems with this:
 * (1) Authorization Issues:
 *     What if you make a request to this route WITHOUT a token?
 *     What if you make a request to this route WITH a token but
 *     it's invalid/expired?
 * (2) Server-Side Validation Issues:
 *     What if you make a request to this route with a valid token but
 *     with an empty/incorrect payload (post)
 */
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = parseToken(req.headers.authorization, res);
    const decodedUser = jwt.verify(token, "secret") as IDecodedUser;
    const user = findUserById(decodedUser.id);

    // Add the user information to the request object
    req.user = user;
    next(); // Pass control to the next middleware function
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

app.post("/api/posts", authenticate, (req, res) => {
  if (!req.user) {
    return res.status(403).json({ error: "User must be logged in." });
  }
  const incomingPost = req.body;
  const userIdFromToken = req.user.id;
  addPost(incomingPost, userIdFromToken);
  res.status(200).json({ success: true });
});

app.put("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  const updatedPostData = req.body; // This contains the updated post data from the form

  const postIndex = posts.findIndex((post) => post.id === parseInt(id));
  if (postIndex === -1) {
    return res.status(404).send({ success: false, message: "Post not found" });
  }

  posts[postIndex] = { ...posts[postIndex], ...updatedPostData };
  res.send({ success: true, post: posts[postIndex] });
});

app.listen(port, () => console.log("Server is running"));
