import React, { Fragment, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getTextContentsFromHtmlString } from 'shared/utils/browser';
import { TextEditor, TextEditedContent } from 'shared/components';
import { Title, EmptyLabel, DescriptionPreview, EditorContainer  } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsDescription = ({ issue, updateIssue }) => {
  const [description, setDescription] = useState(issue.description || '');
  const [isEditing, setEditing] = useState(false);
  const editorRef = useRef(null);

  // Закрываем редактор и сохраняем изменения при клике вне его
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event) => {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        if (description !== issue.description) {
          updateIssue({ description });
        }
        setEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, description, issue.description, updateIssue]);

  const isEmpty = getTextContentsFromHtmlString(description).trim().length === 0;

  return (
    <EditorContainer ref={editorRef}>
      {isEditing ? (
        <TextEditor
          placeholder="Describe the issue"
          defaultValue={description}
          onChange={setDescription}
        />
      ) : (
        <DescriptionPreview onClick={() => setEditing(true)}>
          {isEmpty ? (
            <EmptyLabel>Add a description...</EmptyLabel>
          ) : (
            <TextEditedContent content={description} />
          )}
        </DescriptionPreview>
      )}
    </EditorContainer>
  );
};

ProjectBoardIssueDetailsDescription.propTypes = propTypes;
export default ProjectBoardIssueDetailsDescription;