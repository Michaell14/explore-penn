import React, { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type SearchBarProps = {
    placeholder?: string;
    onSearch: (query: string) => void;
};

const suggestions = [
    { id: '1', name: 'The Button Statue', distance: '2 mi' },
    { id: '2', name: 'Harnwell College House', distance: '2.5 mi' },
    { id: '3', name: 'Rodin College House', distance: '2.6 mi' },
];

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', onSearch }) => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleFocus = () => {
        setShowSuggestions(true);
    };

    const handleBlur = () => {
        // if want to hide suggestions when input loses focus
        // setShowSuggestions(false);
    };

    const handleSuggestionPress = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        onSearch(suggestion);
    };

    return (
        <View className="w-full bg-[#D9D9FF] rounded-lg px-4 py-2 shadow-md border border-2 border-gray-100 mt-10">
            {/* Input Row */}
            <View className="flex-row items-center">
                <FontAwesome name="search" size={20} color="#535353" className="mr-2" />
                <TextInput
                    value={query}
                    onChangeText={(text) => setQuery(text)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="flex-1 text-base text-[#535353]"
                    placeholderTextColor="#B5A8D6"
                />
            </View>

            {/* Suggestions */}
            {showSuggestions && (
                <View className="rounded-lg" style={styles.suggestions}>
                    <FlatList className="p-2"
                        data={suggestions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const fillingStr = ' ' + '_'.repeat(29 - item.name.length) + ' ';
                            return <TouchableOpacity
                                onPress={() => handleSuggestionPress(item.name)}
                                className="flex-row justify-left items-center p-2 border-gray-200 last:border-none"
                            >
                                <Image source={require("../assets/images/down-right-arrow.png")} style={styles.downRightArrowIcon} />
                                <Text className="text-[#535353]">{item.name}</Text>
                                <Text className="text-[#A1A1A1]">{fillingStr}</Text>
                                <Text className="text-[#A1A1A1]">{item.distance}</Text>
                            </TouchableOpacity>
                        }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    downRightArrowIcon: {
        width: 18,
        height: 16,
        marginLeft: 8,
        marginRight: 20,
    },
    suggestions: {
        width: "100%",
        backgroundColor: '#E0E0F4',
        marginTop: 10,
    }
});

export default SearchBar;