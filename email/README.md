# Invitation Email

## Preview in browser

Open `email/invitation.html` locally to vibe on copy and layout.

## Recommended send tools

| Tool | Why |
|------|-----|
| [Brevo](https://www.brevo.com) | Free tier, import HTML, mail merge with `{{ contact.FIRSTNAME }}`, easy for ~100–300 guests |
| [Mailchimp](https://mailchimp.com) | Similar drag-and-drop + HTML import |
| Gmail + YAMM | ~50 guests, sends from your Gmail, rich text + {{First Name}} merge |

**Best workflow for designing from this repo:**

1. Edit `email/invitation.html` here in Cursor.
2. Open the file in a browser to preview.
3. Deploy the site so images have public URLs.
4. Hero image URL (same as site hero):  
   `https://yzzzzzzzzy.github.io/rsvp/assets/images/hero-candidates/r13.jpg`
5. In Brevo: **Campaigns → Create → Code your own → Paste HTML**.
6. Import your guest list from the save-the-date Google Sheet (Name + Email columns).
7. In the HTML, use `Dear {{ contact.FIRSTNAME }},` (or insert via Brevo’s **{ } Add variable** → Contact attributes → FIRSTNAME).
8. Send a test to yourself first.

## Gmail + Yet Another Mail Merge (~50 guests)

Good if you want emails to come **from your Gmail** with a rich-text invite (not full HTML).

### 1. Google Sheet

Create a sheet with **exactly these headers** (row 1):

| Email | First Name |
|-------|------------|
| guest@example.com | Alex |

- One row per guest (~50 rows).
- **First Name** = what goes after “Dear …” (first name only is fine).
- No blank rows in the middle.

### 2. Gmail draft

1. Gmail → **Compose** (do not send).
2. Copy text from `email/gmail-draft-template.txt`.
3. **Insert hero photo:** toolbar → Insert photo → **Web URL (URL)** → paste the r13 link above.
4. Replace `Dear {{First Name}},` — keep the braces; YAMM fills this in.
5. Select the RSVP URL and click **Link** (same URL as text).
6. Optional: bold the names / date line.
7. **Save as draft** and close (leave it in Drafts).

### 3. Install YAMM

1. In Google Sheets: **Extensions → Add-ons → Get add-ons**.
2. Search **Yet Another Mail Merge** → install.
3. Extensions → YAMM → **Start mail merge**.
4. Pick your draft, map **Email** column, confirm merge tags match **First Name**.
5. **Send a test email to yourself** first (YAMM offers this).
6. Then send to all rows.

### Tips

- Send in one batch of 50 — fine for Gmail.
- If images don’t show for some guests, they can still use the RSVP link.
- Subject line ideas are in `gmail-draft-template.txt`.

## Subject line ideas

- You're invited — Zhen & Yan, August 22
- Our wedding invitation (+ RSVP inside)
- Join us in Menlo Park — August 22, 2026

## RSVP link to use in the email

```
https://yzzzzzzzzy.github.io/rsvp/
```
