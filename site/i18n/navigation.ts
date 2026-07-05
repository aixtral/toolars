import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Drop-in replacements for next/link and next/navigation that automatically
// prepend the active locale to every path. Components should import { Link,
// redirect, usePathname, useRouter } from "@/i18n/navigation" instead of
// "next/link" / "next/navigation".
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
