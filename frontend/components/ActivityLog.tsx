import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const ActivityLog = () => {
    const activities = [
        {
            time: 'just now',
            userImage: 'https://via.placeholder.com/40', // Replace with actual image URL or local asset
            description: 'Bonnie moved Jese Leos to Funny Group',
            group: 'Funny Group',
        },
        {
            time: '2 hours ago',
            userImage: 'https://via.placeholder.com/40',
            description: 'Thomas Lean commented on Flowbite Pro',
            comment: "Hi ya'll! I wanted to share a webinar zeroheight is having regarding how to best measure your design system! This is the second session of our new webinar series on #DesignSystems discussions where we'll be speaking about Measurement.",
        },
        {
            time: '1 day ago',
            userImage: 'https://via.placeholder.com/40',
            description: 'Jese Leos has changed Pricing page task status to Finished',
            status: 'Finished',
        },
    ];

    return (
        <View className="border-l border-gray-200 dark:border-gray-700">
            {activities.map((activity, index) => (
                <View key={index} className="mb-10 ml-6">
                    {/* User Image */}
                    <View className="absolute -left-3 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                        <Image source={{ uri: activity.userImage }} className="w-full h-full rounded-full shadow-lg" />
                    </View>

                    {/* Activity Content */}
                    <View className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-xs font-normal text-gray-400">{activity.time}</Text>
                        </View>
                        <Text className="text-sm font-normal text-gray-500 dark:text-gray-300">
                            {activity.description.includes('Group') ? (
                                <>
                                    {activity.description.split(' ').slice(0, 2).join(' ')}{' '}
                                    <TouchableOpacity>
                                        <Text className="font-semibold text-blue-600 dark:text-blue-500">Jese Leos</Text>
                                    </TouchableOpacity>{' '}
                                    {activity.description.split(' ').slice(3).join(' ')}
                                    <View className="bg-gray-100 text-gray-800 text-xs font-normal px-2.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-300 inline">
                                        {activity.group}
                                    </View>
                                </>
                            ) : (
                                activity.description
                            )}
                        </Text>

                        {/* Optional Comment */}
                        {activity.comment && (
                            <View className="p-3 mt-3 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-600 dark:border-gray-500">
                                <Text className="text-xs italic font-normal text-gray-500 dark:text-gray-300">{activity.comment}</Text>
                            </View>
                        )}

                        {/* Optional Status */}
                        {activity.status && (
                            <Text className="text-sm font-semibold text-gray-900 dark:text-white">{activity.status}</Text>
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
};

export default ActivityLog;
