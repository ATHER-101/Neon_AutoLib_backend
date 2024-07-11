import { Router } from "express";
import passport from 'passport';
import jwt from 'jsonwebtoken';


const router = Router();

router.get("/api/auth/google", passport.authenticate("google"));

const generateAccessToken = (user) => {
    return jwt.sign({ user }, 'YOUR_JWT_SECRET', { expiresIn: '30s' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ user }, 'YOUR_REFRESH_TOKEN_SECRET', { expiresIn: '2m' });
};

router.get("/api/auth/google/callback",
    passport.authenticate('google', { session: false, failureRedirect:'/api/auth/failed' }),
    (req, res) => {
        const accessToken = generateAccessToken(req.user);
        const refreshToken = generateRefreshToken(req.user);

        res.redirect(`${process.env.FRONTEND}?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    }
);


router.post('/api/auth/token', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).send('Access Denied');
    }

    try {
        const decoded = jwt.verify(refreshToken, 'YOUR_REFRESH_TOKEN_SECRET');
        const accessToken = generateAccessToken(decoded.user);
        res.send({ accessToken });
    } catch (error) {
        res.status(403).send('Invalid Refresh Token');
    }
});

const verifyToken = (req, res, next) => {
    const {accessToken} = req.query;
    if (!accessToken) {
        return res.status(401).send('Access Denied');
    }

    try {
        const decoded = jwt.verify(accessToken, 'YOUR_JWT_SECRET');
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).send('Invalid Token');
    }
};

router.get("/api/auth/status", verifyToken, (request, response) => {
    if (request.user) {
        if (request.user.email === 'atharvatijare04@gmail.com') {
            request.user.role = 'admin';
        } else {
            request.user.role = 'student';
        }
        console.log("User authenticated:", request.user);
        response.send({ status: "authorised", user: request.user });
    } else {
        console.log("User not authenticated");
        response.status(401).send({ status: "unauthorised" });
    }
});

router.get("/api/auth/logout", (request, response) => {
    response.redirect(process.env.FRONTEND);
});

router.get("/api/auth/failed", (request, response) => {
    response.redirect(`${process.env.FRONTEND}/auth-failed`);
});

export default router;