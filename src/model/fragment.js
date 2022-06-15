// Use https://www.npmjs.com/package/nanoid to create unique IDs
const { nanoid } = require('nanoid');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    //id
    if (id) {
      this.id = id;
    } else {
      this.id = nanoid();
    }
    if (ownerId) {
      this.ownerId = ownerId;
    } else {
      logger.Error('The ownerID is not valid');
    }
    if (created) {
      this.created = created;
    } else {
      this.created = new Date().toISOString();
    }
    if (updated) {
      this.updated = updated;
    } else {
      this.updated = new Date().toISOString();
    }
    if (type === 'text/plain' || type === 'text/plain; charset=utf-8') {
      this.type = type;
    } else {
      logger.Error('This text type not supported');
    }
    if (size < 0 || typeof size === 'string') {
      logger.Error('Only positive numbers allowed');
    } else {
      this.size = size;
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
   static async byUser(ownerId, expand = false) {
    try {
      return await listFragments(ownerId, expand);
    } catch (err) {
      throw new Error('Error (ListFragment)');
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
   static async byId(ownerId, id) {
    try {
      const fragment = await readFragment(ownerId, id);
      if (fragment) {
        if (fragment instanceof Fragment === false) {
          return new Fragment(fragment);
        } else {
          return fragment;
        }
      }
    } catch (err) {
      throw new Error('Cant read fragment');
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
   static async delete(ownerId, id) {
    try {
      return await deleteFragment(ownerId, id);
    } catch (err) {
      throw new Error('Unable to delete fragment object');
    }
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
   async save() {
    try {
      this.updated = new Date().toISOString();
      return await writeFragment(this);
    } catch (err) {
      throw new Error('Unable to save fragment');
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
   async getData() {
    try {
      return await readFragmentData(this.ownerId, this.id);
    } catch (err) {
      throw new Error('unable to read fragment data');
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
   async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error('data is not a Buffer');
    } else {
      this.save();
      try {
        return await writeFragmentData(this.ownerId, this.id, data);
      } catch (err) {
        throw new Error('unable to set fragment data');
      }
    }
  }

  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }


  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    if (/(text\/)+/.test(this.mimeType)) {
      return true;
    }
    return false;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // return [this.mimeType];
    return [contentType.format({ type: 'text/plain' })];
  
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
   static isSupportedType(value) {
    return value == 'text/plain' || value.includes('text/plain; charset=utf-8') ? true : false;
  }
}

module.exports.Fragment = Fragment;
