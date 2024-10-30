import { takeEvery, call, put } from 'redux-saga/effects';
import { fetchDataStart, fetchDataSuccess, fetchDataFailure } from '../slices/repo.slice';
import functions from '../../helpers/functions';

export const FETCH_DATA = "fetch data";

function* fetchData(action) {
  try {
    yield put(fetchDataStart());

    // Construct the URL with query parameters
    const { queryParams } = action.payload;

    // Make the API request using Axios
    const response = yield call(functions.fetchGitHubRepos, queryParams);

    // Dispatch success action with the response data
    yield put(fetchDataSuccess(response));
  } catch (error) {
    yield put(fetchDataFailure(error.message));
  }
}

export default function* watchFetchData() {
  yield takeEvery(FETCH_DATA, fetchData);
}