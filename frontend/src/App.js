import { Box, Container, Typography } from '@mui/material';
import AddContent from './components/AddContent';
import QueryBox from './components/QueryBox';
import AnswerDisplay from './components/AnswerDisplay';
import ItemsList from './components/ItemsList';
// import './App.css';

function App() {
  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box textAlign="center" mb={2}>
        <Typography variant="h4" fontWeight={600}>
          Mind Vault
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Save notes and URLs. Ask questions. Get AI-powered answers.
        </Typography>
      </Box>
      <AddContent />
      <QueryBox />
      <AnswerDisplay />
      <ItemsList />
    </Container>
  );
}

export default App;
