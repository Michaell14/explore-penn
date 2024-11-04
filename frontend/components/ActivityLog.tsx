import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

interface Activity {
    date: string;
    text: string;
}

interface ActivityLogProps {
    activities: Activity[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            <View className="flex-row">
                {/* Vertical Line and Dots */}
                <View className="flex items-center">
                    {activities.map((_, index) => (
                        <View key={index} className="flex items-center mb-8">
                            {/* Dot */}
                            <View className="w-4 h-4 bg-gray-500 rounded-full" />

                            {/* Line Segment */}
                            {index < activities.length - 1 && (
                                <View className="w-px bg-gray-300 flex-1 my-1" style={{ height: 32 }} />
                            )}
                        </View>
                    ))}
                </View>

                {/* Activity Content */}
                <View className="ml-6">
                    {activities.map((activity, index) => (
                        <View key={index} className="mb-8">
                            {/* Date */}
                            <Text className="text-gray-700 font-semibold mb-2">{activity.date}</Text>

                            {/* Content Box */}
                            <View className="bg-gray-200 rounded-lg p-4">
                                <Text className="text-gray-800">{activity.text}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ActivityLog;
