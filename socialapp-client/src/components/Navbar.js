import  React,{Component,Fragment}  from "react";
import {Link} from 'react-router-dom';
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import MyButton from '../utility/MyButton'
import AddIcon from '@material-ui/icons/Add'
import HomeIcon from '@material-ui/icons/Home'
import Notifications from '@material-ui/icons/Notifications'
//MATERIAL UI
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import PostScream from './PostScream'
export class Navbar extends Component{
    render(){
        const {authenticated}=this.props;
        return(
            <div>
                <AppBar>
                    <Toolbar className="nav-container">
                       {authenticated? (
                           <Fragment>
                               <PostScream/>
                               <MyButton tip='Home'>
                               <Link to='/'>
                                     <HomeIcon color='primary'/>
                                </Link>
                               </MyButton>
                               <MyButton tip='Notifications'>
                                   <Notifications color='primary'/>

                               </MyButton>
                           </Fragment>
                       ):(
                           <Fragment>
                            <Button color="inherit" component={Link} to='/login'>Login</Button>
                            <Button color="inherit" component={Link} to='/'>Home</Button>
                            <Button color="inherit" component={Link} to='/singup'>Singup</Button>
                            </Fragment>
                       )}

                    </Toolbar>
                </AppBar>
                
            </div>
        )
    }
} 
Navbar.propTypes={
    authenticated: PropTypes.bool.isRequired
}
const mapStateToProps=(state)=>({
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps)(Navbar)