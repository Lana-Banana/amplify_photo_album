import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { GetAlbum, SubscribeToUpdatedAlbums } from './graphql';
import AlbumDetails from './AlbumDetails';

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
        const subscription = API.graphql(graphqlOperation(SubscribeToUpdatedAlbums)).subscribe({
            next: (update) => {
                const album = update.value.data.onUpdateAlbum;
                this.setState({ 
                    album: Object.assign(this.state.album, album)
                });
            }
        });
        this.setState({ 
            albumUpdatesSubscription: subscription
        });
    }
    componentWillUnmount() {
        this.state.albumUpdatesSubscription.unsubscribe();
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
