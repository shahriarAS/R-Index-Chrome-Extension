async function rInd(api_key, channel_id) {
  const Channelurl = "https://youtube.googleapis.com/youtube/v3/channels";
  const playListUrl = "https://youtube.googleapis.com/youtube/v3/playlistItems";
  const videoUrl = "https://www.googleapis.com/youtube/v3/videos";
  const apiOth = `&key=${api_key}`;

  const random_video = new URL(document.querySelector("#thumbnail").href);
  const random_video_id = random_video.searchParams.get("v");

  var channel_id = "";

  await axios
    .get(videoUrl + `?part=snippet&id=${random_video_id}` + apiOth)
    .then((response) => (channel_id = response.data.items[0].snippet.channelId))
    .catch((err) => console.log(err));

  var res = [];
  await axios
    .get(
      Channelurl + `?part=statistics,contentDetails&id=${channel_id}` + apiOth
    )
    .then(function (response) {
      res = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  const subscriberCount = res["items"][0]["statistics"]["subscriberCount"];

  playlist_id =
    res["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"];

  var videos = [];
  await axios
    .get(
      playListUrl +
        `?playlistId=${playlist_id}&part=snippet&maxResults=10` +
        apiOth
    )
    .then(function (response) {
      videos = response.data.items.map(
        (vidItem) => vidItem.snippet.resourceId.videoId
      );
    })
    .catch(function (error) {
      console.log(error);
    });

  videos = videos.join(",");

  var videoInfo = [];

  await axios
    .get(videoUrl + `?part=statistics&id=${videos}` + apiOth)
    .then((response) => (videoInfo = response.data.items))
    .catch((err) => console.log(err));

  const last10ViewsList = videoInfo.map((i) => Number(i.statistics.viewCount));
  // console.log(videoInfo);
  var last10ViewsSum = last10ViewsList.reduce(function (a, b) {
    return a + b;
  }, 0);
  // console.log(last10ViewsList)
  // console.log("Your Last 10 videos Views: ", last10ViewsSum);
  // console.log("Your Channels Total Subscriber: ", subscriberCount);
  const rIndex = last10ViewsSum / 10 / subscriberCount;
  const subscriber_page = document.querySelector("#subscriber-count");
  const subscriber_search = document.querySelector("#subscribers");

  function nFormatter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "K" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    return item
      ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
      : "0";
  }

  if (subscriber_page) {
    subscriber_page.innerHTML = `${nFormatter(
      subscriberCount,
      1
    )} subscribers || <b>R-index: ${rIndex.toFixed(2)}</b>`;
  } else if (subscriber_search) {
    subscriber_search.innerHTML = `${nFormatter(
      subscriberCount,
      1
    )} subscribers || <b>R-index: ${rIndex.toFixed(2)}</b>`;
  }
}

rInd(
  (api_key = "AIzaSyDwFG9iINz7D01PUREmY014zZlZ9gHggQw"),
  (channel_id = "UCwIzJ_UWnn1Uc8d1H8nCuUA")
);
