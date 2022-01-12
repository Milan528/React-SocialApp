import  React,{Component}  from "react";
import withStyles from '@material-ui/core/styles/withStyles'
import { StylesContext } from "@material-ui/styles/StylesProvider";
import {Link} from 'react-router-dom'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import  Typography  from "@material-ui/core/Typography";
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {likeScream,unlikeScream} from '../redux/actions/dataActions'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import ChatIcon from '@material-ui/icons/Chat'
import MyButton from '../utility/MyButton'
import DeleteScream from '../components/DeleteScream'
const styles={
    card:{
        display:'flex',
        marginBottom: 20,
        position:'relative'
    },
    image:{
       
      minWidth:200,
      objectFit: 'cover',
     

    },
    content:{
        padding:25,
    }

}
 class Scream extends Component{
     likedScream=()=>{
         if(this.props.user.likes && this.props.user.likes.find(like=> like.screamId===this.props.scream.screamId))
          return true;
          else
          return false;

     }
     likeScream=()=>{
         this.props.likeScream(this.props.scream.screamId)

     }
     unlikeScream=()=>{
        this.props.unlikeScream(this.props.scream.screamId)

    }

    render(){
        dayjs.extend(relativeTime)
        const {classes,user:{authenticated,credentials:{handle}}}=this.props;
        const likeButton=!authenticated?(
            <MyButton tip='Like'>
                <Link to='/login'>
                    <FavoriteBorder color='primary'/>
                </Link>
            </MyButton>
        ):(
            this.likedScream()? (
                <MyButton tip='Unlike' onClick={this.unlikeScream}>
                    <FavoriteIcon color='primary'/>
                </MyButton>
            ):(
                <MyButton tip='Like' onClick={this.likeScream}>
                  <FavoriteBorder color='primary'/>
                </MyButton>
            )
        )
        const deleteButton=authenticated && this.props.scream.userHandle===handle ? (
            <DeleteScream screamId={this.props.scream.screamId}/>
        ):null
        return(
            <Card className={classes.card}>
                <CardMedia className={classes.image}
                image={this.props.scream.userImage}
                tittle="Pofile Image"/>
                <CardContent className={classes.content}>
                    <Typography 
                     variant="h5"
                     component={Link}
                      to={`/users/${this.props.scream.userHandle}`} 
                      color='primary'>
                      {this.props.scream.userHandle}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color='textSecondary'>{dayjs(this.props.scream.createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{this.props.scream.body}</Typography>
                    {likeButton}
                    <span>{this.props.scream.likeCount} Likes</span>
                    <MyButton tip='Comments'>
                        <ChatIcon color='primary'/>
                    </MyButton>
                    <span>{this.props.scream.commentCount} Comments</span>
                </CardContent>
                
            </Card>
        )
    }
} 

Scream.propTypes={
    likeScream:PropTypes.func.isRequired,
    unlikeScream:PropTypes.func.isRequired,
    user:PropTypes.object.isRequired,
    scream:PropTypes.object.isRequired,
    classes:PropTypes.object.isRequired
}
const mapStateToProps=(state)=>({
    user:state.user
})

const mapActionsToProps={
    likeScream,
    unlikeScream
}
export default connect(mapStateToProps,mapActionsToProps)(withStyles(styles)(Scream))