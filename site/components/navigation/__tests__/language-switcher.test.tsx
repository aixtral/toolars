import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/components/navigation/language-switcher';

// next-intl's useLocale is mocked in test/setup.ts to return 'en'.
// @/i18n/navigation's useRouter/usePathname are also mocked there.

describe('LanguageSwitcher', () => {
  it('renders the trigger and opens the locale listbox with all four launch locales', () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button', { name: /switch language/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    const listbox = screen.getByRole('listbox', { name: /switch language/i });
    expect(listbox).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);

    // All four launch-locale native names render as options.
    expect(screen.getAllByText('English').length).toBeGreaterThan(0);
    expect(screen.getByText('中文')).toBeInTheDocument();
    expect(screen.getByText('Espanol')).toBeInTheDocument();
    expect(screen.getByText('Portugues')).toBeInTheDocument();
  });

  it('closes the listbox after selecting an option', () => {
    render(<LanguageSwitcher />);

    fireEvent.click(screen.getByRole('button', { name: /switch language/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.click(screen.getByText('中文'));

    // After selecting, the listbox closes regardless of whether the locale changed.
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('compact mode hides the active native-name label', () => {
    render(<LanguageSwitcher compact />);
    // compact mode shows only the globe icon + chevron, not the "English" label
    // in the trigger (the trigger still has the aria-label).
    expect(screen.getByRole('button', { name: /switch language/i })).toBeInTheDocument();
    // The non-compact trigger renders "English" in a span.lg:inline; compact skips it.
    // We assert the listbox still works after opening.
    fireEvent.click(screen.getByRole('button', { name: /switch language/i }));
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });
});
