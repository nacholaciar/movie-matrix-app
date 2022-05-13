import { API_KEY, MOVIES_API_URL } from "./config";
import * as model from "./model.js";
import genreCardsView from "./views/genreCardsView";
import paginationView from "./views/paginationView";

// prettier-ignore
/**
 * This function is responsible for rendering the cards in the page
 * as well as the genre buttons, pagination buttons, and the error message.
 * @param {Object} viewType - The view that will be rendered [discoverView.js, trendingView.js, and etc.].
 * @param {String} viewName - The name of the view to be rendered in the page.
 * @param {String} [pageType=home] - The page type to be rendered in the page [home,trending,movies-pop,tvs-pop ].
 * @param {Number} [pageNum=1] - The page number of the movie cards to be displayed.
 */
export const controlMovieCards = async function (viewType, viewName, pageType = "home",pageNum = 1) {
  try {
    console.log("dadadadaad")
    // Empty's genre's array
    model.data.genre.genreArr = [];

    // Render's Loading Spinner
    viewType.renderLoading();
    
    // Create's Movie Data
    await model.createDiscoverCards(pageType,pageNum);

    // Render's HTML Cards
    await viewType.renderHTML(model.data[viewName], model.data.bookMarksData);

    // Sets Pagination View Page number to pageNum
    paginationView.pageNum = pageNum;

    // Render's pagination
    paginationView.renderPagination(model.data.pages.currentPageLast);

    // Render's Genre tags
    if(pageType === "trending"){
      genreCardsView.renderGenreErrorMsg();
    }else{
      await genreCardsView.renderGenreTags(model.data.genre.genresData);
    }
  } catch (error) {
    viewType.renderErrorMsg(error.message)
  }
};

// This function is for fetching data's from TMDB Api
export const apiFetch = async function (
  url,
  pageName = model.data.pages.pageName
) {
  try {
    // Fetches the data
    const movieData = await fetch(url);

    // Throws an error when the response fails
    if (!movieData.ok) throw new Error(movieData.statusText);

    // Takes the response and convert it to JSON
    const movieDataResults = await movieData.json();

    // Sets the current URL to fetched URL
    model.data.pages.currentUrl = url;

    // Sets the obj to which type of page has been clicked
    model.data.pages.pageName = pageName;

    return movieDataResults;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// This function is for creating moviecards
export const createMovieObj = function (movieData) {
  // Returns an Object that contains only Image and Title
  return movieData.map((data) => {
    return {
      title:
        data.title ?? data.name ?? data.original_title ?? data.original_name,
      img: data.poster_path,
      id: data.id,
    };
  });
};

// This function is for getting data's in the api both for TV's and Movies.
export const getMovieTvData = async function (videoId, detailType = "") {
  try {
    // Fetching Movie's and TV's Data's from TMDB API
    const movieData = await fetch(
      `${MOVIES_API_URL}movie/${videoId}${detailType}?api_key=${API_KEY}&language=en-US`
    );
    const tvData = await fetch(
      `${MOVIES_API_URL}tv/${videoId}${detailType}?api_key=${API_KEY}&language=en-US`
    );

    // Throw's and error if Movie's and TV's data doesn't exist
    if (!movieData.ok && !tvData.ok) throw new Error("eeeee");

    const movieDataRes = await movieData.json();
    const tvDataRes = await tvData.json();

    // prettier-ignore
    if(movieDataRes.results || tvDataRes.results){   
      // Merges the 2 results array and filters only the values that isnt undefined
      const finalRes = [tvDataRes.results || movieDataRes.results]
      .concat(tvDataRes.results || movieDataRes.results)
      .filter(val => val !== undefined);
      return finalRes;
    }

    // prettier-ignore
    // Merges the two objects
    const finalRes = Object.assign(movieDataRes,tvDataRes)

    return finalRes;
  } catch (error) {
    throw error;
  }
};