// shared/utils/priorities.js
import veryHighIcon from 'App/assets/imgs/very-high-priority-icon.svg';
import highIcon     from 'App/assets/imgs/high-priority-icon.svg';
import mediumIcon   from 'App/assets/imgs/medium-priority-icon.svg';
import lowIcon      from 'App/assets/imgs/low-priority-icon.svg';

const priorityIconMap = {
  'low':       { src: lowIcon,      size: '1.5rem' },
  'medium':    { src: mediumIcon,   size: '1rem'   },
  'high':      { src: highIcon,     size: '1.5rem' },
  'critical':  { src: veryHighIcon, size: '1.5rem' },
};

export const getPriorityMeta = (issue, priorities) => {
  // пытаемся получить id из разных мест
  const priorityId = issue?.priority?.id || issue?.priority_id;
  if (priorityId && priorities?.length) {
    const priorityObj = priorities.find(p => p.id === priorityId);
    if (priorityObj && priorityIconMap[priorityObj.name.toLowerCase()]) {
      return priorityIconMap[priorityObj.name.toLowerCase()];
    }
  }
  // fallback: ищем по имени, если оно есть
  const name = (issue?.priority?.name || '').toLowerCase();
  if (name && priorityIconMap[name]) return priorityIconMap[name];
  // ищем частичное совпадение
  for (const [key, meta] of Object.entries(priorityIconMap)) {
    if (name.includes(key)) return meta;
  }
  return null;  // вернём null, если не нашли
};