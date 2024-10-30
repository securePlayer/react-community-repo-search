import { takeEvery, call, put, takeLatest } from 'redux-saga/effects';
import { fetchDataStart, fetchDataSuccess, fetchDataFailure } from '../slices/ai.slice';
import functions from '../../helpers/functions';

export const FETCH_AI_DATA = "fetch ai data";

function* fetchData(action) {
  try {
    yield put(fetchDataStart());

    // Construct the URL with query parameters
    const { queryParams } = action.payload;

    // Make the API request using Axios
    const response = yield call(functions.callGemini, queryParams);

    // Dispatch success action with the response data
    yield put(fetchDataSuccess(response));
  } catch (error) {
    yield put(fetchDataFailure(error.message));
  }
}

export default function* watchFetchData() {
  yield takeLatest(FETCH_AI_DATA, fetchData);
}