import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import api from 'shared/utils/api';
import useCurrentUser from 'shared/hooks/currentUser';
import toast from 'shared/utils/toast';
import BodyForm from '../BodyForm';
import ProTip from './ProTip';
import { Create, UserAvatar, Right, FakeTextarea } from './Styles';

const propTypes = {
  issueId: PropTypes.number.isRequired,
  fetchIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsCommentsCreate = ({ issueId, fetchIssue }) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [body, setBody] = useState('');
  const { currentUser } = useCurrentUser();

  const handleCommentCreate = async () => {
    if (!body.trim()) return;
    try {
      setCreating(true);
      // Отправляем notes через PUT /issues/:id.json
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
      {currentUser && <UserAvatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} />}
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

ProjectBoardIssueDetailsCommentsCreate.propTypes = propTypes;
export default ProjectBoardIssueDetailsCommentsCreate;