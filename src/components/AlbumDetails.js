import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { Segment, Header, Form, Icon, List } from 'semantic-ui-react';

import S3ImageUpload from './S3ImageUpload';
import PhotosList from './PhotosList';
import AddUsernameToAlbum from './AddUsernameToAlbum';


export default class AlbumDetails extends Component {
    async componentDidMount() {
        this.setState({
            currentUser: await Auth.currentAuthenticatedUser()
        });
    }
    render() {
        if (!this.props.album) return 'Loading album...';
        return (
            <Segment>
                <Header as='h3'>{this.props.album.name}</Header>
                {
                    this.state.currentUser.username === this.props.album.owner
                    &&
                    <Segment.Group>
                        <Segment>
                            <AlbumMembers members={this.props.album.members} />
                        </Segment>
                        <Segment basic>
                            <AddUsernameToAlbum albumId={this.props.album.id} />
                        </Segment>
                    </Segment.Group>
                }                
                <S3ImageUpload albumId={this.props.album.id}/>       
                <PhotosList photos={this.props.album.photos.items} />
                {
                    this.props.hasMorePhotos && 
                    <Form.Button
                    onClick={this.props.loadMorePhotos}
                    icon='refresh'
                    disabled={this.props.loadingPhotos}
                    content={this.props.loadingPhotos ? 'Loading...' : 'Load more photos'}
                    />
                }
            </Segment>
        );
    }
}

const AlbumMembers = (props) => (
    <div>
        <Header as='h4'>
            <Icon name='user circle' />
            <Header.Content>Members</Header.Content>
        </Header>
        {
            props.members
            ? <List bulleted> 
                {props.members && props.members.map((member) => <List.Item key={member}>{member}</List.Item>)}
                </List>
            : 'No members yet (besides you). Invite someone below!'
        }
    </div>
);