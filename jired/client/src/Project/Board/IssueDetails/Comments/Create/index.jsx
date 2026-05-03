import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from 'shared/utils/api';
import useCurrentUser from 'shared/hooks/currentUser';
import toast from 'shared/utils/toast';
import BodyForm from '../BodyForm';
import ProTip from './ProTip';
import { Create, UserAvatar, Right, FakeTextarea } from './Styles';

const ProjectBoardIssueDetailsCommentsCreate = ({ issueId, fetchIssue, currentUser }) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [body, setBody] = useState('');

  const userData = currentUser; // берём из пропса

  const handleCommentCreate = async () => {
    if (!body.trim()) return;
    try {
      setCreating(true);
      await api.put(`/issues/${issueId}.json`, {
        issue: { notes: body }
      });
      await fetchIssue();
      setFormOpen(false);
      setBody('');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Create>
      {userData && (
        <UserAvatar
          name={userData.name}
          avatarUrl={userData.avatarUrl}
        />
      )}
      <Right>
        {isFormOpen ? (
          <BodyForm
            value={body}
            onChange={setBody}
            isWorking={isCreating}
            onSubmit={handleCommentCreate}
            onCancel={() => setFormOpen(false)}
          />
        ) : (
          <Fragment>
            <FakeTextarea onClick={() => setFormOpen(true)}>Add a comment...</FakeTextarea>
            <ProTip setFormOpen={setFormOpen} />
          </Fragment>
        )}
      </Right>
    </Create>
  );
};


ProjectBoardIssueDetailsCommentsCreate.propTypes = {
  issueId: PropTypes.number.isRequired,
  fetchIssue: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};
export default ProjectBoardIssueDetailsCommentsCreate;