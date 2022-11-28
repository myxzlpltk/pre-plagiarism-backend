db.createUser(
  {
    user: "user",
    pwd: "password",
    roles: [
      {
        role: "readWrite",
        db: "skripsi"
      }
    ]
  }
);

db.createCollection("users");
db.users.createIndex({email: 1}, {unique: true});

db.createCollection("documents", {});
db.documents.createIndex({user: 1});
db.documents.createIndex({filename: 1}, {unique: true});
db.documents.createIndex({createdAt: -1});
