import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "firebase/auth";
import { authSlice } from "./authReducer";

const { updateUserProfile, authSignOut, authStateChange, updateSelectedImage } = authSlice.actions;

export const authSignUpUser = ({ login, email, password, photoURL }) => async (
    dispatch,
    getState
) => {
    try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, {
            displayName: login,
            photoURL: photoURL,
            
        });
        const user = auth.currentUser;
        const { displayName, uid } = user;
        const userUpdateProfile = {
            login: displayName,
            userId: uid,
            email: email,
            photoURL: photoURL,
        };
        dispatch(updateUserProfile(userUpdateProfile));
    } catch (error) {
        console.log("error", error);
        console.log("error.message", error.message);
    }
};

export const authSignInUser = ({ email, password }) => async (
    dispatch,
    getState
) => {
try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;
    const { displayName, uid, photoURL } = user;
    const userUpdateProfile = {
        login: displayName,
        userId: uid,
        email: email,
        photoURL: photoURL,
    };
    dispatch(updateUserProfile(userUpdateProfile));

} catch (error) {
    console.log("error", error);
    console.log("error.code", error.code);
    console.log("error.message", error.message);
}
};


export const authSignOutUser = () => async (dispatch, getState) => {
    const auth = await getAuth();
    await signOut(auth);
    dispatch(authSignOut());
};

export const authStateChangeUser = () => async (dispatch, getState) => {
    const auth = await getAuth();
    await onAuthStateChanged(auth, (user) => {
        if (user) {
            const userUpdateProfile = {
                nickName: user.displayName,
                userId: user.uid,
            };
            dispatch(authStateChange({ stateChange: true }));
            dispatch(updateUserProfile(userUpdateProfile));
        }
    });
};

export const updateProfileWithAvatar = (photoURL) => async (dispatch) => {
    try {
        const auth = getAuth();
        await updateProfile(auth.currentUser, {
            photoURL: photoURL,
        });
        dispatch(updateSelectedImage(photoURL));
        } catch (error) {
        console.log(error);
        }
    };