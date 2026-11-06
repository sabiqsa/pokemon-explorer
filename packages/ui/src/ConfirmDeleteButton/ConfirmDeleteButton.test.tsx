import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));

const { ConfirmDeleteButton } = await import('./index');

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

function renderButton(action: () => Promise<{ error?: string; deleted?: boolean }>) {
  render(<ConfirmDeleteButton title="Delete Pikachu?" description="This can't be undone." action={action} redirectTo="/" />);
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  return screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
}

const confirmButton = (dialog: HTMLElement) =>
  [...dialog.querySelectorAll('button')].find((b) => b.type === 'submit')!;

describe('ConfirmDeleteButton', () => {
  it('opens the dialog and closes it on cancel without deleting', () => {
    const action = vi.fn();
    const dialog = renderButton(action);
    expect(dialog.open).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel', hidden: true }));
    expect(dialog.open).toBe(false);
    expect(action).not.toHaveBeenCalled();
  });

  it('runs the action and redirects once deleted', async () => {
    const action = vi.fn(async () => ({ deleted: true }));
    const dialog = renderButton(action);

    fireEvent.click(confirmButton(dialog));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/'));
    expect(action).toHaveBeenCalledOnce();
  });

  it('shows the error and stays on the page when deleting fails', async () => {
    const dialog = renderButton(async () => ({ error: 'This pokemon was already deleted.' }));

    fireEvent.click(confirmButton(dialog));
    expect((await screen.findByRole('alert', { hidden: true })).textContent).toBe('This pokemon was already deleted.');
    expect(replace).not.toHaveBeenCalled();
  });
});
