// eslint-disable-next-line no-unused-vars
import pg from 'pg';
import { queryAndReturnError } from './db.js';

/**
 * Uploads a given document to the database
 * @param {pg.Pool} db the database to query
 * @param {Integer} courseId the id of the course that the document belongs to
 * @param {String} documentName the name of the document
 * @param {Buffer} document the actual byte data of the document
 */
async function uploadDocument(db, courseId, documentName, document) {
  const uploadDocumentQuery = {
    name: `upload-document ${courseId} ${documentName}`,
    text: "INSERT INTO documents (course_id, document_name, document) VALUES ($1,$2,$3);",
    values: [courseId, documentName, document]
  };

  return await queryAndReturnError(db, uploadDocumentQuery, "There was an error while uploading the document");

}

/**
 * Gets all the documents of a given course
 * @param {pg.Pool} db the database to query
 * @param {Integer} courseId the id of the course that the documents belong to
 */
async function getDocumentsList(db, courseId) {
  const getAllDocumentsQuery = {
    name: `get-documents-list ${courseId}`,
    text: "SELECT document_id, document_name, upload_time FROM documents WHERE course_id = $1 ORDER BY upload_time;",
    values: [courseId]
  };

  return await queryAndReturnError(db, getAllDocumentsQuery, `There was an error while getting the documents list for course ${courseId}`);

}

/**
 * Get a document from a given course
 * @param {pg.Pool} db the database to query
 * @param {Integer} courseId the id of the course that the document belong to
 * @param {Integer} documentId the id of the document to get
 */
async function getDocument(db, courseId, documentId) {
  const getAllDocumentsQuery = {
    name: `get-document ${courseId} ${documentId}`,
    text: "SELECT document, document_name FROM documents WHERE course_id = $1 AND document_id = $2;",
    values: [courseId, documentId]
  };
  return await queryAndReturnError(db, getAllDocumentsQuery, `There was an error getting document ${documentId} from course ${courseId}`);

}

export { uploadDocument, getDocumentsList, getDocument }