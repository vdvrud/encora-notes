import express from 'express';
import { check, param } from 'express-validator';
import { ObjectId } from 'mongodb';
import { notesFolder, noteUpload } from '../commons/image';
import { verifyUser } from '../commons/jwt_auth';
import { createResponse, response } from '../commons/response';
import { validatePayload } from '../commons/validation';
import { Notes } from '../models/notes';
import fs from 'fs';
const router = express();

router.post('/createNote', [
    verifyUser,
    noteUpload.single('image'),
    check('title', 'Please provide a title').not().isEmpty(),
    check('content', 'Please provide content').not().isEmpty(),
    validatePayload
], async(req, res) => {
    try {
        const { user: { _id }, body: { title, content, tags }, file } = req;
        const newNote = {
            title, content, user_id: _id
        }
        if(tags && Array.isArray(tags) && tags.length > 0) {
            newNote.tags = tags;
        }
        if(file) {
            newNote.image = notesFolder + file.filename
        }
        const created = await new Notes(newNote).save();
        response(res, 201, createResponse(created));
    } catch (error) {
        console.log(error, 'Error in creating note');
        response(res, 500, createResponse('Error in creating note, please try again !'))
    }
});

router.put('/note/:note_id', [
    verifyUser,
    noteUpload.single('image'),
    check('title', 'Please provide a title').not().isEmpty(),
    check('content', 'Please provide content').not().isEmpty(),
    validatePayload
], async(req, res) => {
    try {
        const { params: { note_id }, user: { _id }, body: { title, content, tags }, file } = req;
        const valid = ObjectId.isValid(note_id);
        if(!valid) {
            return response(res, 400, createResponse('Please provide a valid note id !'))
        }
        const note = await Notes.findOne({ _id: note_id });
        if(!note) {
            return response(res, 400, createResponse('Note not found !'))
        }
        if(note.user_id !== _id) {
            return response(res, 401, createResponse('Not authorized to perform this action !'))
        }
        note.set({
            title, content
        });
        if(tags && Array.isArray(tags) && tags.length > 0) {
            note.tags = tags;
        }
        if(file) {
            note.image = notesFolder + file.filename
        }
        await note.save();
        
        response(res, 200, createResponse(note));
    } catch (error) {
        console.log(error, 'Error in updating notes !');
        response(res, 500, createResponse('Error in updating notes, please try again !'))
    }
});

router.delete('/deleteNote/:note_id', verifyUser,async(req, res) => {
    try {
    const { params: { note_id }, user: { _id } } = req;
    const valid = ObjectId.isValid(note_id);
    if(!valid) {
        return response(res, 400, createResponse('Please provide a valid note id !'))
    }
    const deleted = await Notes.findOneAndDelete({ _id: note_id, user_id: _id });
    if(!deleted) {
        return response(res, 400, createResponse('Not note to delete !'))
    }
        response(res, 200, createResponse('Note successfully deleted !'))
} catch (error) {
    console.log(error, 'Error in deleting note');
    response(res, 500, createResponse('Error in deleting note, please try again !'))
} 
});

router.get('/notes/:page/:limit', verifyUser, async(req, res) => {
    try {
        let { params: { page, limit }, user: { _id } } = req;
        page = parseInt(page), limit = parseInt(limit);
        if(isNaN(page) || isNaN(limit) || page < 0 || limit < 0) {
            return response(res, 400, createResponse('Please provide valid page and limit !'))
        }
        const notes = await Notes.aggregate([
            {
                $match: {
                    user_id: _id
                }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ]);
        response(res, 200, createResponse(notes));
    } catch (error) {
        console.log(error, 'Error in getting notes !');
        response(res, 500, createResponse('Error in getting notes , please try again !'))
    }
})


export {
    router as notesRouter
}