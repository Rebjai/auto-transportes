
const auth = {
    isLoggedIn : (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    
    },

}

// export default auth
export let isLoggedIn = auth.isLoggedIn