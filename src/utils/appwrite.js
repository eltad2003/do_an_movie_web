import { Client, ID, Query, TablesDB } from "appwrite";
import { formatPosterUrl } from "./helpers";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

const tablesDB = new TablesDB(client)

export const updateSearchCount = async (query, movie) => {
    console.log(PROJECT_ID, DATABASE_ID, TABLE_ID);

    //check table if exist
    //if exist update count + 1
    //if not exist create new row with query and count = 1
    try {
        const result = await tablesDB.listRows(DATABASE_ID, TABLE_ID, [
            Query.equal("searchQuery", query)
        ])
        if (result.rows.length > 0) {
            const row = result.rows[0];
            await tablesDB.updateRow(DATABASE_ID, TABLE_ID, row.$id, {
                count: row.count + 1
            })
        } else {
            await tablesDB.createRow(DATABASE_ID, TABLE_ID, ID.unique(), {
                movie_id: movie._id,
                searchQuery: query,
                count: 1,
                poster_url: formatPosterUrl(movie.poster_url)
            })
            console.log('new search: ', query);

        }

    } catch (error) {
        console.log(error);
    }
}

export const getTrendingMovies = async () => {
    try {
        const result = await tablesDB.listRows(DATABASE_ID, TABLE_ID, [
            Query.limit(10),
            Query.orderDesc("count")
        ])
        return result.rows

    } catch (error) {
        console.log(error);
    }
}