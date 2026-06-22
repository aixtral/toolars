import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import en from "../../messages/en.json";

function wrap(ui: ReactNode) {
  return <NextIntlClientProvider locale="en" messages={en}>{ui}</NextIntlClientProvider>;
}

/**
 * Render a component inside a NextIntlClientProvider using the English message
 * bundle. Use this for any component that calls useTranslations so tests don't
 * need to set up the provider themselves.
 *
 * The returned `rerender` also wraps updates in the provider, so component
 * swaps keep the i18n context.
 */
export function renderWithIntl(ui: ReactNode) {
  const utils = render(wrap(ui));
  return {
    ...utils,
    rerender: (nextUi: ReactNode) => utils.rerender(wrap(nextUi))
  };
}
