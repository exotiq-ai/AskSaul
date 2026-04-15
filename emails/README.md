# AskSaul Email Templates

React Email templates for the proposal builder. Sent via Resend from the Next.js API routes (and the MCP server for `proposal.tsx`).

## Templates

| File                        | Purpose                                      | Triggered by                              |
| --------------------------- | -------------------------------------------- | ----------------------------------------- |
| `confirmation.tsx`          | Customer "we got it" email                   | `POST /api/proposal` on successful submit |
| `internal-notification.tsx` | Gregory's structured lead alert              | `POST /api/proposal` on successful submit |
| `proposal.tsx`              | Saul's quote delivery (HTML + markdown body) | MCP server `send_proposal` tool call      |

## API shape

Every template exports:

- A **default** React component rendering the email body.
- A **`subject`** function that takes the same props and returns the inbox subject string. Use this to keep subject logic alongside the template.

```ts
import Confirmation, { subject } from "@/emails/confirmation";

const html = render(<Confirmation {...props} />);
const subj = subject(props);
```

## Preview locally

```bash
npx react-email dev --dir emails
```

This boots the React Email preview server (default port 3001) and hot-reloads any file in `emails/`. Each template renders with its own fake prop set — add an `export const preview` or a `.preview.tsx` sibling if you want to pin demo data.

If `react-email` is not installed yet:

```bash
npm i -D react-email
```

## Editing conventions

- Brand colors live in a `const brand = {...}` block at the top of every template. Update once, propagates to everything inline-styled below.
- Inline styles only — Gmail strips `<style>` tags. Use the `brand` object plus plain JS style objects.
- `<Preview>` goes at the top of every email. That's the grey snippet Gmail/Apple Mail show in the inbox list.
- Subject lines never use em-dashes, always use "Gregory" (not "Greg"), and follow the brand voice: direct, specific, confident.
- Keep each template under 250 LOC. Extract shared bits into `emails/_shared.tsx` if that grows.

## Testing in Resend

In dev, set `RESEND_DEV_TO=you@example.com` to redirect every send there. The send call should use the rendered `html` plus a plain-text fallback (`internal-notification.tsx` already includes one at the bottom of the component; for the other two, render from the markdown source or pass `text` explicitly).
