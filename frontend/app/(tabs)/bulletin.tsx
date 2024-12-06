import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import WriteModal from '../../components/bulletin/WriteModal';
import StickyNote from '../../components/bulletin/StickyNote';
import { usePin } from '@/hooks/usePin';
import { addPost, deletePost } from '@/api/eventPinApi';
import { PostData } from '@/api/eventPinApi';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db, storage } from '@/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImageManipulator from 'expo-image-manipulator';

const height = Dimensions.get('window').height / 2;
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

const BulletinStack = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { selectedPin } = usePin();

    const [isModalVisible, setModalVisible] = useState(false);
    const [text, setText] = useState('');
    const [posts, setPosts] = useState<PostData[]>([]);
    const [flatListHeight, setFlatListHeight] = useState(height);

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
     
      // Usage
    //   (async () => {
    //     const fileUri = "file:///var/mobile/Containers/Data/Application/8270C186-AF99-46C5-8B5E-1AA004A06408/Library/Caches/ExponentExperienceData/@michaell19/explore-penn/ImagePicker/22531B1E-0DF7-42A5-8BD9-12D024665969.jpg";
    //     try {
    //       const url = await uploadImageToFirebase(fileUri);
    //       console.log("Uploaded file available at:", url);
    //     } catch (error) {
    //       console.error("Upload failed:", error);
    //     }
    //   })();

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


    // const handleMove = (id: string, x: number, y: number) => {
    //     console.log('handleMove called for:', { id, x, y }); // Log the sticky note ID and new position

    //     try {
    //         setPosts((prevPosts) => {
    //             console.log('Previous posts:', prevPosts); // Log the current posts state
    //             const updatedPosts = prevPosts.map((post) =>
    //                 post.id === id ? { ...post, x, y } : post
    //             );
    //             console.log('Updated posts:', updatedPosts); // Log the updated posts state
    //             return updatedPosts;
    //         });
    //     } catch (error) {
    //         console.error('Error in handleMove:', error); // Catch and log any errors
    //     }
    // };

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

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#BFBFEE' }}
            contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'center',
                paddingTop: 16,
                paddingBottom: 24
            }}
        >
            {/* Close Button */}
            <TouchableOpacity
                onPress={handleClose}
                className="absolute z-10 top-[62px] right-8"
            >
                <Image
                    source={require('../../assets/images/x-out.png')}
                    className="w-10 h-10"
                />
            </TouchableOpacity>

            {/* Title and Decorative Elements */}
            {/* <View className="flex justify-center items-center w-full aspect-[11/21] bg-[#BFBFEE] pt-14 pb-3 overflow-hidden"> */}
                <View className="w-full h-full bg-[#FAFAFA] mt-10 px-6 pt-10 rounded-lg border-1 border-white relative overflow-hidden">
                    {/* Top Bar */}
                    <View className="absolute -top-[50px] px-20 left-0 right-0 items-center">
                        <View className="w-full h-[60px] bg-[#BFBFEE] opacity-100 rounded-full" />
                    </View>

                    {/* Title Section */}
                    <View className="z-10 flex-row justify-between border-b border-gray-300 pb-2 py-4">
                        <Text className="text-xl font-bold text-[#535353]">
                            {selectedPin?.header}
                        </Text>
                        <View className="flex items-center justify-center">
                            <View className="px-3 py-1 bg-[#EF6A56] rounded-full">
                                <Text className="text-white text-xs">{selectedPin?.start_time}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Organization Name */}
                    <Text className="text-sm text-[#373737] mb-4">org name</Text>

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

                    {/* Dotted Background */}
                    <View className="absolute inset-0 top-40">
                        {Array.from({ length: 35 }).map((_, rowIndex) => (
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
                        <FlatList
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
                        />
                                    {/* Add Post Button */}
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        className="absolute -bottom-[65px] right-0 bg-[#FE8BC0] w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    >
                        <Text className="text-white text-2xl font-bold">+</Text>
                    </TouchableOpacity>
                    </View>
            {/* </View> */}

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
    );
};

export default BulletinStack;