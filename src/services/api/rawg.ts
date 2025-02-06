import axios from 'axios';

import {Screenshots, GameStore} from '../../types/Game';
import {getDateRanges} from '../../utils/dateTime';

//get API key from RAWG API
const API_KEY = '073e39c421ce4638ba42fea55efba786';
const BASE_URL = 'https://api.rawg.io/api';

export const fetchGames = async () => {
  const response = await axios.get(`${BASE_URL}/games?key=${API_KEY}`);
  const filteredGames = response.data.results.filter((game: any) =>
    game.tags.every((tag: any) => !EXCLUDED_TAGS.includes(tag.name)),
  );
  return filteredGames;
};

//exclude words from the search results
const EXCLUDED_WORDS = ['sex', 'nude', 'hentai', 'adult', 'nsfw'];

//search games
export const searchGames = async (query: string) => {
  const response = await axios.get(
    `${BASE_URL}/games?key=${API_KEY}&search=${query}`,
  );
  const retaggedGames = response.data.results.filter((game: any) =>
    game.tags.every((tag: any) => !EXCLUDED_TAGS.includes(tag.name)),
  );
  //filter the search words
  const filteredGames = retaggedGames.filter((game: any) =>
    EXCLUDED_WORDS.every(
      word => !game.name.toLowerCase().includes(word.toLowerCase()),
    ),
  );
  return filteredGames;
};

//fetch game details for selected game
export const fetchGameDetails = async (gameId: number) => {
  const response = await axios.get(
    `${BASE_URL}/games/${gameId}?key=${API_KEY}`,
  );
  return response.data;
};

//get screnshots for selected game
export const fetchScreenShots = async (
  gameId: number,
): Promise<Screenshots[]> => {
  const response = await axios.get(
    `${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}`,
  );
  return response.data.results;
};

//get stores where the game is available. for eg: steam, epic
export const fetchGameStores = async (gameId: number): Promise<GameStore[]> => {
  const response = await axios.get(
    `${BASE_URL}/games/${gameId}/stores?key=${API_KEY}`,
  );
  return response.data.results;
};

//get dlcs for a game
export const fetchAdditions = async (gameId: number) => {
  const response = await axios.get(
    `${BASE_URL}/games/${gameId}/additions?key=${API_KEY}`,
  );
  return response.data.results;
};

//get base game for the dlcs
export const fetchBaseGame = async (gameId: number) => {
  const response = await axios.get(
    `${BASE_URL}/games/${gameId}/parent-games?key=${API_KEY}`,
  );
  return response.data.results;
};

//get other games in the series
export const fetchSeriesGames = async (gameId: number) => {
  const response = await axios.get(
    `${BASE_URL}/games/${gameId}/game-series?key=${API_KEY}`,
  );
  return response.data.results;
};

//get games from developers
export const fetchGamesByDeveloper = async (developer: string) => {
  const response = await axios.get(`${BASE_URL}/games`, {
    params: {
      key: API_KEY,
      developers: developer,
      page_size: 40,
    },
  });
  return response.data.results;
};

//get games from publishers
export const fetchGamesByPublisher = async (publisher: string) => {
  const response = await axios.get(`${BASE_URL}/games`, {
    params: {
      key: API_KEY,
      publishers: publisher,
      page_size: 40,
    },
  });
  return response.data.results;
};

//get games by genre
export const fetchGamesByGenres = async (genre: string) => {
  const response = await axios.get(`${BASE_URL}/games`, {
    params: {
      key: API_KEY,
      genres: genre,
      ordering: '-rating',
      page_size: 40,
    },
  });
  const filteredGames = response.data.results.filter((game: any) =>
    game.tags.every((tag: any) => !EXCLUDED_TAGS.includes(tag.name)),
  );
  return filteredGames;
};

//tags to exclude, dont add tags from main games
//need to include more tags, tags can be in different languages
const EXCLUDED_TAGS = ['NSFW', 'adult', 'hentai', 'sex'];

//get games by tags
export const fetchGamesByTags = async (tag: string) => {
  const response = await axios.get(`${BASE_URL}/games`, {
    params: {
      key: API_KEY,
      tags: tag,
      ordering: '-rating',
      page_size: 40,
    },
  });
  const filteredGames = response.data.results.filter((game: any) =>
    game.tags.every((tag: any) => !EXCLUDED_TAGS.includes(tag.name)),
  );
  return filteredGames;
};

//get games by platoforms
export const fetchGamesByPlatforms = async (platform: number) => {
  const response = await axios.get(`${BASE_URL}/games`, {
    params: {
      key: API_KEY,
      platforms: platform,
      ordering: '-rating',
      page_size: 40,
    },
  });
  const filteredGames = response.data.results.filter((game: any) =>
    game.tags.every((tag: any) => !EXCLUDED_TAGS.includes(tag.name)),
  );
  return filteredGames;
};

//discover - fetch games based on rawg ordering fields
export const discoverGames = async (ordering: string) => {
  try {
    // console.log(`Fetching games with order: ${ordering}`);
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: API_KEY,
        ordering,
        page_size: 20,
      },
    });
    const filteredGames = response.data.results.filter((game: any) =>
      game.tags.every((tag: any) => !EXCLUDED_TAGS.includes(tag.name)),
    );
    // console.log(filteredGames);
    return filteredGames;
  } catch (error) {
    console.error('Error fetching games to discover', error);
  }
};

//get dates from date funtion
const {currentDate, lastYearDate, nextYearDate} = getDateRanges();

//discover - upcoming games
export const fetchUpcomingGames = async () => {
  const response = await axios.get(`${BASE_URL}/games`, {
    params: {
      key: API_KEY,
      dates: `${currentDate},${nextYearDate}`,
      ordering: '-added',
      page_size: 20,
    },
  });
  const filteredGames = response.data.results.filter((game: any) =>
    game.tags.every((tag: any) => !EXCLUDED_TAGS.includes(tag.name)),
  );
  return filteredGames;
};

//discover - fetch new games
export const fetchNewGames = async () => {
  const response = await axios.get(`${BASE_URL}/games`, {
    params: {
      key: API_KEY,
      dates: `${lastYearDate},${currentDate}`,
      ordering: '-released',
      page_size: 20,
    },
  });
  const filteredGames = response.data.results.filter((game: any) =>
    game.tags.every((tag: any) => !EXCLUDED_TAGS.includes(tag.name)),
  );
  return filteredGames;
};

//discover - fetch popular games
export const fetchPopularGames = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: API_KEY,
        dates: `${lastYearDate},${currentDate}`,
        ordering: '-rating',
        page_size: 20,
      },
    });
    const filteredGames = response.data.results.filter((game: any) =>
      game.tags.every((tag: any) => !EXCLUDED_TAGS.includes(tag.name)),
    );
    return filteredGames;
  } catch (error) {
    console.error('Error fetching games to discover', error);
  }
};

//discover - fetch genres
export const fetchGenres = async (ordering: string, genre: string | null) => {
  // console.log(`Fetching games with order: ${ordering} and genre: ${genre}`);
  const response = await axios.get(`${BASE_URL}/games`, {
    params: {
      key: API_KEY,
      ordering: '-metacritic', //based on metascores, change to anything else for that ordering
      genres: genre,
      page_size: 20,
    },
  });
  const filteredGames = response.data.results.filter((game: any) =>
    game.tags.every((tag: any) => !EXCLUDED_TAGS.includes(tag.name)),
  );
  return filteredGames;
};
