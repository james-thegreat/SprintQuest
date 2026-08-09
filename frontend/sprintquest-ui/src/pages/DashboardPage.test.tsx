import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAppSelectionStore } from '../stores/useAppSelectionStore';
import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
  beforeEach(() => {
    useAppSelectionStore.setState({
      projects: [],
      selectedProjectId: null,
      sprints: [],
      selectedSprintId: null,
      isProjectsLoading: false,
      isSprintsLoading: false,
      projectsErrorMessage: null,
      sprintsErrorMessage: null,
    });
  });

  it('shows a loading state while application context is loading', () => {
    useAppSelectionStore.setState({
      isProjectsLoading: true,
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('status', {
        name: /loading dashboard/i,
      }),
    ).toBeInTheDocument();
  });
});