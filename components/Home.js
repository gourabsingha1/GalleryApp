import { React, useEffect, useState } from 'react';
import { View, Image, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Home() {

    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch images from AsyncStorage
        AsyncStorage.getItem('images')
            .then(storedImages => {
                if (storedImages) {
                    setImages(JSON.parse(storedImages));
                }
            })
            .catch(error => console.error(error));

        // Fetch images from API
        fetch('https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s')
            .then(response => response.json())
            .then(data => {
                const newImages = data.photos.photo.map(item => item.url_s);
                setImages(newImages);

                // Store images in AsyncStorage
                AsyncStorage.setItem('images', JSON.stringify(newImages))
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    }, []);

    const windowWidth = Dimensions.get('window').width;
    const imageSize = windowWidth / 2;

    return (
        <FlatList
            data={images}
            renderItem={({ item }) => (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Image
                        source={{ uri: item }}
                        style={{ justifyContent: 'center', alignItems: 'center', height: imageSize, width: imageSize }}
                    />
                </View>
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
        />
    );
}