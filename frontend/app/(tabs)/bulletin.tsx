import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import WriteModal from '../../components/bulletin/WriteModal';
import StickyNote from '../../components/bulletin/StickyNote';
import { usePin } from '@/hooks/usePin';
import { addPost, deletePost } from '@/api/eventPinApi';
import { PostData } from '@/api/eventPinApi';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

const { width } = Dimensions.get('window');
const SPACING = 100;
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
    const [flatListWidth, setFlatListWidth] = useState(width);

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
        if (posts.length > 0 && flatListWidth < currentThreshold * SPACING) {
            setFlatListWidth(currentThreshold * SPACING);
        }
    }, [posts.length, flatListWidth]);

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

        // Calculate position for the new post
        const index = posts.length;
        const newPost: PostData = {
            id: '', // Placeholder until Firebase assigns ID
            uid: user.uid,
            x: index * SPACING, // Position based on index
            y: Math.random() * 100, // Random vertical position
            rotation: Math.random() * 40 - 20,
            words: text.trim() || 'Untitled',
            picture: imageUri || null,
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
                transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
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
        <View className="flex-1 justify-start items-center bg-[#D9D9FF]">
            {/* Close Button */}
            <TouchableOpacity onPress={() => router.push('/(tabs)')} className="absolute top-16 right-4">
                <Image source={require('../../assets/images/xout.png')} className="w-12 h-12" />
            </TouchableOpacity>

            {/* Title and Decorative Elements */}
            <View className="flex justify-center items-center w-full aspect-[11/21] bg-[#BFBFEE] pt-14 pb-3 overflow-hidden">
                <View className="w-full h-full bg-[#F2F3FD] p-10 relative">
                    {/* Top Bar */}
                    <View className="absolute -top-[25px] px-10 left-0 right-0 items-center">
                        <View className="w-full h-[40px] bg-[#BFBFEE] opacity-100 rounded-full" />
                    </View>

                    {/* Title Section */}
                    <View className="flex-row justify-between border-b border-gray-300 pb-2 py-4">
                        <Text className="text-lg font-bold text-[#535353]">
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
                        className="absolute top-3 left-3 w-2 h-2"
                    />
                    <Image
                        source={require('../../assets/images/bulletincircle.png')}
                        className="absolute top-3 right-3 w-2 h-2"
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
                    <View className="absolute inset-0 top-36">
                        {Array.from({ length: 24 }).map((_, rowIndex) => (
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
                    <View style={{ overflow: 'visible', position: 'relative', width: '100%', aspectRatio: '7/10', marginTop: 30 }}>
                        <FlatList
                            data={posts}
                            keyExtractor={(item) => item.id}
                            renderItem={renderStickyNote}
                            horizontal
                            onEndReachedThreshold={0.5}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                width: flatListWidth,
                                paddingHorizontal: width / 7,
                                borderColor: 'red',
                                borderWidth: 1,
                            }}
                            style={{
                                overflow: 'visible',
                            }}
                        />
                    </View>
                </View>
            </View>

            {/* Add Post Button */}
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="absolute bottom-[150px] right-10 bg-[#FE8BC0] w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            >
                <Text className="text-white text-2xl font-bold">+</Text>
            </TouchableOpacity>

            {/* Write Modal */}
            <WriteModal
                isVisible={isModalVisible}
                text={text}
                setText={setText}
                onClose={toggleModal}
                onPin={handlePin}
            />
        </View>
    );
};

export default BulletinStack;