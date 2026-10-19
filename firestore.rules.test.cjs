
const fs = require("node:fs");
const { test, before, after } = require("node:test");
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} = require("@firebase/rules-unit-testing");

const {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  writeBatch,
} = require("firebase/firestore");

let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "onlinebookrental-b260f",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: fs.readFileSync("firestore.rules", "utf8"),
    },
  });

  await env.clearFirestore();

  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();

    await setDoc(doc(db, "members", "admin1"), {
      id: "admin1",
      role: "admin",
      email: "admin@example.com",
      status: "Active",
      name: "Admin",
    });

    await setDoc(doc(db, "members", "member1"), {
      id: "member1",
      role: "member",
      email: "member@example.com",
      status: "Active",
      name: "Member",
    });

    await setDoc(doc(db, "books", "TEST001"), {
      title: "Test Book",
      quantityTotal: 2,
      quantityAvailable: 2,
      lateFeePerDay: 10,
    });
  });
});

after(async () => {
  if (env) await env.cleanup();
});

test("ทุกคนอ่านหนังสือได้", async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(db, "books", "TEST001")));
});

test("ผู้ไม่เข้าสู่ระบบแก้หนังสือไม่ได้", async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertFails(
    updateDoc(doc(db, "books", "TEST001"), { title: "Changed" })
  );
});

test("สมาชิกแก้สิทธิ์ตัวเองเป็น Admin ไม่ได้", async () => {
  const db = env.authenticatedContext("member1", {
    email: "member@example.com",
  }).firestore();

  await assertFails(
    updateDoc(doc(db, "members", "member1"), { role: "admin" })
  );
});

test("สมาชิกอ่านข้อมูลสมาชิกคนอื่นไม่ได้", async () => {
  const db = env.authenticatedContext("member1", {
    email: "member@example.com",
  }).firestore();

  await assertFails(getDoc(doc(db, "members", "admin1")));
});

test("Admin แก้ไขหนังสือได้", async () => {
  const db = env.authenticatedContext("admin1", {
    email: "admin@example.com",
  }).firestore();

  await assertSucceeds(
    updateDoc(doc(db, "books", "TEST001"), { title: "Updated by Admin" })
  );
});

test("สมาชิกเช่าหนังสือพร้อมลดสต็อกได้", async () => {
  const db = env.authenticatedContext("member1", {
    email: "member@example.com",
  }).firestore();

  const batch = writeBatch(db);

  batch.update(doc(db, "books", "TEST001"), {
    quantityAvailable: 1,
    lastRentalId: "RENT001",
  });

  batch.set(doc(db, "rentals", "RENT001"), {
    memberId: "member1",
    bookId: "TEST001",
    rentalDate: "2026-10-19",
    dueDate: "2026-11-02",
    returnDate: null,
    status: "Rented",
    fine: 0,
  });

  await assertSucceeds(batch.commit());
});

test("สมาชิกแก้สถานะคืนหนังสือเองไม่ได้", async () => {
  const db = env.authenticatedContext("member1", {
    email: "member@example.com",
  }).firestore();

  await assertFails(
    updateDoc(doc(db, "rentals", "RENT001"), {
      status: "Returned",
    })
  );
});
