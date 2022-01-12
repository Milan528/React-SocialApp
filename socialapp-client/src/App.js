import React,{Component} from 'react';
import './App.css';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import jwt from 'jwt-decode'
import AuthRoute from './utility/AuthRoute'
//pages
import Home from './Pages/home'
import Login from './Pages/login'
import Singup from './Pages/singup'
//components
import Navbar from './components/Navbar';

//utility
import theme from './utility/Theme'

//redux
import {SET_AUTHENTICATED} from './redux/types'
import {logoutUser,getUserData} from './redux/actions/userActions'
import {Provider} from 'react-redux'
import store from './redux/store'
import axios from 'axios';


const token=localStorage.FBIDToken;
if(token)
{
  console.log('Provera tokena')
  const decodedToken=jwt(token)
  if(decodedToken.exp*1000<Date.now()){
    store.dispatch(logoutUser())
    window.location.href='/login'
  
  }
  else
  {
    store.dispatch({
      type:SET_AUTHENTICATED,

    })
    axios.defaults.headers.common['Authorization']=token
    store.dispatch(getUserData())
  }
  
}



export class App extends Component{

  
  render(){
   
      return(
          <MuiThemeProvider theme={theme}>
            <Provider store={store}>
            
            <Router>
            <Navbar/>
              <div className='container'>
              
              <Switch>
                <Route exact path="/" component={Home} />
                <AuthRoute exact path="/login" component={Login} />
                <AuthRoute exact path="/singup" component={Singup}/>
              
              </Switch>

              </div>
              
            </Router>
          
          </Provider>
          </MuiThemeProvider>
      )
  }
} 


export default App;
