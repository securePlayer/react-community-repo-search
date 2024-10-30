import { all, call } from 'redux-saga/effects';
import getRepos from './repo.sagas';
import getAI from './ai.sagas';

export default function* rootSaga() {
  yield all([
    call(getRepos),
    call(getAI)
  ]);
}