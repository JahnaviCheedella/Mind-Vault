import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Alert, Button, Paper, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import LinkIcon from '@mui/icons-material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import { clearMessages, fetchItems, ingestContent } from "../store/slices/itemsSlice";

const AddContent = () => {
    const [sourceType, setSourceType] = useState("text");
    const [content, setContent] = useState("");
    const { ingestLoading, error, successMessage } = useSelector((state) => state.items);
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        if (!content.trim()) return;
        await dispatch(ingestContent({ content, source_type: sourceType })).unwrap();
        dispatch(fetchItems());
        setContent("");
        setTimeout(() => { dispatch(clearMessages()) }, 3000)
    }

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Add Content</Typography>

            <ToggleButtonGroup
                value={sourceType}
                exclusive
                onChange={(_, val) => val && setSourceType(val)}
                sx={{ mb: 2 }}
            >
                <ToggleButton value="text"><NoteAddIcon sx={{ mr: 1 }} />Text Note</ToggleButton>
                <ToggleButton value="url"><LinkIcon sx={{ mr: 1 }} />URL</ToggleButton>
            </ToggleButtonGroup>

            <TextField
                fullWidth
                multiline={sourceType === 'text'}
                rows={sourceType === 'text' ? 4 : 1}
                label={sourceType === 'text' ? 'Enter your note...' : 'Enter URL (https://...)'}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={ingestLoading || !content.trim()}
                startIcon={ingestLoading ? <CircularProgress size={16} /> : null}
            >
                {ingestLoading ? "Saving..." : "Save"}
            </Button>

            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Paper>
    )
}

export default AddContent;
