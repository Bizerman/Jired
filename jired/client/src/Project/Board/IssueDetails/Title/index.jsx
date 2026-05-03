import React, { Fragment, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { KeyCodes } from 'shared/constants/keyCodes';
import { is, generateErrors } from 'shared/utils/validation';
import { TitleTextarea, ErrorText } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,   // Redmine issue
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsTitle = ({ issue, updateIssue }) => {
  const $titleInputRef = useRef();
  const [error, setError] = useState(null);

  const handleTitleChange = () => {
    setError(null);
    const newTitle = $titleInputRef.current.value;
    if (newTitle === issue.subject) return;

    const errors = generateErrors(
      { title: newTitle },
      { title: [is.required(), is.maxLength(255)] }
    );
    if (errors.title) {
      setError(errors.title);
    } else {
      updateIssue({ subject: newTitle });
    }
  };

  return (
    <Fragment>
      <TitleTextarea
        minRows={1}
        placeholder="Short summary"
        defaultValue={issue.subject}
        ref={$titleInputRef}
        onBlur={handleTitleChange}
        onKeyDown={event => {
          if (event.keyCode === KeyCodes.ENTER) {
            event.target.blur();
          }
        }}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Fragment>
  );
};

ProjectBoardIssueDetailsTitle.propTypes = propTypes;
export default ProjectBoardIssueDetailsTitle;