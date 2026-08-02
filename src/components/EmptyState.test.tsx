// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  afterEach(cleanup);

  it('renders the title and description', () => {
    render(<EmptyState title="Aucun résultat" description="Essayez de modifier vos critères" />);
    expect(screen.getByText('Aucun résultat')).toBeTruthy();
    expect(screen.getByText('Essayez de modifier vos critères')).toBeTruthy();
  });

  it('fires the action callback when the primary action is clicked', () => {
    const onAction = vi.fn();
    render(<EmptyState title="Vide" actionLabel="Réessayer" onAction={onAction} />);
    fireEvent.click(screen.getByText('Réessayer'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('fires the secondary action callback', () => {
    const onSecondaryAction = vi.fn();
    render(
      <EmptyState title="Vide" secondaryActionLabel="Annuler" onSecondaryAction={onSecondaryAction} />,
    );
    fireEvent.click(screen.getByText('Annuler'));
    expect(onSecondaryAction).toHaveBeenCalledTimes(1);
  });
});
