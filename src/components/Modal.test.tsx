// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  afterEach(cleanup);

  it('renders nothing when closed', () => {
    const { container } = render(<Modal isOpen={false} onClose={() => {}}>Contenu</Modal>);
    expect(container.innerHTML).toBe('');
  });

  it('renders the title and content when open', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Détails">
        Contenu de la modal
      </Modal>,
    );
    expect(screen.getByText('Détails')).toBeTruthy();
    expect(screen.getByText('Contenu de la modal')).toBeTruthy();
  });

  it('calls onClose when the Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        Contenu
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Titre">
        Contenu
      </Modal>,
    );
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
