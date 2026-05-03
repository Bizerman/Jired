import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import { InputDebounced, Modal, Button } from 'shared/components';
import TrackingWidget from './TrackingWidget';
import { SectionTitle } from '../Styles';
import {
  TrackingLink,
  ModalContents,
  ModalTitle,
  Inputs,
  InputCont,
  InputLabel,
  Actions,
} from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsEstimateTracking = ({ issue, updateIssue }) => {
  const estimatedHours = issue.estimated_hours;
  const spentHours = issue.spent_hours;   // может отсутствовать
  const doneRatio = issue.done_ratio || 0;

  const handleUpdateEstimated = (val) => {
    const num = val === '' || isNil(val) ? null : Number(val);
    updateIssue({ estimated_hours: num });
  };

  const handleUpdateDoneRatio = (val) => {
    const num = val === '' || isNil(val) ? 0 : Number(val);
    updateIssue({ done_ratio: Math.min(100, Math.max(0, num)) });
  };

  // Виджет трекинга (для модалки) использует те же данные
  const trackingIssue = {
    ...issue,
    // для TrackingWidget добавим timeRemaining, если нужно
    timeRemaining: estimatedHours && spentHours
      ? Math.max(estimatedHours - spentHours, 0)
      : undefined,
  };

  return (
    <Fragment>
      <SectionTitle>Original Estimate (hours)</SectionTitle>
      <InputDebounced
        placeholder="Number"
        filter={/^\d{0,6}(\.\d{0,2})?$/}
        value={isNil(estimatedHours) ? '' : estimatedHours}
        onChange={handleUpdateEstimated}
      />

      <SectionTitle>Time Tracking</SectionTitle>
      <Modal
        testid="modal:tracking"
        width={400}
        renderLink={modal => (
          <TrackingLink onClick={modal.open}>
            <TrackingWidget issue={trackingIssue} />
          </TrackingLink>
        )}
        renderContent={modal => (
          <ModalContents>
            <ModalTitle>Time tracking</ModalTitle>
            <TrackingWidget issue={trackingIssue} />
            <Inputs>
              <InputCont>
                <InputLabel>Time spent (hours) – read only</InputLabel>
                <InputDebounced
                  placeholder="0"
                  filter={/^\d{0,6}(\.\d{0,2})?$/}
                  value={isNil(spentHours) ? '' : spentHours}
                  onChange={() => {}} // только для чтения, либо можно сделать редактируемым через отдельный запрос
                  disabled
                />
              </InputCont>
              <InputCont>
                <InputLabel>Done (%)</InputLabel>
                <InputDebounced
                  placeholder="0"
                  filter={/^\d{0,3}$/}
                  value={doneRatio}
                  onChange={handleUpdateDoneRatio}
                />
              </InputCont>
            </Inputs>
            <Actions>
              <Button variant="primary" onClick={modal.close}>Done</Button>
            </Actions>
          </ModalContents>
        )}
      />
    </Fragment>
  );
};

ProjectBoardIssueDetailsEstimateTracking.propTypes = propTypes;
export default ProjectBoardIssueDetailsEstimateTracking;