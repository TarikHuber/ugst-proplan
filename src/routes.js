import React from 'react';
import makeLoadable from 'rmw-shell/lib/containers/MyLoadable';
import RestrictedRoute from 'rmw-shell/lib/containers/RestrictedRoute';

const MyLoadable = (opts, preloadComponents) =>
  makeLoadable(
    { ...opts, firebase: () => import('./firebase') },
    preloadComponents
  );

const AsyncDashboard = MyLoadable({ loader: () => import('./containers/Dashboard/Dashboard') });
const AsyncWorkflows = MyLoadable({ loader: () => import('./containers/Workflows/Workflows') });
const AsyncWorkflow = MyLoadable({ loader: () => import('./containers/Workflows/Workflow') });
const AsyncWorkflowStep = MyLoadable({ loader: () => import('./containers/WorkflowSteps/WorkflowStep') });
const AsyncProjects = MyLoadable({ loader: () => import('./containers/Projects/Projects') });
const AsyncProject = MyLoadable({ loader: () => import('./containers/Projects/Project') });

const Routes = [
  <RestrictedRoute type="private" path="/" exact component={AsyncDashboard} />,
  <RestrictedRoute type="private" path="/workflows" exact component={AsyncWorkflows} />,
  <RestrictedRoute type="private" path="/workflows/:type" exact component={AsyncWorkflows} />,
  <RestrictedRoute type="private" path="/create_workflow" exact component={AsyncWorkflow} />,
  <RestrictedRoute type="private" path="/workflows/edit/:uid/:editType" exact component={AsyncWorkflow} />,
  <RestrictedRoute type="private" path="/steps/:basePath/:workflowUid/create" exact component={AsyncWorkflowStep} />,
  <RestrictedRoute type="private" path="/steps/:basePath/:workflowUid/edit/:uid" exact component={AsyncWorkflowStep} />,
  <RestrictedRoute type="private" path="/projects/:uid" exact component={AsyncProjects} />,
  <RestrictedRoute type="private" path="/projects/edit/:uid/:editType" exact component={AsyncProject} />,
  <RestrictedRoute type="private" path="/dashboard" exact component={AsyncDashboard} />,
];

export default Routes;
