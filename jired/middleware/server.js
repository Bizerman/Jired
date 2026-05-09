const express = require('express');
const cors = require('cors');
const groupIssuesRouter = require('./routes/groupIssues');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware для парсинга JSON
app.use(express.json());
// Разрешаем запросы с твоего фронтенда (порт 8080 обычно)
app.use(cors({ origin: 'http://localhost:8080' }));

// Подключаем роутер группировки
app.use('/api/group-issues', groupIssuesRouter);

// Health-check для Docker
app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => {
  console.log(`Middleware is running on port ${PORT}`);
});