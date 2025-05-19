// src/utils/indexedDB.js
import { openDB } from "idb";

const DATABASE_NAME = "validpanelLocalStorageDB";
const STORE_NAME = "vp_store";

export const initDB = async () => {
  const db = await openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
  return db;
};

export const addData = async (data) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.add(data);
  await tx.done;
};

export const getData = async (id) => {
  const db = await initDB();
  return await db.get(STORE_NAME, id);
};

export const getAllData = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

export const deleteData = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.delete(id);
  await tx.done;
};

export const updateData = async (id, updatedData) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const data = await tx.store.get(id);
  if (!data) {
    throw new Error(`Record with id ${id} not found`);
  }
  const newData = { ...data, ...updatedData };
  await tx.store.put(newData);
  await tx.done;
};