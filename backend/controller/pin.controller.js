import {db} from "../server.js"
import admin from 'firebase-admin';

/*
getting pin data, including user and reactions
*/
export const getPin = async (req, res) => {
    const { pin_id } = req.params;

    try {
        // fetch the pin data
        const pinRef = db.collection('posts').doc(pin_id);
        const pinDoc = await pinRef.get();

        if (!pinDoc.exists) {
            return res.status(404).json({ message: "Pin not found." });
        }

        const pinData = pinDoc.data();

        // fetch the user data using u_id from pin data
        const userRef = db.collection('users').doc(pinData.u_id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        const userData = userDoc.data();

        // getting reactions with their corresponding usernames
        const reactionsWithNames = await fetchReactionsWithUserNames(pin_id);

        // structure the response
        const response = {
            pin: {
                ...pinData,
                pin_id: pin_id,
            },
            user: {
                name: userData.name,
                email: userData.email,
            },
            reactions: reactionsWithNames,
        };

        // send the response
        res.status(200).json(response);

    } catch (error) {
        console.error("Error fetching pin details:", error);
        res.status(500).json({ error: "Failed to fetch pin details" });
    }
};

export const addPin = async (req, res) => {
    // Extract parameters from the request body
    const { description, u_id, coordinate } = req.body;

    // Validate the required fields
    if (!description || !u_id || !coordinate || !coordinate.lat || !coordinate.lng) {
        return res.status(400).json({ error: "Missing required fields: description, u_id, or coordinates." });
    }

    try {
        // Add the new post document to the "posts" collection
        const newPost = {
            description,
            u_id,
            coordinate: {
                lat: coordinate.lat,
                lng: coordinate.lng
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const postRef = await db.collection('posts').add(newPost);

        res.status(200).json({ message: "Post successfully added", postId: postRef.id });
    } catch (error) {
        console.error("Error adding post:", error);
        res.status(500).json({ error: "Failed to add post" });
    }
};


/*
getting the top 10 posts
*/
export const getTopPins = async (req, res) => {
    try {
        const pinsSnapshot = await db.collection('posts').get();

        const pins = pinsSnapshot.docs.map(doc => ({
            ...doc.data(),
            post_id: doc.id
        }));

        // count reactions for each pin
        const pinReactionCounts = await Promise.all(
            pins.map(async (pin) => {
                const reactionsRef = db.collection('reactions').where('post_id', '==', pin.post_id);
                const reactionsSnapshot = await reactionsRef.get();
                return {
                    ...pin,
                    reactionCount: reactionsSnapshot.size, // count reactions for this pin
                };
            })
        );

        // sort pins by reaction count in descending order and get the top 10
        const topPosts = pinReactionCounts
            .sort((a, b) => b.reactionCount - a.reactionCount)
            .slice(0, 10);

        res.status(200).json({ topPosts });
    } catch (error) {
        console.error("Error fetching top posts:", error);
        res.status(500).json({ error: "Failed to fetch top posts" });
    }
};


/*
getting reactions
*/
export const getReactions = async (req, res) => {
    const { pin_id } = req.params;

    try {
        const reactionsWithNames = await fetchReactionsWithUserNames(pin_id);
        res.status(200).json({ reactions: reactionsWithNames });

    } catch (error) {
        console.error("Error fetching reactions:", error);
        res.status(500).json({ error: "Failed to fetch reactions" });
    }
};

/*
posting reaction to a specific post
*/
export const postReaction = async (req, res) => {
    const { pin_id } = req.params;
    const { u_id, type } = req.body;

    if (!u_id || !type) {
        return res.status(400).json({ error: "Missing required fields: u_id and type" });
    }

    try {
        // check if the reaction already exists for the user on this post
        const reactionRef = db.collection('reactions')
            .where('post_id', '==', pin_id)
            .where('u_id', '==', u_id)
            .where('type', '==', type);
        
        const reactionSnapshot = await reactionRef.get();

        if (!reactionSnapshot.empty) {
            return res.status(400).json({ error: "Reaction already exists" });
        }

        // add a new reaction to the reactions collection
        const newReaction = {
            post_id: pin_id,
            u_id: u_id,
            type: type,
        };

        await db.collection('reactions').add(newReaction);
        res.status(201).json({ message: "Reaction added successfully", reaction: newReaction });

    } catch (error) {
        console.error("Error posting reaction:", error);
        res.status(500).json({ error: "Failed to post reaction" });
    }
};



/*****
helper functions
*****/

const fetchReactionsWithUserNames = async (pin_id) => {
    // fetch reactions associated with this pin_id
    const reactionsRef = db.collection('reactions').where('post_id', '==', pin_id);
    const reactionsSnapshot = await reactionsRef.get();

    const reactions = reactionsSnapshot.docs.map(doc => doc.data());
    const reactionUserIds = reactions.map(reaction => reaction.u_id);

    // fetch user data for each unique u_id in reactions
    const userPromises = reactionUserIds.map(async (u_id) => {
        const userSnapshot = await db.collection('users').doc(u_id).get();
        return { u_id, name: userSnapshot.exists ? userSnapshot.data().name : "Unknown User" };
    });

    const reactionUsers = await Promise.all(userPromises);

    // combine reactions with user names
    return reactions.map(reaction => {
        const user = reactionUsers.find(u => u.u_id === reaction.u_id);
        return {
            type: reaction.type,
            u_id: reaction.u_id,
            name: user ? user.name : "Unknown User",
        };
    });
};