import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal, Button, Icon } from 'shared/components';
import { useLanguage } from 'context/LanguageContext';
import { color } from 'shared/utils/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import GroupTaskCard from './GroupTaskCard';
import {
  GroupsContainer, GroupCard, GroupTitle, TaskList,
  ModalWrapper, Header, TitleHeader, HeaderRight,
  CloseButton, Body, Footer, Loader, ErrorMsg,
} from './Styles';
import { getCachedGroups, setCachedGroups, clearCachedGroups } from 'shared/utils/groupCache';

// === СТИЛИ ДЛЯ СОЗДАНИЯ И ИНПУТА ===
const GroupCardCreate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 2px dashed ${color.borderLightest};
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 60px;
  margin-bottom: 12px;
  color: ${color.textMedium};
  font-weight: 500;
  &:hover {
    border-color: #AD1E1E;
    background: rgba(173, 30, 30, 0.03);
    color: #AD1E1E;
  }
`;

const GroupTitleInput = styled.input`
  font-size: 1.1rem;
  font-weight: 400;
  color: #4a2727;
  padding: 7px 8px;
  border-radius: 4px;
  width: 100%;
  outline: none;
  box-sizing: border-box;
  font-family: 'Outfit', sans-serif;
  line-height: 1.3;
  margin-bottom: 12px;        /* отступ перед списком задач */
`;

const MakeGroupModal = ({ issues, projectUsers, priorities, groups: initialGroups, onSaveGroups, onClose }) => {
  const { t } = useLanguage();
  const [groups, setGroups] = useState(initialGroups || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingGroupId, setEditingGroupId] = useState(null); // Стейт для inline-редактирования

  const currentHash = JSON.stringify(issues.map(i => `${i.id}:${i.subject || i.title}`));

  const fetchGroups = useCallback(() => {
    setLoading(true); setError(null);
    fetch('http://localhost:3001/api/group-issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issues: issues.map(issue => ({ id: issue.id, subject: issue.subject || issue.title, description: issue.description || '' })) }),
    })
      .then(res => { if (!res.ok) throw new Error('Server error'); return res.json(); })
      .then(data => {
        if (data.groups && data.groups.length > 0) {
          setGroups(data.groups);
          setCachedGroups(currentHash, data.groups);
        } else setError(t('noGroupsReturned'));
      })
      .catch(err => setError(t('groupingError')))
      .finally(() => setLoading(false));
  }, [issues, t, currentHash]);

  useEffect(() => {
    if (!issues || issues.length === 0) { setError(t('noTasksToGroup')); return; }
    const cached = getCachedGroups(currentHash);
    if (cached) {
      const nonEmptyCached = cached.filter(g => g.tasks && g.tasks.length > 0);
      setGroups(nonEmptyCached);
      return;
    }
    if (!initialGroups || initialGroups.length === 0) {
      fetchGroups();
    } else {
      setGroups(initialGroups.filter(g => g.tasks && g.tasks.length > 0));
    }
  }, []);

  const handleRegroup = () => { clearCachedGroups(currentHash); setGroups([]); fetchGroups(); };

  const handleCreateEmptyGroup = () => {
    const maxId = groups.reduce((max, g) => {
      const id = Number(g.id);
      return id > max ? id : max;
    }, 0);
    const newId = Number(maxId) + 1;
    setGroups(prev => [...prev, { id: newId, name: '', tasks: [] }]);
    setEditingGroupId(newId);
  };

  const updateGroupName = (id, newName) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, name: newName } : g));
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;
    const taskId = parseInt(draggableId, 10);

    setGroups(prevGroups => {
      // 1. Перемещаем задачу, НЕ удаляя группы
      return prevGroups.map(group => {
        if (group.id.toString() === source.droppableId) {
          const newTasks = [...group.tasks];
          newTasks.splice(source.index, 1);
          return { ...group, tasks: newTasks };
        }
        if (group.id.toString() === destination.droppableId) {
          const newTasks = [...group.tasks];
          newTasks.splice(destination.index, 0, taskId);
          return { ...group, tasks: newTasks };
        }
        return group;
      });
    });
  };

  return (
    <Modal isOpen width="80vw" testid="modal:make-group" onClose={onClose} withCloseIcon={false} renderContent={() => (
      <ModalWrapper>
        <Header>
          <TitleHeader>{t('Group creation')}</TitleHeader>
          <HeaderRight>
            {groups.length > 0 && !loading && (
              <Button variant="secondary" onClick={handleRegroup}>Regroup with LLM</Button>
            )}
            <CloseButton onClick={onClose}>✕</CloseButton>
          </HeaderRight>
        </Header>

        <Body>
          {loading && <Loader>{t('loading')}...</Loader>}
          {error && <ErrorMsg>{error}</ErrorMsg>}
          
          {!loading && (
            <DragDropContext onDragEnd={onDragEnd}>
              <GroupsContainer>
                {groups.map(group => (
                  <GroupCard key={group.id}>
                    {/* INLINE РЕДАКТИРОВАНИЕ */}
                    {editingGroupId === group.id ? (
                      <GroupTitleInput
                        autoFocus
                        value={group.name}
                        onChange={(e) => updateGroupName(group.id, e.target.value)}
                        onBlur={() => setEditingGroupId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingGroupId(null)}
                      />
                    ) : (
                      <GroupTitle 
                        onClick={() => setEditingGroupId(group.id)} 
                        style={{ cursor: 'text', minHeight: '22px', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.target.style.color = '#AD1E1E'}
                        onMouseLeave={e => e.target.style.color = 'inherit'}
                      >
                        {group.name || 'Untitled Group'}
                      </GroupTitle>
                    )}

                    <Droppable droppableId={group.id.toString()} type="TASK">
                      {(provided) => (
                        <TaskList ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: '40px' }}>
                          {group.tasks.map((taskId, index) => {
                            const task = issues.find(i => i.id === taskId);
                            if (!task) return null;
                            return (
                              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                    style={{ ...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.5 : 1 }}
                                  >
                                    <GroupTaskCard task={task} projectUsers={projectUsers} priorities={priorities} />
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </TaskList>
                      )}
                    </Droppable>
                  </GroupCard>
                ))}

                {/* ПУСТАЯ КАРТОЧКА ДЛЯ СОЗДАНИЯ */}
                <GroupCardCreate onClick={handleCreateEmptyGroup}>
                  <Icon type="plus" size={20} />
                  <span>Create new group</span>
                </GroupCardCreate>

              </GroupsContainer>
            </DragDropContext>
          )}
        </Body>

        <Footer>
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button variant="primary" onClick={() => {
            const nonEmptyGroups = groups.filter(g => g.tasks && g.tasks.length > 0);
            onSaveGroups(nonEmptyGroups);
            clearCachedGroups(currentHash);
            onClose();
          }}>
            {t('save')}
          </Button>
        </Footer>
      </ModalWrapper>
    )} />
  );
};

export default MakeGroupModal;