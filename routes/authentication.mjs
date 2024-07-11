import { Router } from "express";
import passport from 'passport';
import jwt from 'jsonwebtoken';


const router = Router();

router.get("/api/auth/google", passport.authenticate("google"));

const generateAccessToken = (user) => {
    return jwt.sign({ user }, 'YOUR_JWT_SECRET', { expiresIn: '1m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ user }, 'YOUR_REFRESH_TOKEN_SECRET', { expiresIn: '3m' });
};

router.get("/api/auth/google/callback",
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const accessToken = generateAccessToken(req.user);
        const refreshToken = generateRefreshToken(req.user);

        // Send the tokens in cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            domain: 'neon-autolib-backend.onrender.com',
            path: '/'
          });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            domain: 'neon-autolib-backend.onrender.com',
            path: '/'
          });

        res.redirect(`${process.env.FRONTEND}`);
    }
);


router.post('/api/auth/token', (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).send('Access Denied');
    }

    try {
        const decoded = jwt.verify(refreshToken, 'YOUR_REFRESH_TOKEN_SECRET');
        const accessToken = generateAccessToken(decoded.user);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            domain: 'neon-autolib-backend.onrender.com',
            path: '/'
          });
        res.send({ accessToken });
    } catch (error) {
        res.status(403).send('Invalid Refresh Token');
    }
});

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const decoded = jwt.verify(token, 'YOUR_JWT_SECRET');
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).send('Invalid Token');
    }
};

router.get("/api/auth/status", verifyToken, (request, response) => {
    console.log(request.headers.cookie); // Log cookie headers
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
    response.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        domain: 'neon-autolib-backend.onrender.com',
        path: '/'
      });

    response.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        domain: 'neon-autolib-backend.onrender.com',
        path: '/'
      });

    response.redirect(process.env.FRONTEND);
});

router.get("/api/auth/failed", (request, response) => {
    response.redirect(`${process.env.FRONTEND}/auth-failed`);
});

export default router;