import pg from 'pg'
import log from '../logger.js'
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

  const result = await queryAndReturnError(db, uploadDocumentQuery, "There was an error while uploading the document");

  return result;
}

export { uploadDocument }