const express = require('express');
const cors = require('cors');
const groupIssuesRouter = require('./routes/groupIssues');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());

app.use(cors({ origin: 'http://localhost:8080' }));

app.use('/api/group-issues', groupIssuesRouter);

app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => {
  console.log(`Middleware is running on port ${PORT}`);
});