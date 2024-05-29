import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

let posts = [];
let id = 0;

app.get("/", (req, res) => {
  res.render("landing.ejs");
});

app.get("/create-post", (req, res) => {
  res.render("create-post.ejs");
});

app.get("/view-posts", (req, res) => {
  res.render("view-posts.ejs",{posts:posts});
});

app.get("/contact-me", (req, res) => {
  res.render("contact-me.ejs");
});

app.post("/submit-post", (req, res) => {
  const { author, title, content } = req.body;
  const newPost = {
    author,
    title,
    content, id};
  posts.push(newPost);
  id+=1;
  res.render("view-posts.ejs",{posts:posts})
});

app.get("/edit-post/:postId", (req, res) => {
  const postId = req.params.postId;
  const postToEdit = posts.find(post => post.id === parseInt(postId));
  if (!postToEdit) {
    res.status(404).send("Post not found");
  } else {
    res.render("edit-post.ejs", { post: postToEdit });
  }
});

// Handle edit post submission
app.post("/edit-post/:postId", (req, res) => {
  const postId = req.params.postId;
  const { author, title, content } = req.body;
  const postIndex = posts.findIndex(post => post.id === parseInt(postId));
  if (postIndex === -1) {
    res.status(404).send("Post not found");
  } else {
    posts[postIndex] = { ...posts[postIndex], author, title, content };
    res.redirect("/view-posts");
  }
});

app.post("/delete-post/:postId", (req, res) => {
  const postId = req.params.postId;
  const postIndex = posts.findIndex(post => post.id === parseInt(postId));
  if (postIndex === -1) {
    res.status(404).send("Post not found");
  } else {
    posts.splice(postIndex, 1); // Remove the post from the array
    res.redirect("/view-posts");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});