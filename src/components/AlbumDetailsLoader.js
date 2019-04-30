import React, { Component } from 'react';
// import { Connect } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';
import { Segment, Header, Form } from 'semantic-ui-react';
import { GetAlbum } from './graphql';

import S3ImageUpload from './S3ImageUpload';
import PhotosList from './PhotosList';

export default class AlbumDetailsLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nextTokenForPhotos: null,
            hasMorePhotos: true,
            album: null,
            loading: true
        };
    }

    loadMorePhotos = async () => {
        if (!this.state.hasMorePhotos) return;

        this.setState({ loading: true });
        const { data } = await API.graphql(graphqlOperation(GetAlbum, {
                id: this.props.id, 
                nextTokenForPhotos: this.state.nextTokenForPhotos
            })
        );

        let album;
        if (this.state.album === null) {
            album = data.getAlbum;
        } else {
            album = this.state.album;
            album.photos.items = album.photos.items.concat(data.getAlbum.photos.items);
        }
        this.setState({ 
            album: album,
            loading: false,
            nextTokenForPhotos: data.getAlbum.photos.nextToken,
            hasMorePhotos: data.getAlbum.photos.nextToken !== null
        });
    }

    componentDidMount() {
        console.log(this.props);
        this.loadMorePhotos();
    }

    render() {
        return (
            <AlbumDetails 
                loadingPhotos={this.state.loading} 
                album={this.state.album} 
                loadMorePhotos={this.loadMorePhotos.bind(this)}
                hasMorePhotos={this.state.hasMorePhotos} 
            />
        );
    }
    /*     render() {
        return (
            <Connect query={graphqlOperation(GetAlbum, { id: this.props.id })}>
                {({ data, loading }) => {
                    if (loading) { return <div>Loading...</div>; }
                    if (!data.getAlbum) return;
                    return <AlbumDetails album={data.getAlbum} />;
                }}
            </Connect>
        );
    } */
}

class AlbumDetails extends Component {
    render() {
        if (!this.props.album) return 'Loading album...';
        return (
            <Segment>
                <Header as='h3'>{this.props.album.name}</Header>
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