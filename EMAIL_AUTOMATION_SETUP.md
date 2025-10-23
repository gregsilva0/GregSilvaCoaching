# Email Automation Setup Guide

This guide explains how to set up automated email notifications for monthly reminders and weekly summaries.

## Overview

Two types of automated emails are available:
1. **Monthly Reminders**: Sent on the 1st of each month to remind school owners to input their data
2. **Weekly Summaries**: Sent every Monday with key metrics, trends, and performance indicators

Both email types use a single Supabase Edge Function that accepts a `type` parameter.

## Prerequisites

1. **SendGrid Account**: Sign up at [sendgrid.com](https://sendgrid.com) - Free tier includes 100 emails/day
2. **SendGrid API Key**: Create an API key with "Mail Send" permissions
3. **Supabase Project**: Your project is already set up with the edge function deployed

## Step 1: Configure SendGrid API Key

1. Go to your Supabase Dashboard
2. Navigate to **Project Settings** → **Edge Functions** → **Secrets**
3. Add a new secret:
   - Name: `SENDGRID_API_KEY`
   - Value: Your SendGrid API key (starts with `SG.`)

## Step 2: Verify Sender Email in SendGrid

1. Log into SendGrid Dashboard
2. Go to **Settings** → **Sender Authentication**
3. Choose one option:
   - **Single Sender Verification** (easiest): Verify a single email like noreply@yourdomain.com
   - **Domain Authentication** (professional): Verify your entire domain
4. **Important**: Update the edge function code to use your verified sender email

## Step 3: Set Up Automated Scheduling

### Option A: Using Supabase pg_cron (Recommended)

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule monthly reminder (1st of every month at 9 AM UTC)
SELECT cron.schedule(
  'monthly-data-reminder',
  '0 9 1 * *',
  $$
  SELECT net.http_post(
    url := 'https://fpvxoxuprqiodinuqcvj.supabase.co/functions/v1/send-monthly-reminder',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body := '{"type": "monthly"}'::jsonb
  );
  $$
);

-- Schedule weekly summary (Every Monday at 8 AM UTC)
SELECT cron.schedule(
  'weekly-summary-email',
  '0 8 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://fpvxoxuprqiodinuqcvj.supabase.co/functions/v1/send-monthly-reminder',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body := '{"type": "weekly"}'::jsonb
  );
  $$
);
```

**Important**: Replace `YOUR_ANON_KEY` with your Supabase anon key from Project Settings → API.

### Option B: Using External Cron Service (Alternative)

Use services like:
- **Cron-job.org** (free, easy to set up)
- **EasyCron** (free tier available)
- **GitHub Actions** (free for public repos)

Configure them to POST to:
```
URL: https://fpvxoxuprqiodinuqcvj.supabase.co/functions/v1/send-monthly-reminder
Headers: 
  - Authorization: Bearer YOUR_ANON_KEY
  - Content-Type: application/json
Body (Monthly): {"type": "monthly"}
Body (Weekly): {"type": "weekly"}
```

## Step 4: Test the Email Function

### Test Monthly Reminder
```bash
curl -X POST https://fpvxoxuprqiodinuqcvj.supabase.co/functions/v1/send-monthly-reminder \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type": "monthly"}'
```

### Test Weekly Summary
```bash
curl -X POST https://fpvxoxuprqiodinuqcvj.supabase.co/functions/v1/send-monthly-reminder \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type": "weekly"}'
```


## Email Templates

### Monthly Reminder Email
- **Sent**: 1st of every month
- **Subject**: "Monthly Data Entry Reminder - [School Name]"
- **Content**: Reminder to input monthly metrics with login link

### Weekly Summary Email
- **Sent**: Every Monday
- **Subject**: "Weekly Summary - [School Name]"
- **Content**: Key metrics, trends, and performance indicators

## Customization

### Update Email Content
Edit the edge function in Supabase Dashboard → Edge Functions → `send-monthly-reminder`:
- Modify the email HTML templates for monthly or weekly emails
- Update the metrics shown in weekly summaries
- Customize the call-to-action buttons and links


### Change Schedule
Modify the cron expressions:
- `0 9 1 * *` = 1st of month at 9 AM
- `0 8 * * 1` = Every Monday at 8 AM
- Use [crontab.guru](https://crontab.guru) to create custom schedules

### Update Sender Information
Change the `from` field in edge functions to match your verified SendGrid sender.

## Monitoring

1. **SendGrid Dashboard**: View email delivery stats
2. **Supabase Logs**: Check edge function execution logs
3. **Cron Job Status**: Query pg_cron jobs:
   ```sql
   SELECT * FROM cron.job;
   ```

## Troubleshooting

### Emails Not Sending
- Verify SENDGRID_API_KEY is set correctly
- Check SendGrid sender is verified
- Review Supabase edge function logs
- Ensure school_profiles table has email column populated

### Cron Jobs Not Running
- Verify pg_cron extension is enabled
- Check cron job schedule: `SELECT * FROM cron.job;`
- Ensure edge function URLs are correct
- Verify Authorization header includes valid anon key

## Cost Considerations

- **SendGrid Free Tier**: 100 emails/day
- **Supabase Edge Functions**: 500K invocations/month (free tier)
- **pg_cron**: Included with Supabase (no extra cost)

For larger schools, consider upgrading SendGrid plan as needed.
