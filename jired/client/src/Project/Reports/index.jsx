import React, { useState, useMemo } from 'react';
import moment from 'moment';
import { useLanguage } from 'context/LanguageContext';
import {
  ReportsPage,
  SectionTitle,
  TabsContainer,
  TabButton,
  ChartContainer,
  EmptyState,
  GanttRow,
  GanttLabel,
  GanttTimeline,
  GanttBar,
  BarChartWrapper,
  BarColumn,
  BarFill,
  BarLabel,
  BurndownContainer,
} from './Styles';

const ProjectReports = ({ project }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('gantt');
  const issues = project.issues || [];

  const stats = useMemo(() => {
    const total = issues.length;
    const closed = issues.filter(i => i.status?.is_closed || i.statusKey === 'done').length;
    const inProgress = issues.filter(i => i.statusKey === 'inprogress').length;
    const backlog = total - closed - inProgress;
    return { total, closed, inProgress, backlog };
  }, [issues]);

  const ganttData = useMemo(() => {
    const validIssues = issues
      .map(i => ({
        ...i,
        start: moment(i.start_date || i.created_on),
        end: moment(i.due_date || i.updatedAt || i.updated_on),
      }))
      .filter(i => i.start.isValid() && i.end.isValid());

    if (validIssues.length === 0) return null;

    const minDate = moment.min(validIssues.map(i => i.start));
    const maxDate = moment.max(validIssues.map(i => i.end));
    const totalDuration = Math.max(maxDate.diff(minDate, 'hours'), 24);

    return {
      minDate,
      maxDate,
      totalDuration,
      items: validIssues.sort((a, b) => a.start.valueOf() - b.start.valueOf()),
    };
  }, [issues]);

  const burndownData = useMemo(() => {
    if (issues.length === 0) return null;

    const today = moment().startOf('day');
    const minDate = issues.reduce((min, issue) => {
      const start = moment(issue.start_date || issue.created_on);
      return start.isValid() && start.isBefore(min) ? start : min;
    }, moment(today));

    const daysCount = today.diff(minDate, 'days') + 1;
    if (daysCount <= 0) return null;

    const days = Array.from({ length: daysCount }, (_, i) =>
      minDate.clone().add(i, 'days').format('D MMM'),
    );

    const ideal = days.map((_, idx) => {
      const fraction = idx / (daysCount - 1 || 1);
      return Math.round(issues.length * (1 - fraction));
    });

    const actual = days.map((_, idx) => {
      const day = minDate.clone().add(idx, 'days');
      return issues.filter(issue => {
        if (issue.status?.is_closed || issue.statusKey === 'done') {
          const closedDate = moment(issue.updated_on || issue.updatedAt || issue.due_date);
          return !closedDate.isValid() || closedDate.isAfter(day, 'day');
        }
        return true;
      }).length;
    });

    return { days, ideal, actual };
  }, [issues]);

  const renderGantt = () => {
    if (!ganttData) {
      return <EmptyState>{t('ganttNoData')}</EmptyState>;
    }

    return (
      <ChartContainer>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px',
          color: '#866f6f', paddingLeft: '200px'
        }}>
          <span>{ganttData.minDate.format('DD.MM.YYYY')}</span>
          <span>{ganttData.maxDate.format('DD.MM.YYYY')}</span>
        </div>
        {ganttData.items.map(issue => {
          const leftOffset = Math.max(
            (issue.start.diff(ganttData.minDate, 'hours') / ganttData.totalDuration) * 100, 0
          );
          const durationWidth = Math.max(
            (issue.end.diff(issue.start, 'hours') / ganttData.totalDuration) * 100, 1
          );

          return (
            <GanttRow key={issue.id}>
              <GanttLabel title={issue.title}>ISSUE-{issue.id}: {issue.title}</GanttLabel>
              <GanttTimeline>
                <GanttBar
                  left={leftOffset}
                  width={durationWidth}
                  title={`${issue.start.format('DD.MM')} - ${issue.end.format('DD.MM')}`}
                />
              </GanttTimeline>
            </GanttRow>
          );
        })}
      </ChartContainer>
    );
  };

  const renderStatusChart = () => {
    if (stats.total === 0) {
      return <EmptyState>{t('statusChartEmpty')}</EmptyState>;
    }

    const maxVal = Math.max(stats.backlog, stats.inProgress, stats.closed) || 1;

    return (
      <ChartContainer>
        <BarChartWrapper>
          <BarColumn>
            <BarFill height={(stats.backlog / maxVal) * 100} color="#866f6f">
              {stats.backlog}
            </BarFill>
            <BarLabel>{t('backlog')}</BarLabel>
          </BarColumn>
          <BarColumn>
            <BarFill height={(stats.inProgress / maxVal) * 100} color="#D29922">
              {stats.inProgress}
            </BarFill>
            <BarLabel>{t('inProgress')}</BarLabel>
          </BarColumn>
          <BarColumn>
            <BarFill height={(stats.closed / maxVal) * 100} color="#238636">
              {stats.closed}
            </BarFill>
            <BarLabel>{t('done')}</BarLabel>
          </BarColumn>
        </BarChartWrapper>
      </ChartContainer>
    );
  };

  const renderBurndown = () => {
    if (!burndownData || issues.length === 0) {
      return <EmptyState>{t('burndownEmpty')}</EmptyState>;
    }

    const { days, ideal, actual } = burndownData;
    const maxTasks = issues.length;
    const CHART_WIDTH = 600;
    const CHART_HEIGHT = 180;

    return (
      <BurndownContainer>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginBottom: 8,
          color: '#725757', fontSize: 13
        }}>
          <span>{t('tasksRemaining')}</span>
          <span>{t('xOfY', { done: actual[actual.length - 1], total: maxTasks })}</span>
        </div>
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'calc(100% - 24px)' }}
        >
          <text x="10" y={CHART_HEIGHT - 5} fontSize="9" fill="#866f6f">
            {days[0]}
          </text>
          <text x={CHART_WIDTH - 10} y={CHART_HEIGHT - 5} fontSize="9" fill="#866f6f" textAnchor="end">
            {days[days.length - 1]}
          </text>
          <polyline
            fill="none"
            stroke="#ccc"
            strokeWidth="2"
            strokeDasharray="5,5"
            points={`10,${CHART_HEIGHT - 10} ${CHART_WIDTH - 10},10`}
          />
          <polyline
            fill="none"
            stroke="#5E3F3F"
            strokeWidth="3"
            points={actual.map((v, i) => {
              const x = 10 + (i / (actual.length - 1)) * (CHART_WIDTH - 20);
              const y = v === 0 ? 10 : 10 + (1 - v / maxTasks) * (CHART_HEIGHT - 20);
              return `${x},${y}`;
            }).join(' ')}
          />
        </svg>
      </BurndownContainer>
    );
  };

  return (
    <ReportsPage>
      <SectionTitle>{t('reports')}</SectionTitle>
      <TabsContainer>
        <TabButton active={activeTab === 'gantt'} onClick={() => setActiveTab('gantt')}>
          {t('gantt')}
        </TabButton>
        <TabButton active={activeTab === 'status'} onClick={() => setActiveTab('status')}>
          {t('statusChart')}
        </TabButton>
        <TabButton active={activeTab === 'burndown'} onClick={() => setActiveTab('burndown')}>
          {t('burndown')}
        </TabButton>
      </TabsContainer>

      {activeTab === 'gantt' && renderGantt()}
      {activeTab === 'status' && renderStatusChart()}
      {activeTab === 'burndown' && renderBurndown()}
    </ReportsPage>
  );
};

export default ProjectReports;