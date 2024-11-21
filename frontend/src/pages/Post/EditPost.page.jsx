import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMAIN from '../../services/endpoint';
import { TextInput, Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const form = useForm({
    initialValues: {
      title: '',
      category: '',
      image: '',
      content: '',
    },
  });

  useEffect(() => {
    setIsEditMode(true);
    axios.get(`${DOMAIN}/api/posts/${id}`)
      .then(response => {
        const { title, category, image, content } = response.data;
        form.setValues({ title, category, image, content });
      })
      .catch(error => console.error("Failed to fetch post details:", error));
  }, [id, form.setValues]);
  

  const handleSubmit = async (values) => {
    event.preventDefault(); // Prevent the default form submission action
    // Submit the updated post
    try {
      await axios.put(`${DOMAIN}/api/posts/${id}`, values);
      navigate(`/posts/${id}`); // Navigate to the post details page or wherever you see fit
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  return (
    <Box mx="auto" style={{ maxWidth: 400 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Title" {...form.getInputProps('title')} />
        <TextInput label="Category" {...form.getInputProps('category')} />
        <TextInput label="Image URL" {...form.getInputProps('image')} />
        <TextInput label="Content" {...form.getInputProps('content')} />
        <Group position="right" mt="md">
          <Button type="submit">Update Post</Button>
        </Group>
      </form>
    </Box>
  );
}

export default EditPostPage;
