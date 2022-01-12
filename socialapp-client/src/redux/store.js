import {createStore,combineReducers,applyMiddleware,compose} from 'redux'
import thunk from 'redux-thunk'
import userReducer from './reducers/userReducer'
import dataReducer from './reducers/dataReduces'
import uiReducer from './reducers/uiReducer'
const initialState={}

const middleware=[thunk]
//sve iz userReducer cuva se u user
const reducers=combineReducers({
    user: userReducer,
    data: dataReducer,
    UI: uiReducer

})

const store=createStore(reducers,initialState,compose(applyMiddleware(...middleware),
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))

export default store