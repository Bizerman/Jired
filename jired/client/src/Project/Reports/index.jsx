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
      .map(i => {
        const start = moment(i.start_date || i.created_on);
        let end = moment(i.due_date || i.updatedAt || i.updated_on);
        
        if (end.isValid() && start.isValid() && end.isBefore(start)) {
          end = start.clone().add(1, 'day');
        }

        return { ...i, start, end };
      })
      .filter(i => i.start.isValid() && i.end.isValid());

    if (validIssues.length === 0) return null;

    const minDate = moment.min(validIssues.map(i => i.start)).startOf('day');
    const maxDate = moment.max(validIssues.map(i => i.end)).endOf('day'); 
    
    const totalDuration = Math.max(maxDate.diff(minDate, 'hours'), 24);

    return {
      minDate,
      maxDate,
      totalDuration,
      items: validIssues.sort((a, b) => a.start.valueOf() - b.start.valueOf()),
    };
  }, [issues]);

  // --- ИСПРАВЛЕННЫЙ BURNDOWN DATA ---
  const burndownData = useMemo(() => {
    if (issues.length === 0) return null;

    const today = moment().startOf('day');
    
    // 1. Ищем минимальную и максимальную даты для оси X
    let minDate = moment(today);
    let maxDate = moment(today);

    issues.forEach(issue => {
      const start = moment(issue.start_date || issue.created_on);
      if (start.isValid() && start.isBefore(minDate)) minDate = start.clone().startOf('day');

      const end = moment(issue.due_date || issue.closed_on || issue.updated_on || issue.updatedAt);
      if (end.isValid() && end.isAfter(maxDate)) maxDate = end.clone().startOf('day');
    });

    const totalDays = Math.max(maxDate.diff(minDate, 'days'), 1);

    const actual = [];
    let lastRemaining = issues.length;

    // 2. Считаем остаток задач по дням
    for (let i = 0; i <= totalDays; i++) {
      const currentDay = minDate.clone().add(i, 'days');
      const fraction = i / totalDays;

      // Если день в будущем, мы перестаем рисовать фактическую линию
      if (currentDay.isAfter(today)) {
        break;
      }

      const remaining = issues.filter(issue => {
        if (issue.status?.is_closed || issue.statusKey === 'done') {
          const closedDate = moment(issue.closed_on || issue.updated_on || issue.updatedAt || issue.due_date);
          // Если задача была закрыта до или в этот день, она больше не "осталась"
          if (closedDate.isValid() && closedDate.isSameOrBefore(currentDay, 'day')) {
            return false;
          }
        }
        return true; 
      }).length;

      actual.push({ xRatio: fraction, val: remaining });
      lastRemaining = remaining;
    }

    return { 
      minDate, 
      maxDate, 
      today, 
      totalDays,
      actual, 
      currentRemaining: lastRemaining 
    };
  }, [issues]);

  const renderGantt = () => {
    if (!ganttData) {
      return <EmptyState>{t('ganttNoData')}</EmptyState>;
    }

    const { minDate, maxDate, totalDuration, items } = ganttData;
    
    // Расчет позиции линии "Сегодня"
    const now = moment();
    const isTodayInRange = now.isBetween(minDate, maxDate);
    const todayLeftOffset = isTodayInRange 
      ? (now.diff(minDate, 'hours') / totalDuration) * 100 
      : null;

    return (
      <ChartContainer style={{ position: 'relative' }}>
        
        {/* Шапка с датами */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px',
          color: '#866f6f', paddingLeft: '200px' // Убедись, что 200px совпадает с шириной твоего GanttLabel
        }}>
          <span>{minDate.format('DD.MM.YYYY')}</span>
          <span>{maxDate.format('DD.MM.YYYY')}</span>
        </div>

        {/* Контейнер для строк (чтобы позиционировать линию "Сегодня") */}
        <div style={{ position: 'relative' }}>
          
          {/* Вертикальная линия "Сегодня" */}
          {isTodayInRange && (
             <div style={{
               position: 'absolute',
               left: `calc(200px + ${todayLeftOffset}vw - 200px * (${todayLeftOffset} / 100))`, // примерная корректировка с учетом отступа
               // Для идеальной точности лучше сделать timeline container (правую часть) отдельным relative блоком, 
               // ниже я покажу как линия будет стоять внутри самого GanttTimeline
             }} />
          )}

          {items.map(issue => {
            // 3. Фикс: Защита от NaN и отрицательных значений
            let leftOffset = Math.max((issue.start.diff(minDate, 'hours') / totalDuration) * 100, 0);
            let durationWidth = Math.max((issue.end.diff(issue.start, 'hours') / totalDuration) * 100, 0.5); // Минимум 0.5% чтобы точку было видно

            // 4. Фикс: Защита от вылезания за пределы 100% (container overflow)
            if (leftOffset + durationWidth > 100) {
              durationWidth = 100 - leftOffset;
            }

            return (
              <GanttRow key={issue.id}>
                <GanttLabel title={issue.title}>ISSUE-{issue.id}: {issue.title}</GanttLabel>
                
                <GanttTimeline style={{ position: 'relative' }}>
                  {/* Отрисовка линии "сегодня" внутри таймлайна (чтобы не мучиться с 200px отступом) */}
                  {isTodayInRange && (
                    <div style={{
                      position: 'absolute',
                      left: `${todayLeftOffset}%`,
                      top: 0,
                      bottom: 0,
                      width: '1px',
                      backgroundColor: 'rgba(255, 0, 0, 0.4)', // Полупрозрачная красная линия
                      zIndex: 1
                    }} />
                  )}

                  <GanttBar
                    left={leftOffset}
                    width={durationWidth}
                    title={`Старт: ${issue.start.format('DD.MM.YYYY HH:mm')}\nКонец: ${issue.end.format('DD.MM.YYYY HH:mm')}`}
                    style={{ position: 'relative', zIndex: 2 }} // Чтобы бар был поверх линии "Сегодня"
                  />
                </GanttTimeline>
              </GanttRow>
            );
          })}
        </div>
      </ChartContainer>
    );
  };

  const renderStatusChart = () => {
    // ... твой текущий renderStatusChart (без изменений) ...
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

  // --- ИСПРАВЛЕННЫЙ RENDER BURNDOWN ---
  const renderBurndown = () => {
    if (!burndownData || issues.length === 0) {
      return <EmptyState>{t('burndownEmpty')}</EmptyState>;
    }

    const { minDate, maxDate, today, totalDays, actual, currentRemaining } = burndownData;
    const maxTasks = issues.length;
    
    const CHART_WIDTH = 600;
    const CHART_HEIGHT = 180;

    // Вспомогательные функции для расчета координат
    const getX = (ratio) => 10 + ratio * (CHART_WIDTH - 20);
    const getY = (val) => 10 + (1 - val / maxTasks) * (CHART_HEIGHT - 20);

    // Точки идеальной линии (от всех задач к 0)
    const idealPoints = `${getX(0)},${getY(maxTasks)} ${getX(1)},${getY(0)}`;
    
    // Точки фактической линии (до текущего дня)
    const actualPoints = actual.map(p => `${getX(p.xRatio)},${getY(p.val)}`).join(' ');

    // Вычисляем позицию текущего дня на оси X (от 0 до 1)
    let todayRatio = today.diff(minDate, 'days') / totalDays;
    todayRatio = Math.max(0, Math.min(todayRatio, 1)); // Ограничиваем от 0 до 1

    return (
      <BurndownContainer>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginBottom: 8,
          color: '#725757', fontSize: 13
        }}>
          <span>{t('tasksRemaining')}</span>
          <span>{t('xOfY', { done: maxTasks - currentRemaining, total: maxTasks })}</span>
        </div>
        
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'calc(100% - 24px)' }}
        >
          {/* Дата начала (слева) */}
          <text x="10" y={CHART_HEIGHT - 2} fontSize="9" fill="#866f6f">
            {minDate.format('D MMM')}
          </text>

          {/* Текущая дата (посередине графика, если она не совпадает с краями) */}
          {todayRatio > 0 && todayRatio < 1 && (
            <text x={getX(todayRatio)} y={CHART_HEIGHT - 2} fontSize="9" fill="#D29922" textAnchor="middle">
              {today.format('D MMM')}
            </text>
          )}

          {/* Дата окончания (справа) */}
          <text x={CHART_WIDTH - 10} y={CHART_HEIGHT - 2} fontSize="9" fill="#866f6f" textAnchor="end">
            {maxDate.format('D MMM')}
          </text>

          {/* Идеальная линия (пунктир) */}
          <polyline
            fill="none"
            stroke="#ccc"
            strokeWidth="2"
            strokeDasharray="5,5"
            points={idealPoints}
          />

          {/* Фактическая линия */}
          <polyline
            fill="none"
            stroke="#5E3F3F"
            strokeWidth="3"
            points={actualPoints}
          />
          
          {/* Точка на текущем дне для наглядности (опционально) */}
          {actual.length > 0 && (
             <circle 
                cx={getX(actual[actual.length - 1].xRatio)} 
                cy={getY(actual[actual.length - 1].val)} 
                r="3" 
                fill="#5E3F3F" 
             />
          )}
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