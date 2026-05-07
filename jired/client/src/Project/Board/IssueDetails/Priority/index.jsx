import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'shared/components';
import { useLanguage } from 'context/LanguageContext';
import { SectionTitle } from '../Styles';
import { Priority, Label } from './Styles';

// SVG-иконки приоритетов (тот самый маппинг)
const priorityIconMap = {
  'low':       { src: require('../../../../App/assets/imgs/low-priority-icon.svg').default,      size: '1.5rem' },
  'medium':    { src: require('../../../../App/assets/imgs/medium-priority-icon.svg').default,   size: '1rem'   },
  'high':      { src: require('../../../../App/assets/imgs/high-priority-icon.svg').default,     size: '1.5rem' },
  'critical':  { src: require('../../../../App/assets/imgs/very-high-priority-icon.svg').default, size: '1.5rem' },
};

const propTypes = {
  issue: PropTypes.object.isRequired,
  priorities: PropTypes.array.isRequired,   // [{id, name, is_default}]
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsPriority = ({ issue, priorities, updateIssue }) => {
  const { t } = useLanguage();

  const priorityOptions = priorities.map(p => ({
    value: p.id,
    label: translatePriorityName(p.name),
  }));

  const handleChange = (priorityId) => {
    updateIssue({ priority_id: priorityId });
  };

  // Перевод имени приоритета
  const translatePriorityName = (name) => {
    if (!name) return t('priorityMedium');
    const key = `priority${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}`;
    return t(key) || name;
  };

  const renderPriorityItem = (priorityId, isValue) => {
    const priority = priorities.find(p => p.id === priorityId);
    const name = priority?.name?.toLowerCase() || 'medium';
    const meta = priorityIconMap[name] || priorityIconMap['medium'];
    const displayName = translatePriorityName(priority?.name);

    return (
      <Priority isValue={isValue}>
        <img src={meta.src} alt="" style={{ width: meta.size, height: meta.size }} />
        <Label>{displayName}</Label>
      </Priority>
    );
  };

  return (
    <Fragment>
      <SectionTitle>{t('priority')}</SectionTitle>
      <Select
        variant="empty"
        withClearValue={false}
        dropdownWidth={343}
        value={issue.priority?.id}
        options={priorityOptions}
        onChange={handleChange}
        renderValue={({ value }) => renderPriorityItem(value, true)}
        renderOption={({ value }) => renderPriorityItem(value)}
      />
    </Fragment>
  );
};

ProjectBoardIssueDetailsPriority.propTypes = propTypes;
export default ProjectBoardIssueDetailsPriority;