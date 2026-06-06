# Invitation Email

## Preview in browser

Open `email/invitation.html` locally to vibe on copy and layout.

## Recommended send tools

| Tool | Why |
|------|-----|
| [Brevo](https://www.brevo.com) | Free tier, import HTML, mail merge with `{{first_name}}`, easy for ~100–300 guests |
| [Mailchimp](https://mailchimp.com) | Similar drag-and-drop + HTML import |
| Gmail + Mail merge | Fine for very small lists; awkward for images and tracking |

**Best workflow for designing from this repo:**

1. Edit `email/invitation.html` here in Cursor.
2. Open the file in a browser to preview.
3. Deploy the site so images have public URLs.
4. Replace relative image paths with absolute URLs, e.g.  
   `https://yzzzzzzzzy.github.io/rsvp/assets/images/wedding/cover.jpg`
5. In Brevo: **Campaigns → Create → Code your own → Paste HTML**.
6. Import your guest list from the save-the-date Google Sheet (Name + Email columns).
7. Map `{{first_name}}` to the name column.
8. Send a test to yourself first.

## Subject line ideas

- You're invited — Zhen & Yan, August 22
- Our wedding invitation (+ RSVP inside)
- Join us in Menlo Park — August 22, 2026

## RSVP link to use in the email

```
https://yzzzzzzzzy.github.io/rsvp/
```
