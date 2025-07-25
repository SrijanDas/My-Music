// Test file to verify Spotify integration setup
// This file helps developers test if their Spotify configuration is working

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testSpotifyCredentials() {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    console.log("🎵 Testing Spotify Integration...\n");

    // Check if credentials are set
    if (!clientId) {
        console.error(
            "❌ NEXT_PUBLIC_SPOTIFY_CLIENT_ID is not set in .env.local"
        );
        return false;
    }

    if (!clientSecret) {
        console.error("❌ SPOTIFY_CLIENT_SECRET is not set in .env.local");
        return false;
    }

    console.log("✅ Environment variables found");
    console.log(`   Client ID: ${clientId.substring(0, 8)}...`);
    console.log(`   Client Secret: ${clientSecret.substring(0, 8)}...\n`);

    // Test getting access token
    try {
        const tokenResponse = await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        Buffer.from(clientId + ":" + clientSecret).toString(
                            "base64"
                        ),
                },
                body: "grant_type=client_credentials",
            }
        );

        if (!tokenResponse.ok) {
            console.error("❌ Failed to get access token from Spotify");
            console.error(`   Status: ${tokenResponse.status}`);
            console.error(`   Response: ${await tokenResponse.text()}`);
            return false;
        }

        const tokenData = await tokenResponse.json();
        console.log("✅ Successfully obtained access token from Spotify");
        console.log(`   Token type: ${tokenData.token_type}`);
        console.log(`   Expires in: ${tokenData.expires_in} seconds\n`);

        // Test search functionality
        const searchResponse = await fetch(
            "https://api.spotify.com/v1/search?q=Taylor%20Swift&type=track&limit=3",
            {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                },
            }
        );

        if (!searchResponse.ok) {
            console.error("❌ Failed to search tracks on Spotify");
            console.error(`   Status: ${searchResponse.status}`);
            return false;
        }

        const searchData = await searchResponse.json();
        console.log("✅ Successfully searched tracks on Spotify");
        console.log(`   Found ${searchData.tracks.items.length} tracks:`);

        searchData.tracks.items.forEach((track, index) => {
            console.log(
                `   ${index + 1}. ${track.name} by ${track.artists[0].name}`
            );
            console.log(
                `      Preview: ${
                    track.preview_url ? "Available" : "Not available"
                }`
            );
        });

        console.log("\n🎉 Spotify integration is working correctly!");
        console.log("\nNext steps:");
        console.log("1. Run `npm run dev` to start the development server");
        console.log("2. Create a room and try searching for music");
        console.log("3. Add songs to the queue and test playback\n");

        return true;
    } catch (error) {
        console.error("❌ Error testing Spotify API:", error.message);
        return false;
    }
}

testSpotifyCredentials().then((success) => {
    process.exit(success ? 0 : 1);
});
