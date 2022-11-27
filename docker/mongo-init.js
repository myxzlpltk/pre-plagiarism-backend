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
