export const ListAlbums = `query ListAlbums {
    listAlbums(limit: 9999) {
        items {
            id
            name
        }
    }
}`;

export const SubscribeToNewAlbums = `
  subscription OnCreateAlbum {
    onCreateAlbum {
      id
      name
    }
  }
`;

export const SubscribeToUpdatedAlbums = `
  subscription OnUpdateAlbum {
    onUpdateAlbum {
      id
      name
      owner
      members
    }
  }
`;
// export const GetAlbum = `query GetAlbum($id: ID!) {
//   getAlbum(id: $id) {
//     id
//     name
//   }
// }
// `;

export const GetAlbum = `query GetAlbum($id: ID!, $nextTokenForPhotos: String) {
  getAlbum(id: $id) {
    id
    name
    owner
    members
    photos(sortDirection: DESC, nextToken: $nextTokenForPhotos) {
      nextToken
      items {
        thumbnail {
          width
          height
          key
        }
        fullsize {
          width
          height
          key
        }
      }
    }
  }
}`;

export const SearchPhotos = `query SearchPhotos($label: String!) {
  searchPhotos(filter: { labels: { match: $label }}) {
    items {
      id
      bucket
      thumbnail {
          key
          width
          height
      }
      fullsize {
          key
          width
          height
      }
    }
  }
}`;