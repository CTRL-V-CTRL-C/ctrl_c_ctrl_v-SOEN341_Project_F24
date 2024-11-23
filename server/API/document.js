import express from 'express';
import log from '../logger.js';
import fileUpload from 'express-fileupload';
import { db } from '../database/db.js';
import { getAllDocuments, uploadDocument } from '../database/document.js';
import { requireAuth, requireTeacher } from './auth.js';
import { requireIsInCourse } from './course.js';

const router = express.Router();

// All middleware for /upload
router.post("/upload/:courseId", requireAuth, requireTeacher, requireIsInCourse, fileUpload({
  safeFileNames: true,
  preserveExtension: 4,
  abortOnLimit: true,
  limits: { fileSize: 1 * 1024 * 1024 * 1024 } //4 gigs is maximum of db, but since file will be held in memory maximum is 1 gig
}));

// Actual route handler
router.post("/upload/:courseId", async (req, res) => {
  if (!req.files || !req.files.document) {
    console.log(req.files);
    console.log(req.body);
    res.status(400).json({ msg: "Missing file to upload" })
    return;
  }
  let documentName = req.files.document.name;
  let document = req.files.document.data;
  let courseId = req.params.courseId;

  let result = await uploadDocument(db, courseId, documentName, document);

  if (result instanceof Error) {
    log.error(result, "Error uploading file");
    res.status(500).json({ msg: "Something went wrong trying to upload your file, please try again in a bit" });
  } else {
    res.status(200).json({ msg: `Successfully uploaded ${documentName}` });
  }
});

router.get("/get-all-documents/:courseId", requireAuth, requireIsInCourse, async (req, res) => {
  let courseId = req.params.courseId;

  let result = await getAllDocuments(db, courseId);

  if (result instanceof Error) {
    log.error(result, "Error getting all documents");
    res.status(500).json({ msg: "Something went wrong trying to get all the documents, please try again in a bit" });
  } else {
    res.status(200).json(result);
  }
});

export { router };