import axios from 'axios';
import {put, takeLatest } from 'redux-saga/effects';


function* fetchShelf() {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      };
  
      const response = yield axios.get('api/shelf', config);
  
      yield put({ type: 'SET_SHELF', payload: response.data });
    } catch (error) {
      console.log('Shelf get request failed', error);
    }
  }
  
  function* shelfSaga() {
    yield takeLatest('FETCH_SHELF', fetchShelf);
  }
  
  export default shelfSaga;