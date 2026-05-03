import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Title from '../Title';
import Description from '../Description';
import Comments from '../Comments';
import RelationModal from '../RelationModal';
import {
  LeftContainer,
  MainBlock,
  HeaderBlock,
  TitleRow,
  AddChildButton,
  AddChildIcon,
  DescriptionBlock,
  DescriptionTitle,
  ActivitySection,
  ActivityHeader,
  ShowRow,
  ShowLabel,
  FilterButtons,
  FilterButton,
  SortButton,
  CommentBlock,
  TitleDisplay,
  DescriptionDisplay,
  DescriptionWrapper,
  RelationsBlock,
  SectionTitle,
  RelationItem,
  RelationType,
  ActionsRow,
} from './Styles';

const LeftPanel = ({ issue, updateIssue, fetchIssue, isEditing, currentUser, statuses, priorities}) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [relationModalOpen, setRelationModalOpen] = useState(false);
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);
  const handleRelationCreated = async () => {
    await fetchIssue();                      // обновляем данные задачи (включая связи)
    if (isMountedRef.current) {
      setRelationModalOpen(false);           // закрываем модалку только если компонент ещё жив
    }
  };
  return (
    <LeftContainer>
      <MainBlock>
        <HeaderBlock>
          <TitleRow>
            {isEditing ? (
              <Title issue={issue} updateIssue={updateIssue} />
            ) : (
              <TitleDisplay>{issue.subject}</TitleDisplay>
            )}
          </TitleRow>
          {!isEditing && (
            <ActionsRow>
              <AddChildButton>
                <AddChildIcon>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M16.955 11.5714H14.8658V8.51786C14.8658 8.42946 14.7934 8.35714 14.705 8.35714H9.7229V6.42857H11.8925C12.0693 6.42857 12.214 6.28393 12.214 6.10714V0.321429C12.214 0.144643 12.0693 0 11.8925 0H6.10683C5.93004 0 5.7854 0.144643 5.7854 0.321429V6.10714C5.7854 6.28393 5.93004 6.42857 6.10683 6.42857H8.27647V8.35714H3.29433C3.20594 8.35714 3.13362 8.42946 3.13362 8.51786V11.5714H1.04433C0.867543 11.5714 0.7229 11.7161 0.7229 11.8929V17.6786C0.7229 17.8554 0.867543 18 1.04433 18H6.83004C7.00683 18 7.15147 17.8554 7.15147 17.6786V11.8929C7.15147 11.7161 7.00683 11.5714 6.83004 11.5714H4.58004V9.80357H13.4193V11.5714H11.1693C10.9925 11.5714 10.8479 11.7161 10.8479 11.8929V17.6786C10.8479 17.8554 10.9925 18 11.1693 18H16.955C17.1318 18 17.2765 17.8554 17.2765 17.6786V11.8929C17.2765 11.7161 17.1318 11.5714 16.955 11.5714ZM5.62469 13.0982V16.4732H2.24969V13.0982H5.62469ZM7.31219 4.90179V1.52679H10.6872V4.90179H7.31219ZM15.7497 16.4732H12.3747V13.0982H15.7497V16.4732Z" fill="#3F3F3F"/>
                  </svg>
                </AddChildIcon>
                Add a child issue
              </AddChildButton>
              <AddChildButton onClick={() => setRelationModalOpen(true)}>
                <AddChildIcon>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M10 2H8V10H2V12H8V20H10V12H16V10H10V2Z" fill="#3F3F3F"/>
                  </svg>
                </AddChildIcon>
                Add relation
              </AddChildButton>
            </ActionsRow>
          )}
          {!isEditing && issue.relations && issue.relations.length > 0 && (
            <RelationsBlock>
              <SectionTitle>Relations</SectionTitle>
              {issue.relations.map(rel => (
                <RelationItem key={rel.id}>
                  <RelationType>{rel.relation_type}</RelationType>
                  <span>LP-{rel.issue_to_id}</span>
                </RelationItem>
              ))}
            </RelationsBlock>
          )}
        </HeaderBlock>
        <DescriptionBlock>
          <DescriptionTitle>Description</DescriptionTitle>
          {isEditing ? (
            <DescriptionWrapper>
              <Description issue={issue} updateIssue={updateIssue} />
            </DescriptionWrapper>
          ) : (
            <DescriptionDisplay
              dangerouslySetInnerHTML={{ __html: issue.description || 'No description' }}
            />
          )}
        </DescriptionBlock>
      </MainBlock>

      {!isEditing && (
        <>
          <ActivitySection>
            <ActivityHeader>Activity</ActivityHeader>
            <ShowRow>
              <ShowLabel>Show:</ShowLabel>
              <FilterButtons>
                <FilterButton active={activeFilter === 'All'} onClick={() => setActiveFilter('All')}>All</FilterButton>
                <FilterButton active={activeFilter === 'Comments'} onClick={() => setActiveFilter('Comments')}>Comments</FilterButton>
                <FilterButton active={activeFilter === 'History'} onClick={() => setActiveFilter('History')}>History</FilterButton>
                <FilterButton active={activeFilter === 'Work log'} onClick={() => setActiveFilter('Work log')}>Work log</FilterButton>
              </FilterButtons>
              <SortButton onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}>
                {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  {/* ... ваш SVG ... */}
                </svg>
              </SortButton>
            </ShowRow>
          </ActivitySection>
          <CommentBlock>
            <Comments 
              issue={issue} 
              fetchIssue={fetchIssue} 
              currentUser={currentUser} 
              activeFilter={activeFilter} 
              statuses={statuses}  
              priorities={priorities}
              sortOrder={sortOrder}
            />
          </CommentBlock>
        </>
      )}

      {relationModalOpen && (
        <RelationModal
          issue={issue}
          onClose={() => setRelationModalOpen(false)}
          onCreated={handleRelationCreated}
        />
      )}
    </LeftContainer>
  );
};

export default LeftPanel;