import * as firestore from "firebase/firestore";
import {
  deleteDocument,
  getDocuments,
  saveUserData,
  updateDocument,
} from "./CollectionOperations";

jest.mock("../firebaseConfig", () => ({
  db: {},
  auth: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
}));
describe("Collection operations", () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });
  test("should call addDoc and return doc id", async () => {
    const mockDocRef = { id: "123" };
    (firestore.addDoc as jest.Mock).mockResolvedValue(mockDocRef);
    (firestore.collection as jest.Mock).mockReturnValue("mockCollection");

    const data = {
      userName: "John Doe",
      userEmail: "john@example.com",
      userId: "uid123",
      deviceName: "Device1",
      description: "Test device",
      deviceLat: 10,
      deviceLong: 20,
      deviceAddress: "Address1",
    };

    const id = await saveUserData(data);
    expect(firestore.addDoc).toHaveBeenCalledWith("mockCollection", data);
    expect(id).toBe("123");
  });

  test("should throw error if addDoc fails", async () => {
    (firestore.addDoc as jest.Mock).mockRejectedValue(new Error("Failed"));

    await expect(saveUserData({} as any)).rejects.toThrow("Failed");
  });
  test("should call deleteDoc with correct doc ref", async () => {
    (firestore.doc as jest.Mock).mockReturnValue("mockDocRef");
    (firestore.deleteDoc as jest.Mock).mockResolvedValue(undefined);

    await deleteDocument("123");
    expect(firestore.deleteDoc).toHaveBeenCalledWith("mockDocRef");
  });

  test("should throw error if deleteDoc fails", async () => {
    (firestore.deleteDoc as jest.Mock).mockRejectedValue(new Error("Failed"));
    (firestore.doc as jest.Mock).mockReturnValue("mockDocRef");

    await expect(deleteDocument("123")).rejects.toThrow(
      "Failed to delete the document."
    );
  });
  test("should return list of devices", async () => {
    const devices = [
      {
        id: "1",
        data: () => ({
          description: "My laptop",
          deviceAddress: "Aleea Profesor Vasile Petrescu, Iași,Romania",
          deviceLat: 47.157176969640766,
          deviceLong: 27.60457611625316,
          deviceName: "Mac",
          userEmail: "alupu@griddynamics.com",
          userId: "GW7cGeR2aJcc8RJvhZXcbWu7Fwk2",
          userName: "Andra Maria Lupu",
        }),
      },
      {
        id: "2",
        data: () => ({
          description: "Camin T6",
          deviceAddress:
            "Aleea Profesor Gheorghe Alexa, Tudor Vladimirescu, Iași, Iași Metropolitan Area, Iași, 700562, Romania",
          deviceLat: 47.154842,
          deviceLong: 27.6075295,
          deviceName: "PC",
          userEmail: "alupu@griddynamics.com",
          userId: "GW7cGeR2aJcc8RJvhZXcbWu7Fwk2",
          userName: "Andra Maria Lupu",
        }),
      },
    ];

    (firestore.getDocs as jest.Mock).mockResolvedValue({ docs: devices });

    (firestore.collection as jest.Mock).mockReturnValue("mockCollection");

    const result = await getDocuments();
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "1", deviceName: "Mac" }),
        expect.objectContaining({ id: "2", deviceName: "PC" }),
      ])
    );
  });
  test("should throw error if getDocs fails", async () => {
    (firestore.getDocs as jest.Mock).mockRejectedValue(new Error("Failed"));
    await expect(getDocuments()).rejects.toThrow("Error getting documents!");
  });
  test("should call updateDoc with correct doc ref and data", async () => {
    (firestore.doc as jest.Mock).mockReturnValue("mockDocRef");
    (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

    const dataToUpdate = { deviceName: "Updated name" };
    await updateDocument("123", dataToUpdate);

    expect(firestore.updateDoc).toHaveBeenCalledWith(
      "mockDocRef",
      dataToUpdate
    );
  });
  test("should throw error if updateDoc fails", async () => {
    (firestore.doc as jest.Mock).mockReturnValue("mockDocRef");
    (firestore.updateDoc as jest.Mock).mockRejectedValue(new Error("Failed"));

    await expect(updateDocument("123", {})).rejects.toThrow(
      "Failed to update the document."
    );
  });
});
