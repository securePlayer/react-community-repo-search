import { combineReducers } from 'redux';
import repoReducer from './repo.slice';
import aiReducer from './ai.slice';

const rootReducer = combineReducers({
  data: repoReducer,
  ai: aiReducer,
});

export default rootReducer;