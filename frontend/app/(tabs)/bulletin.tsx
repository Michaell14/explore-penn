import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import WriteModal from '../../components/bulletin/WriteModal';
import StickyNote from '../../components/bulletin/StickyNote';
import StickerTray from '../../components/bulletin/StickerTray';
import { usePin } from '@/hooks/usePin';
import { addPost, deletePost } from '@/api/eventPinApi';
import { PostData } from '@/api/eventPinApi';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db, storage } from '@/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImageManipulator from 'expo-image-manipulator';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';


// const height = Dimensions.get('window').height / 2;
const SPACING = 150;
const POSTS_PER_PAGE = 10;


const colors = ['#FFB3DE', '#9FE5A9', '#FFCC26', '#D9D9FF', '#87CEEB'];
const hashStringToIndex = (str: string, arrayLength: number): number => {
    if (!str || arrayLength === 0) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) % arrayLength;
    }
    return hash;
};

const { width, height } = Dimensions.get('window');


const BulletinStack = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { selectedPin } = usePin();

    const [isModalVisible, setModalVisible] = useState(false);
    const [text, setText] = useState('');
    const [posts, setPosts] = useState<PostData[]>([]);
    const [flatListHeight, setFlatListHeight] = useState(height);
    const [stickers, setStickers] = useState<{
        id: string; uri: string; x: number; y: number 
}[]>([]);

    // Fetch posts from Firestore and listen for real-time updates
    useEffect(() => {
        if (!selectedPin?.id) return;

        const postsQuery = query(collection(db, 'eventPins', selectedPin.id, 'posts'));
        const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
            const updatedPosts: PostData[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                x: doc.data().x ?? 0,
                y: doc.data().y ?? 0,
                rotation: doc.data().rotation ?? 0,
                words: doc.data().words ?? 'Untitled',
                uid: doc.data().uid,
                picture: doc.data().picture ?? null,
                isUserPost: doc.data().uid === user?.uid,
            }));
            setPosts(updatedPosts);
        });

        return () => unsubscribe();
    }, [selectedPin, user?.uid]);

    // Update the FlatList's width in increments of POSTS_PER_PAGE
    useEffect(() => {
        const currentThreshold = Math.ceil(posts.length / POSTS_PER_PAGE) * POSTS_PER_PAGE;
        if (posts.length > 0 && flatListHeight < currentThreshold * SPACING) {
            setFlatListHeight(currentThreshold * SPACING);
        }
    }, [posts.length, flatListHeight]);

    const resizeImage = async (uri: string) => {
        const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 400, height: 400 } }], // Resize to 800x800
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        return manipResult.uri;
    };

    // Handle adding a new post
    const handlePin = async (imageUri?: string) => {
        console.log('User:', user); //testing stuff
        console.log('Selected Pin:', selectedPin);
        if (!text.trim() && !imageUri) {
            console.error('Cannot add an empty post.');
            return;
        }

        if (!user || !selectedPin?.id) {
            console.error('User or selected pin is missing.');
            return;
        }

        let downloadURL: any;
        if (imageUri) {
            try {
                console.log("Uploading file from URI:", imageUri);
                const resizedUri = await resizeImage(imageUri);
                downloadURL = await uploadImageToFirebase(resizedUri);
            } catch (error) {
                console.error("Error adding post:", error); // Logs full error details
                const typedError = error as any;
                console.error("Error code:", typedError.code);   // Logs specific error code
                console.error("Error message:", typedError.message); // Logs error message
            }
        }

        // Calculate position for the new post
        const index = posts.length;
        const newPost: PostData = {
            id: '', // Placeholder until Firebase assigns ID
            uid: user.uid,
            x: Math.random() * 100, // Position based on index
            y: index * SPACING, // Random vertical position
            rotation: Math.random() * 40 - 20,
            words: text.trim() || 'Untitled',
            picture: downloadURL || null,
            isUserPost: true,
        };

        try {
            await addPost(selectedPin.id, newPost);
            setText('');
            setModalVisible(false);
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!selectedPin?.id) return;

        try {
            await deletePost(selectedPin.id, postId); // API call
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const uploadImageToFirebase = async (fileUri: string) => {
        try {
            const response = await fetch(fileUri);

            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.statusText}`);
            }
            const blob = await response.blob();
            const filename = `images/${selectedPin?.id || 'unnamed'}_${user?.uid}_${Date.now()}.jpeg`;
            const storageRef = ref(storage, filename);

            try {
                await uploadBytes(storageRef, blob);
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Upload failed with error:", error.message);
                } else {
                    console.error("Upload failed with unknown error:", error);
                }
                console.error("Full error:", error);
                throw error; // Re-throw to debug further
            }

            const downloadURL = await getDownloadURL(storageRef);

            return downloadURL;
        } catch (error) {
            console.error("Error uploading file to Firebase:", error);
            throw error;
        }
    };

    const handleClose = () => router.push('/(tabs)');
    const toggleModal = () => setModalVisible((prev) => !prev);

    const renderStickyNote = ({ item }: { item: PostData }) => (
        <StickyNote
            key={item.id}
            text={item.words}
            color={colors[hashStringToIndex(item.id, colors.length)]}
            style={{
                left: item.x,
                top: item.y,
                transform: [{ translateX: '-50%' }, { translateY: '-50%' }, { rotate: `${item.rotation}deg` }],
            }}
            isUserPost={item.isUserPost}
            imageUri={item.picture ?? undefined}
            onMove={(x, y) => handleMove(item.id, x, y)}
            onDelete={() => handleDelete(item.id)} id={''}
        />
    );

    // Unified render function for FlatList
    const renderItem = ({ item }: { item: PostData | { uri: any; x: number; y: number } }) => {
        // Check if the item is a sticker (has `uri` property)
        if ('uri' in item) {
            console.log(item);
            return (
                <Image
                    key={item.uri}
                    source={item.uri}
                    style={{
                        //position: 'absolute',
                        left: item.x,
                        top: item.y,
                        width: "auto",
                        objectFit: "contain",
                        height: 50,
                    }}
                />
            );
        }

        // Otherwise, render a sticky note
        return (
            <StickyNote
                key={(item as PostData).id}
                text={(item as PostData).words}
                color={colors[hashStringToIndex((item as PostData).id, colors.length)]}
                style={{
                    left: (item as PostData).x,
                    top: (item as PostData).y,
                    transform: [
                        { translateX: '-50%' },
                        { translateY: '-50%' },
                    ],
                }}
                rotation={(item as PostData).rotation}
                isUserPost={(item as PostData).isUserPost}
                imageUri={(item as PostData).picture ?? undefined}
                onMove={(x, y) => handleMove((item as PostData).id, x, y)}
                onDelete={() => handleDelete((item as PostData).id)}
                id={(item as PostData).id}
            />
        );
    };

    // Combine stickers and posts into one array for the FlatList
    const combinedData = [...posts, ...stickers];
    console.log('Combined Data:', combinedData);



    const handleMove = (id: string, x: number, y: number) => {
        console.log('handleMove called with:', { id, x, y });

        // Check if the ID exists in posts
        const postExists = posts.some((post) => post.id === id);
        if (!postExists) {
            console.error('Post with the given ID does not exist:', id);
            return;
        }

        if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) {
            console.error('Invalid x or y values:', { x, y });
            return;
        }


        try {
            setPosts((prevPosts) => {
                console.log('Previous posts state:', prevPosts);
                const updatedPosts = prevPosts.map((post) =>
                    post.id === id ? { ...post, x, y } : post
                );
                console.log('Updated posts state:', updatedPosts);
                return updatedPosts;
            });
        } catch (error) {
            console.error('Error in handleMove state update:', error);
        }
    };

    // Handle clicking a sticker to add it to the bulletin
    const handleAddSticker = (uri: string) => {
        console.log('Adding sticker:', uri);
        setStickers((prevStickers) => [
            ...prevStickers,
            { id: `${Date.now()}`, uri, x: 50, y: 50 }, // Initialize at a default position
        ]);
    };

    // Handle moving a sticker
    const handleStickerMove = (id: string, x: number, y: number) => {
        setStickers((prevStickers) =>
            prevStickers.map((sticker) =>
                sticker.id === id ? { ...sticker, x, y } : sticker
            )
        );
    };



    // Render stickers on the bulletin board
    const renderSticker = (sticker: { uri: string; x: number; y: number }, index: number) => {
        console.log(`Rendering sticker #${index}`, sticker);
        return (
            <Image
                key={index}
                source={{ uri: sticker.uri }}
                style={{
                    position: 'absolute',
                    left: sticker.x,
                    top: sticker.y,
                    width: 50,
                    height: 50,
                    resizeMode: 'contain',
                }}
            />
        );
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#B1B1FF' }}>
            <ScrollView
                style={{ flex: 1, backgroundColor: '#B1B1FF' }}
                contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: 'center',
                    paddingTop: 16,
                    paddingBottom: 32,
                    //paddingBottom: 120, // leaving space for sticker tray
                }}
            >
                {/* Close Button */}
                <TouchableOpacity
                    onPress={handleClose}
                    style={{
                        position: 'absolute',
                        top: 68,
                        right: 20,
                        zIndex: 10,
                    }}
                >
                    <Image
                        source={require('../../assets/images/logout.png')}
                        style={{ width: 20, height: 20 }}
                    />
                </TouchableOpacity>

                {/* Title and Decorative Elements */}
                <View className="w-full h-full bg-[#FAFAFA] mt-10 px-8 pt-10 rounded-lg border-1 border-white relative overflow-hidden">
                    {/* Top Bar */}
                    <View className="absolute -top-[50px] px-20 left-0 right-0 items-center">
                         <View className="w-full h-[60px] bg-[#B1B1FF] opacity-100 rounded-full" />
                    </View>

                    {/* Title Section */}
                    <Text className="text-3xl font-bold text-[#535353] pt-5">
                        {selectedPin?.header}
                    </Text>
                    <View className="z-10 flex-row justify-start gap-2 border-b border-gray-300 py-1">
                        <Text style={{ fontSize: 12, color: '#5500FF' }}>
                            {selectedPin?.start_time} - {selectedPin?.end_time} | Penn Spark
                        </Text>
                    </View>

                    {/* Render Stickers */}
                    {/* {stickers.map((sticker, index) => renderSticker(sticker, index))} */}

                    {/* Organization Name */}
                    <Text className="text-sm text-[#373737] mb-4 pt-3 w-full border-t border-white">
                        {selectedPin?.description}
                    </Text>

                    {/* Dotted Background */}
                    <View style={{ position: 'relative', height: '100%', width: '100%', marginTop: 70, paddingBottom: 40, zIndex: 0 }}>
                        <View className="absolute inset-0">
                            {Array.from({ length: Math.ceil(flatListHeight / 30) }).map((_, rowIndex) => (
                                <View key={rowIndex} className="flex-row justify-center">
                                    {Array.from({ length: 18 }).map((_, colIndex) => (
                                        <View
                                            key={colIndex}
                                            className="w-[0.5vw] h-[0.5vw] bg-gray-300 rounded-full mx-[2.1vw] my-[2.1vw]"
                                        />
                                    ))}
                                </View>
                            ))}
                        </View>

                        {/* Horizontal Scrolling Sticky Notes */}
                        {/* <FlatList
                            data={posts}
                            keyExtractor={(item) => item.id}
                            renderItem={renderStickyNote}
                            onEndReachedThreshold={0.5}
                            contentContainerStyle={{
                                height: flatListHeight,
                                marginHorizontal: 20,
                                borderColor: 'red',
                                borderWidth: 1,
                            }}
                            style={{
                                overflow: 'visible',
                            }}
                        /> */}

                        <View style={{ flex: 1, position: 'relative', zIndex: 5}}>
                            <FlatList
                                data={combinedData}
                                keyExtractor={(item, index) =>
                                    'id' in item ? item.id : `${item.uri}-${index}`
                                }
                                renderItem={renderItem}
                                onEndReachedThreshold={0.5}
                                contentContainerStyle={{
                                    height: flatListHeight,
                                    marginHorizontal: 20,
                                    borderColor: 'red',
                                    borderWidth: 1,
                                }}
                                style={{
                                    overflow: 'visible',
                                }}
                            />
                        </View>

                     {/* Dotted Background */}
                     <View className="absolute inset-0">
                        {Array.from({ length: Math.ceil(flatListHeight / 19) }).map((_, rowIndex) => (
                            <View key={rowIndex} className="flex-row justify-center">
                                {Array.from({ length: 18 }).map((_, colIndex) => (
                                    <View
                                        key={colIndex}
                                        className="w-[0.5vw] h-[0.5vw] bg-gray-300 rounded-full mx-[2.1vw] my-[2.1vw]"
                                    />
                                ))}
                            </View>
                        ))}
                    </View>


                    </View>

                    {/* <StickerTray /> */}
                    {/* Corner Dots */}
                    <Image
                        source={require('../../assets/images/bulletincircle.png')}
                        className="absolute top-6 left-6 w-2 h-2"
                    />
                    <Image
                        source={require('../../assets/images/bulletincircle.png')}
                        className="absolute bottom-3 left-3 w-2 h-2"
                    />
                    <Image
                        source={require('../../assets/images/bulletincircle.png')}
                        className="absolute bottom-3 right-3 w-2 h-2"
                    />
                </View>

                {/* Write Modal */}
                <WriteModal
                    isVisible={isModalVisible}
                    text={text}
                    pin_id={selectedPin?.id ?? 'undefined pin'}
                    setText={setText}
                    onClose={toggleModal}
                    onPin={handlePin}
                />




            </ScrollView>


            {/* Sticker Tray */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 100,
                    backgroundColor: '#FAFAFA',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5,
                    paddingRight: 100,
                }}
            >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        alignItems: 'center',
                        paddingHorizontal: 16,
                    }}
                >
                    <StickerTray onAddSticker={handleAddSticker} />
                </ScrollView>
            </View>

            {/* Add Post Button */}
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                    position: 'absolute',
                    bottom: 15,
                    right: 15,
                    height: 70,
                    width: 70,
                    borderRadius: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                }}
            >
                    <ImageBackground
                    source={require('../../assets/images/yellow-post-it.png')} // Replace with your image path
                    style={{
                        flex: 1,
                        width: 70,
                        height: 70,
                    }}
                    ></ImageBackground>
                <Text style={{ marginBottom: 15, color: 'white', fontSize: 36 }}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

export default BulletinStack;