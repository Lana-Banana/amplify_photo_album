import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Input } from 'semantic-ui-react';
import { GetAlbum } from './graphql';

export default class AddUsernameToAlbum extends Component {
    constructor(props) {
        super(props);
        this.state = { username: '' };
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })
    
    handleSubmit = async (event) => {
        event.preventDefault();
        
        const { data } = await API.graphql(graphqlOperation(GetAlbum, {id: this.props.albumId}));
        
        let updatedAlbum = data.getAlbum;
        const updatedMembers = (data.getAlbum.members || []).concat([this.state.username]);
        updatedAlbum.members = updatedMembers;
        const {id, name, owner, members} = updatedAlbum;
        const updatedAlbumInput = {id, name, owner, members};
        const UpdateAlbum = `mutation UpdateAlbum($input: UpdateAlbumInput!) {
            updateAlbum(input: $input) {
            id
            members
            }
        }
        `;
    
        const result = await API.graphql(graphqlOperation(UpdateAlbum, { input: updatedAlbumInput }));
    
        console.log(`Added ${this.state.username} to album id ${result.data.updateAlbum.id}`);
    
        this.setState({ username: '' });
    } 
    render() {
        return (
            <Input
            type='text'
            placeholder='Username'
            icon='user plus'
            iconPosition='left'
            action={{ content: 'Add', onClick: this.handleSubmit }}
            name='username'
            value={this.state.username}
            onChange={this.handleChange}
            />
        );
    }
}
