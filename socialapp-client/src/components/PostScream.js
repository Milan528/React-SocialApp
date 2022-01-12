import  React,{Component, Fragment}  from "react";
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import {style} from '../style/styles'
import {connect} from 'react-redux'
import {postScream,clearErrors} from '../redux/actions/dataActions'
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
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import CircuralProgress from '@material-ui/core/CircularProgress'



class PostScream extends Component{
    state={
        open:false,
        body:'',
       
    }
    handleOpen=()=>{
        this.setState({
            open:true
        })
        
    }
    handleClose=()=>{
        this.setState({
            open:false
        })
        this.setState({
            body:''
        })
        this.props.clearErrors();
    }
    handleChange=(event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    }
    handleSubmit=(event)=>{

        event.preventDefault();
        this.props.postScream({
            body:this.state.body
        },this.handleClose)

    
     }
    render(){
        const {classes,UI:{errors,loading}}=this.props
        return(
            <Fragment>
                <MyButton onClick={this.handleOpen} tip='Create a post!'>
                    <AddIcon/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth='sm'>
                    <MyButton tip='Close' onClick={this.handleClose} tipClassName={classes.closeButton}>
                           <CloseIcon/>
                    </MyButton>
                    <DialogTitle >
                        Create a new post
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField name='body'
                            type='text'
                            label="Post!"
                            multiline
                            rows='3'
                            placeholder='Enter text'
                            error={errors.body? true:false}
                            helperText={errors.body}
                            className={classes.textField}
                            onChange={this.handleChange}
                            fullWidth
                            />
                           <Button type='submit' variant='contained' color='primary' className={classes.submitButton}
                           disabled={loading}>
                               Submit
                               {loading && (<CircuralProgress size={30} className={classes.progressSpinner}/>)}
                           </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>

        )
    }
}


PostScream.propTypes={
    clearErrors:PropTypes.func.isRequired,
    postScream:PropTypes.func.isRequired,
    UI:PropTypes.object.isRequired,
    classes:PropTypes.object.isRequired

}

const mapStateToProps=(state)=>({
    UI:state.UI
})
export default connect(mapStateToProps,{postScream,clearErrors})(withStyles(style)(PostScream))