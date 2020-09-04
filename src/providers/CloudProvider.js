import { of } from "rxjs";
export default class CloudProvider {
  files = [
    {
      url:
        "https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3",
      name: "Perfect by Ed Sheeran",
    },
    {
      url:
        "https://ia801609.us.archive.org/16/items/nusratcollection_20170414_0953/Man%20Atkiya%20Beparwah%20De%20Naal%20Nusrat%20Fateh%20Ali%20Khan.mp3",
      name: "Man Atkeya Beparwah by Nusrat Fateh Ali Khan",
    },
    {
      url:
        "https://ia801503.us.archive.org/15/items/TheBeatlesPennyLane_201805/The%20Beatles%20-%20Penny%20Lane.mp3",
      name: "Penny Lane by The Beatles",
    },
  ];

  async callAPI(searchTerm) {
    return fetch(
      `https://deezerdevs-deezer.p.rapidapi.com/search?q=${searchTerm}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
          "x-rapidapi-key": process.env.REACT_APP_DEEZER_API_KEY,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
  }
  async getFiles(searchTerm) {
    const data = await this.callAPI(searchTerm);
    return of(data);
  }
}
