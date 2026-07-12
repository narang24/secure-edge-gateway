const { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../config/s3");
const pool = require("../config/db")
const redis = require("../config/redis")

const upload = async (req) => {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    })
    await s3.send(command);

    const result = await pool.query(
        `INSERT INTO files
        (filename, s3_key, content_type, size, owner_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            req.file.originalname,
            req.file.originalname,
            req.file.mimetype,
            req.file.size,
            req.user.id
        ]
    );

    redis.set("");

    return result.rows[0];
};

const getAllFiles = async () => {
    const cached = await redis.get("files");

    if (cached) {
        return JSON.parse(cached);
    }

    const result = await pool.query(
        "SELECT * FROM files"
    );

    await redis.setEx(
        "files",
        60,
        JSON.stringify(result.rows)
    );

    return result.rows;
};

const getFile = async (id) => {

    const result = await pool.query(
        "SELECT * FROM files WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("File not found");
    }

    const file = result.rows[0];

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.s3_key
    });

    const url = await getSignedUrl(
        s3,
        command,
        { expiresIn: 300 }
    );

    return {
        url
    };

};

const deleteFile = async (id) => {

    const result = await pool.query(
        "SELECT * FROM files WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("File not found");
    }

    const file = result.rows[0];

    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.s3_key
    });

    await s3.send(command);

    await pool.query(
        "DELETE FROM files WHERE id = $1",
        [id]
    );

    return {
        message: "File deleted successfully"
    };
};

module.exports = {
    upload,
    getAllFiles,
    getFile,
    deleteFile
};