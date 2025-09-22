import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { DeviceData } from "../Auth/deviceSlice";

export async function saveUserData(data: {
  userName: string;
  userEmail: string;
  userId: string;
  deviceName: string;
  description: string;
  deviceLat: number;
  deviceLong: number;
  deviceAddress: string;
}) {
  try {
    const dataCollection = collection(db, "airo-react-alupu");

    const docRef = await addDoc(dataCollection, {
      userName: data.userName,
      userEmail: data.userEmail,
      userId: data.userId,
      deviceName: data.deviceName,
      description: data.description,
      deviceLat: data.deviceLat,
      deviceLong: data.deviceLong,
      deviceAddress: data.deviceAddress,
    });

    return docRef.id;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function deleteDocument(docId: string) {
  try {
    const dataRef = doc(db, "airo-react-alupu", docId);

    await deleteDoc(dataRef);

    console.log(`Doc was successfully deleted.`);
  } catch (error: any) {
    console.error("Error deleting document: ", error);
    throw new Error("Failed to delete the document.");
  }
}
export async function getDocuments(): Promise<DeviceData[]> {
  try {
    const dataCollection = collection(db, "airo-react-alupu");
    const data = await getDocs(dataCollection);
    const devices: DeviceData[] = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DeviceData[];
    return devices;
  } catch (error: any) {
    throw new Error("Error getting documents!");
  }
}

export async function updateDocument(
  docId: string,
  dataToUpdate: Partial<DeviceData>
) {
  try {
    const docRef = doc(db, "airo-react-alupu", docId);

    await updateDoc(docRef, dataToUpdate);

    console.log(`Doc was successfully updated.`);
  } catch (error: any) {
    console.error("Error updating document: ", error);
    throw new Error("Failed to update the document.");
  }
}
