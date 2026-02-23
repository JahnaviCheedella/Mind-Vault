import { Alert, Box, Card, CardContent, Chip, Divider, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const AnswerDisplay = () => {
    const { answer, sources, error } = useSelector((state) => state.query)

    if (!answer && !error) return null;

    return (
        <Paper elevation={3} sx={{ p: 3, borderLeft: '4px solid #7c3aed' }}>
            <Typography variant="h6" gutterBottom>AI Answer</Typography>

            {error && <Alert severity="error">{error}</Alert>}

            {answer && (
                <>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        {answer}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Sources Used:
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={1}>
                        {sources.map((source, i) => (
                            <Card key={i} variant="outlined" sx={{ bgcolor: '#f9fafb' }}>
                                <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                                    <Chip
                                        label={source.source_type}
                                        size="small"
                                        sx={{ mb: 1 }}
                                        color={source.source_type === 'url' ? 'primary' : 'success'}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {source.content}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </>
            )}
        </Paper>
    )
}

export default AnswerDisplay;