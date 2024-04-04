import pg from 'pg';

async function connectDB() {
    // DB setup
    const client = new pg.Client({
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        ssl: 'require'
    });
    await client.connect();

    if (!(await dbCheck(client))) {
        console.log("Database Error");
    }
    return client;
}

async function dbCheck(client) {
    const tables = await client.query({
        text: "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"
    });
    let usersTable = tables.rows.find(r => r.table_name === "users");
    if (usersTable === undefined) {
        usersTable = await client.query(`CREATE TABLE Users (
            userId int GENERATED ALWAYS AS IDENTITY,
            username varchar(255) NOT NULL,
            avatar varchar(255) NOT NULL,
            created timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(userId));`);
    }
    let postsTable = tables.rows.find(r => r.table_name === "posts");
    if (postsTable === undefined) {
        postsTable = await client.query(`CREATE TABLE Posts (
            postId int GENERATED ALWAYS AS IDENTITY,
            title varchar(255) NOT NULL,
            content varchar(255) NOT NULL,
            image varchar(255),
            userId int NOT NULL,
            created timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(postId),
            CONSTRAINT fk_user FOREIGN KEY(userId) REFERENCES Users(userId) ON DELETE CASCADE);`);
    }
    let commentsTable = tables.rows.find(r => r.table_name === "comments");
    if (commentsTable === undefined) {
        commentsTable = await client.query(`CREATE TABLE Comments (
            commentId int GENERATED ALWAYS AS IDENTITY,
            content varchar(255) NOT NULL,
            userId int NOT NULL,
            postId int NOT NULL,
            created timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(commentId),
            CONSTRAINT fk_user FOREIGN KEY(userId) REFERENCES Users(userId) ON DELETE CASCADE,
            CONSTRAINT fk_post FOREIGN KEY(postId) REFERENCES Posts(postId) ON DELETE CASCADE);
        `);
    }
        
    return true;
}

async function getUsers(client, params) {
    let users;
    if (params.userId != undefined) {
        users = client.query(`SELECT * FROM users WHERE userid='${params.userId}';`);
    } else {
        users = client.query(`SELECT * FROM users`);
    }
    return users;
}

async function createUser(userData, client) {
    const user = client.query(`INSERT INTO users (username, avatar)
        VALUES ('${userData.username}', '${userData.avatar}')
        RETURNING *;`);
    return user;
}

async function getPosts(client, params) {
    let posts;
    if (params.postId != undefined) {
        posts = client.query(`SELECT * FROM posts WHERE postid='${params.postId}';`);
    } else if (params.userId != undefined) {
        posts = client.query(`SELECT * FROM posts WHERE userid='${params.userId}';`)
    } else {
        posts = client.query('SELECT * FROM posts;');
    };
    return posts;
}

async function createPost(postData, client) {
    const post = client.query(`INSERT INTO posts (title, content, image, userId)
        VALUES ('${postData.title}', '${postData.content}', '${postData.image}', '${postData.userId}')
        RETURNING *;`).catch((err) => { return err });
    return post;
}

async function getComments(client, params) {
    let comments;
    if (params.postId != undefined) {
        comments = client.query(`SELECT * FROM comments WHERE postid='${params.postId}';`);
    } else if (params.userId != undefined) {
        comments = client.query(`SELECT * FROM comments WHERE userid='${params.userId}';`);
    } else {
        comments = client.query(`SELECT * FROM comments;`);
    }
    return comments;
}

async function createComment(commentData, client) {
    const comment = client.query(`INSERT INTO comments (content, userId, postId)
        VALUES ('${commentData.content}', '${commentData.userId}', '${commentData.postId}')
        RETURNING *;`).catch((err) => { return err });
    return comment;
}

async function resetDB(client) {
    const commentsDeleted = client.query('DROP TABLE comments;');
    const postsDeleted = client.query('DROP TABLE posts;');
    const usersDeleted = client.query('DROP TABLE users');
    return await dbCheck(client);
}

export {
    connectDB, resetDB,
    getUsers, createUser,
    getPosts, createPost,
    getComments, createComment
};
