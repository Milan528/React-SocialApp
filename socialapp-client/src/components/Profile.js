import  React,{Component, Fragment}  from "react";
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {style} from '../style/styles'
import MuiLink from '@material-ui/core/Link'
import  Typography  from "@material-ui/core/Typography";
import LocationOn from '@material-ui/icons/LocationOn'
import LinkIcon from '@material-ui/icons/Link'
import CalendarToday from '@material-ui/icons/CalendarToday'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import dayjs from 'dayjs'
import Tooltip from '@material-ui/core/Tooltip'
import {uploadImage,logoutUser} from '../redux/actions/userActions'
import KeyboardReturn from '@material-ui/icons/KeyboardReturn'
import EditDetails from './EditDetails'
import MyButton from "../utility/MyButton";
export class Profile extends Component{

    handleLogout=()=>{
        this.props.logoutUser()
    }

    handleImageChange=(event)=>{
        const image=event.target.files[0];
        

        const fromData=new FormData();
        fromData.append('image',image,image.name)
        this.props.uploadImage(fromData)



    }
    handleEditPicture=()=>{
        const fileInput=document.getElementById('imageInput');
        fileInput.click();
    }
    render(){
        const {classes,
            user:{
                credentials:{handle,createdAt,imageUrl,bio,webSite,location
                },
                loading,
                authenticated
            }
        }=this.props
        console.log(classes)
        let profileMarkup=!loading ? (authenticated? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                   <div className="image-wrapper">
                       <img className="profile-image" src={imageUrl} alt='Profile'/>
                       <input type='file' id='imageInput' onChange={this.handleImageChange} hidden='hidden'/>
                      
                      <MyButton tip='Edit profile picture' onClick={this.handleEditPicture} btnClassName="button">
                          <EditIcon color='primary'/>
                      </MyButton>
                   </div>
                   <hr/>
                   <div className="profile-details">
                       <MuiLink component={Link} to={`/users/${handle}`} color='primary' variant='h5'>
                           @{handle}
                       </MuiLink>
                       <hr/>
                       {bio && <Typography variant='body2'>{bio}</Typography>}
                       <hr/>
                       {location && (
                          <Fragment>
                               <LocationOn color='primary'/><span>{location}</span>
                               <hr/>
                          </Fragment>
                       )}
                       {webSite && (
                           <Fragment>
                               <LinkIcon color='primary'/>
                               <a href={webSite} target='_blank' rel='noopener noreferrer'>
                                   {' '}{webSite}
                               </a>
                               <hr/>
                           </Fragment>
                       )}
                       <CalendarToday color='primary'/>{' '}
                       <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>

                   </div>
                   
                   <MyButton tip='Logout' onClick={this.handleLogout}>
                          <KeyboardReturn color='primary'/>
                    </MyButton>
                   <EditDetails>

                   </EditDetails>

                </div>
            </Paper>
        ):(
            <Paper className={classes.paper}>
                <Typography variant='body2' align='center'>
                    No profile found, please login again
                    <div className={classes.buttons}>
                        <Button variant='contained' color='primary' component={Link} to='/login'>
                            Login
                        </Button>
                        <Button variant='contained' color='secondary' component={Link} to='/singup'>
                            Singup
                        </Button>
                    </div>
                </Typography>
            </Paper>
        )):(<p>loading...</p>)
        return profileMarkup;
           
        
    }
} 

const mapStateToProps=(state)=>({
  user:state.user
})

const mapActionsToProps={
    logoutUser,
    uploadImage
}

Profile.propTypes={
    user:PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    logoutUser:PropTypes.func.isRequired,
    uploadImage:PropTypes.func.isRequired
}
export default connect(mapStateToProps,mapActionsToProps)(withStyles(style)(Profile))