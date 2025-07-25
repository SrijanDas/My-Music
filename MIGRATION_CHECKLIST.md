# 🎵 Migration Verification Checklist

Use this checklist to verify that your YouTube → Spotify migration was successful.

## ✅ Pre-Migration Checklist

-   [ ] **Backup your database** (in case you need to rollback)
-   [ ] **Note existing queue/room data** (will be cleared during migration)
-   [ ] **Have your Spotify Developer credentials ready**

## 🔧 Setup Verification

### Dependencies

-   [ ] `npm install` completed successfully
-   [ ] No dependency conflicts reported
-   [ ] Build passes: `npm run build`
-   [ ] Linting passes: `npm run lint`

### Environment Setup

-   [ ] Created `.env.local` file
-   [ ] Added `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`
-   [ ] Added `SPOTIFY_CLIENT_SECRET`
-   [ ] Existing Supabase variables still present

### Database Migration

-   [ ] Ran `spotify-migration.sql` in Supabase
-   [ ] No SQL errors reported
-   [ ] Songs table updated with new schema
-   [ ] Existing queue items cleared (expected)

## 🧪 Testing

### Spotify Integration Test

-   [ ] Run `node test-spotify.js`
-   [ ] ✅ Environment variables found
-   [ ] ✅ Successfully obtained access token
-   [ ] ✅ Successfully searched tracks
-   [ ] 🎉 "Spotify integration is working correctly!" message

### Application Testing

-   [ ] `npm run dev` starts without errors
-   [ ] App loads at `http://localhost:3000`
-   [ ] Can create/join rooms
-   [ ] Music search works
-   [ ] Search results show Spotify tracks
-   [ ] Can add tracks to queue

### Playback Testing

-   [ ] Preview URLs work (when available)
-   [ ] HTML5 audio player appears
-   [ ] Play/pause controls work (for creators)
-   [ ] Volume control functions
-   [ ] "Open in Spotify" links work
-   [ ] Progress bar shows correctly

### Real-time Features

-   [ ] Room synchronization still works
-   [ ] Chat messages appear
-   [ ] Queue updates in real-time
-   [ ] User list updates correctly

## 🎯 Feature Verification

### Music Search

-   [ ] Search returns Spotify results
-   [ ] Track metadata displays (title, artist, duration)
-   [ ] Album artwork loads
-   [ ] "No preview available" shows when appropriate
-   [ ] External Spotify links work

### Music Player

-   [ ] Shows current song information
-   [ ] Preview plays when available
-   [ ] Progress bar updates during playback
-   [ ] Volume control affects audio
-   [ ] Skip button advances queue
-   [ ] Sync works across multiple browser tabs

### Queue Management

-   [ ] Can add tracks to queue
-   [ ] Queue displays correctly
-   [ ] Queue items show Spotify metadata
-   [ ] Queue advances automatically
-   [ ] Position updates correctly

## 🚨 Troubleshooting

If any items fail, check:

### Environment Issues

-   **No search results**: Verify Spotify credentials in `.env.local`
-   **API errors**: Check Spotify Developer Dashboard for app status
-   **Token errors**: Ensure Client Secret is correct and not exposed

### Database Issues

-   **Missing songs table**: Re-run `spotify-migration.sql`
-   **Old queue items**: Clear browser cache and refresh
-   **Schema errors**: Verify migration script ran completely

### Playback Issues

-   **No audio**: Check browser audio permissions
-   **Sync problems**: Verify Supabase real-time is working
-   **Missing previews**: Normal - not all tracks have previews

### Performance Issues

-   **Slow search**: May be API rate limiting (normal)
-   **Failed requests**: Check network connection and API status

## 📋 Migration Acceptance Criteria

**✅ Migration is complete when:**

1. **All builds pass** without errors
2. **Spotify test passes** completely
3. **Search returns results** from Spotify
4. **Playback works** for tracks with previews
5. **Real-time sync** functions across users
6. **Queue management** operates correctly
7. **No console errors** during normal operation

## 🎉 Success!

When all items are checked:

-   Your migration is complete ✅
-   Your app now uses Spotify API ✅
-   Users can discover and preview music ✅
-   Full tracks accessible via Spotify ✅
-   Real-time sync maintained ✅

## 📞 Support

If you encounter issues:

1. Check `MIGRATION_COMPLETE.md` for detailed documentation
2. Review `SPOTIFY_SETUP.md` for configuration help
3. Run `test-spotify.js` to diagnose API issues
4. Verify environment variables are correctly set

**Remember**: Preview limitations are normal - not all Spotify tracks have 30-second previews available.
