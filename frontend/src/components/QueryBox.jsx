import { Paper, Typography, Box, Button, TextField, } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { askQuestion } from "../store/slices/querySlice";

const QueryBox = () => {
    const [question, setQuestion] = useState("");
    const { loading } = useSelector((state) => state.query)
    const dispatch = useDispatch();

    const handleAsk = () => {
        if (!question.trim()) return;
        dispatch(askQuestion({ question }));
        setQuestion("");
    }

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Ask a Question</Typography>

            <Box display="flex" gap={2}>
                <TextField
                    fullWidth
                    label="Ask anything about your saved content..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAsk}
                    disabled={loading || !question.trim()}
                    startIcon={loading ? <CircularProgress size={16} /> : <SearchIcon />}
                    sx={{ minWidth: 120 }}
                >
                    {loading ? 'Thinking...' : 'Ask AI'}
                </Button>
            </Box>
        </Paper>
    )
}

export default QueryBox;