import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Game } from '../../types/Game';

type SignUpProps = {
    email: string;
    password: string;
    username: string;
}

export type GameProps = {
    id: number;
    name: string;
    background_image: string;
    addedDate: Date;
    released: string;
    // Add more fields as needed
}
export interface ReGame extends Game {
    addedDate: Date;
}

type LogInProps = {
    email: string;
    password: string;
    // username: string;
}

//sign up user
export const signUp = async ({ email, password, username }: SignUpProps): Promise<FirebaseAuthTypes.User | null> => {
    try {
        const userCredentials = await auth().createUserWithEmailAndPassword(email, password);
        if (userCredentials.user) {
            await userCredentials.user.updateProfile({ displayName: username });
            console.log('User signed up', userCredentials.user?.email);
            await createDefaultLists(userCredentials.user?.uid);
        }
        return userCredentials.user;
    } catch (error) {
        console.log('Error signing up user', error);
        throw error;
    }
};


//login user
export const logIn = async ({ email, password }: LogInProps): Promise<FirebaseAuthTypes.User | null> => {
    try {
        const userCredentials = await auth().signInWithEmailAndPassword(email, password);
        console.log('User logged in', userCredentials.user?.email)
        return userCredentials.user;
    } catch (error) {
        console.log('Error logging in user', error);
        throw error;
    }
};

//log out the current user
export const signOut = async (): Promise<void> => {
    try {
        await auth().signOut();
        console.log('User signed out');
    } catch (error) {
        console.error('Error signing out', error);
        throw error;
    }
};

//get info about current user from firebase
export const getCurrentUser = (): { email: string; username: string } | null => {
    const user = auth().currentUser;
    if (user) {
        return {
            email: user.email ?? '',
            username: user.displayName ?? '',
        }
    }
    return null;
};

//create the default lists when the user signs up (backlog, playlist, wishlist, completed)
const createDefaultLists = async (userId: string | undefined) => {
    if (!userId) {
        throw new Error('User ID is undefined');
    }

    const defaultLists = ['backlog', 'playlist', 'wishlist', 'completed'];

    const batch = firestore().batch();

    defaultLists.forEach(async (listName) => {
        const listRef = firestore().collection('users').doc(userId).collection('lists').doc(listName);
        batch.set(listRef, {
            games: []
        });
    });

    await batch.commit();
};

//add a game to a list in firestore
export const addGameToList = async (userId: string, listName: string, game: GameProps) => {
    try {
        const listsRef = firestore().collection('users').doc(userId).collection('lists');
        const snapshot = await listsRef.get();

        let gameExists = false;

        // Check if the game already exists in any list
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const existingGame = data.games.find((g: GameProps) => g.id === game.id);
            if (existingGame) {
                gameExists = true;
            }
        });

        if (!gameExists) {
            const gameRef = firestore().collection('users').doc(userId).collection('lists').doc(listName);
            await gameRef.update({
                games: firestore.FieldValue.arrayUnion(game),
            });
            console.log('Game added to list:', listName);
        } else {
            console.log('Game already exists in the collection.');
        }
    } catch (error) {
        console.error('Error adding game to list:', error);
        throw new Error('Failed to add game to list. Please try again.');
    }
};

//delete a game from a list in firestore
export const deleteGameFromList = async (userId: string, listName: string, gameId: number) => {
    try {
        const listRef = firestore().collection('users').doc(userId).collection('lists');
        const listDoc = await listRef.doc(listName).get();
        const listData = listDoc.data();
        if (listData && listData.games) {
            // Find the game to remove based on the gameId
            const gameToRemove = listData.games.find((game: any) => game.id === gameId);
            
            if (gameToRemove) {
                // Remove the exact game object from the list
                await listRef.doc(listName).update({
                    games: firestore.FieldValue.arrayRemove(gameToRemove)
                });
                console.log('Deleted game from list', listName);
            } else {
                console.log('Game not found in the list');
            }
        } else {
            console.log('List data not found');
        }
    } catch (error) {
        console.error('Error deleting game', error);
        throw new Error("Failed to delete game from list");
    }
};

//move games between lists
export const moveGameToList = async (userId: string, sourceList: string, targetList: string, game: ReGame) => {
    try {
        const listRef = firestore().collection('users').doc(userId).collection('lists');

        // Get the current state of the source and target lists
        const sourceListDoc = await listRef.doc(sourceList).get();
        const targetListDoc = await listRef.doc(targetList).get();

        // Update the source list to remove the game
        const updatedSourceGames = sourceListDoc.data()?.games.filter((g: ReGame) => g.id !== game.id) || [];

        // Update the target list to add the game with the new addedDate
        const updatedTargetGames = [
            ...targetListDoc.data()?.games || [],
            { ...game, addedDate: new Date() }, // Add the game with updated date
        ];

        // Write the updated lists back to Firestore
        await listRef.doc(sourceList).update({ games: updatedSourceGames });
        await listRef.doc(targetList).update({ games: updatedTargetGames });

        console.log('Moved game to list', targetList);
    } catch (error) {
        console.error('Error moving game', error);
        throw new Error("Failed to move game between lists");
    }
};

//get all lists and games from firestore
export const getUserLists = (userId: string, callback: (lists: any[]) => void) => {
    const listsRef = firestore().collection('users').doc(userId).collection('lists');

    return listsRef.onSnapshot((snapshot) => {
        const listsData = snapshot.docs.map(doc => {
            const data = doc.data();
            const games = data.games.map((game: any) => ({
                ...game,
                addedDate: game.addedDate.toDate(),
            }));
            return {
                id: doc.id,
                ...data,
                games,
                gameCount: games.length, // Calculate the number of games
            };
        });
        callback(listsData);
    }, (error) => {
        console.error('Error fetching user lists:', error);
        // Handle error
    });
};

//gameDetails - show the list name if the game exists in any list
export const getGameList = async (userId: string, gameId: number): Promise<string | null> => {
    try {
        const listName = firestore().collection('users').doc(userId).collection('lists');
        const snapshot = await listName.get();

        for (const doc of snapshot.docs) {
            const list = doc.data();
            if (list.games.find((g: GameProps) => g.id === gameId)) {
                return doc.id;
            }
        }
        return null;
    } catch (error) {
        console.error('Error cheking game status', error);
        throw new Error('Error fetching game list status. Please try again');
    }
};

//delete only the games from the collection. 
export const deleteCollectionGames = async (userId: string) => {
    try {
        const listsRef = firestore().collection('users').doc(userId).collection('lists');
        const snapshot = await listsRef.get();

        const batch = firestore().batch();

        snapshot.docs.forEach(doc => {
            const listRef = listsRef.doc(doc.id);
            batch.update(listRef, { games: [] }); // Set the games array to empty
        });

        await batch.commit();
        console.log('Deleted all games from user collection');
    } catch (error) {
        console.error('Error deleting all games from collection', error);
        throw new Error("Failed to delete all games from collection");
    }
};
