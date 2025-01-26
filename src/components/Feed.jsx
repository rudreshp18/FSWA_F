import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, TextField, CardMedia, Avatar, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';

const FeedDisplay = ({ feeds }) => {
    return (
        <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
            gap={4}
            sx={{
                maxHeight: "75vh",
                overflowY: 'auto',
                borderRadius: 1,
                p: 1,
                mb: 2,
            }}
        >
            {feeds.map((feed) => (
                <Card key={feed._id} sx={{ boxShadow: 2, borderRadius: 2 }}>
                    {/* Image */}
                    <CardMedia
                        component="img"
                        height="200"
                        image={feed.uploads[0]} // Displaying First Image
                        alt="Post image"
                        sx={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                    />

                    <CardContent>
                        {/* User Info */}
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            <Avatar>{feed.user.username[0]}</Avatar>
                            <Typography variant="subtitle1" color="text.primary">
                                {feed.user.username}
                            </Typography>
                        </Stack>

                        {/* Post Description */}
                        <Typography variant="body2" color="text.secondary">
                            {feed.desc}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default function Feed() {
    const [feeds, setFeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [caption, setCaption] = useState('');

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: 'none',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
    };

    // Fetching Feeds
    useEffect(() => {
        retrieveFeeds();
    }, []);

    const retrieveFeeds = async () => {
        try {
            const response = await toast.promise(axios.get(`${import.meta.env.VITE_SERVER}/feed/feeds`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('acTk')}`
                },
            }), {
                pending: 'Loading !'
            });

            if (response.status === 200) {
                if (response.data.posts.length > 0) {
                    setFeeds(response.data.posts);
                }
            }

            setLoading(false)
        } catch (error) {
            console.error('Error retrieving feed:', error.message);
            setLoading(false)
        }
    };


    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        setFiles(files);
        setSelectedImages(imageUrls);
    };

    const handleSubmit = async () => {
        if (selectedImages.length === 0) return;

        const formData = new FormData();

        formData.append('desc', caption);

        files.forEach((file) => {
            formData.append('photos', file);
        });

        try {
            const response = await toast.promise(axios.post(`${import.meta.env.VITE_SERVER}/feed/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${sessionStorage.getItem('acTk')}`
                },
            }), {
                pending: 'Posting Feed!'
            });

            if (response.status === 201) {
                handleClose();
                retrieveFeeds();
            }

            console.log('Feed posted successfully:', response.data);
        } catch (error) {
            console.error('Error posting feed:', error.message);
            toast.error('Error posting feed. Please try again.');
            handleClose();
        }

    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Typography variant="h4" mb={3} color="text.primary">
                Recent Feeds
            </Typography>
            {feeds.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No feeds available.
                </Typography>
            ) : (
                <FeedDisplay feeds={feeds} />
            )}
            <button className="bg-slate-300 outline-none border-none text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-100 transition-all absolute bottom-0 right-0" onClick={handleOpen}> Post Feed </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-title" variant="h6" component="h2" mb={2}>
                        Post Something!
                    </Typography>

                    {/* File Input */}
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<PhotoCamera />}
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        Select Photos
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={handleFileSelect}
                        />
                    </Button>

                    {/* Displaying Selected Images */}
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        gap={2}
                        sx={{
                            maxHeight: 200,
                            overflowY: 'auto',
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            p: 1,
                            mb: 2,
                        }}
                    >
                        {selectedImages.length > 0 ? (
                            selectedImages.map((image, index) => (
                                <Box
                                    key={index}
                                    component="img"
                                    src={image}
                                    alt={`Selected ${index + 1}`}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        border: '1px solid #ddd',
                                    }}
                                />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No photos selected.
                            </Typography>
                        )}
                    </Box>

                    {/* Caption Input */}
                    <TextField
                        label="Add Caption"
                        multiline
                        rows={3}
                        fullWidth
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    {/* Submit Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>
            <ToastContainer />
        </Box>
    );
}