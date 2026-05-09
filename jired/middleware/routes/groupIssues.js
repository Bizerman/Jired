const router = require('express').Router();
const fetch = require('node-fetch');

const API_KEY = process.env.YANDEXGPT_API_KEY;
const FOLDER_ID = process.env.YANDEXGPT_FOLDER_ID;
const API_URL = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';

router.post('/', async (req, res) => {
  const { issues } = req.body;
  if (!issues || !Array.isArray(issues) || issues.length === 0) {
    return res.status(400).json({ error: 'No issues provided' });
  }

  const tasks = issues.map(i => `ID: ${i.id}, Title: ${i.subject}`).join('\n');

  // Промпт с одним явным примером, как нужно группировать
  const prompt = `Разбей задачи на смысловые группы. Дай группам осмысленные названия на русском. Верни JSON с массивом "groups", каждый элемент: id, name, tasks (массив ID задач).

Пример:
Задачи:
ID: 1, Title: Купить огурцы
ID: 2, Title: Бананы
ID: 3, Title: Апельсины
JSON: {"groups":[{"id":"1","name":"Овощи","tasks":[1]},{"id":"2","name":"Фрукты","tasks":[2,3]}]}

Теперь обработай эти задачи:
${tasks}
JSON:`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${API_KEY}`,
      },
      body: JSON.stringify({
        modelUri: `gpt://${FOLDER_ID}/yandexgpt-lite`,   // ← бесплатная Lite‑модель
        completionOptions: {
          stream: false,
          temperature: 0,          // максимум точности
          maxTokens: 500,
        },
        messages: [{ role: 'user', text: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`YandexGPT API responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const completion = data.result.alternatives[0].message.text;
    console.log('Raw LLM response:', completion);

    let parsed;
    const jsonMatch = completion.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('Failed to parse JSON from response:', e);
      }
    }
    if (!parsed) {
      try {
        parsed = JSON.parse(completion.trim());
      } catch (e) {
        console.error('Failed to parse entire completion as JSON');
      }
    }

    if (!parsed || !parsed.groups || !Array.isArray(parsed.groups)) {
      parsed = {
        groups: [
          {
            id: 'g1',
            name: 'All tasks',
            tasks: issues.map(i => i.id),
          },
        ],
      };
    } else {
      parsed.groups = parsed.groups.filter(g => g.tasks && g.tasks.length > 0);
    }

    return res.json(parsed);
  } catch (error) {
    console.error('LLM request failed:', error.message);
    return res.status(502).json({ error: 'LLM service unavailable' });
  }
});

module.exports = router;