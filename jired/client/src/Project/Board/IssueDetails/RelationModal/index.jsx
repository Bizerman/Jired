import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { Modal, Button } from 'shared/components';
import { FormGroup, Label, Select, Input, Actions } from './Styles';

const RELATION_TYPES = [
  { value: 'blocks', label: 'Blocks' },
  { value: 'blocked_by', label: 'Blocked by' },
  { value: 'precedes', label: 'Precedes' },
  { value: 'follows', label: 'Follows' },
];

const RelationModal = ({ issue, onClose, onCreated }) => {
  const [type, setType] = useState('blocks');
  const [targetId, setTargetId] = useState('');
  const [saving, setSaving] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  const handleCreate = async () => {
    if (!targetId || isNaN(targetId)) return;
    setSaving(true);
    try {
      await api.post('/relations.json', {
        relation: {
          issue_id: issue.id,
          issue_to_id: Number(targetId),
          relation_type: type,
        },
      });
      toast.success('Relation created');
      if (isMountedRef.current) {
        onCreated();
      }
    } catch (error) {
      if (isMountedRef.current) {
        const serverErrors = error.response?.data?.errors;
        const errorMessage = Array.isArray(serverErrors) ? serverErrors.join(', ') : (error.message || 'Unknown error');
        console.error('Relation creation error:', error.response?.data || error);
        toast.error('Failed: ' + errorMessage);
      }
    } finally {
      if (isMountedRef.current) {
        setSaving(false);
      }
    }
  };

  return (
    <Modal isOpen width={400} onClose={onClose} renderContent={() => (
      <div style={{ padding: 20 }}>
        <h3>Add relation</h3>
        <FormGroup>
          <Label>Type</Label>
          <Select value={type} onChange={e => setType(e.target.value)}>
            {RELATION_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Target issue ID</Label>
          <Input
            type="number"
            placeholder="e.g. 123"
            value={targetId}
            onChange={e => setTargetId(e.target.value)}
          />
        </FormGroup>
        <Actions>
          <Button variant="primary" onClick={handleCreate} disabled={saving}>
            {saving ? 'Saving...' : 'Create'}
          </Button>
          <Button variant="empty" onClick={onClose}>Cancel</Button>
        </Actions>
      </div>
    )} />
  );
};

export default RelationModal;