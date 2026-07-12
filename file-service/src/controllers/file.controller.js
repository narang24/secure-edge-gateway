const fileService = require("../services/file.service");

const upload = async (req, res) => {
    const result = await fileService.upload(req);

    res.status(201).json(result);
};

const getAllFiles = async (req, res) => {
    const files = await fileService.getAllFiles();

    res.status(200).json(files);
};

const getFile = async (req, res) => {

    const file = await fileService.getFile(req.params.id);

    res.status(200).json(file);

};

const deleteFile = async (req, res) => {

    const result = await fileService.deleteFile(req.params.id);

    res.status(200).json(result);

};

module.exports = {
    upload,
    getAllFiles,
    getFile,
    deleteFile
};