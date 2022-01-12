import  React,{Component, Fragment}  from "react";
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import {style} from '../style/styles'
import {connect} from 'react-redux'
import {editUserDetails} from '../redux/actions/userActions'
import  Tooltip  from "@material-ui/core/Tooltip";
import IconButton  from "@material-ui/core/IconButton";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit'
import Button from '@material-ui/core/Button';
import { classExpression } from "@babel/types";
import MyButton from "../utility/MyButton";
class EditDetails extends Component{
    state={
        bio:'',
        webSite:'',
        location:'',
        open:false
    }
    mapUserDetailstoState=(credentials)=>{
        this.setState({
            bio:credentials.bio ? credentials.bio:'',
            webSite:credentials.webSite ? credentials.webSite:'',
            location:credentials.location ? credentials.location:'',
        })
    }
    handleSubmit=()=>{
        const userDetails={
            bio:this.state.bio,
            webSite:this.state.webSite,
            location:this.state.location
        }
        console.log('Sending user data')
        console.log(userDetails)
        this.props.editUserDetails(userDetails)
        this.handleClose();
    }
    handleChange=(event)=>{
        console.log(event.target.value)
        this.setState({
            [event.target.name]:event.target.value
        })
    
    }
    handleOpen=()=>{
        this.setState({
            open:true
        })
        this.mapUserDetailstoState(this.props.credentials)
    }
    handleClose=()=>{
        this.setState({
            open:false
        })
    }

    componentDidMount(){
        const {credentials}=this.props;
        this.mapUserDetailstoState(credentials);
       
    }
    
    render(){
        const {classes}=this.props
        return(
            <Fragment>
                
                <MyButton tip='Edit Details' onClick={this.handleOpen} btnClassName={classes.editUserbutton}>
                    <EditIcon color='primary'/>
                </MyButton>
                <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                fullWidth
                maxWidth='sm'>
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                            name='bio'
                            type='text'
                            label='Bio'
                            multiline
                            rows='3'
                            placeholder='A short bio about yourself.'
                            className={classes.textField}
                            value={this.state.bio}
                            onChange={this.handleChange}
                            fullWidth/>
                            <TextField
                            name='webiSite'
                            type='text'
                            label='Web Site'
                            placeholder='Personal/favorite web site.'
                            className={classes.textField}
                            value={this.state.webSite}
                            onChange={this.handleChange}
                            fullWidth/>
                            <TextField
                            name='location'
                            type='text'
                            label='Location'
                            placeholder='Your location.'
                            className={classes.textField}
                            value={this.state.location}
                            onChange={this.handleChange}
                            fullWidth/>
                            
                          
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='primary'>Cancle</Button>
                        <Button onClick={this.handleSubmit} color='primary'>Save</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>

        )
    }

}
const mapStateToProps=(state)=>(
    {
        credentials:state.user.credentials
    }
)




EditDetails.propTypes={
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}
export default connect(mapStateToProps,{editUserDetails})(withStyles(style)(EditDetails))