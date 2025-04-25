// src/utils/indexedDbHelper.js

export const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MediaDB', 1);
      request.onerror = (e) => reject(e);
      request.onsuccess = (e) => resolve(e.target.result);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        db.createObjectStore('files');
      };
    });
  };
  
  export const saveFile = async (name, file) => {
    const db = await openDB();
    console.log('Saving file:', name, file);
  
    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
  
      const getRequest = store.get(name);
      getRequest.onsuccess = () => {
        if (!getRequest.result) {
          const putRequest = store.put(file, name);
          putRequest.onsuccess = () => {
            console.log('File saved:', name);
            resolve();
          };
          putRequest.onerror = (e) => {
            console.error('Failed to save file:', e);
            reject(e);
          };
        } else {
          console.log('File already exists:', name);
          resolve(); // Already exists, no need to save
        }
      };
      getRequest.onerror = (e) => {
        console.error('Failed to get file:', e);
        reject(e);
      };
    });
  };
  
  
  
  export const getFile = async (name) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', 'readonly');
      const store = tx.objectStore('files');
  
      const request = store.get(name);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (e) => {
        reject(e);
      };
    });
  };
  