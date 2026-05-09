import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'shared/components';
import { useLanguage } from 'context/LanguageContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import GroupTaskCard from './GroupTaskCard';
import {
  GroupsContainer,
  GroupCard,
  GroupTitle,
  TaskList,
  ModalWrapper,
  Header,
  TitleHeader,
  HeaderRight,
  CloseButton,
  Body,
  Footer,
  Loader,
  ErrorMsg,
} from './Styles';
import { getCachedGroups, setCachedGroups, clearCachedGroups } from 'shared/utils/groupCache';

const MakeGroupModal = ({
  issues,
  projectUsers,
  priorities,
  groups: initialGroups,
  onSaveGroups,
  onClose,
}) => {
  const { t } = useLanguage();
  const [groups, setGroups] = useState(initialGroups);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentHash = JSON.stringify(issues.map(i => `${i.id}:${i.subject || i.title}`));

  const fetchGroups = useCallback(() => {
    setLoading(true);
    setError(null);

    fetch('http://localhost:3001/api/group-issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        issues: issues.map(issue => ({
          id: issue.id,
          subject: issue.subject || issue.title,
          description: issue.description || '',
        })),
      }),
    })
      .then(res => { if (!res.ok) throw new Error('Server error'); return res.json(); })
      .then(data => {
        if (data.groups && data.groups.length > 0) {
          setGroups(data.groups);
          setCachedGroups(currentHash, data.groups);
        } else {
          setError(t('noGroupsReturned'));
        }
      })
      .catch(err => {
        console.error(err);
        setError(t('groupingError'));
      })
      .finally(() => setLoading(false));
  }, [issues, t, currentHash]);

  useEffect(() => {
    if (!issues || issues.length === 0) {
      setError(t('noTasksToGroup'));
      return;
    }

    const cached = getCachedGroups(currentHash);
    if (cached) {
      setGroups(cached);
      return;
    }

    fetchGroups();
  }, []);

  const handleRegroup = () => {
    clearCachedGroups(currentHash);
    setGroups(null);
    fetchGroups();
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const taskId = parseInt(draggableId, 10);

    setGroups(prevGroups => {
      const newGroups = prevGroups.map(group => {
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
      return newGroups;
    });
  };

  const handleSave = () => {
    onSaveGroups(groups);
    onClose();
  };

  return (
    <Modal
      isOpen
      width="90vw"
      testid="modal:make-group"
      onClose={onClose}
      withCloseIcon={false}
      renderContent={() => (
        <ModalWrapper>
          <Header>
            <TitleHeader>{t('Group creation')}</TitleHeader>
            <HeaderRight>
              {groups && !loading && (
                <Button variant="secondary" onClick={handleRegroup}>
                  Regroup with LLM
                </Button>
              )}
              <CloseButton onClick={onClose}>✕</CloseButton>
            </HeaderRight>
          </Header>

          <Body>
            {loading && <Loader>{t('loading')}...</Loader>}
            {error && <ErrorMsg>{error}</ErrorMsg>}
            {groups && !loading && (
              <DragDropContext onDragEnd={onDragEnd}>
                <GroupsContainer>
                  {groups.map(group => (
                    <GroupCard key={group.id}>
                      <GroupTitle>{group.name}</GroupTitle>
                      <Droppable droppableId={group.id.toString()} type="TASK">
                        {(provided) => (
                          <TaskList ref={provided.innerRef} {...provided.droppableProps}>
                            {group.tasks.map((taskId, index) => {
                              const task = issues.find(i => i.id === taskId);
                              if (!task) return null;
                              return (
                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        opacity: snapshot.isDragging ? 0.5 : 1,
                                      }}
                                    >
                                      <GroupTaskCard
                                        task={task}
                                        projectUsers={projectUsers}
                                        priorities={priorities}
                                      />
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
                </GroupsContainer>
              </DragDropContext>
            )}
          </Body>

          <Footer>
            <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
            {groups && <Button variant="primary" onClick={handleSave}>{t('save')}</Button>}
          </Footer>
        </ModalWrapper>
      )}
    />
  );
};

MakeGroupModal.propTypes = {
  issues: PropTypes.array.isRequired,
  projectUsers: PropTypes.array.isRequired,
  priorities: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MakeGroupModal;