import { Box, Chip, CircularProgress, Link, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../store/slices/itemsSlice";

const ItemsList = () => {
    const { list, loading } = useSelector((state) => state.items)
    const dispatch = useDispatch();
    const [expandedItems, setExpandedItems] = useState({});

    useEffect(() => {
        dispatch(fetchItems())
    }, [dispatch])

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const renderContent = (item) => {
        const content = item.content || "";
        const isExpanded = expandedItems[item.id];
        const limit = 150;

        if (content.length <= limit) {
            return <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{content}</Typography>;
        }

        return (
            <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                {isExpanded ? content : `${content.substring(0, limit)}...`}
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => toggleExpand(item.id)}
                    sx={{ color: "gray", textDecoration: "none" }}
                >
                    {isExpanded ? "show less" : "more"}
                </Link>
            </Typography>
        );
    };

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Saved Items ({list.length})</Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress />
                </Box>
            ) : list.length === 0 ? (
                <Typography color="text.secondary">No items yet. Add a note or URL above!</Typography>
            ) : (
                <List dense>
                    {list.map((item) => (
                        <ListItem key={item.id} divider sx={{ alignItems: 'flex-start', py: 2 }}>
                            <ListItemText
                                primary={renderContent(item)}
                                secondary={item.created_at}
                                sx={{ mr: 2 }}
                            />
                            <Chip
                                label={item.source_type}
                                size="small"
                                color={item.source_type === 'url' ? 'primary' : 'success'}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    )
}

export default ItemsList;
