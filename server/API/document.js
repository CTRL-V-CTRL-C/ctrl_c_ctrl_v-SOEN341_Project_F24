import express from 'express';
import log from '../logger.js';
import fileUpload from 'express-fileupload';
import { db } from '../database/db.js';
import { getDocumentsList, getDocument, uploadDocument } from '../database/document.js';
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
router.post("/upload/:courseId", async (req, res, next) => {
  if (!req.files || !req.files.document) {
    log.debug("the file was missing when trying to upload");
    res.status(400).json({ msg: "Missing file to upload" })
    next();
    return;
  }
  let documentName = req.files.document.name;
  let document = req.files.document.data;
  let courseId = req.params.courseId;

  let result = await uploadDocument(db, courseId, documentName, document);

  if (result instanceof Error) {
    log.error(result, "Error uploading file");
    res.status(500).json({ msg: result.message });
  } else {
    res.status(200).json({ msg: `Successfully uploaded ${documentName}` });
  }
  next();
});

router.get("/get-documents-list/:courseId", requireAuth, requireIsInCourse, async (req, res, next) => {
  let courseId = req.params.courseId;

  let result = await getDocumentsList(db, courseId);

  if (result instanceof Error) {
    log.error(result, "Error getting all documents");
    res.status(500).json({ msg: result.message });
  } else {
    res.status(200).json(result.rows);
  }
  next();
});

router.get("/get-document/:courseId/:documentId", requireAuth, requireIsInCourse, async (req, res, next) => {

  let courseId = req.params.courseId;
  let documentId = req.params.documentId;

  if (!Number.isInteger(Number.parseInt(documentId))) {
    res.status(400).json({ msg: "Document id needs to be an integer" });
    next();
    return;
  }

  let result = await getDocument(db, courseId, documentId);

  if (result instanceof Error) {
    log.error(result, "Error getting document");
    res.status(500).json({ msg: result.message });
    next();
    return;
  }

  result = result.rows;

  if (result.length == 0) {
    res.status(400).json({ msg: "No such document exists for this course" });
  }

  if (result.length == 1) {
    res.status(200);
    res.setHeader('Content-Length', result[0].document.length);
    res.setHeader('Content-disposition', `attachment; filename=${result[0].document_name}`);
    res.write(result[0].document, 'binary');
    res.end();
  }
  next();

});

export { router };