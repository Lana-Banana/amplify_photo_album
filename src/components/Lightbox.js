import React, { Component } from 'react';
import { Modal, Container} from 'semantic-ui-react';
import { S3Image } from 'aws-amplify-react';
export default class Lightbox extends Component {
    render() {
        return (
            <Modal 
            open={this.props.photo !== null} 
            onClose={this.props.onClose}
            >
                <Modal.Content>
                    <Container textAlign='center'>
                    { 
                        this.props.photo? 
                        <S3Image 
                        imgKey={this.props.photo.key.replace('public/', '')} 
                        theme={{ photoImg: { maxWidth: '100%' } }}
                        onClick={this.props.onClose}
                        /> :
                        null 
                    }
                    </Container>
                </Modal.Content>
            </Modal>
        );
    }
}
