import { Project } from 'entities';
import { catchErrors } from 'errors';
import { findEntityOrThrow, updateEntity, createEntity } from 'utils/typeorm';
import { issuePartial } from 'serializers/issues';

export const getProjectWithUsersAndIssues = catchErrors(async (req, res) => {
  const project = await findEntityOrThrow(Project, req.currentUser.projectId, {
    relations: ['users', 'issues'],
  });
  res.respond({
    project: {
      ...project,
      issues: project.issues.map(issuePartial),
    },
  });
});

export const getProjects = catchErrors(async (_req, res) => {
  const projects = await Project.find();
  res.respond({ projects });
});

export const update = catchErrors(async (req, res) => {
  const project = await updateEntity(Project, req.currentUser.projectId, req.body);
  res.respond({ project });
});

export const create = catchErrors(async (req, res) => {
  const project = await createEntity(Project, req.body);
  res.respond({ project });
});
