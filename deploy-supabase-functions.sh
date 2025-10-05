#!/bin/bash

# Deploy Supabase Edge Functions for Newsletter Automation
# Make sure you have Supabase CLI installed: npm install -g supabase

echo "🚀 Deploying Supabase Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Login to Supabase (if not already logged in)
echo "🔐 Checking Supabase authentication..."
supabase status 2>/dev/null || {
    echo "Please login to Supabase:"
    supabase login
}

# Deploy the newsletter function
echo "📧 Deploying send-newsletter function..."
supabase functions deploy send-newsletter

# Set environment variables for the function
echo "⚙️  Setting environment variables..."
echo "Please set these environment variables in your Supabase dashboard:"
echo "1. Go to your Supabase project dashboard"
echo "2. Navigate to Edge Functions > send-newsletter"
echo "3. Add these environment variables:"
echo "   - NEWSLETTER_API_KEY: your_newsletter_api_key"
echo "   - SITE_URL: https://voidd.space"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set the environment variables in Supabase dashboard"
echo "2. Run the SQL trigger in your Supabase SQL editor"
echo "3. Test by publishing a post in your database"
echo ""
echo "🔗 Your function URL:"
echo "https://your-project-ref.supabase.co/functions/v1/send-newsletter"
