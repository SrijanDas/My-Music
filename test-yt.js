import YTMusic from "ytmusic-api";

const ytmusic = new YTMusic();
await ytmusic.initialize(/* Optional: Custom cookies */);

ytmusic.search("Never gonna give you up").then((songs) => {
    console.log(songs);
});
