import React, { useState } from "react";
import { View, ScrollView, Image } from "react-native";
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";
import { styled } from "tailwindcss-react-native";

const StyledView = styled(View);
const StyledImage = styled(Image);

type Sticker = {
    id: number;
    uri: string;
};

const stickers: Sticker[] = [
    { id: 1, uri: "https://example.com/sticker1.png" },
    { id: 2, uri: "https://example.com/sticker2.png" },
    { id: 3, uri: "https://example.com/sticker3.png" },
];

const StickerTray: React.FC<{
    onDragSticker: (sticker: Sticker) => ReturnType<typeof Gesture.Pan>;
}> = ({ onDragSticker }) => {
    return (
        <StyledView className="h-24 bg-gray-200 border-t border-gray-300 p-2">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {stickers.map((sticker) => (
                    <Animated.View
                        key={sticker.id}
                        className="m-2 w-20 h-20 items-center justify-center"
                    >
                        <GestureDetector gesture={onDragSticker(sticker)}>
                            <StyledView className="w-full h-full items-center justify-center">
                                <StyledImage
                                    source={{ uri: sticker.uri }}
                                    className="w-16 h-16"
                                />
                            </StyledView>
                        </GestureDetector>
                    </Animated.View>
                ))}
            </ScrollView>
        </StyledView>
    );
};

const App: React.FC = () => {
    const [boardStickers, setBoardStickers] = useState<
        { sticker: Sticker; x: number; y: number; id: string }[]
    >([]);

    const addStickerToBoard = (sticker: Sticker, x: number, y: number) => {
        setBoardStickers((prev) => [
            ...prev,
            { sticker, x, y, id: `${sticker.id}-${Date.now()}` },
        ]);
    };

    const handleDragSticker = (sticker: Sticker) => {
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);

        return Gesture.Pan()
            .onBegin(() => {
                // Reset position on drag start
                translateX.value = 0;
                translateY.value = 0;
            })
            .onUpdate((event) => {
                // Update position during drag
                translateX.value = event.translationX;
                translateY.value = event.translationY;
            })
            .onEnd(() => {
                // Add to board with final position
                addStickerToBoard(
                    sticker,
                    translateX.value + 100, // Adjust for initial tray offset
                    translateY.value + 500 // Adjust for board positioning
                );
            });
    };

    return (
        <GestureHandlerRootView className="flex-1 bg-gray-50">
            {/* Bulletin Board */}
            <StyledView className="flex-1 bg-white border border-gray-300 m-3 rounded-lg">
                {boardStickers.map(({ sticker, x, y, id }) => (
                    <Animated.Image
                        key={id}
                        source={{ uri: sticker.uri }}
                        style={[
                            {
                                position: "absolute",
                                width: 64,
                                height: 64,
                                resizeMode: "contain",
                                left: x,
                                top: y,
                            },
                        ]}
                    />
                ))}
            </StyledView>

            {/* Sticker Tray */}
            <StickerTray onDragSticker={handleDragSticker} />
        </GestureHandlerRootView>
    );
};

export default App;
