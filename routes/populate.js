import express from 'express'
import { createUser, createPost, createComment } from '../database.js';
import { LoremIpsum } from "lorem-ipsum";
const router = express.Router();

const post_titles = [
    "Yo cuando me dan 4 tareas que hacer en la misma semana.",
    "Goloso",
    "Demasiado Real",
    "HAHAHA",
    "Mecanica de Fluidos"
]

const post_contents = [
    `Llegue feliz el lunes, lleno de felicidad por la resurrección
    de nuestro señor jesus y en cada clase me dicen
    "Esta difcil la tarea, empiecen a trabajar desde ahora". Quiero morir.`,
    "Asi me siento dps de los huevitos en semana santa.",
    "No sean como yo, procastinar es malo cabros.",
    "Este canal es muy bueno, veanlo https://www.youtube.com/@StevenHe",
    "Porque me exigen hacer este ramo horrible >.<"
]

const post_images = [
    "https://i.imgur.com/3NL58Ij.jpeg", // Sad smoking cat
    "https://img.delicious.com.au/WqbvXLhs/del/2016/06/more-the-merrier-31380-2.jpg",
    "https://plaky.com/blog/wp-content/uploads/2023/08/Intro.jpg",
    "https://napoleoncat.com/wp-content/uploads/2022/05/social-media-memes-emotional-damage-meme.jpg",
    "https://fcp.uncuyo.edu.ar/cache/meme-3-2_608_1076.png"
]

/* Populate with default Data */
router.post('/', async function(req, res, next) {
    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 8,
            min: 4
        },
        wordsPerSentence: {
            max: 16,
            min: 4
        }
    });
    let user, post, comment;

    for (let i = 0; i < 10; i++) {
        user = {
            username: lorem.generateWords(3),
            avatar: "default"
        }
        user = (await createUser(user, req.db)).rows[0];
        for (let j = 0; j < 5; j++) {
            post = {
                title: lorem.generateWords(5),
                content: lorem.generateSentences(2),
                userId: user.userid,
                image: ""
            };
            post = (await createPost(post, req.db)).rows[0];
            for (let k = 0; k < 5; k++) {
                comment = {
                    content: lorem.generateSentences(1),
                    userId: user.userid,
                    postId: post.postid
                }
                comment = (await createComment(comment, req.db)).rows[0]
            }
        }
        
    }
    user = {
        username: "Memero",
        avatar: "https://static.vecteezy.com/system/resources/previews/016/088/771/large_2x/cute-turtle-logo-mascot-icon-sea-animal-character-illustration-in-vector.jpg"
    }
    user = (await createUser(user, req.db)).rows[0];
    for (let i = 0; i < 5; i++) {
        post = {
            title: post_titles[i],
            content: post_contents[i],
            image: post_images[i],
            userId: user.userid
        };
        post = await createPost(post, req.db);
        post = post.rows[0];
        comment = {
            content: lorem.generateSentences(1),
            userId: user.userid,
            postId: post.postid
        };
        comment = await createComment(comment, req.db);        
    }
    res.status(200).json({});
});

export default router;
