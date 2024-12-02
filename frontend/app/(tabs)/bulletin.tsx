import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import WriteModal from '../../components/bulletin/WriteModal';
import StickyNote from '../../components/bulletin/StickyNote';
import { usePin } from '@/hooks/usePin';
import { fetchPosts, addPost } from '@/api/eventPinApi';
import { PostData } from '@/api/eventPinApi';

const BulletinStack = () => {
    const router = useRouter();
    const [isModalVisible, setModalVisible] = useState(false);
    const [text, setText] = useState('');
    const [posts, setPosts] = useState<PostData[]>([]); // Posts fetched and managed
    const colors = ['#FFB3DE', '#9FE5A9', '#FFCC26', '#D9D9FF', '#87CEEB']; // Predefined colors
    const { selectedPin } = usePin();

    // Fetch posts
    useEffect(() => {
        const loadPosts = async () => {
            if (!selectedPin?.id) return; // Ensure pin is selected
            try {
                const fetchedPosts = await fetchPosts(selectedPin.id);
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Error loading posts:", error);
            }
        };

        loadPosts();
    }, [selectedPin]);

    // Log selected pin
    useEffect(() => {
        console.log('Selected Pin:', selectedPin);
    }, [selectedPin]);

    if (!selectedPin) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16,
                    backgroundColor: '#F2F3FD',
                }}
            >
                <Text>No pin selected</Text>
            </View>
        );
    }

    const handleClose = () => {
        router.push('/(tabs)');
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handlePin = async (imageUri?: string) => {
        if (text.trim() !== '' || imageUri) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const randomX = Math.random() * 100; // Random X position as percentage of width
            const randomY = Math.random() * 100; // Random Y position as percentage of height
            const randomRotation = Math.random() * 360; // Random rotation for fun

            const newPost: PostData = {
                id: '', // Temporary placeholder, will be replaced by backend
                uid: '', // Temporary placeholder, will be replaced by backend
                x: randomX,
                y: randomY,
                rotation: randomRotation,
                words: text,
                picture: imageUri || null,
            };

            setPosts((prev) => [
                ...prev,
            newPost,
            ]);
            setText('');
            setModalVisible(false);

            // try {
            //     // Add post to backend and receive the stored post (with backend-generated `id`)
            //     let storedPost: PostData | undefined;
            //     if (selectedPin?.id) {
            //         storedPost = await addPost(selectedPin.id, newPost);
            //     } else {
            //         console.error('Selected pin ID is undefined');
            //     }
    
            //     if (storedPost !== undefined) {
            //         // Update local state with the complete post from the backend
            //         setPosts((prev) => [
            //             ...prev,
            //             {
            //                 ...storedPost,
            //                 color: randomColor, // Assign color for frontend display
            //             },
            //         ]);
            //     }
    
                // Reset input and close modal
            //     setText('');
            //     setModalVisible(false);
            // } catch (error) {
                
            //     console.error('Error adding post:', error);
            // }
        }
    };

//scale everything to width of screen so we can have consistent full screen view + coordinate system

    return (
        // <View className="flex-1 justify-center items-center bg-[#D9D9FF]"></View>
        <View className="flex-1 justify-start items-center bg-[#D9D9FF]">
            {/* X Button in Top Right Corner */}
            <TouchableOpacity
                onPress={handleClose}
                className="absolute top-16 right-4"
            >
                <Image
                    source={require('../../assets/images/xout.png')}
                    className="w-12 h-12"
                />
            </TouchableOpacity>

            {/* Outer View */}
            {/* <View className="flex justify-center items-center w-[390px] h-[620px] bg-[#BFBFEE] rounded-lg p-4 overflow-hidden"> */}
            <View className="flex justify-center items-center w-full aspect-[11/21] bg-[#BFBFEE] rounded-lg pt-14 pb-3 overflow-hidden">
                {/* Inner View */}
                {/* <View className="w-[370px] h-[600px] bg-[#F2F3FD] rounded-lg p-4 relative"> */}
                <View className="w-full h-full bg-[#F2F3FD] p-10 relative">
                    {/* Rounded Rectangle */}
                    {/* <View className="absolute -top-8 left-0 right-0 items-center">
                        <View className="w-[300px] h-[40px] bg-[#BFBFEE] opacity-100 rounded-full" /> */}
                    <View className="absolute -top-[25px] px-20 left-0 right-0 items-center">
                        <View className="w-full h-[40px] bg-[#BFBFEE] opacity-100 rounded-full" />
                    </View>

                    {/* Title Section */}
                    <View className="flex-row justify-between border-b border-gray-300 pb-2 py-4 mb-4">
                        <Text className="text-lg font-bold text-[#535353]">
                            {selectedPin.header}
                        </Text>
                        <View className="flex items-center justify-center">
                            <View className="px-3 py-1 bg-[#EF6A56] rounded-full">
                                <Text className="text-white text-xs">
                                    {selectedPin.start_time}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Content */}
                    {/* <Text className="text-xs text-[#373737] mb-4">
                        Come to the Ben Franklin statue to speak with UPenn founder Ben
                        Franklin!
                    </Text> */}
                    <Text className="text-sm text-[#373737] mb-4">
                        org name
                    </Text>

                    {/* Corner Dots */}
                    <Image
                        source={require('../../assets/images/bulletincircle.png')}
                        className="absolute top-3 left-14 w-2 h-2"
                    />
                    <Image
                        source={require('../../assets/images/bulletincircle.png')}
                        className="absolute top-3 right-14 w-2 h-2"
                    />
                    {/* <Image
                        source={require('../../assets/images/bulletincircle.png')}
                        className="absolute bottom-2 left-2 w-2 h-2"
                    />
                    <Image
                        source={require('../../assets/images/bulletincircle.png')}
                        className="absolute bottom-2 right-2 w-2 h-2"
                    /> */}


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

                    {/* Sticky Notes Container thats just organized */}
                    {/* <View
                        className="absolute inset-0 mt-12 p-4 pt-16 flex-wrap flex-row"
                        style={{
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 16,
                        }}
                    >
                        {pinnedTexts.map((pin) => (
                            <StickyNote key={pin.id} text={pin.text} color={pin.color} />
                        ))}
                    </View> */}

                    {/* Sticky Notes Container thats random coords, temporary border to show boundaries */}
                    <View className="absolute m-20 my-44 inset-0 border-2 border-red-300">
                    {posts.map((post, index) => (
                            <StickyNote
                                key={index}
                                text={post.words}
                                color={colors[index % colors.length]}
                                style={{
                                    position: 'absolute',
                                    left: `${post.x}%`,
                                    top: `${post.y}%`,
                                    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
                                }}
                                imageUri={post.picture ?? undefined} id={''} userId={''}                            />
                        ))}
                    </View>


                    {/* Swipe Up Section */}
                    {/* <TouchableOpacity
                        onPress={toggleModal}
                        className="absolute bottom-12 left-0 right-0 items-center"
                    >
                        <Image
                            source={require('../../assets/images/swipeup.png')}
                            className="w-6 h-6 mb-2"
                        />
                        <Text className="text-xs text-[#808080]">Swipe Up To Write</Text>
                    </TouchableOpacity> */}

                    {/* Yellow Component for swipeup */}
                    {/* <View className="absolute bottom-0 left-20 right-20 h-12 bg-[#FFCC26] rounded-t-lg items-center justify-center">
                        <View className="w-40 mt-1 h-1 bg-customBlack opacity-60 rounded-full" />
                        <View className="w-40 mt-1 h-1 bg-customBlack opacity-60 rounded-full" />
                    </View> */}
                </View>
            </View>
            {/* add post */}
            <TouchableOpacity
                onPress={toggleModal}
                className="absolute bottom-[150px] right-10 bg-[#FE8BC0] w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            >
                <Text className="text-white text-2xl font-bold">+</Text>
            </TouchableOpacity>
            {/* WriteModal Component */}
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
