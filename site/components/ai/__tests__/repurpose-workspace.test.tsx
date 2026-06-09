import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RepurposeWorkspace } from '@/components/ai';
import { createRepurposeJob } from '@/lib/ai';

describe('RepurposeWorkspace', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          job: createRepurposeJob({
            sourceType: 'text',
            sourceValue:
              'toolars helps operators move from a useful calculator to an AI workflow without losing focus.',
            platforms: ['twitter-thread', 'linkedin-post'],
            tone: 'professional',
            brandVoiceId: 'founder',
            model: 'toolars-fast',
          }),
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('generates streaming output cards and allows cancellation with partial content preserved', async () => {
    render(<RepurposeWorkspace />);

    fireEvent.change(screen.getByLabelText(/source text/i), {
      target: {
        value:
          'toolars helps operators move from a useful calculator to an AI workflow without losing focus.',
      },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(/streaming outputs/i),
    );
    const outputRegion = screen.getByRole('region', { name: /generated outputs/i });
    expect(
      within(outputRegion).getByRole('heading', { name: /twitter thread/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/canceled/i);
    expect(within(outputRegion).getByText(/drafting twitter thread/i)).toBeInTheDocument();
  });

  it('renders the commercial AI dashboard controls from the design spec', () => {
    render(<RepurposeWorkspace planId="pro" />);

    expect(
      screen.getByRole('region', { name: /ai repurpose workspace/i }),
    ).toBeInTheDocument();

    const sourceTabs = screen.getByRole('tablist', { name: /source type/i });
    expect(within(sourceTabs).getByRole('tab', { name: /text/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(within(sourceTabs).getByRole('tab', { name: /url/i })).toBeInTheDocument();

    expect(screen.getByRole('group', { name: /platform picker/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /generation controls/i })).toHaveTextContent(
      /professional/i,
    );
    expect(screen.getByRole('region', { name: /generation controls/i })).toHaveTextContent(
      /toolars fast/i,
    );

    expect(screen.getByRole('region', { name: /usage and plan state/i })).toHaveTextContent(
      /pro plan/i,
    );
    expect(screen.getByRole('region', { name: /history and saved outputs/i })).toHaveTextContent(
      /local draft history/i,
    );
  });
});
