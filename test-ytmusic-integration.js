// Test script for YouTube Music integration
import { searchYTMusicTracks } from "./src/lib/ytmusic.js";

async function testYTMusicSearch() {
    try {
        console.log("Testing YouTube Music search...");
        const results = await searchYTMusicTracks("Lovers rock", 5);
        console.log("Search results:", results);

        if (results.length > 0) {
            console.log("\nFirst result:");
            console.log("- ID:", results[0].id);
            console.log("- Title:", results[0].title);
            console.log("- Artist:", results[0].artist);
            console.log("- Duration:", results[0].duration, "seconds");
            console.log("- Thumbnail:", results[0].thumbnail);
            console.log("- YouTube URL:", results[0].youtube_url);
        }

        console.log("\n✅ YouTube Music integration test passed!");
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

testYTMusicSearch();
