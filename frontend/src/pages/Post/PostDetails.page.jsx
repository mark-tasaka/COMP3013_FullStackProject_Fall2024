import { Link, useLoaderData, useParams, useNavigate } from "react-router-dom";
import DOMAIN from "../../services/endpoint";
import axios from "axios";
import { Button, Container, Avatar, Text, Group } from "@mantine/core";
import classes from './Post.module.css';
import useBoundStore from '../../store/Store'; // Adjust the import path as necessary
import { useEffect, useState } from "react";

export function PostDetailsPage() {
 const postData = useLoaderData();
   // Access user and authentication status

  const [post, setPost] = useState(null); // Initialize state to null indicating no data initially
  const { id } = useParams(); // id of the post
   const user = useBoundStore(state => state.user );
   const navigate = useNavigate();

   useEffect(() => {
     const fetchPostDetails = async () => {
       try {
         const response = await axios.get(`${DOMAIN}/api/posts/${id}`);
         console.log("Fetched post details:", response.data); // Log fetched post
         setPost(response.data); // Update the state with the fetched data
       } catch (error) {
         console.error("Error fetching post details:", error);
       }
     };
 
     fetchPostDetails();
   }, [id]);
 
   if (!post) {
     return <div>Loading post...</div>; // Show a loading message or spinner instead
   }
  return (
    <>
      <Container className={classes.container}>
        <div>
      <Group wrap="nowrap">
        <Avatar
          src={postData.image}
          size={350}
          radius="md"
        />
        <div>
        <Text fz="lg" fw={500} className={classes.name}>
          <span className={classes.categoryName}>Author</span>: {post.authorName} 
        </Text>
         

          <Text fz="lg" fw={500} className={classes.name}>
          <span className={classes.categoryName}>Title:</span> {postData.title} 
          </Text>
          
          <Text fz="lg" fw={500} className={classes.name}>
          <span className={classes.categoryName}>Category:</span> {postData.category}
          </Text>
          
          
          <Text fz="lg" fw={500} className={classes.name}>
          <span className={classes.categoryName}>Content:</span> {postData.content}
          </Text>

          
          {user && user.id === post.userId && (
          <Button 
            onClick={() => navigate(`/posts/edit/${post.id}`)}>
            Edit
          </Button>
        )}

      </div>
      

          </Group>

    </div>

        <Button mt={50}>
          <Link to="/posts">Back to Posts</Link>
        </Button>
      </Container>
    </>
  );
}

export const postDetailsLoader = async ({ params }) => {
  const { id } = params;
  try {
    const response = await fetch(`${DOMAIN}/api/posts/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch post details");
    }

    const postDetails = await response.json();
    return postDetails;
  } catch (error) {
    console.error("Error fetching post details:", error);
    return null;
  }
};


export default PostDetailsPage;
